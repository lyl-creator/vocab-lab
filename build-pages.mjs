// 生成多入口静态页：docs/<路由>/index.html，每个页面有独立的 title / description / og 标签。
// 用法：node build-pages.mjs   （需先 npm run build 生成 dist/）
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)))
const SITE = (process.env.SITE_ORIGIN || 'https://lyl-creator.github.io/vocab-lab').replace(/\/$/, '')
const SITE_PATH = new URL(SITE).pathname.replace(/\/$/, '')

const { vocabulary, unitNames } = await import('./src/vocabulary.ts')
const { TRANSLATION_WORDS } = await import('./src/data/translation.ts')

const MODE_META = {
  'en-zh': ['英译中', '看英文选中文，检验词义识别。'],
  'zh-en': ['中译英', '看中文选英文，检验主动回忆。'],
  spelling: ['拼写填空', '不给选项，直接拼写单词或短语。'],
  matching: ['词义配对', '把单词和释义连起来，建立语义关联。'],
  cloze: ['选词填空', '在文章空格里填词，四级词库直接用真题。'],
  translate: ['翻译题', '翻译一段中文，提交后对照参考译文与点拨。'],
}
const DICT_META = {
  book: ['课本词库', '来自教材的 241 个词，按单元与栏目练习。'],
  cet4: ['四级词库', '四级大纲 4428 词，其中 577 个高频词。'],
  translation: ['翻译词汇', '四六级翻译常用表达 548 条，按主题分组。'],
}
const DICT_MODES = {
  book: ['en-zh', 'zh-en', 'spelling', 'matching', 'cloze'],
  cet4: ['en-zh', 'zh-en', 'spelling', 'matching', 'cloze', 'translate'],
  translation: ['zh-en', 'spelling', 'matching'],
}
const SECTION_SLUGS = { 'Episode 1': 'episode-1', 'Episode 2': 'episode-2', 'Text A': 'text-a', 'Text B': 'text-b' }

const routes = []
const add = (path, title, desc) => routes.push({ path, title: title + ' · 词汇实验室', desc })

add('/', '学习概览', '词汇实验室：用教材与四六级词库做英译中、中译英、拼写、配对、真题选词填空与翻译练习，学习记录只保存在本机浏览器。')
add('/notebook/', '生词本', '测验中答错的词会自动归档到这里，按错题次数排序，可标记为已掌握或集中复习。')
add('/history/', '学习统计', '查看累计测验次数、综合正确率、近 7 天学习节奏与每一次测验的详细报告。')
add('/guide/', '使用指南', '词汇实验室的功能说明：三个词库、六种练习、四级真题、生词本与统计、账号云同步、数据备份与常见问题。')

add('/book/', '课本词库', '教材 241 个词，含 ★ 重点词标记，按 Unit 与 Episode / Text 栏目筛选练习。')
const sectionsOf = (unit) => [...new Set(vocabulary.filter((w) => w.unit === unit).map((w) => w.section))]
for (let unit = 1; unit < unitNames.length; unit++) {
  const label = unitNames[unit].split(' · ')[0]
  const count = vocabulary.filter((w) => w.unit === unit).length
  add('/book/u' + unit + '/', '课本词库 · ' + label, label + ' 的 ' + count + ' 个词，可继续按栏目筛选。')
  for (const section of sectionsOf(unit)) {
    const n = vocabulary.filter((w) => w.unit === unit && w.section === section).length
    add('/book/u' + unit + '/' + SECTION_SLUGS[section] + '/', '课本词库 · ' + label + ' · ' + section, label + ' · ' + section + ' 的 ' + n + ' 个词。')
  }
}

add('/cet4/', '四级词库', '四级大纲 4428 词，577 个高频词，可选只考高频，真题选词填空与翻译共 12 套。')
add('/cet4/high/', '四级词库 · 高频词', '四级高频 577 词，按英译中、拼写、配对等方式练习。')

const groups = [...new Set(TRANSLATION_WORDS.map((e) => e.group))]
add('/translation/', '翻译词汇', '四六级翻译常用表达 548 条，按 11 个主题分组练习中译英与拼写。')
for (const group of groups) {
  const n = TRANSLATION_WORDS.filter((e) => e.group === group).length
  add('/translation/' + group + '/', '翻译词汇 · ' + group, group + ' 主题的 ' + n + ' 条翻译表达，中译英与拼写练习。')
}

for (const dict of Object.keys(DICT_MODES)) {
  for (const mode of DICT_MODES[dict]) {
    const [modeTitle, modeDesc] = MODE_META[mode]
    add('/' + dict + '/' + mode + '/', DICT_META[dict][0] + ' · ' + modeTitle, modeDesc + DICT_META[dict][1])
  }
}

