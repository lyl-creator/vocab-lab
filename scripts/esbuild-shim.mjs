// Pure-JS stand-in for esbuild's JS API.
// The DSH file sandbox blocks piped child processes (spawn EPERM), and esbuild's
// JS API talks to a spawned binary over pipes. Only transform() is needed by
// Vite's define plugin during a build, so we replace it with a tiny JS version.
const version = '0.0.0-shim'

function applyDefines(code, define) {
  if (!define) return code
  const keys = Object.keys(define).sort((a, b) => b.length - a.length)
  let out = code
  for (const key of keys) {
    if (!out.includes(key)) continue
    const esc = key.replace(/[.*+?^\${}()|[\]\\]/g, '\\$&')
    const re = new RegExp('(?<![\\w$.])' + esc + '(?![\\w$])', 'g')
    out = out.replace(re, String(define[key]))
  }
  return out
}

function mapFor(code, sourcefile) {
  return JSON.stringify({ version: 3, sources: [sourcefile || 'module.js'], sourcesContent: [code], names: [], mappings: '' })
}

export async function transform(code, opts = {}) {
  return { code: applyDefines(code, opts.define), map: mapFor(code, opts.sourcefile), warnings: [] }
}
export function transformSync(code, opts = {}) {
  return { code: applyDefines(code, opts.define), map: mapFor(code, opts.sourcefile), warnings: [] }
}
export function formatMessages() { return Promise.resolve([]) }
export function formatMessagesSync() { return [] }
export async function build() { throw new Error('esbuild shim: build() is not supported') }
export function context() { throw new Error('esbuild shim: context() is not supported') }
export { version }
export default { transform, transformSync, build, context, formatMessages, formatMessagesSync, version }
