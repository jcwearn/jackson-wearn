// ---------------------------------------------------------------------------
// Everything on the portfolio page comes from this file.
// Edit here, not in Portfolio.tsx.
//
// `source` is public source. For most of these that is a snapshot mirror: the
// private repo stays canonical and a CI job publishes a filtered tree to
// <name>-public on every merge. A few are simply public repos. Either way, only
// add an entry once a logged-out visitor can actually open the link -- a
// portfolio pointing at a 404 is worse than a shorter portfolio.
//
// A project with no public source at all sets `private: true` and omits
// `source`. That pairing is asserted both ways in the test, so a link left off
// by accident fails rather than rendering a card that quietly has nowhere to go.
// ---------------------------------------------------------------------------

export type Category = 'sites' | 'games' | 'infrastructure' | 'tooling'

export type Project = {
  /** URL segment for the case study, and the React key on the portfolio page. */
  slug: string
  name: string
  category: Category
  /** Live site. Omitted for projects that are not a website. */
  url?: string
  /** Public source: a mirror for the private repos, the repo itself otherwise. */
  source?: string
  /** True exactly when there is no public source to link. Never both. */
  private?: boolean
  blurb: string
  tags: string[]
}

/**
 * Declaration order is page order, which is why this is an array and not a map.
 * Keeping it here rather than in Portfolio.tsx means adding a group is a content
 * edit like everything else on this page.
 */
export const categories: { id: Category; label: string; blurb: string }[] = [
  {
    id: 'sites',
    label: 'Sites',
    blurb: 'Things you can open and use.',
  },
  {
    id: 'games',
    label: 'Games',
    blurb: 'Things you can play. One is solo and daily; the other needs a room full of phones.',
  },
  {
    id: 'infrastructure',
    label: 'Homelab & infrastructure',
    blurb: 'A house and a cluster, both run from a git repo.',
  },
  {
    id: 'tooling',
    label: 'Developer tooling',
    blurb: 'Small things built to remove a recurring chore.',
  },
]

