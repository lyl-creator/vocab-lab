// Minify dist/assets with the esbuild CLI (a plain exec; the JS API would need pipes),
// then regenerate docs/index.html + vocab-lab.html via build-standalone.mjs.
// Usage: node scripts/finalize-assets.mjs
import { spawnSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, extname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

function findEsbuild() {
  const dir = join(root, 'node_modules/@esbuild')
  if (existsSync(dir)) {
    for (const name of readdirSync(dir)) {
      const exe = join(dir, name, 'esbuild.exe')
      if (existsSync(exe)) return exe
    }
  }
  throw new Error('esbuild binary not found (expected node_modules/@esbuild/*/esbuild.exe)')
}

const assetsDir = join(root, 'dist/assets')
if (!existsSync(assetsDir)) throw new Error('dist/assets missing — run node scripts/build-inline.mjs first')
const exe = findEsbuild()
let js = ''
for (const file of readdirSync(assetsDir)) {
  const ext = extname(file)
  if (ext !== '.js' && ext !== '.css') continue
  const target = join(assetsDir, file)
  const res = spawnSync(exe, [target, '--minify', '--target=esnext', '--charset=utf8', '--legal-comments=none', '--allow-overwrite', '--outfile=' + target, '--log-level=warning'], { stdio: 'inherit' })
  if (res.status !== 0) throw new Error('minify failed: ' + file)
  if (ext === '.js') js = file
}

const standalone = spawnSync(process.execPath, [join(root, 'build-standalone.mjs')], { cwd: root, stdio: 'inherit' })
if (standalone.status !== 0) throw new Error('build-standalone.mjs failed')
console.log('assets minified: ' + js + ' -> ' + readFileSync(join(assetsDir, js)).length + ' bytes')