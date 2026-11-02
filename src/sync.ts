// 云同步：Supabase（邮箱 + 密码登录）
// 未填 url / anonKey 时界面上完全没有同步入口。
import type { NotebookEntry, Report } from './engine'

export type SyncConfig = { url: string; anonKey: string }

export const SYNC_CONFIG: SyncConfig = {
  url: 'https://uxvfnvoxhjyedahcypwf.supabase.co',        // 形如 https://abcdefgh.supabase.co
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4dmZudm94aGp5ZWRhaGN5cHdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM1OTQ5OTMsImV4cCI6MjEwOTE3MDk5M30.Gvvuo8vqab6Gg2jTclUzbHG2lTXJSCRYwzG7Ro7j0j0',    // Supabase → Project Settings → API → anon public
}

export const syncConfigured = () => !!(SYNC_CONFIG.url && SYNC_CONFIG.anonKey)

// 容错：允许填 https://xxx.supabase.co/rest/v1/ 这种地址
const baseUrl = () => SYNC_CONFIG.url.trim().replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '')

export type SyncPayload = { version: 1; updatedAt: number; history: Report[]; notebook: NotebookEntry[]; device: string }
export type SyncAccount = { email: string; uid: string }

const SDK_URLS = [
  'https://unpkg.com/@supabase/supabase-js@2/dist/umd/supabase.js',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js',
]

let sdkPromise: Promise<any> | null = null

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = src
    s.async = true
    s.onload = () => resolve()
    s.onerror = () => reject(new Error('加载失败: ' + src))
    document.head.appendChild(s)
  })
}

function loadSdk(): Promise<any> {
  const holder = window as any
  if (holder.supabase?.createClient) return Promise.resolve(holder.supabase)
  if (sdkPromise) return sdkPromise
  sdkPromise = (async () => {
    for (const url of SDK_URLS) {
      try {
        await loadScript(url)
        if (holder.supabase?.createClient) return holder.supabase
      } catch { /* 试下一个 CDN */ }
    }
    sdkPromise = null
    throw new Error('无法加载 Supabase SDK，请检查网络')
  })()
  return sdkPromise
}

let clientPromise: Promise<any> | null = null
function getClient(): Promise<any> {
  if (!syncConfigured()) return Promise.reject(new Error('云同步尚未配置'))
  if (!clientPromise) {
    clientPromise = loadSdk().then((sdk) => sdk.createClient(baseUrl(), SYNC_CONFIG.anonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    }))
  }
  return clientPromise
}

const TABLE = 'vocab_sync'

// Supabase 的报错是英文，挑常见的翻一下
function humanize(message: string): string {
  const text = String(message || '')
  if (/invalid login credentials/i.test(text)) return '邮箱或密码不正确'
  if (/user already registered/i.test(text)) return '该邮箱已注册，请直接登录'
  if (/password should be at least/i.test(text)) return '密码至少 6 位'
  if (/email not confirmed/i.test(text)) return '邮箱还没确认，请先点邮件里的链接'
  if (/rate limit|too many requests/i.test(text)) return '操作太频繁，稍后再试'
  if (/failed to fetch|network/i.test(text)) return '网络异常，请检查后重试'
  return text || '操作失败'
}

function accountOf(session: any): SyncAccount | null {
  const user = session?.user
  if (!user?.id) return null
  return { uid: user.id, email: user.email || localStorage.getItem('vocab-lab-sync-email') || '' }
}

export async function currentAccount(): Promise<SyncAccount | null> {
  if (!syncConfigured()) return null
  try {
    const client = await getClient()
    const { data } = await client.auth.getSession()
    return accountOf(data?.session)
  } catch { return null }
}

export async function signIn(email: string, password: string): Promise<SyncAccount> {
  const client = await getClient()
  const { data, error } = await client.auth.signInWithPassword({ email, password })
  if (error) throw new Error(humanize(error.message))
  const acc = accountOf(data?.session)
  if (!acc) throw new Error('登录态异常，请重试')
  localStorage.setItem('vocab-lab-sync-email', email)
  return acc
}

export async function signUp(email: string, password: string): Promise<SyncAccount> {
  const client = await getClient()
  const { data, error } = await client.auth.signUp({ email, password })
  if (error) throw new Error(humanize(error.message))
  const acc = accountOf(data?.session)
  if (!acc) throw new Error('注册成功，请先到邮箱点确认链接，再回来登录')
  localStorage.setItem('vocab-lab-sync-email', email)
  return acc
}

export type SyncProfile = { nickname: string; avatar: string }

export async function fetchProfile(): Promise<SyncProfile | null> {
  const client = await getClient()
  const { data, error } = await client.auth.getUser()
  if (error) return null
  const meta = data?.user?.user_metadata
  if (!meta) return null
  const nickname = typeof meta.nickname === 'string' ? meta.nickname : ''
  const avatar = typeof meta.avatar === 'string' ? meta.avatar : ''
  if (!nickname && !avatar) return null
  return { nickname, avatar }
}

export async function saveProfile(profile: SyncProfile): Promise<void> {
  const client = await getClient()
  const { error } = await client.auth.updateUser({ data: { nickname: profile.nickname, avatar: profile.avatar } })
  if (error) throw new Error(humanize(error.message))
}

export async function changePassword(password: string): Promise<void> {
  const client = await getClient()
  const { error } = await client.auth.updateUser({ password })
  if (error) throw new Error(humanize(error.message))
}

export async function signOut() {
  const client = await getClient()
  await client.auth.signOut()
  localStorage.removeItem('vocab-lab-sync-email')
}

export async function pull(account: SyncAccount): Promise<SyncPayload | null> {
  const client = await getClient()
  const { data, error } = await client.from(TABLE).select('payload').eq('user_id', account.uid).maybeSingle()
  if (error) throw new Error(humanize(error.message))
  const raw = data?.payload
  if (!raw) return null
  const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw
  if (!parsed || !Array.isArray(parsed.history) || !Array.isArray(parsed.notebook)) return null
  return parsed as SyncPayload
}

export async function push(account: SyncAccount, payload: SyncPayload): Promise<void> {
  const client = await getClient()
  const { error } = await client.from(TABLE).upsert({ user_id: account.uid, payload, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })
  if (error) throw new Error(humanize(error.message))
}

// 内容是否等价（用于判断"两边一样就不用弹冲突"）
export function sameStore(a: { history: Report[]; notebook: NotebookEntry[] }, b: { history: Report[]; notebook: NotebookEntry[] }): boolean {
  if (a.history.length !== b.history.length || a.notebook.length !== b.notebook.length) return false
  const ha = [...a.history].sort((x, y) => x.id.localeCompare(y.id))
  const hb = [...b.history].sort((x, y) => x.id.localeCompare(y.id))
  for (let i = 0; i < ha.length; i++) {
    if (ha[i].id !== hb[i].id || (ha[i].date || 0) !== (hb[i].date || 0)) return false
  }
  const na = [...a.notebook].sort((x, y) => x.wordId.localeCompare(y.wordId))
  const nb = [...b.notebook].sort((x, y) => x.wordId.localeCompare(y.wordId))
  for (let i = 0; i < na.length; i++) {
    if (na[i].wordId !== nb[i].wordId) return false
    if ((na[i].mistakes || 0) !== (nb[i].mistakes || 0)) return false
    if (!!na[i].mastered !== !!nb[i].mastered) return false
  }
  return true
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
