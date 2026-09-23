export interface LeagueSection {
  id: string;
  nav: string;
  h2: string;
  answer: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface CompetitorSection {
  id: string;
  name: string;
  body: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export const NAV_ITEMS: { href: string; label: string }[] = [
  { href: "#mirrors", label: "Mirrors" },
  { href: "#nfl", label: "NFL" },
  { href: "#nba", label: "NBA" },
  { href: "#mlb", label: "MLB" },
  { href: "#nhl", label: "NHL" },
  { href: "#ufc", label: "UFC" },
  { href: "#soccer", label: "Soccer" },
  { href: "#alternatives", label: "Alternatives" },
  { href: "#faq", label: "FAQ" },
];

export const LEAGUES: LeagueSection[] = [
  {
    id: "nfl",
    nav: "NFL",
    h2: "GKStreams NFL — Watch Football Games Online",
    answer:
      "GKStreams collects public NFL game links for the regular season, playoffs, and Super Bowl so fans can open a matchup without creating an account.",
    paragraphs: [
      "Football fans often want one place that surfaces week-by-week game URLs. It gathers openly listed links across the NFL schedule so viewers can open a game and continue on the third-party page that already publishes that feed.",
      "Because GKStreams does not store video, the list stays fast. When a domain moves, the mirrors above refresh on a short cycle so people seeking current access can open a working URL and reach the game.",
    ],
    bullets: [
      "NFL regular season and primetime windows",
      "Conference championships and Super Bowl week",
      "Links only — playback stays on the host site",
    ],
  },
  {
    id: "nba",
    nav: "NBA",
    h2: "GKStreams NBA — Basketball Links Without Sign-Up",
    answer:
      "Open NBA links on GKStreams for regular-season nights, the play-in, playoffs, and Finals — free, with no registration step.",
    paragraphs: [
      "Basketball search intent spikes on back-to-back nights and deep into the postseason. GKStreams works the same way across the site: it presents collected stream links instead of storing files on its own servers.",
      "Use a live mirror above, then look for the matchup among available basketball links. It does not require an account wall to browse the list.",
    ],
    bullets: [
      "Regular season slate and national TV games",
      "Play-in tournament through the NBA Finals",
      "Free access — no sign-up required",
    ],
  },
  {
    id: "mlb",
    nav: "MLB",
    h2: "GKStreams MLB — Baseball Game Link Directory",
    answer:
      "Follow publicly listed MLB links on GKStreams through the long regular season and October. It never uploads game files itself.",
    paragraphs: [
      "A 162-game calendar means people return often for “today’s games.” GKStreams baseball coverage follows the same non-hosting pattern as its other leagues: open links are collected for fans, and hosting stays with third parties.",
      "Open a working mirror above when you need current access, then use the available baseball links for the day’s card. Status timestamps show when the list was last checked.",
    ],
    bullets: [
      "Daily regular-season matchups",
      "All-Star week and October postseason",
      "Aggregated links only — no local uploads",
    ],
  },
  {
    id: "nhl",
    nav: "NHL",
    h2: "GKStreams NHL — Hockey Streams Collected as Links",
    answer:
      "Find NHL game links on GKStreams for the regular season and Stanley Cup playoffs — free, with no sign-up.",
    paragraphs: [
      "Hockey sits beside the other major US leagues under the same model. GKStreams never stores broadcasts; it only surfaces URLs fans can open for a game feed.",
      "Use the mirror section when the primary name is unavailable, then browse collected hockey links. Header anchors send NHL searches straight to this heading.",
    ],
    bullets: [
      "Regular-season and rivalry nights",
      "Stanley Cup Final windows",
      "Link aggregator — not a media host",
    ],
  },
  {
    id: "ufc",
    nav: "UFC",
    h2: "GKStreams UFC — MMA Fight Night Links",
    answer:
      "Browse public UFC and MMA fight-night links on GKStreams so you can follow cards without any video hosted here.",
    paragraphs: [
      "Fight cards create sharp, event-driven search volume. GKStreams treats access as an aggregator of open links: paths to streams that already live elsewhere, with no PPV files uploaded by the site.",
      "Check live mirrors before the main card, open an available domain, and look for the event link you need. Pages stay informational and point back to third-party hosts.",
    ],
    bullets: [
      "Fight Night and numbered PPV cards",
      "Prelims and main-card link discovery",
      "No files stored on GKStreams",
    ],
  },
  {
    id: "soccer",
    nav: "Soccer",
    h2: "GKStreams Soccer — Premier League, Champions League & More",
    answer:
      "GKStreams soccer links cover the Premier League, Champions League, top European leagues, and international windows — free, without sign-up.",
    paragraphs: [
      "Fans search across many competitions in one sitting. GKStreams keeps the same non-hosting rule here: collected public links only, for people who want a quick path to a match page.",
      "From weekend kickoffs to midweek European nights, open a working mirror above and follow available links. The list aims at multiple popular competitions together, not a single region.",
    ],
    bullets: [
      "Premier League, La Liga, Serie A, Bundesliga",
      "UEFA Champions League and Europa nights",
      "International windows and major tournaments",
    ],
  },
];

export const MORE_SPORTS: { name: string; note: string }[] = [
  { name: "College Football", note: "Saturday slates and bowl season link lists" },
  { name: "NCAA Basketball", note: "March Madness–style tournament coverage" },
  { name: "Boxing", note: "Fight-night card links when available" },
  { name: "Formula 1 & NASCAR", note: "Race-day sessions and highlights links" },
  { name: "Tennis & Golf", note: "Major championship windows" },
  { name: "Olympics & Multisport", note: "Event-period aggregated links" },
];

export const COMPETITORS: CompetitorSection[] = [
  {
    id: "methstreams",
    name: "Methstreams",
    body: "Methstreams is another name people meet in free sports link searches. Readers who follow that query often also look for mirror lists when domains move. GKStreams sits in the same broad category: a directory that surfaces third-party game links rather than owning a broadcast network.",
  },
  {
    id: "crackstreams",
    name: "Crackstreams",
    body: "Crackstreams shows up often in free-sports autocomplete. Search interest around that brand overlaps with GKStreams on live US league nights. The distinction is simple: it collects public links, needs no sign-up for directory use, and does not claim to host video.",
  },
  {
    id: "sportsurge",
    name: "Sportsurge",
    body: "Sportsurge is a well-known hub-style aggregator in the same search neighborhood. Fans comparing the two usually want the same outcome — a quick path to a working game link. GKStreams simply collects links and does not upload content.",
  },
  {
    id: "buffstreams",
    name: "Buffstreams",
    body: "Buffstreams is a common alternative keyword when primary sites change address. The mirror list above exists so people searching that cluster can still reach current access and open collected sports links without creating an account.",
  },
  {
    id: "nflbite",
    name: "NFLbite",
    body: "NFLbite is NFL-focused branding inside the free-link niche. The football section higher up covers the same schedule intent. Readers jumping between those queries and GKStreams typically care about coverage and whether a mirror is online.",
  },
  {
    id: "totalsportek",
    name: "Totalsportek",
    body: "Totalsportek is widely searched for soccer-heavy listings. The soccer section above addresses similar international and domestic match intent while restating that it collects links and does not store streams.",
  },
  {
    id: "streameast",
    name: "Streameast",
    body: "Streameast draws substantial brand search in free sports circles. Visitors arriving from that query can use the live mirror list to check availability, then continue to aggregated league links for football, basketball, and more.",
  },
  {
    id: "hesgoal",
    name: "Hesgoal",
    body: "Hesgoal is another competitor entity fans see next to soccer directories. A short mention helps connect related alternatives in search. GKStreams remains a non-hosting link aggregator with free directory access and no sign-up.",
  },
];

export const FAQS: FaqItem[] = [
  {
    q: "What is GKStreams?",
    a: "It is a sports streaming link aggregator. GKStreams collects publicly available game links for leagues such as the NFL, NBA, MLB, NHL, UFC, and soccer so fans can open them without a directory account.",
  },
  {
    q: "Does GKStreams host or upload streams?",
    a: "No. Video is never hosted, stored, or uploaded on GKStreams. It only collects links to third-party pages; playback and copyright responsibility stay with the actual host of each link.",
  },
  {
    q: "Is GKStreams free to use?",
    a: "Yes. It is free, and no sign-up is required to view the mirror list or open the collected sports links it points to.",
  },
  {
    q: "How do I open a working GKStreams mirror?",
    a: "Use the live mirror list near the top of the page. Domains are checked on a short cycle; only currently working links are shown.",
  },
  {
    q: "What sports are on GKStreams?",
    a: "It covers popular US sports — NFL, NBA, MLB, NHL, UFC — plus soccer and other events listed under More Sports.",
  },
  {
    q: "How is GKStreams similar to Sportsurge or Crackstreams?",
    a: "All three are free sports link directories. It collects links and does not host content itself.",
  },
  {
    q: "Do I need an account for GKStreams?",
    a: "No sign-up is required to use the mirror directory. Any login on a destination page belongs to that third-party host, not to GKStreams.",
  },
];
