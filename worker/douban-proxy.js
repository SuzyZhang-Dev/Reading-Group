/**
 * 书封集 · 图书搜索代理（Cloudflare Worker）
 * ------------------------------------------------------------
 * 前端调用：GET https://<worker>/?q=<书名>
 * 返回：JSON 数组 [{ id, title, cover, author, year, source }]
 *   —— 与 docs/annual_report_2025/index.html 的 searchBook() 预期一致，
 *      前端无需改动（cover 仍是豆瓣大图直链 /l/public/）。
 *
 * 修复点（豆瓣机房 IP 被限流导致搜不到）：
 *   1. 改用仍可用的 book.douban.com/j/subject_suggest 接口；
 *   2. 带浏览器 UA / Referer 头；
 *   3. 边缘缓存（同一书名缓存 24h）大幅降低打豆瓣的次数，减少被限流；
 *   4. 豆瓣被限流 / 非 JSON / 空结果时，自动回退到 Google Books；
 *   5. 统一补 CORS 头，供跨域前端调用。
 *
 * 部署：Cloudflare 控制台 → 你的 Worker（falling-sun-969d）→ Quick edit
 *      → 用本文件内容整体替换 → Save and Deploy。Worker URL 不变，前端不用动。
 */

const DOUBAN_SUGGEST = "https://book.douban.com/j/subject_suggest?q=";
const GOOGLE_BOOKS = "https://www.googleapis.com/books/v1/volumes?country=US&maxResults=8&q=";

const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
    "(KHTML, like Gecko) Chrome/125.0 Safari/537.36",
  Referer: "https://book.douban.com/",
  Accept: "application/json, text/plain, */*",
  "Accept-Language": "zh-CN,zh;q=0.9",
};

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(data, { status = 200, maxAge = 0 } = {}) {
  const headers = { "Content-Type": "application/json; charset=utf-8", ...CORS };
  if (maxAge > 0) headers["Cache-Control"] = `public, max-age=${maxAge}`;
  return new Response(JSON.stringify(data), { status, headers });
}

// 豆瓣建议接口给的是小图（/s/public/），升级成大图 /l/public/
function upgradeDoubanCover(pic) {
  if (!pic) return "";
  return pic.replace("/view/subject/s/public/", "/view/subject/l/public/");
}

async function fromDouban(q) {
  const res = await fetch(DOUBAN_SUGGEST + encodeURIComponent(q), {
    headers: BROWSER_HEADERS,
    cf: { cacheTtl: 0 },
  });
  const text = await res.text();
  // 被限流时豆瓣返回的是 "Rate limit..." 纯文本，直接判为失败
  if (!res.ok || !text.trim().startsWith("[")) {
    throw new Error("douban_unavailable");
  }
  const list = JSON.parse(text);
  return list
    .filter((it) => it && it.type === "b" && it.title) // 只要图书条目
    .map((it) => ({
      id: String(it.id || ""),
      title: it.title,
      cover: upgradeDoubanCover(it.pic),
      author: it.author_name || "",
      year: it.year || "",
      source: "douban",
    }));
}

// Google Books 的封面直链带 CORS，能直接用；顺手升级清晰度、去掉 curl 边框
function normalizeGoogleCover(link) {
  if (!link) return "";
  return link
    .replace(/^http:\/\//, "https://")
    .replace("&edge=curl", "")
    .replace("zoom=1", "zoom=2");
}

async function fromGoogleBooks(q) {
  const res = await fetch(GOOGLE_BOOKS + encodeURIComponent(q));
  if (!res.ok) throw new Error("google_unavailable");
  const data = await res.json();
  const items = Array.isArray(data.items) ? data.items : [];
  return items
    .map((it) => {
      const v = it.volumeInfo || {};
      const cover = normalizeGoogleCover((v.imageLinks || {}).thumbnail);
      if (!cover) return null; // 没封面的条目对本工具没用
      return {
        id: it.id,
        title: v.title || "",
        cover,
        author: (v.authors || []).join(", "),
        year: (v.publishedDate || "").slice(0, 4),
        source: "google",
      };
    })
    .filter(Boolean);
}

export default {
  async fetch(request) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS });
    }

    const url = new URL(request.url);
    const q = (url.searchParams.get("q") || "").trim();
    if (!q) return json([], { maxAge: 0 });

    // 边缘缓存：同一书名 24h 内不再打豆瓣
    const cache = caches.default;
    const cacheKey = new Request(
      "https://cache.local/book?q=" + encodeURIComponent(q),
      { method: "GET" }
    );
    const hit = await cache.match(cacheKey);
    if (hit) return hit;

    let results = [];
    let ttl = 86400; // 豆瓣命中缓存 1 天
    try {
      results = await fromDouban(q);
      if (results.length === 0) throw new Error("douban_empty");
    } catch (_) {
      try {
        results = await fromGoogleBooks(q);
        ttl = 3600; // 兜底结果缓存短一些，方便豆瓣恢复后尽快切回
      } catch (_) {
        results = [];
        ttl = 0;
      }
    }

    const response = json(results, { maxAge: ttl });
    if (ttl > 0) {
      // 只缓存成功结果
      await cache.put(cacheKey, response.clone());
    }
    return response;
  },
};
