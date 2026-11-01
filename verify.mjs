import { chromium } from 'playwright'
import assert from 'node:assert/strict'
const root='C:/Users/minec/WorkBuddy AI/2026-11-01-18-35-48'
const browser=await chromium.launch({channel:'msedge',headless:true})
const errors=[]
try {
 const context=await browser.newContext({viewport:{width:1440,height:1050}})
 const page=await context.newPage()
 page.on('pageerror',e=>errors.push(e.message))
 await page.goto('http://127.0.0.1:5173')
 await page.locator('.hero').waitFor()
 const words=await page.evaluate(async()=> (await import('/src/vocabulary.ts')).vocabulary)
 assert.equal(words.length,241)
 assert.equal(new Set(words.map(w=>w.id)).size,241)
 assert(words.every(w=>w.en&&w.zh&&w.page>=1&&w.page<=9))
 const getStore=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('vocab-lab-v1')))
 async function fresh(){await page.evaluate(()=>localStorage.removeItem('vocab-lab-v1'));await page.reload();await page.locator('.hero').waitFor()}
 async function begin(mode){await page.locator(`.mode-card`).nth(['en-zh','zh-en','spelling','matching'].indexOf(mode)).click();await page.locator('.count-options button').first().click();await page.locator('.full-button').click();await page.locator('.quiz-card').waitFor()}
 for(const mode of ['en-zh','zh-en','spelling']){
  await fresh();await begin(mode)
  for(let i=0;i<5;i++){
   const s=await getStore();const q=s.active.questions[i];const w=q.words[0]
   if(mode==='spelling'){await page.locator('#spelling-input').fill(i===0?'definitelywrong':`  ${w.en.toUpperCase()}  `);await page.getByRole('button',{name:'提交答案'}).click()}
   else {const opt=q.options.findIndex(o=>i===0?o.id!==w.id:o.id===w.id);await page.locator('.answer-option').nth(opt).click()}
   await page.locator('.feedback').waitFor()
   if(i===0){await page.reload();await page.locator('.feedback').waitFor();assert.equal((await getStore()).active.answers.length,1);assert.equal(await page.locator('.answer-option:enabled').count(),0)}
   await page.locator('.quiz-footer .primary-button').click()
  }
  await page.locator('.report-hero').waitFor()
  const s=await getStore();assert.equal(s.history.length,1);assert.equal(s.history[0].answers.filter(a=>a.correct).length,4);assert.equal(s.notebook.length,1);assert.equal(s.active,null)
  assert.match(await page.locator('.report-metrics').innerText(),/80/)
  await page.getByRole('button',{name:'查看生词本',exact:true}).click();await page.locator('.notebook-card').waitFor();await page.getByRole('button',{name:'标记为已掌握'}).click();assert.equal((await getStore()).notebook[0].mastered,true)
  console.log('PASS',mode,'score=80%, refresh no duplicate, notebook persisted')
 }
 await fresh();await begin('matching')
 let state=await getStore();let first=state.active.questions[0];let firstWord=first.words[0];let wrongIndex=first.options.findIndex(o=>o.id!==firstWord.id)
 await page.locator('.matching-grid>div').nth(0).locator('button').first().click()
 await page.locator('.matching-grid>div').nth(1).locator('button').nth(wrongIndex).click()
 assert.equal((await getStore()).notebook.length,1)
 await page.reload();await page.locator('.matching-grid').waitFor()
 for(let group=0;group<2;group++){
  state=await getStore();const q=state.active.questions[group]
  for(let i=0;i<q.words.length;i++){const w=q.words[i];await page.locator('.matching-grid>div').nth(0).locator('button').nth(i).click();await page.locator('.matching-grid>div').nth(1).locator('button').nth(q.options.findIndex(o=>o.id===w.id)).click()}
  await page.locator('.quiz-footer .primary-button').click()
 }
 await page.locator('.report-hero').waitFor();state=await getStore();assert.equal(state.history[0].answers.length,5);assert.equal(state.history[0].answers.filter(a=>a.correct).length,4);assert.equal(state.notebook[0].mistakes,1)
 console.log('PASS matching: first-error scoring, immediate notebook, survives refresh, no duplicate mistake')
 await fresh();await page.locator('.nav-item').nth(1).click();await page.getByRole('textbox',{name:'搜索词汇'}).fill('breakthrough');assert.equal(await page.locator('.word-row').count(),1)
 await page.getByRole('textbox',{name:'搜索词汇'}).fill('');await page.getByRole('combobox',{name:'筛选单元'}).selectOption('2');assert.equal(await page.locator('.word-row').count(),words.filter(w=>w.unit===2).length)
 await page.locator('.nav-item').first().click()
 await page.locator('.mode-card').nth(2).click();await page.locator('#unit-select').selectOption('1');await page.locator('.full-button').click();state=await getStore();assert(state.active.questions.every(q=>q.words[0].unit===1&&!q.words[0].phrase))
 await page.locator('.quiz-header .subtle-button').click();const elapsed=(await getStore()).active.elapsed;assert(await page.locator('.pause-screen').isVisible());await page.locator('.pause-screen .primary-button').click();await page.getByRole('button',{name:'暂时不会'}).click();await page.locator('.feedback.wrong').waitFor()
 await page.getByRole('button',{name:'结束测验',exact:true}).click();await page.getByRole('button',{name:'结束并返回'}).click();assert.equal((await getStore()).active,null)
 console.log('PASS search, filters, spelling pool, pause/resume, skip, early exit')
 await fresh()
 for(const width of [375,768,1024,1440]){await page.setViewportSize({width,height:900});const dims=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,width:window.innerWidth}));assert(dims.scroll<=dims.width,`horizontal overflow at ${width}`);console.log('PASS responsive',width)}
 await page.setViewportSize({width:375,height:812});await page.screenshot({path:root+'/source/mobile.png',fullPage:true});await page.getByRole('button',{name:'打开菜单'}).click();await page.locator('.nav-item').nth(2).click();await page.locator('.empty-state').waitFor();assert.equal(await page.locator('.sidebar.open').count(),0)
 await page.getByRole('button',{name:'打开菜单'}).click();await page.locator('.nav-item').first().click();await begin('spelling');assert(await page.locator('#spelling-input').isVisible());await page.screenshot({path:root+'/source/mobile-quiz.png',fullPage:true})
 console.log('PASS mobile navigation and spelling form')
 const engine=await page.evaluate(async()=>{const e=await import('/src/engine.ts');const v=(await import('/src/vocabulary.ts')).vocabulary;return {alt:e.checkSpelling('preventive',v.find(w=>w.en==='preventative')),wrong:e.checkSpelling('prevntive',v.find(w=>w.en==='preventative')),empty:e.createTest('spelling',1,30,[],true).questions.length}})
 assert.deepEqual(engine,{alt:true,wrong:false,empty:0});assert.equal(errors.length,0,JSON.stringify(errors));console.log('PASS alternative spelling and empty review pool; browser errors = 0')
 await context.close()
 console.log('ALL TESTS PASSED')
} finally {await browser.close()}
