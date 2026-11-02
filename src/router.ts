import { GROUPS, DICTS, type DictId } from './dicts'
import { EXAM_CLOZE, EXAM_TRANSLATION } from './data/exams'
import type { Mode } from './engine'

// 路径 → 应用状态 的唯一映射。URL 形如：
//   /                          学习概览
//   /notebook/                 生词本
//   /history/                  学习统计
//   /book/                     课本词库
//   /book/u1/                  Unit 1
//   /book/u1/episode-1/        Unit 1 · Episode 1
//   /cet4/high/                四级高频
//   /translation/中国历史/       翻译词汇分组
//   /cet4/cloze/               直接选中该练习方式
//   /cet4/cloze/2025-12-2/     并预选真题套次

export type Page = 'home' | 'words' | 'notebook' | 'history' | 'guide'

export type Route = {
  page: Page
  dict: DictId
  unit: number
  section: string
  high: boolean
  group: string
  mode: Mode | null
  exam: string | null
}

export const MODE_IDS: Mode[] = ['en-zh', 'zh-en', 'spelling', 'matching', 'cloze', 'translate']

const SECTION_SLUGS: [string, string][] = [
  ['Episode 1', 'episode-1'],
  ['Episode 2', 'episode-2'],
  ['Text A', 'text-a'],
  ['Text B', 'text-b'],
]

export const sectionSlug = (section: string) => SECTION_SLUGS.find(([name]) => name === section)?.[1] || section.toLowerCase().replace(/\s+/g, '-')

const sectionFromSlug = (slug: string) => SECTION_SLUGS.find(([, s]) => s === slug)?.[0] || ''

const examIds = [...EXAM_CLOZE, ...EXAM_TRANSLATION].map((e) => e.id)

export const defaultRoute = (dict: DictId = 'book', page: Page = 'home'): Route => ({
  page, dict, unit: 0, section: '', high: false, group: '', mode: null, exam: null,
})

// pathname 已去掉站点前缀（形如 /cet4/high/）
export function parseRoute(path: string): Route {
  const segments = path.split('/').filter(Boolean).map((s) => {
    try { return decodeURIComponent(s) } catch { return s }
  })
  if (!segments.length) return defaultRoute()
  const head = segments[0]
  if (head === 'notebook') return { ...defaultRoute(), page: 'notebook' }
  if (head === 'history') return { ...defaultRoute(), page: 'history' }
  if (head === 'guide') return { ...defaultRoute(), page: 'guide' }
  if (head === 'home') return defaultRoute()

  const dict = DICTS.some((d) => d.id === head) ? (head as DictId) : null
  if (!dict) return defaultRoute()

  const route: Route = { page: 'words', dict, unit: 0, section: '', high: false, group: '', mode: null, exam: null }
  for (const token of segments.slice(1)) {
    const unit = /^u(\d+)$/.exec(token)
    if (unit) { route.unit = Number(unit[1]) || 0; continue }
    if (token === 'high' && dict === 'cet4') { route.high = true; continue }
    if (MODE_IDS.includes(token as Mode)) { route.mode = token as Mode; continue }
    const section = sectionFromSlug(token)
    if (section) { route.section = section; continue }
    if (dict === 'translation' && GROUPS.includes(token)) { route.group = token; continue }
    if (/^\d{4}-\d{2}-\d$/.test(token) && examIds.includes(token)) { route.exam = token; continue }
  }
  return route
}

export function routePath(route: Route): string {
  if (route.page === 'home') return '/'
  if (route.page === 'notebook') return '/notebook/'
  if (route.page === 'history') return '/history/'
  if (route.page === 'guide') return '/guide/'
  let path = '/' + route.dict + '/'
  if (route.dict === 'book') {
    if (route.unit) path += 'u' + route.unit + '/'
    if (route.section) path += sectionSlug(route.section) + '/'
  } else if (route.dict === 'cet4') {
    if (route.high) path += 'high/'
  } else if (route.group) {
    path += encodeURIComponent(route.group) + '/'
  }
  if (route.mode) path += route.mode + '/'
  if (route.exam) path += route.exam + '/'
  return path
}

// 旧版的 #/cet4/high 链接 → 新路径
export function legacyHashPath(hash: string): string | null {
  if (!hash || !hash.startsWith('#')) return null
  const segments = hash.replace(/^#\/?/, '').split('/').filter(Boolean)
  if (!segments.length) return '/'
  const dict = segments[0]
  if (!DICTS.some((d) => d.id === dict)) return null
  const route: Route = { page: 'words', dict: dict as DictId, unit: 0, section: '', high: false, group: '', mode: null, exam: null }
  if (dict === 'book') {
    route.unit = Number(segments[1]) || 0
    route.section = segments[2] ? decodeURIComponent(segments[2]) : ''
  } else if (dict === 'cet4') {
    route.high = segments[1] === 'high'
  } else {
    route.group = segments[1] ? decodeURIComponent(segments[1]) : ''
  }
  return routePath(route)
}
