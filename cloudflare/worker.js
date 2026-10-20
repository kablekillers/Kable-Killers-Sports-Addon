/**
 * Cloudflare Workers compatibility probe for Kable Killers Sports USA.
 * This is NOT the full addon and must not replace the production addon.
 * Test /health and /manifest.json before attempting catalog or stream migration.
 */
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};
const json = (value, status = 200) => new Response(JSON.stringify(value), {
  status,
  headers: { ...cors, "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
});
export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (url.pathname === "/health" || url.pathname === "/") {
      return json({ name: "Kable Killers Sports USA", status: "cloudflare-compatibility-test", readyForNuvio: false });
    }
    if (url.pathname === "/manifest.json") {
      return json({ error: "Full manifest not yet migrated", status: "not_ready" }, 501);
    }
    return json({ error: "Endpoint not migrated", path: url.pathname }, 501);
  },
};
