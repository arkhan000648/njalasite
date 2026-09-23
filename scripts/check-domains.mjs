#!/usr/bin/env node
/**
 * Checks all mirror domains and writes:
 *  - src/data/status.json  (baked into HTML at build)
 *  - public/status.json    (served for client refresh)
 *
 * Exit code 0 even if some domains are down (down is a valid state).
 * Exit code 1 only on fatal errors (cannot read config, etc.).
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const domainsPath = join(root, "src", "data", "domains.json");
const statusDataPath = join(root, "src", "data", "status.json");
const statusPublicPath = join(root, "public", "status.json");

const TIMEOUT_MS = Number(process.env.CHECK_TIMEOUT_MS || 5000);
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

async function loadDomains() {
  const raw = await readFile(domainsPath, "utf8");
  const list = JSON.parse(raw);
  if (!Array.isArray(list) || list.length === 0) {
    throw new Error("domains.json must be a non-empty array");
  }
  return list;
}

async function loadPrevious() {
  try {
    const raw = await readFile(statusDataPath, "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function checkOne(domain) {
  const url = domain.url;
  const started = Date.now();
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: {
        "User-Agent": UA,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    });

    // Drain a tiny bit then cancel so we don't download whole pages
    try {
      if (res.body) {
        await res.body.cancel();
      }
    } catch {
      /* ignore */
    }

    const ms = Date.now() - started;
    const httpStatus = res.status;
    // 2xx and 3xx after redirect = reachable. 401/403 often still "up" behind bots/WAF.
    const softUp = [401, 403, 405, 429].includes(httpStatus);
    const ok = (httpStatus >= 200 && httpStatus < 400) || softUp;

    return {
      url,
      status: ok ? "live" : "down",
      httpStatus,
      ms,
    };
  } catch (err) {
    const ms = Date.now() - started;
    const name = err?.name || "";
    const message = err?.message || String(err);
    console.error(`[down] ${url} (${ms}ms): ${name} ${message}`);
    return {
      url,
      status: "down",
      ms,
    };
  }
}

async function main() {
  const domains = await loadDomains();
  const previous = await loadPrevious();

  console.log(`Checking ${domains.length} domain(s), timeout ${TIMEOUT_MS}ms...`);

  const results = await Promise.all(domains.map((d) => checkOne(d)));

  for (const r of results) {
    console.log(
      `  ${r.status === "live" ? "LIVE " : "DOWN "} ${r.url}` +
        (r.httpStatus ? ` HTTP ${r.httpStatus}` : "") +
        (r.ms != null ? ` ${r.ms}ms` : "")
    );
  }

  // If a check totally failed but we had live before, keep down (truthful).
  // If previous had data and new run produced nothing somehow, keep previous.
  let snapshot;
  if (results.length > 0) {
    snapshot = {
      updatedAt: new Date().toISOString(),
      domains: results,
    };
  } else {
    snapshot = previous ?? {
      updatedAt: new Date().toISOString(),
      domains: [],
    };
  }

  const json = JSON.stringify(snapshot, null, 2) + "\n";
  const liveOnly = {
    updatedAt: snapshot.updatedAt,
    domains: snapshot.domains.filter((d) => d.status === "live"),
  };
  const publicJson = JSON.stringify(liveOnly, null, 2) + "\n";
  await mkdir(dirname(statusDataPath), { recursive: true });
  await mkdir(dirname(statusPublicPath), { recursive: true });
  await writeFile(statusDataPath, json, "utf8");
  await writeFile(statusPublicPath, publicJson, "utf8");

  const live = results.filter((r) => r.status === "live").length;
  console.log(`Done: ${live}/${results.length} live. Status written (public: live only).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
