import { vocabulary, type Word } from './vocabulary'
export type Mode = 'en-zh' | 'zh-en' | 'spelling' | 'matching'
export type Answer = { wordId: string; correct: boolean; given: string; seconds: number }
export type Question = { words: Word[]; options: Word[] }
export type Test = { id: string; mode: Mode; questions: Question[]; index: number; answers: Answer[]; started: number; elapsed: number; unit: number; section: string; review: boolean; matchingFailures: string[] }
export type Report = { id: string; mode: Mode; answers: Answer[]; seconds: number; date: number; unit: number; total: number; review: boolean }
export type NotebookEntry = { wordId: string; mistakes: number; lastSeen: number; mastered: boolean }
export type Store = { history: Report[]; notebook: NotebookEntry[]; active: Test | null; sound: boolean }
export const modes: { id: Mode; title: string; english: string; description: string; tag: string; color: string }[] = [
{ id: 'en-zh',title:'英译中',english:'Recognize',description:'从英文出发，找到准确的中文释义。',tag:'词义识别',color:'mint' },
{ id: 'zh-en',title:'中译英',english:'Recall',description:'看到中文释义，选出对应英文词汇。',tag:'主动回忆',color:'peach' },
{ id: 'spelling',title:'拼写填空',english:'Spell',description:'不依赖选项，检验你的拼写记忆。',tag:'深度掌握',color:'lavender' },
{ id: 'matching',title:'词义配对',english:'Connect',description:'连接单词与释义，让记忆形成关联。',tag:'关联记忆',color:'blue' }
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