const distIndex = resolve(root, 'dist/index.html')
if (!existsSync(distIndex)) throw new Error('dist/index.html 不存在，请先 npm run build')
const tpl = readFileSync(distIndex, 'utf8')
const js = (tpl.match(/<script[^>]+src="([^"]+?\.js)"/) || [])[1]
const css = (tpl.match(/<link[^>]+href="([^"]+?\.css)"/) || [])[1]
if (!js || !css) throw new Error('无法从 dist/index.html 解析出 js/css 资源')
const jsName = js.split('/').pop()
const cssName = css.split('/').pop()

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
function pageHtml({ path, title, desc, depth, noindex, absolute }) {
  const prefix = absolute ? SITE_PATH + '/' : '../'.repeat(depth)
  const url = SITE + path
  const lines = [
    '<!doctype html>',
    '<html lang="zh-CN">',
    '<head>',
    '<meta charset="UTF-8" />',
    '<meta name="viewport" content="width=device-width, initial-scale=1.0" />',
    '<meta name="theme-color" content="#faf9f6" />',
    '<title>' + esc(title) + '</title>',
    '<meta name="description" content="' + esc(desc) + '" />',
  ]
  if (noindex) lines.push('<meta name="robots" content="noindex" />')
  lines.push(
    '<meta property="og:type" content="website" />',
    '<meta property="og:site_name" content="词汇实验室 Vocab Lab" />',
    '<meta property="og:title" content="' + esc(title) + '" />',
    '<meta property="og:description" content="' + esc(desc) + '" />',
    '<meta property="og:url" content="' + url + '" />',
    '<meta name="twitter:card" content="summary" />',
    '<link rel="canonical" href="' + url + '" />',
    '<link rel="icon" href="' + prefix + 'favicon.ico" sizes="any" />',
    '<link rel="icon" type="image/svg+xml" href="' + prefix + 'favicon.svg" />',
    '<link rel="apple-touch-icon" href="' + prefix + 'apple-touch-icon.png" />',
    '<link rel="stylesheet" crossorigin href="' + prefix + 'assets/' + cssName + '" />',
    "<style>\nhtml,body{margin:0;background:#faf9f6}\n.boot{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;font-family:ui-sans-serif,system-ui,\"PingFang SC\",\"Microsoft YaHei\",sans-serif;color:#4f673b}\n.boot-mark{width:72px;height:72px;border-radius:20px;background:linear-gradient(180deg,#e8f2cd,#cfe1a7);display:grid;place-items:center;box-shadow:0 10px 30px rgba(79,103,59,.12)}\n.boot-mark svg{width:44px;height:44px}\n.boot-name{font-size:15px;letter-spacing:4px;color:#5b6a4c}\n.boot-bar{width:132px;height:4px;border-radius:999px;background:#e6ead9;overflow:hidden}\n.boot-bar i{display:block;width:40%;height:100%;border-radius:999px;background:#8eab50;animation:bootslide 1.1s ease-in-out infinite}\n@keyframes bootslide{0%{transform:translateX(-100%)}100%{transform:translateX(330%)}}\n@media (prefers-reduced-motion:reduce){.boot-bar i{animation:none;width:100%}}\n</style>",
    '</head>',
    '<body>',
    '<div id="root"><div class="boot" role="status" aria-label="正在加载词汇实验室"><div class="boot-mark"><svg viewBox="0 0 512 512" aria-hidden="true"><path d="M243 170c-44-27-100-31-148-9-6 3-10 9-10 16v204c0 9 9 15 18 11 42-19 94-15 130 11 6 4 14 4 20 0z" fill="#4f673b"/><path d="M269 170c44-27 100-31 148-9 6 3 10 9 10 16v204c0 9-9 15-18 11-42-19-94-15-130 11-6 4-14 4-20 0z" fill="#4f673b"/><path d="M392 96l9.5 22.5L424 128l-22.5 9.5L392 160l-9.5-22.5L360 128l22.5-9.5z" fill="#c9a227"/></svg></div><div class="boot-name">词汇实验室</div><div class="boot-bar"><i></i></div></div></div>',
    '<script type="module" crossorigin src="' + prefix + 'assets/' + jsName + '"></script>',
    '</body>',
    '</html>',
    ''
  )
  return lines.join('\n')
}

const docs = resolve(root, 'docs')
for (const name of ['index.html', '404.html', 'sitemap.xml', 'robots.txt', 'assets', 'book', 'cet4', 'translation', 'notebook', 'history']) {
  rmSync(join(docs, name), { recursive: true, force: true })
}
mkdirSync(join(docs, 'assets'), { recursive: true })
for (const file of readdirSync(resolve(root, 'dist/assets'))) {
  copyFileSync(join(root, 'dist/assets', file), join(docs, 'assets', file))
}

for (const file of ['favicon.ico', 'favicon.svg', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png']) {
  const src = join(root, 'dist', file)
  if (existsSync(src)) copyFileSync(src, join(docs, file))
}

for (const route of routes) {
  const depth = route.path.split('/').filter(Boolean).length
  const dir = join(docs, ...route.path.split('/').filter(Boolean))
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.html'), pageHtml({ ...route, depth }))
}

writeFileSync(join(docs, '404.html'), pageHtml({ path: '/404.html', title: '词汇实验室 · Vocab Lab', desc: '这个地址没有对应的页面，已为你打开词汇实验室。', depth: 0, noindex: true, absolute: true }))
writeFileSync(join(docs, '.nojekyll'), '')

const today = new Date().toISOString().slice(0, 10)
const urls = routes.map((r) => '  <url><loc>' + SITE + r.path + '</loc><lastmod>' + today + '</lastmod></url>').join('\n')
writeFileSync(join(docs, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls + '\n</urlset>\n')
writeFileSync(join(docs, 'robots.txt'), 'User-agent: *\nAllow: /\nSitemap: ' + SITE + '/sitemap.xml\n')

console.log('生成 ' + routes.length + ' 个页面 + 404.html / sitemap.xml / robots.txt（资源 ' + jsName + ' + ' + cssName + '）')