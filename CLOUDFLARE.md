# 托管到 Cloudflare Pages

GitHub Pages 仍然可用（发布目录 `docs/`），但国内访问时常很慢。Cloudflare Pages 从源码构建，不需要把 `docs/` 提交上去，改完代码 push 即可自动发布。

## 方式一：连接 Git 仓库（推荐，之后自动部署）

1. Cloudflare 控制台 → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**，选择 `lyl-creator/vocab-lab`。
2. 构建设置：

   | 项 | 值 |
   | --- | --- |
   | Framework preset | None |
   | Build command | `npm run build && node build-pages.mjs && node build-standalone.mjs` |
   | Build output directory | `docs` |
   | 环境变量 `NODE_VERSION` | `22` |
   | 环境变量 `SITE_ORIGIN` | `https://<你的项目名>.pages.dev` |

3. 保存并部署。之后每次 push 到 `main` 都会自动重建。

> `SITE_ORIGIN` 决定 canonical、`og:url` 和 `sitemap.xml` 里的域名。绑定自定义域名后，把它改成新域名再触发一次部署。

## 方式二：本地命令行发布

```bash
npx wrangler login                 # 首次授权
npm run build && node build-pages.mjs
npx wrangler pages deploy docs --project-name=vocab-lab
```

首次执行会创建项目；之后每次发布用最后一条命令即可。

## 方式三：GitHub Actions 手动触发

仓库里已经带了 `.github/workflows/deploy-cloudflare.yml`，在 **Actions → Deploy to Cloudflare Pages → Run workflow** 手动运行。使用前需要配置：

- Secrets：`CLOUDFLARE_API_TOKEN`（权限 Pages:Edit）、`CLOUDFLARE_ACCOUNT_ID`
- Variables：`CF_PROJECT_NAME`（如 `vocab-lab`）、`SITE_ORIGIN`（如 `https://vocab-lab.pages.dev`）

## 自定义域名

1. Pages 项目 → **Custom domains** → 添加域名，按提示在 DNS 里配置 CNAME；
2. 把构建设置里的 `SITE_ORIGIN` 改成 `https://你的域名`；
3. 重新部署（Deployments → Retry deployment，或再 push 一次）。

这样 `sitemap.xml`、`robots.txt`、每页的 canonical 才会指向新域名。

## 缓存与响应头

`public/_headers` 会被复制到发布根目录，Cloudflare 按它设置响应头：

- `/assets/*`（带 hash 的构建产物）：`max-age=31536000, immutable`；
- `/*.html`：`max-age=0, must-revalidate`，发版后立刻生效；
- 图标：一周缓存；
- 附带 `X-Content-Type-Options`、`Referrer-Policy`、`X-Frame-Options`。

## 404 与路由

站点是**多页面静态站**，每个路由都有对应的 `index.html`，不需要 SPA fallback；未匹配的路径由根目录 `404.html` 接管。路由使用真实路径（`/cet4/high/`），Cloudflare 直接按目录返回对应页面。

## 和 GitHub Pages 的关系

- 仓库里提交的 `docs/` 仍是为 `https://lyl-creator.github.io/vocab-lab/` 构建的版本（路径带 `/vocab-lab/` 前缀）；
- Cloudflare 构建时通过 `SITE_ORIGIN` 覆盖，输出到站点根路径 `/`，两者互不影响；
- 如果以后只保留 Cloudflare，可以把 GitHub Pages 关掉，或把 `docs/` 从仓库移除并在 CI 里构建。
