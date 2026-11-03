import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync, readdirSync, rmSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
const root = dirname(fileURLToPath(import.meta.url))
const outDir = resolve(root, '.tmp-standalone')
// esbuild 在 Windows 沙箱下清理临时文件可能失败，统一切到项目内的临时目录
process.env.TEMP = resolve(root, '.tmp-build')
process.env.TMP = process.env.TEMP

// 用 inlineDynamicImports 再构建一次，保证四级词库等异步 chunk 被内联进主包
execFileSync(process.execPath, [resolve(root, 'node_modules/vite/bin/vite.js'), 'build', '--outDir', '.tmp-standalone', '--emptyOutDir', '--logLevel', 'warn'], {
  stdio: 'inherit',
  env: { ...process.env, VITE_INLINE: '1' },
})

const assets = readdirSync(join(outDir, 'assets'))
const js = readFileSync(join(outDir, 'assets', assets.find((f) => f.endsWith('.js'))), 'utf8').replace(/<\/script/gi, '<\\/script')
const css = readFileSync(join(outDir, 'assets', assets.find((f) => f.endsWith('.css'))), 'utf8')
const icon = readFileSync(resolve(root, 'public/favicon.svg'), 'utf8')
const iconUri = 'data:image/svg+xml;base64,' + Buffer.from(icon).toString('base64')
const html = `<!doctype html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#faf9f6"><link rel="icon" type="image/svg+xml" href="${iconUri}"><meta name="description" content="基于你的教材词库，以选择、拼写与配对测验了解词汇掌握度。"><title>词汇实验室 · Vocab Lab</title><style>${css}</style></head><body><div id="root"></div><script type="module">${js}</script></body></html>`
writeFileSync(resolve(root, 'vocab-lab.html'), html, 'utf8')
rmSync(outDir, { recursive: true, force: true })
console.log('Built self-contained vocab-lab.html (' + html.length + ' bytes) — docs/ 由 build-pages.mjs 生成')
