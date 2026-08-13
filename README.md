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

## Deployment

Cloudflare Pages builds `main` and serves `dist/`. Two things about that are easy to break:

**Do not add `public/_redirects`.** Pages already serves `index.html` for unmatched paths, which is
what makes `/portfolio` and `/resume` work as deep links. A `/*` catch-all would be followed ahead of
real assets and shadow `/assets/*` and `/profile.jpg`, and `_redirects` has no negative-match syntax
to exclude them.

**Do not add `public/404.html`.** Its presence silently disables that single-page-application
fallback, so deep links would work in `vite dev` and 404 in production.

The consequence of relying on the fallback is that unknown paths render the app's not-found page with
a 200 rather than a 404. That is the trade for client-side routing on Pages without a redirects file.

The contact form posts to `/form-submit`, a separate Cloudflare Worker (`jcwearn/cf-worker-email`,
not yet published). It is not part of this build; rolling it in would mean moving off Pages, which
does not support the email-sending or rate-limiting bindings that Worker uses.

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
