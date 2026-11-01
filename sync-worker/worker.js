export default {
  async fetch(request, env) {
    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    };
    const json = (data, status = 200) =>
      new Response(JSON.stringify(data), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });

    const url = new URL(request.url);
    const code = decodeURIComponent(url.pathname.replace(/^\/+/, '')).toUpperCase();
    if (!/^[A-Z0-9-]{6,64}$/.test(code)) return json({ error: 'invalid code' }, 400);

    if (request.method === 'GET') {
      const row = await env.DB.prepare('SELECT payload FROM sync_data WHERE code = ?').bind(code).first();
      if (!row) return json({ error: 'not found' }, 404);
      return new Response(row.payload, { headers: { ...cors, 'Content-Type': 'application/json' } });
    }

    if (request.method === 'PUT') {
      const text = await request.text();
      if (text.length > 1024 * 1024) return json({ error: 'payload too large' }, 413);
      let parsed;
      try { parsed = JSON.parse(text); } catch { return json({ error: 'invalid json' }, 400); }
      if (!Array.isArray(parsed.history) || !Array.isArray(parsed.notebook)) return json({ error: 'invalid shape' }, 400);
      const now = Date.now();
      await env.DB.prepare(
        'INSERT INTO sync_data (code, payload, updated_at) VALUES (?, ?, ?) ' +
        'ON CONFLICT(code) DO UPDATE SET payload = excluded.payload, updated_at = excluded.updated_at'
      ).bind(code, text, now).run();
      return json({ ok: true, updatedAt: now });
    }

    return json({ error: 'method not allowed' }, 405);
  },
};
