# 项目交接文档 · 词汇实验室 Vocab Lab

> 最后更新：2026-11-02 · 交接人：AI 助手 · 线上版本：`67d8ca8`

## 1. 这是什么

一个纯前端的英语词汇学习应用，词库来自教材与四六级真题，支持五种基础题型 + 一种真题翻译题，学习记录保存在浏览器本地。

- 线上：<https://lyl-creator.github.io/vocab-lab/>
- 仓库：<https://github.com/lyl-creator/vocab-lab>（public，Pages 由 `main:/docs` 分支发布）
- 无后端、无账号、无埋点

## 2. 技术栈

| 层 | 选择 |
| --- | --- |
| 框架 | React 19 + TypeScript（函数组件 + hooks，无状态库） |
| 构建 | Vite 7（`base: './'`），Tailwind 3 + shadcn/ui（Radix） |
| 图标 | lucide-react |
| 数据 | 静态 TS 模块（`src/data/*.ts`），无接口 |
| 存储 | localStorage：`vocab-lab-v1`（学习记录，按词库分开存）、`vocab-lab-dict`（当前词库）、`vocab-lab-seq`（顺序练习进度，按词库分开存） |
| 测试 | Playwright（本地脚本，未纳入 CI） |

## 3. 目录与关键文件

```
src/
├── App.tsx          # 全部页面与交互（首页/词库/生词本/统计/答题/报告/弹窗）
├── engine.ts        # 出题、判分、生词本、复习计分、选词填空/翻译题构造
├── vocabulary.ts    # 课本词库 241 词（含 ★ 重点词、栏目、页码）
├── passages.ts      # 8 篇课文原文（课本选词填空）
├── dicts.ts         # 词库注册表：book / cet4 / translation
├── router.ts        # 路径 ↔ 状态映射：/cet4/high、/book/u1/episode-1、/translation/中国历史
├── transfer.ts      # 备份解析、合并/覆盖导入
├── data/
│   ├── cet4.ts          # 四级大纲 4428 词（音标、高频标记 577）
│   ├── translation.ts   # 翻译词汇 548 条（11 个主题）
│   └── exams.ts         # 真题：选词填空 12 套 + 翻译题 15 套（2024.06/2024.12/2025.06/2025.12/2026.06）
├── components/ui/   # shadcn 组件（大部分未直接使用）
scripts/
├── build-inline.mjs     # 沙箱内替代 npm run build（无 esbuild 服务）
├── finalize-assets.mjs  # esbuild CLI 压缩 + 生成单文件产物
├── esbuild-shim.mjs     # 仅实现 transform() 的 esbuild 替身
└── verify-exams.mjs     # 真题数据验收（12 套 × 10 空/15 候选）
build-pages.mjs      # 生成 docs 下的多入口静态页（每页独立 title/description/og）
docs/
├── index.html       # 发布产物（构建生成，勿手改）
├── cet4/index.html  # 每个词库/板块/练习方式一个目录 + 自己的 meta
├── 404.html         # 深链兜底（Pages 对未生成路径返回它）
├── sitemap.xml / robots.txt
└── assets/          # 共享的 js / css
vocab-lab.html       # 单文件离线版（构建生成）
NEXT-SESSION-2025.md # 2025 真题转录记录（已完成）
```

## 4. 词库体系

| 词库 | 规模 | 可用题型 | 筛选维度 |
| --- | --- | --- | --- |
| 课本词库 | 241 词（★ 重点 160） | 英译中、中译英、拼写、配对、选词填空 | 单元 + 栏目（Episode/Text） |
| 四级词库 | 4428 词（高频 577，含音标） | 英译中、中译英、拼写、配对、选词填空（真题）、翻译题（真题） | 全部 / 只考高频 |
| 翻译词汇 | 548 条（11 组） | 中译英、拼写、配对 | 分组 |

侧栏顶部可切换词库；切换后首页题型卡片随之变化。

## 5. 出题规则（重要）

