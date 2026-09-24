const fs = require("fs");
const html = fs.readFileSync("dist/index.html", "utf8");
const checks = [
  ["Organization schema", html.includes('"Organization"')],
  ["WebSite schema", html.includes('"WebSite"')],
  ["logo-512 in graph", html.includes("/icons/logo-512.png")],
  ["FAQPage", html.includes("FAQPage")],
  ["ItemList", html.includes("ItemList")],
  ["og:image logo", html.includes('property="og:image"') && html.includes("logo-512.png")],
  ["og:image width", html.includes("og:image:width")],
  ["twitter summary", html.includes('name="twitter:card"') && html.includes("summary")],
  ["manifest link", html.includes('rel="manifest"')],
  ["apple-touch", html.includes("apple-touch-icon")],
  ["apple capable", html.includes("apple-mobile-web-app-capable")],
  ["sw register", html.includes("serviceWorker")],
  ["no SearchAction", !html.includes("SearchAction")],
  ["@graph", html.includes("@graph")],
];
for (const [k, v] of checks) console.log((v ? "OK" : "FAIL") + ": " + k);

const files = [
  "dist/icons/logo-512.png",
  "dist/icons/maskable-512.png",
  "dist/icons/maskable-192.png",
  "dist/icons/apple-touch-icon.png",
  "dist/manifest.webmanifest",
  "dist/sw.js",
];
for (const f of files) console.log((fs.existsSync(f) ? "OK" : "MISSING") + ": " + f);

const m = JSON.parse(fs.readFileSync("dist/manifest.webmanifest", "utf8"));
console.log(
  "manifest id=" + m.id,
  "scope=" + m.scope,
  "icons=" + m.icons.map((i) => i.sizes + ":" + i.purpose).join(", ")
);
