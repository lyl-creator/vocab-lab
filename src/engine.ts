import { vocabulary, type Word } from './vocabulary'
import { passagesOf, type Passage } from './passages'
export type Mode = 'en-zh' | 'zh-en' | 'spelling' | 'matching' | 'cloze'
export type Answer = { wordId: string; correct: boolean; given: string; seconds: number }
export type Question = { words: Word[]; options: Word[] }
export type ClozeBlank = { wordId: string; en: string; zh: string }
export type ClozeToken = { t: 'text'; v: string } | { t: 'blank'; i: number }
export type ClozeData = { passageId: string; title: string; source: string; blocks: ClozeToken[][]; blanks: ClozeBlank[]; bank: string[] }
export type Test = { id: string; mode: Mode; questions: Question[]; index: number; answers: Answer[]; started: number; elapsed: number; unit: number; section: string; review: boolean; matchingFailures: string[]; cloze?: ClozeData }
export type Report = { id: string; mode: Mode; answers: Answer[]; seconds: number; date: number; unit: number; total: number; review: boolean }
export type NotebookEntry = { wordId: string; mistakes: number; lastSeen: number; mastered: boolean }
export type Store = { history: Report[]; notebook: NotebookEntry[]; active: Test | null; sound: boolean }
export const modes: { id: Mode; title: string; english: string; description: string; tag: string; color: string }[] = [
{ id: 'en-zh',title:'英译中',english:'Recognize',description:'从英文出发，找到准确的中文释义。',tag:'词义识别',color:'mint' },
{ id: 'zh-en',title:'中译英',english:'Recall',description:'看到中文释义，选出对应英文词汇。',tag:'主动回忆',color:'peach' },
{ id: 'spelling',title:'拼写填空',english:'Spell',description:'不依赖选项，检验你的拼写记忆。',tag:'深度掌握',color:'lavender' },
{ id: 'matching',title:'词义配对',english:'Connect',description:'连接单词与释义，让记忆形成关联。',tag:'关联记忆',color:'blue' },
{ id: 'cloze',title:'选词填空',english:'Cloze',description:'在文章的空格中填入合适的词，检验语境理解。',tag:'语境运用',color:'mint' }
]
export const shuffle = <T,>(arr: T[]): T[] => { const a=[...arr]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]} return a }
export const normalize = (s:string) => s.trim().toLowerCase().replace(/\s+/g,' ')
export const checkSpelling = (given:string, word:Word) => normalize(given)===normalize(word.en) || (word.en==='preventative' && normalize(given)==='preventive')
export function createTest(mode:Mode, unit:number, section:string, count:number, notebook:NotebookEntry[], review=false):Test {
 let pool=vocabulary.filter(w => (!unit||w.unit===unit) && (!section||w.section===section) && (!review||notebook.some(n=>n.wordId===w.id&&!n.mastered)))
 // Ellipses and grammatical placeholders are unsuitable for exact spelling.
 const spellable=(w:Word)=>!w.en.includes('/')&&!/\b(?:sb|sth)\.|\.\.\.|\(|\)|~/.test(w.en)
 if(mode==='spelling') pool=pool.filter(spellable)
 const chosen=shuffle(pool).slice(0,count)
 const questions:Question[]=mode==='matching'?Array.from({length:Math.ceil(chosen.length/4)},(_,i)=>{const words=chosen.slice(i*4,i*4+4);return {words,options:shuffle(words)}}):chosen.map(word=>({words:[word],options:shuffle([word,...shuffle(vocabulary.filter(w=>w.id!==word.id&&w.en!==word.en&&w.zh!==word.zh)).slice(0,3)])}))
 return {id:crypto.randomUUID(),mode,unit,section,review,questions,index:0,answers:[],started:Date.now(),elapsed:0,matchingFailures:[]}
}
export function addAnswers(book:NotebookEntry[],answers:Answer[]):NotebookEntry[] {const next=book.map(n=>({...n}));for(const a of answers){if(a.correct)continue;const entry=next.find(n=>n.wordId===a.wordId);if(entry){entry.mistakes++;entry.lastSeen=Date.now();entry.mastered=false}else next.push({wordId:a.wordId,mistakes:1,lastSeen:Date.now(),mastered:false})}return next}
export const accuracy = (answers:Answer[])=>answers.length?Math.round(answers.filter(a=>a.correct).length/answers.length*100):0
export const duration = (seconds:number)=> `${Math.floor(seconds/60).toString().padStart(2,'0')}:${Math.floor(seconds%60).toString().padStart(2,'0')}`
export const level = (score:number)=>score>=90?{title:'掌握扎实',text:'本次抽测表现出色。建议换用拼写模式，检验能否脱离提示主动回忆。'}:score>=75?{title:'较好掌握',text:'大部分词汇已熟悉。复习本次错题后，再用不同题型巩固薄弱环节。'}:score>=50?{title:'正在进步',text:'已经建立一定的词汇基础。建议先浏览词库，再以短测验分批练习。'}:{title:'需要巩固',text:'这些词汇仍需更多练习。建议每次学习 5–10 个词，重点复习生词本。'}
export const storageKey='vocab-lab-v1'
export const emptyStore:Store={history:[],notebook:[],active:null,sound:false}
export function loadStore():Store {try{const raw=JSON.parse(localStorage.getItem(storageKey)||'null');if(raw&&Array.isArray(raw.history)&&Array.isArray(raw.notebook))return {...emptyStore,...raw}}catch{/* unavailable or invalid storage */}return {...emptyStore}}