- **重点词优先**：先抽 `starred`（课本=带*词，四级=高频词），不足才用其余词补；每个栏目至少 16 个重点词，出 5/10 题时不会出现非重点词。
- **干扰项**同样优先取重点词。
- **选词填空**：课本 10 空 + 15 候选（真实文章）；四级 10 空 + 15 候选（真题，弹窗里按年份+套次指定，或随机一套）。判分以**文章中的词形**为准（`bullied` 不是 `bully`），忽略大小写与首尾空格。
- **拼写**：会标注单词/短语并列出全部中文释义；含 `sb./sth./…` 的短语不参与拼写。
- **翻译题**（仅四级）：中文题干 → 用户输入译文 → 提交后展示参考译文与点拨 → 自评「掌握/还需练习」，**只记入历史，不进生词本**。点拨标题随年份取自解析原文：2026「翻译点拨」、2025「译点精析」、2024.12「难点注释」、2024.06 无点拨。
- **每日一词**：学习概览右下角卡片与首屏插画共用同一个词，按日期取种子从四级词库随机挑选，同一天固定、跨天自动轮换（只取有音标的单词，排除专有名词）。
- **复习模式**：从生词本抽词；答对错次 −1，答错 +1，减到 0 自动移出生词本。
- **按词库独立统计**：`Report` 与 `NotebookEntry` 都带 `dict` 字段（book / cet4 / translation），首页指标、最近足迹、生词本、学习统计、顺序练习进度都只显示当前词库的数据；旧记录在加载时按词条 id 前缀（`c\d+`、`t\d+`、`tr-`、真题 id → cet4）推断归属并自动补齐（`normalizeStore`）。
- **顺序练习**：仅「我的词库」里每行的「▶ 从这里开始」触发，可选结束词，不限题数；退出时记住进度，再次进入词库弹窗提示继续。

## 6. 路由

真实路径 + History API（GitHub Pages 上是 `https://lyl-creator.github.io/vocab-lab/...`）：

| 路径 | 页面 |
| --- | --- |
| `/` | 学习概览 |
| `/notebook/`、`/history/` | 生词本、学习统计 |
| `/book/`、`/book/u1/`、`/book/u1/episode-1/` | 课本词库，按 Unit 与栏目 |
| `/cet4/`、`/cet4/high/` | 四级词库，全部 / 高频 |
| `/translation/中国历史/` | 翻译词汇分组（11 个） |
| `/cet4/cloze/`、`/book/spelling/` | 直接选中某个练习方式（打开设置弹窗） |
| `/cet4/cloze/2025-12-2/` | 再预选真题套次 |

- 解析/拼装都在 `src/router.ts`：`parseRoute(path)` ↔ `routePath(state)`；
- 站内导航用 `pushState`（可后退），筛选/切换词库也会同步地址；旧版 `#/cet4/high` 链接会在加载时 301 式改写成新路径；
- `build-pages.mjs` 为每个词库/板块/练习方式预生成独立 HTML（各自 title、description、og、canonical），另有 `sitemap.xml`、`robots.txt`；
- 未预生成的组合（例如 `/cet4/high/cloze/`）由 `docs/404.html` 兜底：页面正常渲染，但 HTTP 状态码是 404。

## 6.5 云同步（可选，默认关闭）

- 代码在 `src/sync.ts`：Supabase 邮箱 + 密码登录，每个用户一行 `vocab_sync`（`user_id` + `payload jsonb`）；
- 未在 `SYNC_CONFIG` 填入 `url` / `anonKey` 时 `syncConfigured()` 为 false，界面上完全没有同步入口；
- SDK 不打包，登录时从 unpkg 动态加载（失败回退 jsDelivr），版本锁在 `sync.ts` 的 `SDK_URLS`；
- 冲突由用户选择：合并两边（报告按 id 去重、生词取较大错次）/ 云端覆盖本地 / 本地覆盖云端；
- 安全依赖 Supabase RLS（三条策略：只能读写 `auth.uid() = user_id` 的行）；
- 开通步骤见 `SYNC-SETUP.md`（建项目 → 开邮箱登录 → 执行建表 SQL → 填 url/anonKey）。

## 7. 构建与部署

```bash
npm install
npm run build            # tsc -b && vite build → dist/
node build-pages.mjs     # 生成 docs/：42 个页面 + 404.html + sitemap + robots + assets
node build-standalone.mjs  # 生成离线单文件 vocab-lab.html
```

**本机三个坑**（换机器可忽略）：

1. `npm run build` 可能报 `esbuild: remove ... Access is denied` —— 把 TEMP/TMP 指到工作区内再构建：
   `$env:TEMP = (Resolve-Path .tmp-build).Path; $env:TMP = $env:TEMP`；
