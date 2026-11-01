// Data-level acceptance test for the CET-4 exam bank (选词填空 + 翻译题).
// Runs the real engine (src/engine.ts) through Node's TS type stripping, so it
// works without a browser: no server, no Playwright.
// Usage: node scripts/verify-exams.mjs

import assert from 'node:assert/strict'
const { createExamCloze, createTranslationTest } = await import('../src/engine.ts')
const { EXAM_CLOZE, EXAM_TRANSLATION } = await import('../src/data/exams.ts')
const cl = await import('../src/data/exams.ts')

assert.equal(EXAM_CLOZE.length, 12, 'cloze count')
assert.equal(EXAM_TRANSLATION.length, 12, 'translation count')

const ids = EXAM_CLOZE.map(e => e.id)
assert.equal(new Set(ids).size, ids.length, 'unique cloze ids')
const tids = EXAM_TRANSLATION.map(e => e.id)
assert.equal(new Set(tids).size, tids.length, 'unique translation ids')
assert.deepEqual(ids, tids, 'id sets match across both tables')

const noise = [/fbr\b/, /\bo f\b/, /\bifs\b/, /\b0 \)/, /\bTn\b/, /tem pered/, /m ight/, /remem ber/, /\bAlzheimer5s/, /parfs/, /  \./]
const report = []
for (const e of EXAM_CLOZE) {
  const t = createExamCloze(e)
  const c = t.cloze
  assert.equal(c.blanks.length, 10, e.id + ' blanks')
  assert.equal(c.bank.length, 15, e.id + ' bank')
  assert.equal(new Set(e.answers).size, 10, e.id + ' answer letters unique')
  for (let i = 0; i < 10; i++) {
    const word = e.bank.find(b => b.letter === e.answers[i])
    assert.ok(word, e.id + ' answer letter ' + e.answers[i] + ' in bank')
    assert.equal(c.blanks[i].form, word.word, e.id + ' blank ' + (26 + i) + ' form')
  }
  const letters = e.bank.map(b => b.letter).join('')
  assert.equal(letters, 'ABCDEFGHIJKLMNO', e.id + ' bank letters')
  assert.equal(e.bank.filter(b => e.answers.includes(b.letter)).length, 10, e.id + ' distinct answer words')
  const text = e.paragraphs.join(' ')
  assert.equal((text.match(/\b(2[6-9]|3[0-5])\b/g) || []).length, 10, e.id + ' blank markers')
  if (e.id.startsWith('2025')) {
    for (const re of noise) assert.ok(!re.test(text), e.id + ' noise ' + re)
    assert.ok(!/\s{3,}/.test(text), e.id + ' no wide gaps')
    for (const b of c.bank) assert.ok(!/\s/.test(b.en), e.id + ' single-word bank item ' + b.en)
  }
  report.push(e.id + ' blanks=' + c.blanks.length + ' bank=' + c.bank.length + ' answers=' + e.answers.join(''))
}
for (const tr of EXAM_TRANSLATION) {
  assert.ok(tr.prompt.length > 60, tr.id + ' prompt')
  assert.ok(tr.ref.length > 200, tr.id + ' ref')
  if (tr.id.startsWith('2025')) assert.ok(tr.tips && tr.tips.length > 100, tr.id + ' tips')
  assert.ok(/[\u4e00-\u9fa5]/.test(tr.prompt), tr.id + ' chinese prompt')
  assert.ok(!/[\u4e00-\u9fa5]/.test(tr.ref), tr.id + ' english ref only')
  assert.ok(!/ {2,}/.test(tr.prompt.replace(/\(\w/g, '(')), tr.id + ' prompt spacing')
  const t = createTranslationTest(tr)
  assert.equal(t.tr.ref, tr.ref)
  report.push(tr.id + ' prompt=' + tr.prompt.length + ' ref=' + tr.ref.length + ' tips=' + (tr.tips || '').length)
}
console.log(report.join('\n'))
console.log('ALL DATA CHECKS PASSED')