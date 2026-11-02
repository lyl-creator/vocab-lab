import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
const root=dirname(fileURLToPath(import.meta.url))
const assets=readdirSync(resolve(root,'dist/assets'))
const js=readFileSync(resolve(root,'dist/assets',assets.find(f=>f.endsWith('.js'))),'utf8').replace(/<\/script/gi,'<\\/script')
const css=readFileSync(resolve(root,'dist/assets',assets.find(f=>f.endsWith('.css'))),'utf8')
const html=`<!doctype html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#faf9f6"><meta name="description" content="基于你的教材词库，以选择、拼写与配对测验了解词汇掌握度。"><title>词汇实验室 · Vocab Lab</title><style>${css}</style></head><body><div id="root"></div><script type="module">${js}</script></body></html>`
writeFileSync(resolve(root,'vocab-lab.html'),html,'utf8')
console.log('Built self-contained vocab-lab.html ('+html.length+' bytes) — docs/ 由 build-pages.mjs 生成')
