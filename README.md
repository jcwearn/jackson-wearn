# jacksonwearn.com

Personal site. React + TypeScript on Vite, styled with Tailwind, deployed to Cloudflare Pages.

Three pages: a short bio with a contact form, a portfolio of side projects, and a resume rendered
as HTML from the same source that produces the PDF.

## Running it

```sh
npm ci        # not npm install -- see the .npmrc note below
npm run dev
```

| Command                | Does                                                     |
| ---------------------- | -------------------------------------------------------- |
| `npm run dev`          | Vite dev server                                          |
| `npm run build`        | Typecheck and build to `dist/`                           |
| `npm run preview`      | Serve the built output                                   |
| `npm test`             | Vitest, once                                             |
| `npm run test:watch`   | Vitest, watching                                         |
| `npm run typecheck`    | `tsc -b`                                                 |
| `npm run lint`         | oxlint                                                   |
| `npm run format`       | Prettier, writing                                        |
| `npm run format:check` | Prettier, checking — this is what CI runs                |
| `npm run resume:fetch` | Pull the latest resume JSON and PDF without a full build |
| `npm run og:build`     | Rebuild the share card (needs Chrome; macOS only)        |

CI runs format, lint, typecheck, test and build on every pull request.

## Layout

```
src/
  App.tsx              route table
  main.tsx             BrowserRouter + mount
  components/          Layout, Header, Nav, ThemeToggle, Footer, ContactForm, ProjectCard
  pages/               Home, Portfolio, Resume, NotFound
  content/             projects.ts, resume.json + resume.ts
  hooks/useDarkMode.ts theme state
scripts/fetch-resume.ts
scripts/build-og.ts    share card
```

Page content lives in `src/content/`, not in components. Adding a portfolio project is an edit to
`projects.ts` and nothing else.

## The resume page

The page renders real HTML, not an embedded PDF. The content comes from
[`jcwearn/resume`](https://github.com/jcwearn/resume), which generates `out/resume.json` from the
same YAML and the same variant filtering that produce the PDF, so the page and the file cannot
disagree about what the resume says.

`scripts/fetch-resume.ts` runs as `prebuild` — on `npm run build`, including the one Cloudflare
runs, and never on `npm run dev`. It refreshes two committed files:

- `src/content/resume.json` — rendered as the page
- `public/resume.pdf` — offered as "View PDF"

Both are committed, and **the fetch never fails the build**. The committed copies decide whether the
page works; the script only tries to make them newer. If GitHub is unreachable, rate-limited, or
serving something unexpected, the build carries on with what is in the repo. It also only writes when
the bytes actually change, so `git status` after a build is a real signal that the resume moved and
wants committing.

Don't edit `src/content/resume.json` by hand — the next build overwrites it. Resume content changes
belong in the resume repo's YAML.

## The share card

`public/og.png` is the 1200x630 image iMessage, Slack and LinkedIn show for a link to the site. One
card for the whole site rather than one per route: the pages share a header and a subject, and
scrapers do not run JavaScript, so per-route cards would need a prerender step to give each URL its
own `<head>`. The card is the site's own header — the portrait, grayscale as dark mode renders it,
the name and the role line — so a preview looks like the page it opens.

`scripts/build-og.ts` renders it by screenshotting a small HTML page with the Chrome installed on
this machine. That is why it is **not** part of `npm run build`: the Cloudflare builder has no
Chrome, and CI builds with no network. The PNG is committed. Rerun it after changing the portrait,
the name or the role line, and commit the result:

```sh
npm run og:build
```

It fails loudly rather than shipping a bad card: it reads the dimensions back out of the PNG header
and rejects anything that is not 1200x630 or is over 500KB, the size above which Apple's link
fetcher gives up. `src/og.test.ts` closes the remaining gap — that the committed file exists and
matches the URL and dimensions `index.html` advertises. Neither checks whether the card _looks_
right, so look at it.

Sharing `/resume.pdf` previews the PDF itself rather than this card, which is the intent — it is a
direct file link, and no `<meta>` tag affects it.

## Deployment

Cloudflare Pages builds `main` and serves `dist/`. A few things about that are easy to break:

**Do not add `public/_redirects`.** Pages already serves `index.html` for unmatched paths, which is
what makes `/portfolio` and `/resume` work as deep links. A `/*` catch-all would be followed ahead of
real assets and shadow `/assets/*` and `/profile.jpg`, and `_redirects` has no negative-match syntax
to exclude them.

**Do not add `public/404.html`.** Its presence silently disables that single-page-application
fallback, so deep links would work in `vite dev` and 404 in production.

The consequence of relying on the fallback is that unknown paths render the app's not-found page with
a 200 rather than a 404. That is the trade for client-side routing on Pages without a redirects file.

**`public/_headers` is fine; an `/assets/*` rule in it would not be.** Unlike `_redirects`,
`_headers` only decorates responses and does not route, so the file itself is safe — it sets a
one-day `Cache-Control` on `/og.png`. What it must never grow is an `immutable` rule for `/assets/*`.
`_headers` matches by request path, so that rule would stamp a year onto the reply for an asset that
is not there — which, given the `index.html`-with-a-200 fallback above, is HTML. The edge would then
serve a cached page under a JavaScript filename for a year. The `borderline` repo does carry that
rule, safely, because it has a `404.html`. Another thing not to copy across.

The contact form posts to `/form-submit`, a separate Cloudflare Worker
([`cf-worker-email-public`](https://github.com/jcwearn/cf-worker-email-public)). It is not part of
this build; rolling it in would mean moving off Pages, which does not support the email-sending or
rate-limiting bindings that Worker uses.

## Notes on the toolchain

`.npmrc` sets `legacy-peer-deps=true`, so peer dependencies are not installed automatically. If you
add a package that declares peers, add them explicitly — `@testing-library/dom` is here for exactly
that reason.

Linting is oxlint, not ESLint. ESLint was removed once `typescript-eslint` stopped supporting the
TypeScript version this repo is on; it was failing before it linted anything.

`.node-version` is pinned exact. Both `setup-node` and Cloudflare Pages read it, so an unpinned
major would let a new release change what CI and production run with no commit saying so.

Blame skips the one wholesale formatting commit:

```sh
git config blame.ignoreRevsFile .git-blame-ignore-revs
```

## License

MIT. See [LICENSE](LICENSE).