2. `git push` 常被网络代理 403 或断流 —— 改用 GitHub Git Data API：blobs → trees(`base_tree`) → commits → PATCH ref（历史提交即此法）；
3. 若终端处于 DSH 文件沙箱内（`spawn EPERM`、`listen EACCES`），esbuild/Vite/Playwright 都会因「不能创建命名管道/监听端口」而失败：
   - 构建改用自带脚本：`node scripts/build-inline.mjs`（用 TypeScript 的 `transpileModule` 在进程内处理 TS/JSX，Rollup 直接打包，不启动 esbuild 服务；脚本会临时把 `scripts/esbuild-shim.mjs` 装到 `node_modules/esbuild/lib/main.js`，结束自动还原）；
   - 再跑 `node scripts/finalize-assets.mjs`：用 esbuild **CLI** 压缩 `dist/assets`（CLI 不需要管道）并调用 `build-pages.mjs` + `build-standalone.mjs`；
   - 沙箱内 Playwright / 无头浏览器都起不来（命名管道被禁、`listen` 返回 EACCES），验收改为 `node scripts/verify-exams.mjs`（直接调用 `engine.ts` 校验 12 套的 10 空/15 候选/答案字母）。

Pages 配置：分支 `main`，目录 `/docs`，已加 `docs/.nojekyll`。

## 8. 数据来源（全部为人工/半自动转录）

| 数据 | 来源 | 方式 |
| --- | --- | --- |
| 课本 241 词 | `source/vocabulary.pdf`（9 页扫描） | 人工转录 + 逐词核对星号 |
| 8 篇课文 | 教材截图 | 人工转录 |
| 四级 4428 词 | 《大学英语四级词汇-顺序版.pdf》 | `pdftohtml -xml` 按坐标重建行，脚本解析 |
| 高频 577 | 《大学英语四级高频词汇.pdf》 | 文本匹配标记 |
| 翻译词汇 548 | `四六级翻译词汇.docx` | 脚本按中英分界切分 |
| 真题选词填空 12 套 | 2024.06 / 2025.06 / 2025.12 / 2026.06 各三套 | 2024 用文字层；2025 用文字层取文章 + 解析页图取答案；2026 页图转录 |
| 真题翻译 15 套 | 2024.06 / 2024.12 / 2025.06 / 2025.12 / 2026.06 各三套 | 题干取文字层；译文与点拨按解析页图或 PDF 原文抄录（2024.12 用下载的《2024-12月翻译解析》） |

## 9. 已知限制

- 真题题库已覆盖 2024.06 / 2025.06 / 2025.12 / 2026.06 四套共 12 套（选词填空 + 翻译各 12 套），转录过程记录见 `NEXT-SESSION-2025.md`。
- 2024.06 的选词填空依赖文字层，个别词形可能仍需抽查；2025.06 文字层噪声较多（`o f`、`fbr`、`ifs` 等），已逐处清洗并校验；2026 全部为人工抄录，建议再校对一遍并保留勘误渠道。
- 四级词库 4428 行在「我的词库」一次渲染，低端机可能略卡；如需优化可做虚拟滚动或分页。
- 首屏 JS 约 980KB（gzip 360KB），主要来自三份词库数据；如需瘦身可改为按词库动态加载（注意会破坏单文件构建）。
- 路径路由依赖 `docs/404.html` 兜底：只有预生成的 42 个页面返回 200，其余深链（如 `/cet4/high/cloze/`、`/cet4/cloze/2025-12-2/`）能正常渲染但状态码是 404，属于 GitHub Pages 的静态托管限制。
- 中文本地化的分组路径（`/translation/中国历史/`）在地址栏会显示为百分号编码，属正常现象。
- 译文自评是主观判定，未做自动评分。

## 10. 待办

1. 若补充更多真题，按 `src/data/exams.ts` 的格式追加，id 用 `YYYY-MM-N`（当前按时间排序，追加后保持升序）；
2. 可选：给单词详情加例句、给词库加虚拟滚动、把 Playwright 脚本纳入 CI。

## 11. 交接自检清单

- [ ] `npm install && npm run build` 通过（注意上面的 TEMP 坑；沙箱内改用 `scripts/build-inline.mjs` + `scripts/finalize-assets.mjs`）
- [ ] `node build-standalone.mjs` 生成 `docs/index.html`
- [ ] `node scripts/verify-exams.mjs` 输出 `ALL DATA CHECKS PASSED`（12 套真题）
- [ ] 打开 `#/book`、`#/cet4`、`#/translation` 三个词库均能正常渲染
- [ ] 各题型开始一局：英译中/中译英/拼写/配对/选词填空/翻译题
- [ ] 选词填空的「真题套次」下拉里能看到 2024.06 / 2025.06 / 2025.12 / 2026.06 共 12 套
- [ ] 选词填空提交后出现「答案对照」
- [ ] 我的词库点单词弹详情、可加入生词本；「▶ 从这里开始」走区间模式
- [ ] 偏好设置：导出/导入、清空记录、只考高频（四级）
- [ ] 部署后访问 <https://lyl-creator.github.io/vocab-lab/> 复核
