import domainsJson from "./domains.json";

export const SITE = {
  name: "GKStreams",
  title: "GKStreams — Official Mirror List | Working Domains",
  description:
    "Find the current working GKStreams mirror domains. This official landing page lists live GKStreams mirrors and checks their status every 5 minutes.",
  url: "https://gkstreams.com",
  email: "dmca@gkstreams.com",
  footerDisclaimer:
    "GKStreams is an informational directory of publicly available mirror links only. We do not host, store, stream, embed, or provide any media or files. Links lead to third-party sites we do not control. Trademarks and content belong to their respective owners. To request link removal or send a DMCA notice, contact us — valid notices are answered promptly.",
} as const;

export interface MirrorDomain {
  url: string;
  label: string;
}

/** Edit src/data/domains.json — one entry per mirror. */
export const DOMAINS: MirrorDomain[] = domainsJson as MirrorDomain[];

export type DomainStatus = "live" | "down" | "unknown";

export interface DomainStatusEntry {
  url: string;
  status: DomainStatus;
  httpStatus?: number;
  ms?: number;
}

export interface StatusSnapshot {
  updatedAt: string;
  domains: DomainStatusEntry[];
}

export const FALLBACK_STATUS: StatusSnapshot = {
  updatedAt: new Date(0).toISOString(),
  domains: DOMAINS.map((d) => ({ url: d.url, status: "unknown" })),
};

export function normalizeUrl(url: string): string {
  return url.replace(/\/+$/, "").toLowerCase();
}

export function statusFor(
  snapshot: StatusSnapshot | null | undefined,
  url: string
): DomainStatusEntry {
  const key = normalizeUrl(url);
  const found = snapshot?.domains?.find(
    (d) => normalizeUrl(d.url) === key
  );
  return found ?? { url, status: "unknown" };
}

export function liveCount(snapshot: StatusSnapshot | null | undefined): {
  live: number;
  total: number;
} {
  const total = DOMAINS.length;
  if (!snapshot?.domains?.length) return { live: 0, total };
  const live = DOMAINS.filter((d) => {
    const s = statusFor(snapshot, d.url).status;
    return s === "live";
  }).length;
  return { live, total };
}

export function formatCheckedAt(iso: string | undefined): string {
  if (!iso) return "Awaiting first check";
  const t = Date.parse(iso);
  if (Number.isNaN(t) || t === 0) return "Awaiting first check";
  return new Date(t).toLocaleString("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZoneName: "short",
  });
}
