-- 同步数据表：每条记录对应一个「同步码」
CREATE TABLE IF NOT EXISTS sync_data (
  code       TEXT PRIMARY KEY,
  payload    TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);