// ---------- 选词填空（文章挖空） ----------
const inflected = (w: string): string[] => {
  const base = w.toLowerCase()
  const out = new Set([base])
  if (base.endsWith('y')) { const b = base.slice(0, -1); out.add(b + 'ies'); out.add(b + 'ied'); out.add(b + 'ily') }
  if (base.endsWith('e')) { out.add(base + 'd'); out.add(base + 'r'); out.add(base + 'st') }
  out.add(base + 's'); out.add(base + 'es'); out.add(base + 'ed'); out.add(base + 'ing'); out.add(base + 'ly')
  const last = base[base.length - 1]
  if (/[bdgklmnprt]/.test(last)) { out.add(base + last + 'ed'); out.add(base + last + 'ing'); out.add(base + last + 'er') }
  return [...out]
}
const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const matchWord = (text: string, word: string): [number, number] | null => {
  const forms = inflected(word).map(escapeRe).join('|')
  const re = new RegExp('(?<![A-Za-z])(' + forms + ')(?![A-Za-z])', 'i')
  const m = re.exec(text)
  return m ? [m.index, m.index + m[0].length] : null
}
export function clozeMatches(unit: number, section: string) {
  const result: { passage: Passage; words: Word[] }[] = []
  for (const passage of passagesOf(unit, section)) {
    const text = passage.paragraphs.join('\n')
    const words = vocabulary.filter(w => w.unit === passage.unit && w.section === passage.section && !w.phrase && matchWord(text, w.en))
    result.push({ passage, words })
  }
  return result
}
export const clozeCapacity = (unit: number, section: string) =>
  clozeMatches(unit, section).reduce((max, item) => Math.max(max, item.words.length), 0)

export function createCloze(unit: number, section: string, count: number, notebook: NotebookEntry[], review = false): Test | null {
  const candidates = clozeMatches(unit, section).filter(item => item.words.length >= Math.min(count, 6))
  if (!candidates.length) return null
  const pick = candidates[Math.floor(Math.random() * candidates.length)]
  const passage = pick.passage
  let pool = pick.words
  if (review) pool = pool.filter(w => notebook.some(n => n.wordId === w.id && !n.mastered))
  if (pool.length < 6) pool = pick.words
  const chosen = shuffle(pool).slice(0, Math.min(count, pool.length))
  const found: { pi: number; start: number; end: number; word: Word }[] = []
  for (const word of chosen) {
    for (let pi = 0; pi < passage.paragraphs.length; pi++) {
      const hit = matchWord(passage.paragraphs[pi], word.en)
      if (hit) { found.push({ pi, start: hit[0], end: hit[1], word }); break }
    }
  }
  found.sort((a, b) => a.pi - b.pi || a.start - b.start)
  const blocks: ClozeToken[][] = []
  const blanks: ClozeBlank[] = []
  let index = 0
  passage.paragraphs.forEach((para, pi) => {
    const hits = found.filter(f => f.pi === pi)
    const tokens: ClozeToken[] = []
    let cursor = 0
    for (const item of hits) {
      if (item.start < cursor) continue
      if (item.start > cursor) tokens.push({ t: 'text', v: para.slice(cursor, item.start) })
      tokens.push({ t: 'blank', i: index })
      blanks.push({ wordId: item.word.id, en: item.word.en, zh: item.word.zh })
      index++
      cursor = item.end
    }
    if (cursor < para.length) tokens.push({ t: 'text', v: para.slice(cursor) })
    blocks.push(tokens)
  })
  if (!blanks.length) return null
  return {
    id: crypto.randomUUID(), mode: 'cloze', unit: passage.unit, section: passage.section, review,
    questions: [{ words: blanks.map(b => vocabulary.find(w => w.id === b.wordId)!), options: [] }],
    index: 0, answers: [], started: Date.now(), elapsed: 0, matchingFailures: [],
    cloze: { passageId: passage.id, title: passage.title, source: passage.source, blocks, blanks, bank: shuffle(blanks.map(b => b.wordId)) },
  }
}
