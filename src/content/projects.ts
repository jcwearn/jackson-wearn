// ---------------------------------------------------------------------------
// Everything on the portfolio page comes from this file.
// Edit here, not in Portfolio.tsx.
//
// `source` points at a public mirror rather than the repo I work in: the
// private repo stays canonical and a CI job publishes a filtered snapshot on
// every merge. Only add an entry once its mirror is public -- a portfolio
// linking to a 404 is worse than a shorter portfolio.
// ---------------------------------------------------------------------------

export type Project = {
  name: string
  /** Live site. Omitted for projects that are not a website. */
  url?: string
  /** Public source. Every project here has some; the mirror counts. */
  source: string
  blurb: string
  tags: string[]
}

export const projects: Project[] = [
  {
    name: 'Contact form Worker',
    source: 'https://github.com/jcwearn/cf-worker-email-public',
    blurb:
      "The Cloudflare Worker behind this site's contact form. One route: it rate-limits per client IP, checks the request came from an allowed origin, validates and sanitises the payload, and delivers it as mail through Email Routing. No database, no state — the message you send from the home page goes through this.",
    tags: ['TypeScript', 'Cloudflare Workers', 'Email Routing', 'Wrangler'],
  },
  {
    name: 'Home Assistant config',
    source: 'https://github.com/jcwearn/homeassistant-config-public',
    blurb:
      'A house run from a git repo. Every automation, dashboard and package is declarative YAML with no UI-editor state, secrets are SOPS-encrypted in the repo and decrypted at deploy time, and CI runs a real Home Assistant config check in Docker before anything reaches the house.',
    tags: ['Home Assistant', 'SOPS', 'GitHub Actions', 'Zigbee2MQTT', 'ESPHome'],
  },
]
