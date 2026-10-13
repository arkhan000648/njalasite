const fs = require("fs");

const ROOT = "https://gkstreams.pro/";
let failures = 0;

function check(label, ok) {
  console.log((ok ? "OK  " : "FAIL") + ": " + label);
  if (!ok) failures++;
}

function readIfExists(p) {
  try {
    return fs.readFileSync(p, "utf8");
  } catch {
    return null;
  }
}

// ── Rotation config ───────────────────────────────────────────────
const configSrc = (readIfExists("src/data/config.ts") || "").replace(
  /^\s*\/\/.*$/gm,
  ""
);
const slugsMatch = configSrc.match(/HOME_SLUGS\s*=\s*\[([^\]]*)\]/);
const slugs = slugsMatch
  ? [...slugsMatch[1].matchAll(/["']([^"']+)["']/g)].map((m) => m[1])
  : [];
const active = slugs[slugs.length - 1];
const HOME_PATH = active ? `/${active}/` : null;
const HOME_URL = active ? `${ROOT}${active}/` : null;

check("config: HOME_SLUGS parsed", slugs.length > 0);
console.log("     slugs=" + JSON.stringify(slugs) + " active=" + active);

// ── Root homepage (dist/index.html, shadow of active page) ────────
const html = readIfExists("dist/index.html");
check("dist/index.html exists", !!html);

if (html) {
  const checks = [
    ["Organization schema", html.includes('"Organization"')],
    ["WebSite schema", html.includes('"WebSite"')],
    ["logo-512 in graph", html.includes("/icons/logo-512.png")],
    ["FAQPage", html.includes("FAQPage")],
    ["ItemList", html.includes("ItemList")],
    [
      "og:image logo",
      html.includes('property="og:image"') && html.includes("logo-512.png"),
    ],
    ["og:image width", html.includes("og:image:width")],
    [
      "twitter summary",
      html.includes('name="twitter:card"') && html.includes("summary"),
    ],
    ["manifest link", html.includes('rel="manifest"')],
    ["apple-touch", html.includes("apple-touch-icon")],
    ["apple capable", html.includes("apple-mobile-web-app-capable")],
    ["sw register", html.includes("serviceWorker")],
    ["no SearchAction", !html.includes("SearchAction")],
    ["@graph", html.includes("@graph")],
    ["no google.com mirror", !html.includes("google.com")],
    ["no heavy favicon.svg link", !html.includes('href="/icons/favicon.svg"')],
    ["app scroll id", html.includes('id="app"')],
    ["hero 15 min", html.includes("Links checked every 15 minutes")],
    ["canonical = active home", html.includes(`rel="canonical" href="${HOME_URL}"`)],
    ["og:url = active home", html.includes(`property="og:url" content="${HOME_URL}"`)],
    ["no canonical to bare root", !html.includes(`rel="canonical" href="${ROOT}"`)],
    [
      "WebSite schema url = active home",
      html.includes(`"url":"${HOME_URL}"`),
    ],
    [
      "ItemList links use active home",
      html.includes(`"${HOME_URL}#`),
    ],
    [
      "internal brand link = active path",
      html.includes(`class="brand" href="${HOME_PATH}"`),
    ],
    [
      "internal body links = active path",
      html.includes(`href="${HOME_PATH}"`),
    ],
  ];
  for (const [k, v] of checks) check(k, v);
}

// ── Every slug in HOME_SLUGS must have a built page ───────────────
for (const slug of slugs) {
  const page = readIfExists(`dist/${slug}/index.html`);
  check(`dist/${slug}/index.html exists`, !!page);
  if (!page) continue;

  if (slug === active) {
    check(
      `${slug}: active page self-canonical = ${HOME_URL}`,
      page.includes(`rel="canonical" href="${HOME_URL}"`)
    );
    check(`${slug}: active page has homepage content`, page.includes("GKStreams"));
    check(
      `${slug}: active page is NOT a forward stub`,
      !page.includes("http-equiv=\"refresh\"")
    );
    if (html) {
      const norm = (s) => s.replace(/\s+/g, " ").trim();
      check(
        "root shadow matches active page (whitespace-normalized)",
        norm(html) === norm(page)
      );
    }
  } else {
    check(
      `${slug}: old slug is a noindex forward page`,
      page.includes('name="robots" content="noindex"') &&
        page.includes("location.replace(")
    );
    check(
      `${slug}: forward page canonical = active home`,
      page.includes(`rel="canonical" href="${HOME_URL}"`)
    );
  }
}

// ── 404 page (GitHub Pages serves /404.html for unknown paths) ────
const nf = readIfExists("dist/404.html");
check("dist/404.html exists", !!nf);
if (nf) {
  check(
    "404: redirects straight to active path",
    nf.includes(`url=${HOME_PATH}`) && nf.includes(`"${HOME_PATH}"`)
  );
  check("404: noindex", nf.includes('name="robots" content="noindex"'));
}

// ── robots + sitemap must point at the active home only ───────────
const robots = readIfExists("dist/robots.txt");
check("dist/robots.txt exists", !!robots);
if (robots) check("robots: allows crawling", robots.includes("Allow: /"));

const sitemap = readIfExists("dist/sitemap.xml");
check("dist/sitemap.xml exists", !!sitemap);
if (sitemap) {
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  check("sitemap: single entry", locs.length === 1);
  check("sitemap: entry is active home", locs[0] === HOME_URL);
}

// ── Static assets ─────────────────────────────────────────────────
const files = [
  "dist/icons/logo-512.png",
  "dist/icons/maskable-512.png",
  "dist/icons/maskable-192.png",
  "dist/icons/apple-touch-icon.png",
  "dist/manifest.webmanifest",
  "dist/sw.js",
];
for (const f of files) check(f + " exists", fs.existsSync(f));

const manifest = readIfExists("dist/manifest.webmanifest");
if (manifest) {
  try {
    const m = JSON.parse(manifest);
    console.log(
      "     manifest id=" + m.id,
      "scope=" + m.scope,
      "icons=" + m.icons.map((i) => i.sizes + ":" + i.purpose).join(", ")
    );
    check("manifest start_url = root", m.start_url === "/");
  } catch (e) {
    check("manifest parses as JSON", false);
  }
}

console.log(
  failures === 0
    ? "\nverify-seo: ALL CHECKS PASSED"
    : `\nverify-seo: ${failures} CHECK(S) FAILED`
);
process.exitCode = failures === 0 ? 0 : 1;
