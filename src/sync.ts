// 云同步：腾讯云开发 CloudBase（邮箱验证码登录）
// 配置前整个功能在界面上不可见；填入 envId / clientId 并部署后自动出现。
import type { NotebookEntry, Report } from './engine'

export type SyncConfig = { envId: string; region: string; clientId: string }

export const SYNC_CONFIG: SyncConfig = {
  envId: '',        // 形如 'vocab-lab-1g2h3i4j'
  region: 'ap-shanghai',
  clientId: '',     // CloudBase 控制台 → 应用配置 里的 clientId
}

export const syncConfigured = () => !!(SYNC_CONFIG.envId && SYNC_CONFIG.clientId)

export type SyncPayload = { version: 1; updatedAt: number; history: Report[]; notebook: NotebookEntry[]; device: string }
export type SyncAccount = { email: string; uid: string }

const sdkUrl = () => 'https://static.cloudbase.net/cloudbase-js-sdk/2.32.0/cloudbase.full.js'
let sdkPromise: Promise<any> | null = null

function loadSdk(): Promise<any> {
  const holder = window as any
  if (holder.cloudbase) return Promise.resolve(holder.cloudbase)
  if (sdkPromise) return sdkPromise
  sdkPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = sdkUrl()
    script.async = true
    script.onload = () => (holder.cloudbase ? resolve(holder.cloudbase) : reject(new Error('SDK 未正确加载')))
    script.onerror = () => reject(new Error('无法加载云开发 SDK（请检查网络）'))
    document.head.appendChild(script)
  })
  return sdkPromise
}

let appPromise: Promise<any> | null = null
function getApp() {
  if (!syncConfigured()) return Promise.reject(new Error('云同步尚未配置'))
  if (!appPromise) {
    appPromise = loadSdk().then((cloudbase) => cloudbase.init({ env: SYNC_CONFIG.envId, region: SYNC_CONFIG.region, clientId: SYNC_CONFIG.clientId }))
  }
  return appPromise
}

async function getAuth() {
  const app = await getApp()
  return app.auth()
}

function uidOf(state: any): string {
  return state?.user?.uid || state?.user?.id || state?.userInfo?.uid || state?.uid || ''
}

function emailOf(state: any): string {
  return state?.user?.email || state?.userInfo?.email || state?.email || ''
}

const COLLECTION = 'vocab_sync'

export async function currentAccount(): Promise<SyncAccount | null> {
  if (!syncConfigured()) return null
  try {
    const auth = await getAuth()
    const state = typeof auth.hasLoginState === 'function' ? auth.hasLoginState() : null
    const user = state || (typeof auth.getLoginState === 'function' ? await auth.getLoginState() : null) || auth.currentUser
    const uid = uidOf(user)
    if (!uid) return null
    return { uid, email: emailOf(user) || localStorage.getItem('vocab-lab-sync-email') || '' }
  } catch {
    return null
  }
}

// 第一步：向邮箱发送 6 位验证码
export async function requestCode(email: string): Promise<'new' | 'existing'> {
  const auth = await getAuth()
  const res = await auth.getVerification({ email })
  sessionStorage.setItem('vocab-lab-sync-vid', res.verification_id || '')
  return res.is_user ? 'existing' : 'new'
}

// 第二步：校验验证码并登录（新用户自动注册）
export async function submitCode(email: string, code: string): Promise<SyncAccount> {
  const auth = await getAuth()
  const verification_id = sessionStorage.getItem('vocab-lab-sync-vid') || ''
  const verified = await auth.verify({ verification_id, verification_code: code })
  const token = verified.verification_token
  let state: any = null
  try {
    state = await auth.signIn({ username: email, verification_token: token })
  } catch (err) {
    state = await auth.signUp({ email, verification_code: code, verification_token: token })
  }
  const uid = uidOf(state)
  if (!uid) throw new Error('登录态异常，请重试')
  localStorage.setItem('vocab-lab-sync-email', email)
  sessionStorage.removeItem('vocab-lab-sync-vid')
  return { uid, email }
}

export async function signOut() {
  const auth = await getAuth()
  if (typeof auth.signOut === 'function') await auth.signOut()
  localStorage.removeItem('vocab-lab-sync-email')
}

function docRef(app: any, uid: string) {
  return app.database().collection(COLLECTION).doc(uid)
}

export async function pull(account: SyncAccount): Promise<SyncPayload | null> {
  const app = await getApp()
  try {
    const res = await docRef(app, account.uid).get()
    const doc = Array.isArray(res?.data) ? res.data[0] : res?.data
    const raw = doc?.payload
    if (!raw) return null
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw
    if (!parsed || !Array.isArray(parsed.history) || !Array.isArray(parsed.notebook)) return null
    return parsed as SyncPayload
  } catch (err: any) {
    const msg = String(err?.message || err?.code || '')
    if (/not exist|NOT_FOUND|DATABASE_DOCUMENT_NOT_EXIST/i.test(msg)) return null
    throw err
  }
}

export async function push(account: SyncAccount, payload: SyncPayload): Promise<void> {
  const app = await getApp()
  await docRef(app, account.uid).set({ payload: JSON.stringify(payload), updatedAt: payload.updatedAt, email: account.email })
}

// 合并：报告按 id 去重取较新，生词按 wordId 取较大错次、已掌握取或
export function mergePayload(local: { history: Report[]; notebook: NotebookEntry[] }, remote: { history: Report[]; notebook: NotebookEntry[] }) {
  const history = new Map<string, Report>()
  for (const item of [...remote.history, ...local.history]) {
    const prev = history.get(item.id)
    if (!prev || (item.date || 0) >= (prev.date || 0)) history.set(item.id, item)
  }
  const notebook = new Map<string, NotebookEntry>()
  for (const item of [...remote.notebook, ...local.notebook]) {
    const prev = notebook.get(item.wordId)
    if (!prev) { notebook.set(item.wordId, { ...item }); continue }
    notebook.set(item.wordId, {
      ...prev,
      mistakes: Math.max(prev.mistakes || 0, item.mistakes || 0),
      lastSeen: Math.max(prev.lastSeen || 0, item.lastSeen || 0),
      mastered: !!(prev.mastered || item.mastered),
      dict: prev.dict || item.dict,
    })
  }
  return {
    history: [...history.values()].sort((a, b) => (b.date || 0) - (a.date || 0)).slice(0, 100),
    notebook: [...notebook.values()],
  }
}
