import { vocabulary, type Word } from './vocabulary'
import { passages, type Passage } from './passages'
import { TRANSLATION_WORDS } from './data/translation'
import type { Mode } from './engine'

export type DictId = 'book' | 'cet4' | 'translation'
export type DictFilter = 'section' | 'high' | 'group'
export type DictMeta = { id: DictId; name: string; desc: string; modes: Mode[]; filter: DictFilter }

export const DICTS: DictMeta[] = [
  { id: 'book', name: '课本词库', desc: '9 页扫描教材 · 241 词', modes: ['en-zh', 'zh-en', 'spelling', 'matching', 'cloze'], filter: 'section' },
  { id: 'cet4', name: '四级词库', desc: '大纲 4428 词 · 高频 577', modes: ['en-zh', 'zh-en', 'spelling', 'matching', 'cloze', 'translate'], filter: 'high' },
  { id: 'translation', name: '翻译词汇', desc: '548 条四六级翻译表达', modes: ['zh-en', 'spelling', 'matching'], filter: 'group' },
]

const tidyZh = (zh: string) => zh
  .replace(/([\u4e00-\u9fff）)])\s*((?:adj|adv|prep|pron|conj|num|art|int|vt|vi|n|v|a)\.)/g, '$1；$2')
  .replace(/；\s*；/g, '；')
  .replace(/\s+/g, ' ')
  .trim()

// 四级数据 615KB，单独打成异步 chunk：首屏只加载 React 与其它词库
let cet4Words: Word[] = []
let cet4Loaded = false
let cet4Promise: Promise<void> | null = null
const buildCet4 = (list: { en: string; zh: string; ipa: string; high: boolean }[]): Word[] => list.map((e, i) => ({
  id: 'c' + i, en: e.en, zh: tidyZh(e.zh), pos: '', unit: 0, section: '', page: 0,
  phrase: false, starred: e.high, ipa: e.ipa, high: e.high,
}))

const translationWords: Word[] = TRANSLATION_WORDS.map((e, i) => ({
  id: 't' + i, en: e.en, zh: e.zh, pos: '', unit: 0, section: e.group, page: 0,
  phrase: false, starred: false,
}))

export const dictWords = (id: DictId): Word[] => (id === 'book' ? vocabulary : id === 'cet4' ? cet4Words : translationWords)
export const dictPassages = (id: DictId): Passage[] => (id === 'book' ? passages : [])
export const dictMeta = (id: DictId) => DICTS.find(d => d.id === id) || DICTS[0]
export const GROUPS = [...new Set(TRANSLATION_WORDS.map(e => e.group))]
export const HIGH_COUNT = cet4Words.filter(w => w.starred).length
export const wordIndex = new Map<string, Word>([...vocabulary, ...translationWords].map(w => [w.id, w]))

export const isDictReady = (id: DictId): boolean => id !== 'cet4' || cet4Loaded

export function loadDict(id: DictId): Promise<void> {
  if (id !== 'cet4' || cet4Loaded) return Promise.resolve()
  if (!cet4Promise) {
    cet4Promise = import('./data/cet4').then((m) => {
      cet4Words = buildCet4(m.CET4_WORDS)
      for (const w of cet4Words) wordIndex.set(w.id, w)
      cet4Loaded = true
    })
  }
  return cet4Promise
}
