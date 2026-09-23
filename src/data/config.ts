import domainsJson from "./domains.json";

export const SITE = {
  name: "GKStreams",
  title: "GKStreams — Free Sports Link Aggregator | NFL, NBA, MLB",
  description:
    "GKStreams is a free sports streaming link aggregator for NFL, NBA, MLB, NHL, UFC, and soccer. It does not host content — see working mirrors, checked every 5 minutes.",
  url: "https://gkstreams.com",
  footerDisclaimer:
    "GKStreams lists publicly available mirror links only. It does not host, store, or stream any content. Links lead to third-party sites GKStreams does not control. For copyright or content removal, please contact the actual host or operator of the linked site.",
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
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
