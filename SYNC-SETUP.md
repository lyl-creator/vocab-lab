# 云同步开通指南（Supabase · 邮箱 + 密码）

代码已写好，但**没填 `url` / `anonKey` 之前，界面上不会出现任何同步入口**。
按下面四步开通，把两个值填进 `src/sync.ts`，重新构建部署即可生效。

---

## 一、建项目（约 5 分钟）

1. 打开 <https://supabase.com> 注册（GitHub 或邮箱都行），点 **New project**。
2. 填写：
   - Name：`vocab-lab`
   - Database Password：自己设一个（只用于数据库，记下来备用）
   - Region：选 **Southeast Asia (Singapore)** 或 **Northeast Asia (Tokyo)**，国内访问相对快
3. 等 2–3 分钟初始化完成。
4. 进入 **Project Settings → API**，复制两个值：
   - **Project URL**：形如 `https://abcdefgh.supabase.co`
   - **anon public**：一长串 `eyJhbGciOi...`

> anon key 本来就是公开给浏览器用的，安全性由下面的 RLS 规则保证，不要用 `service_role` 那个。

## 二、开启邮箱登录

1. **Authentication → Providers → Email**：默认已开启。
2. **Authentication → Sign In / Up**：
   - 想「注册后直接登录」→ 把 **Confirm email** 关掉；
   - 想保留邮箱验证 → 保持开启，用户注册后要去邮箱点确认链接（Supabase 自带发信服务有频率限制，个人使用足够）。
3. **Authentication → URL Configuration**（可选）：
   - Site URL：`https://lyl-creator.github.io/vocab-lab/`
   - Redirect URLs：同上（密码登录用不到，配了也不碍事）

## 三、建表 + 权限（复制粘贴执行）

打开 **SQL Editor**，执行：

```sql
create table if not exists public.vocab_sync (
  user_id uuid primary key references auth.users (id) on delete cascade,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.vocab_sync enable row level security;

create policy "own row read" on public.vocab_sync
  for select using (auth.uid() = user_id);

create policy "own row insert" on public.vocab_sync
  for insert with check (auth.uid() = user_id);

create policy "own row update" on public.vocab_sync
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
```

这三条规则保证：**每个账号只能读写自己那一行**，别人的记录拿不到。

## 四、填配置并部署

编辑 `src/sync.ts` 顶部：

```ts
export const SYNC_CONFIG: SyncConfig = {
  url: 'https://abcdefgh.supabase.co',
  anonKey: 'eyJhbGciOi...',
}
```

然后：

```bash
npm run build
node build-pages.mjs
node build-standalone.mjs
git add -A && git commit -m "chore: 开启云同步" && git push
```

部署后：**偏好设置 → 账号与云同步**。

## 五、自测清单

1. 偏好设置 → 账号与云同步 → 登录 → 填邮箱 + 密码 → 点「注册」；
2. 若提示「注册成功，请先到邮箱点确认链接」→ 去邮箱点一下，再回来「登录」；
3. 提示「已登录并上传本地记录」＝本地已推到云端；
4. 换台设备 / 无痕窗口，同一邮箱登录 → 提示「已拉取云端记录」，记录出现；
5. 两边都有记录时会弹「云端已有学习记录」，可选 **合并两边 / 用云端覆盖本地 / 用本地覆盖云端**；
6. 做完一局测验，云端记录会自动 +1。

## 六、说明与限制

- 同步内容：测验记录 + 生词本（含每个词库归属），不含进行中的测验和偏好设置；
- 合并规则：报告按 `id` 去重取较新；生词按 `wordId` 取较大错次、已掌握取「或」；
- SDK 不打包进站点，登录时才从 unpkg 加载（失败自动回退 jsDelivr），首屏体积不变；
- Supabase 免费额度：500MB 数据库、5 万月活，个人用量远远够；
- 数据存在 Supabase（新加坡/东京），只有 `user_id` + 一份 JSON，没有密码（密码由 Supabase Auth 加密保存）；
- 如果以后想加微信登录，需要接第三方 OAuth，再加一个登录按钮即可。
