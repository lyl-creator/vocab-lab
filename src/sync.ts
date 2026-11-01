import type { Store } from './engine'

export type SyncPayload = { history: any[]; notebook: any[]; updatedAt: number }
export type SyncState = { code: string; lastSync: number; error: string }

const STATE_KEY = 'vocab-lab-sync-v1'
const ENDPOINT_KEY = 'vocab-lab-sync-endpoint'
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

export const normalizeCode = (raw: string) => raw.toUpperCase().replace(/[^A-Z0-9]/g, '')
export const formatCode = (code: string) => (code.match(/.{1,4}/g) || []).join('-')

export function createCode(): string {
  const bytes = new Uint8Array(20)
  crypto.getRandomValues(bytes)
  let out = ''
  for (const b of bytes) out += ALPHABET[b % ALPHABET.length]
  return out
}

export function loadSyncState(): SyncState {
  try {
    const raw = JSON.parse(localStorage.getItem(STATE_KEY) || 'null')
    if (raw && typeof raw.code === 'string') return { code: raw.code, lastSync: raw.lastSync || 0, error: '' }
  } catch { /* ignore */ }
  return { code: '', lastSync: 0, error: '' }
}

export function saveSyncState(state: SyncState) {
  try { localStorage.setItem(STATE_KEY, JSON.stringify({ code: state.code, lastSync: state.lastSync })) } catch { /* ignore */ }
}

let endpointCache: string | null = null
export async function resolveEndpoint(): Promise<string> {
  if (endpointCache !== null) return endpointCache
  const override = localStorage.getItem(ENDPOINT_KEY)
  if (override) { endpointCache = override.replace(/\/+$/, ''); return endpointCache }
  try {
    const res = await fetch('sync-config.json', { cache: 'no-store' })
    if (res.ok) {
      const cfg = await res.json()
      endpointCache = typeof cfg.api === 'string' ? cfg.api.replace(/\/+$/, '') : ''
    } else endpointCache = ''
  } catch { endpointCache = '' }
  return endpointCache ?? ''
}
export const setEndpoint = (url: string) => { const clean = url.replace(/\/+$/, ''); endpointCache = clean; localStorage.setItem(ENDPOINT_KEY, clean) }

export async function pull(code: string, endpoint: string): Promise<SyncPayload | null> {
  const res = await fetch(endpoint + '/' + encodeURIComponent(code), { method: 'GET', cache: 'no-store' })
  if (res.status === 404) return null
  if (!res.ok) throw new Error('拉取失败（' + res.status + '）')
  const data = await res.json()
  return { history: Array.isArray(data.history) ? data.history : [], notebook: Array.isArray(data.notebook) ? data.notebook : [], updatedAt: Number(data.updatedAt) || 0 }
}

export async function push(code: string, endpoint: string, store: Store): Promise<number> {
  const body = JSON.stringify({ history: store.history, notebook: store.notebook, updatedAt: Date.now() })
  const res = await fetch(endpoint + '/' + encodeURIComponent(code), { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body })
  if (!res.ok) throw new Error('上传失败（' + res.status + '）')
  return Date.now()
}

export function mergeStore(local: Store, remote: SyncPayload): Store {
  const history = new Map<string, any>()
  for (const item of [...remote.history, ...local.history]) {
    if (!item || typeof item.id !== 'string') continue
    const prev = history.get(item.id)
    if (!prev || (item.date || 0) > (prev.date || 0)) history.set(item.id, item)
  }
  const notebook = new Map<string, any>()
  for (const item of [...remote.notebook, ...local.notebook]) {
    if (!item || typeof item.wordId !== 'string') continue
    const prev = notebook.get(item.wordId)
    if (!prev) { notebook.set(item.wordId, { ...item }); continue }
    const newer = (item.lastSeen || 0) >= (prev.lastSeen || 0) ? item : prev
    notebook.set(item.wordId, {
      wordId: item.wordId,
      mistakes: Math.max(prev.mistakes || 0, item.mistakes || 0),
      lastSeen: Math.max(prev.lastSeen || 0, item.lastSeen || 0),
      mastered: (prev.lastSeen || 0) === (item.lastSeen || 0) ? !!(prev.mastered || item.mastered) : !!newer.mastered,
    })
  }
  return {
    ...local,
    history: [...history.values()].sort((a, b) => (b.date || 0) - (a.date || 0)).slice(0, 100),
    notebook: [...notebook.values()],
  }
}