export const projects: Project[] = [
  {
    slug: 'anupamaandjackson',
    name: 'Anupama & Jackson',
    category: 'sites',
    url: 'https://anupamaandjackson.com',
    source: 'https://github.com/jcwearn/anupamaandjackson-public',
    blurb:
      'A wedding site giving every guest a different schedule with no accounts, sessions or backend. Each guest’s record is encrypted under a key derived from their own name and they all ship in one static file, so entering your name opens exactly one envelope.',
    tags: ['React', 'TypeScript', 'Web Crypto', 'Vite SSG'],
  },
  {
    slug: 'jackson-wearn',
    name: 'Jackson Wearn',
    category: 'sites',
    url: 'https://jacksonwearn.com',
    source: 'https://github.com/jcwearn/jackson-wearn',
    blurb:
      'The site you are reading. The resume page renders from the same JSON that builds the PDF, refreshed on a schedule so editing the resume reaches the site without touching this repo.',
    tags: ['React', 'TypeScript', 'Vite', 'Tailwind', 'Cloudflare Pages'],
  },
  {
    slug: 'world-clock',
    name: 'World Clock',
    category: 'sites',
    url: 'https://clock.jacksonwearn.com',
    source: 'https://github.com/jcwearn/world-clock',
    blurb:
      'Digital clocks for the timezones I care about, where editing any one of them pins a hypothetical moment and converts it across all the others — for questions like “if it’s 7pm Eastern, what time is it in India?”. One build, two deploy targets: a container image served by unprivileged nginx, and Cloudflare Pages.',
    tags: ['React', 'TypeScript', 'Luxon', 'shadcn/ui', 'Docker'],
  },

  {
    slug: 'borderline',
    name: 'Borderline',
    category: 'games',
    url: 'https://borderline.golf',
    source: 'https://github.com/jcwearn/borderline-public',
    blurb:
      'A daily geography puzzle scored like golf: cross from one country to another in as few as possible, on an unlabelled globe where a country’s name costs you. Each day’s puzzle is derived from the date and a server-side salt, so none of it exists before its day.',
    tags: ['TypeScript', 'React', 'three.js', 'Cloudflare Pages'],
  },
  {
    slug: 'hivemind',
    name: 'Hivemind',
    category: 'games',
    url: 'https://hivemind.jacksonwearn.com',
    source: 'https://github.com/jcwearn/hivemind',
    blurb:
      'A Jackbox-style party game where one snake is steered by the whole room: the board goes on a television, phones join by QR code, and every tick the server tallies the votes and the plurality direction wins. Go, htmx and server-sent events — no WebSocket, no database, and a room’s entire state owned by a single goroutine rather than a mutex.',
    tags: ['Go', 'htmx', 'SSE', 'templ', 'Cloudflare Containers'],
  },

  {
    slug: 'k3s-cluster',
    name: 'k3s-cluster',
    category: 'infrastructure',
    source: 'https://github.com/jcwearn/k3s-cluster-public',
    blurb:
      'A three-node k3s cluster running about 25 self-hosted services, where every change is a pull request FluxCD reconciles into the running system. Secrets are SOPS-encrypted in the repo and the topology is substituted in at reconcile time, so the repo itself is portable.',
    tags: ['Kubernetes', 'Flux CD', 'Helm', 'SOPS', 'Renovate'],
  },
  {
    slug: 'cloudflare-infra',
    name: 'cloudflare-infra',
    private: true,
    category: 'infrastructure',
    blurb:
      'The Cloudflare account as OpenTofu: zones, DNS, Pages projects, Workers boundaries, edge rules and the API tokens the app repos deploy with. Every change is a plan on the pull request and an apply on merge, with a nightly job that checks the account has not drifted away from the repo behind its back.',
    tags: ['OpenTofu', 'Cloudflare', 'GitHub Actions', 'SOPS', 'R2'],
  },
  {
    slug: 'truenas-infra',
    name: 'truenas-infra',
    private: true,
    category: 'infrastructure',
    blurb:
      'The NAS as OpenTofu: ZFS datasets, NFS exports, snapshot schedules and the monitoring grants the cluster scrapes through. It exists because a Prometheus migration ended on a prerequisite that could not be reviewed or rolled back — “create the dataset and the share by hand before merging” — and that step now lives in a diff.',
    tags: ['OpenTofu', 'TrueNAS', 'ZFS', 'NFS', 'GitHub Actions'],
  },
  {
    slug: 'homeassistant-config',
    name: 'homeassistant-config',
    category: 'infrastructure',
    source: 'https://github.com/jcwearn/homeassistant-config-public',
    blurb:
      'A house run from a git repo: every automation and dashboard is declarative YAML with no UI-editor state. CI runs a real Home Assistant config check in Docker before anything reaches the house.',
    tags: ['Home Assistant', 'SOPS', 'GitHub Actions', 'Zigbee2MQTT'],
  },
  {
    slug: 'udm-pro',
    name: 'udm-pro',
    category: 'infrastructure',
    source: 'https://github.com/jcwearn/udm-pro',
    blurb:
      'A UniFi Dream Machine Pro doing its own 802.1X on AT&T fiber, so the ISP gateway can be removed entirely. Every firmware upgrade used to delete the supplicant and drop the WAN — leaving no internet to reinstall it with — so the box now rebuilds it from persistent storage on boot, verified against a real upgrade and a destructive test.',
    tags: ['Bash', 'systemd', 'wpa_supplicant', 'SOPS', 'UniFi OS'],
  },
  {
    slug: 'withjoy-exporter',
    name: 'withjoy-exporter',
    category: 'infrastructure',
    source: 'https://github.com/jcwearn/withjoy-exporter',
    blurb:
      'WithJoy builds its guest-list export in the browser, so there is no API to call. This drives the real interface in headless Chromium, pivots the tags into one column each, and writes to Google Sheets only when something actually changed.',
    tags: ['Python', 'Playwright', 'Google Sheets API', 'Kubernetes'],
  },

  {
    slug: 'resume',
    name: 'resume',
    category: 'tooling',
    source: 'https://github.com/jcwearn/resume',
    blurb:
      'My resume built from YAML through Jinja2 and LaTeX, so adding a job is fifteen lines and never touching TeX. One function feeds both the PDF and the JSON this site renders, so the two cannot disagree about what it says.',
    tags: ['Python', 'Jinja2', 'LaTeX', 'Make', 'GitHub Actions'],
  },
  {
    slug: 'workflows',
    name: 'workflows',
    category: 'tooling',
    source: 'https://github.com/jcwearn/workflows',
    blurb:
      'The shared CI and release pipeline behind most of these repos: Go, Node, Python and Docker builds, label-driven semver, and the job that publishes a private repo as a public snapshot. That last one syncs a file tree and never commits or refs, because GitHub serves closed pull request refs forever — so a repo that once had a secret on a branch can never safely be made public.',
    tags: ['GitHub Actions', 'Bash', 'rsync', 'gitleaks'],
  },
  {
    slug: 'cf-worker-email',
    name: 'cf-worker-email',
    category: 'tooling',
    source: 'https://github.com/jcwearn/cf-worker-email-public',
    blurb:
      'The Worker behind this site’s contact form. It rate-limits per client address, checks the origin, validates the payload and delivers it as mail through Email Routing. No database and no state — the message you send from the home page goes through this.',
    tags: ['TypeScript', 'Cloudflare Workers', 'Email Routing'],
  },
]
