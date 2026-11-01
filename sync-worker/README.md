# 选词实验室 · 同步服务（Cloudflare Workers + D1）

给站点提供「免注册、同步码」的跨设备记录同步。每个同步码对应一条记录，任何人拿到码即可读写——**码等同于密码**。

## 部署步骤（约 5 分钟，免费额度足够）

```bash
# 1. 安装 wrangler（只需一次）
npm install -g wrangler

# 2. 登录 Cloudflare
wrangler login

# 3. 建数据库
wrangler d1 create vocab-lab-sync
#    把输出的 database_id 填进 wrangler.toml

# 4. 建表
wrangler d1 execute vocab-lab-sync --remote --file=./schema.sql

# 5. 部署
wrangler deploy
```

部署成功后会得到一个地址，例如：

```
https://vocab-lab-sync.your-name.workers.dev
```

## 接到站点上

把上面的地址写进仓库里的 `docs/sync-config.json`：

```json
{ "api": "https://vocab-lab-sync.your-name.workers.dev" }
```

推到 GitHub 后刷新站点，进入「偏好设置 → 跨设备同步」：

1. 点「生成同步码」，得到形如 `ABCD-EFGH-JKLM-NPQR` 的码；
2. 在另一台设备打开同一页面，把这串码粘进输入框，点「使用」；
3. 两台设备的测验记录、生词本会按测试 id 去重合并（不会把重复记录翻倍）。

## 接口

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/:code` | 取该码的数据；不存在返回 404 |
| PUT | `/:code` | 覆盖写入 `{ history, notebook, updatedAt }` |

数据体上限 1 MB；`code` 允许 6–64 位大写字母、数字与连字符。

## 注意

- 同步码泄露 = 数据泄露，请勿公开分享；换码即等于换一个独立空间（旧码数据仍在）。
- 免费额度：D1 每天 10 万次读 / 1 万次写，个人使用远远够用。
- 需要自定义域名时，可在 Cloudflare 控制台给 Worker 绑定。
