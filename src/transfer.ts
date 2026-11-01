import type { NotebookEntry, Report, Store } from './engine'

export type Backup = { history: Report[]; notebook: NotebookEntry[]; sound?: boolean; exportedAt?: string }
export type BackupSummary = { tests: number; words: number; exportedAt?: string }

export function parseBackup(text: string): Backup | null {
  let raw: any
  try { raw = JSON.parse(text) } catch { return null }
  if (!raw || typeof raw !== 'object') return null
  if (!Array.isArray(raw.history) || !Array.isArray(raw.notebook)) return null
  const notebook = raw.notebook.filter((n: any) => n && typeof n.wordId === 'string')
  return {
    history: raw.history.filter((h: any) => h && typeof h.id === 'string' && Array.isArray(h.answers)),
    notebook,
    sound: typeof raw.sound === 'boolean' ? raw.sound : undefined,
    exportedAt: typeof raw.exportedAt === 'string' ? raw.exportedAt : undefined,
  }
}

export const summarize = (backup: Backup): BackupSummary => ({
  tests: backup.history.length,
  words: backup.notebook.length,
  exportedAt: backup.exportedAt,
})

export function mergeBackup(local: Store, backup: Backup): Store {
  const history = new Map<string, Report>()
  for (const item of [...backup.history, ...local.history]) {
    const prev = history.get(item.id)
    if (!prev || (item.date || 0) > (prev.date || 0)) history.set(item.id, item)
  }
  const notebook = new Map<string, NotebookEntry>()
  for (const item of [...backup.notebook, ...local.notebook]) {
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
  return { ...local, history: [...history.values()].sort((a, b) => (b.date || 0) - (a.date || 0)).slice(0, 100), notebook: [...notebook.values()] }
}

export function replaceWithBackup(local: Store, backup: Backup): Store {
  return {
    ...local,
    history: [...backup.history].sort((a, b) => (b.date || 0) - (a.date || 0)).slice(0, 100),
    notebook: [...backup.notebook],
    sound: backup.sound ?? local.sound,
  }
}
