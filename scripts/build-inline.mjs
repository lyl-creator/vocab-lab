// Sandbox-friendly Vite build: no piped child processes, no esbuild service.
// Vite's define plugin only needs esbuild.transform(), so scripts/esbuild-shim.mjs
// is temporarily installed over node_modules/esbuild/lib/main.js.
// Usage: node scripts/build-inline.mjs   (then: node scripts/finalize-assets.mjs)
import cp from 'node:child_process'
import { copyFileSync, existsSync, rmSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const esbuildMain = join(root, 'node_modules/esbuild/lib/main.js')
const backup = esbuildMain + '.sandbox-backup'
if (!existsSync(esbuildMain)) throw new Error('node_modules/esbuild not found — run npm install first')
if (!existsSync(backup)) copyFileSync(esbuildMain, backup)
copyFileSync(join(root, 'scripts/esbuild-shim.mjs'), esbuildMain)
const restore = () => {
  if (existsSync(backup)) {
    copyFileSync(backup, esbuildMain)
    rmSync(backup, { force: true })
  }
}
process.on('exit', restore)
process.on('uncaughtException', (err) => { restore(); console.error(err); process.exit(1) })
cp.exec = (cmd, cb) => {
  if (typeof cb === 'function') process.nextTick(() => cb(new Error('child_process disabled by sandbox'), '', ''))
  return { on() {}, kill() {}, unref() {} }
}
cp.execFile = cp.exec
const path = await import('node:path')
const ts = (await import('typescript')).default

function tsTranspile() {
  return {
    name: 'ts-transpile-inline',
    enforce: 'pre',
    transform(code, id) {
      if (!/\.(ts|tsx)$/.test(id) || id.includes('node_modules')) return null
      const out = ts.transpileModule(code, {
        fileName: id,
        compilerOptions: {
          jsx: ts.JsxEmit.ReactJSX,
          target: ts.ScriptTarget.ES2020,
          module: ts.ModuleKind.ESNext,
          moduleResolution: ts.ModuleResolutionKind.Bundler,
          isolatedModules: true,
          verbatimModuleSyntax: false,
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
        },
      })
      return { code: out.outputText, map: null }
    },
  }
}

const { build } = await import('vite')
await build({
  configFile: false,
  root,
  base: './',
  resolve: { alias: { '@': path.resolve(root, 'src') } },
  esbuild: false,
  plugins: [tsTranspile()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'esnext',
    minify: false,
    cssCodeSplit: true,
    rollupOptions: { input: path.resolve(root, 'index.html') },
  },
})
restore()
console.log('VITE BUILD OK (unminified — run node scripts/finalize-assets.mjs next)')
