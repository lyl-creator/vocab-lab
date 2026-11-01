# 词汇实验室 · Vocab Lab

> 每一次练习，都是一次进步。Little steps, lasting progress.

一个纯前端的英语词汇抽测应用：词库来自我自己的扫描教材，按"识别 / 回忆 / 拼写 / 关联"四个角度出题，答完给出掌握度评估，错词自动进入生词本。没有账号、没有后端，学习记录只保存在当前浏览器里。

**在线体验**：[lyl-creator.github.io/vocab-lab](https://lyl-creator.github.io/vocab-lab/)　·　**单文件版**：[vocab-lab.html](https://lyl-creator.github.io/vocab-lab/vocab-lab.html)（可直接下载，离线双击打开）

![桌面端首页](source/desktop.png)

## 为什么做这个

背单词软件大多用通用词表，而我需要练的是**这本教材里的词**——包括课文里的短语搭配。市面工具要么不支持自建词库，要么把"练习"做成了打卡任务。

所以这个项目的取舍很明确：

- **词库优先**：241 个词条逐个人工核对，保留 PDF 页码和栏目来源，随时能翻回原书对照。
- **练习而不是考试**：不限时、不排名，每题即时反馈，答错只是"这个词值得再看一次"。
- **数据归属自己**：只用 localStorage 和导出的 JSON，不上传任何内容。

## 功能

| 模块 | 说明 |
| --- | --- |
| 五种练习模式 | 英译中（识别）、中译英（主动回忆）、拼写填空（无选项）、词义配对（4 词一组连线）、选词填空（文章挖空） |
| 测验设置 | 单元 + 栏目两级范围（Unit 1/2 → Episode 1 / Episode 2 / Text A / Text B）、5 / 10 / 20 / 30 词，可只抽生词复习 |
| 即时反馈 | 正误提示、正确答案朗读（Web Speech API）、可选的作答提示音 |
| 选词填空 | 按所选栏目调取对应课文，挖 10 个空，从 10 张词卡中点选填入；提交后统一判分，错词进生词本 |
| 我的词库 | 按单元、栏目两级筛选，支持中英文搜索与朗读，显示来源页码 |
| 生词本 | 错题自动归档并累计错误次数，可标记"已掌握"或发起专属复习 |
| 学习统计 | 累计测验数、综合正确率、专注时长、最近 7 天节奏、最近 100 次记录 |
| 测评报告 | 得分、答对词数、用时、平均每词耗时、逐题回顾、分级建议 |
| 数据备份 | 一键导出 JSON（记录 + 生词本），可换设备前先备份 |
| 响应式 | 375 / 768 / 1024 / 1440 宽度下均无横向溢出，移动端为抽屉式导航 |

<p>
  <img src="source/mobile-final.png" width="240" alt="移动端首页">
  <img src="source/mobile-quiz-final.png" width="240" alt="移动端拼写题">
</p>

## 词库数据

数据集中在 `src/vocabulary.ts`，由 9 页扫描教材转录而来：

- 共 **241** 个词条：Unit 1（113 个）+ Unit 2（128 个），其中短语 42 个；
- 每条包含 `en` / `zh` / `pos` / `unit` / `section` / `page` / `phrase`，`page` 指 PDF 页码；
- 栏目按原书拆分为 Episode 1、Episode 2、Text A、Text B，个别跨栏词条做了人工校正；
- 中文释义按原书**完整录入**（多义项以「；」分隔），不含专有名称；
- 栏目（Episode 1 / Episode 2 / Text A / Text B）与页码均可在测验范围与「我的词库」中两级筛选。

> 教材扫描原件（`source/*.pdf` 与 `source/page-*.png`）属于出版方版权内容，**未包含在本仓库中**；仓库只保留转录后的词汇数据与界面截图。

## 技术栈

- **React 19** + **TypeScript 5.9**，函数组件与 hooks，无状态管理库
- **Vite 7** 构建与开发服务器
- **Tailwind CSS 3** + **shadcn/ui**（Radix 原语）组件层，`lucide-react` 图标
- **Web Speech API** 朗读、**Web Audio** 提示音、**localStorage** 持久化
- **Playwright** 端到端校验脚本（`verify.mjs`）

## 快速开始

```bash
npm install        # 安装依赖
npm run dev        # 开发服务器 http://127.0.0.1:5173
npm run build      # 类型检查 + 生产构建到 dist/
npm run preview    # 预览生产构建
```

生成可直接双击打开的单文件版本：

```bash
npm run build && node build-standalone.mjs   # 输出 vocab-lab.html
```

`vocab-lab.html` 把 JS 与 CSS 内联进单个 HTML，双击即可离线使用（无需服务器）。仓库里的这份是构建产物，源码改动后重新生成即可。

## 目录结构

```
.
├── index.html              # Vite 入口
├── src/
│   ├── main.tsx            # 挂载 React
│   ├── App.tsx             # 全部页面与交互（首页 / 词库 / 生词本 / 统计 / 答题 / 报告）
│   ├── engine.ts           # 出题、判分、生词本、等级评价、存储读写
│   ├── vocabulary.ts       # 词库数据（241 词条，含来源页码）
│   ├── App.css             # 页面样式
│   └── components/ui/      # shadcn/ui 组件
├── src/passages.ts         # 八篇课文原文（选词填空题库）
├── source/                 # 界面截图（教材原件已排除）
├── docs/index.html         # Pages 发布用的单文件构建产物
├── build-standalone.mjs    # 打包为单文件 HTML
├── verify.mjs              # Playwright 端到端校验
└── vocab-lab.html          # 单文件构建产物
```

## 规则细节

- 选择题每个词**按首次作答计分**，跳过视为错误；
- 拼写题会标注提示语是**单词**还是**短语**，并列出该词的全部中文释义；忽略大小写与首尾空格，`preventative` 与 `preventive` 互认，含 `sb.` / `sth.` / `…` 等占位符的短语不参与拼写考核；
- 选词填空按「单元 + 栏目」取对应课文，从该栏目词库中命中的词里随机挖 10 空（每词只挖一处），词卡即这 10 个答案、无干扰项；整篇作答后统一提交判分，错词按首次作答计入生词本；
- 选词填空若范围为「全部单元 / 全部栏目」，会从 8 篇课文中随机抽一篇；
- 配对题每组最多 4 个词，**按首次配对结果**计分，配错后可继续尝试，但错词立即进入生词本；
- 中途退出不生成报告，已产生的错词仍会保留在生词本；
- 刷新页面不会丢失本次作答进度（进行中的测验会一并持久化）。

## 部署

站点发布在 **GitHub Pages**（分支发布，来源为 `main` 的 `/docs` 目录）：<https://lyl-creator.github.io/vocab-lab/>

`docs/index.html` 是 `node build-standalone.mjs` 生成的自包含单文件版本（JS 与 CSS 全部内联），所以托管时不需要额外的构建服务。改完源码后重新生成并推送即可：

```bash
npm run build:standalone     # 构建并重新生成 vocab-lab.html 与 docs/index.html
git add docs && git commit -m "docs: 更新站点" && git push
```

Vite 的 `base` 设为 `'./'`，产物在 `/vocab-lab/` 子路径下也能正确加载。

## 隐私

无账号、无网络请求、无统计埋点。所有记录存放在当前浏览器的 `localStorage`（键名 `vocab-lab-v1`），清理浏览器数据会丢失，建议先在"偏好设置 → 学习记录备份"导出 JSON。

## 关于评估口径

报告中的正确率反映的是**本次教材抽测**的掌握情况，不等同于 CEFR 等级，也不代表总词汇量。
