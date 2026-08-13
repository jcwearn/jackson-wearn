# Working in this repo

Personal site: React 19 + TypeScript on Vite 8, Tailwind v4, react-router 8, deployed to Cloudflare
Pages. Small on purpose. Read `README.md` first — this file covers what is easy to get wrong rather
than repeating what is already there.

## Before committing

```sh
npm run format:check && npm run lint && npm run typecheck && npm test && npm run build
```

That is exactly what CI runs, in that order. `npm ci`, not `npm install`, for a clean tree.

## Things that will bite you

**`public/_redirects` and `public/404.html` must not exist.** Cloudflare Pages serves `index.html`
for unmatched paths only while there is no top-level `404.html`, and that fallback is what makes
`/portfolio` and `/resume` work as deep links. Adding `_redirects` with a `/*` rule is worse than
useless: redirects are followed ahead of asset matching, so it shadows `/assets/*` and `/profile.jpg`,
and there is no negative-match syntax to carve them out. The sibling `borderline` repo does have a
`404.html` — correct there, wrong here. Don't copy it across.

**`useDarkMode` must be called exactly once per tree.** It mirrors its state onto `localStorage` and
a class on `documentElement`. Two callers get two independent `useState`s writing the same globals and
diverge on the first toggle. `Layout` is the single caller; everything else takes the value as a prop.

**`src/index.css` has no global `a` rules, deliberately.** They were removed because they coloured
every link Vite-template blue, including nav links, with no obvious cause. Style links locally.

**`src/content/resume.json` is generated.** It is refreshed on every build and is in `.prettierignore`
— without that, Prettier reformats it, the next build writes the generator's formatting back, and
`format:check` fails in between. Content changes go in the resume repo's YAML, which also produces
the PDF.

**`.npmrc` sets `legacy-peer-deps=true`.** Peer dependencies are not installed automatically, so a
package that declares peers needs them listed explicitly.

## Conventions

Page content lives in `src/content/`, not in components — `projects.ts` is the model. Adding a
portfolio project should be a data edit and nothing else. Prose is the exception: three paragraphs of
bio belong in `Home.tsx`, not a module.

Tests assert behaviour, not markup. `aria-current`, roles and accessible names over class strings.
There are no snapshot tests and adding one wants a reason. Worth testing: the dark-mode hook, routing,
content-module invariants. Not worth testing: static JSX, Tailwind classes.

Formatting is Prettier with the repo's config, pinned exact. The one wholesale reformat is recorded in
`.git-blame-ignore-revs`; if another ever happens, land it alone and record the SHA in a follow-up,
because a squash merge rewrites the SHA a same-PR entry would have recorded.

## Portfolio links

`projects.ts` entries link to `-public` mirrors, not the private repos those projects are developed
in. A test enforces the suffix, because linking the private repo reads as correct in review and 404s
for every visitor. Only add a project once its mirror is actually public.

## The contact form

It works. It posts JSON to `/form-submit`, a separate Worker in `jcwearn/cf-worker-email` that
validates, rate-limits and sends mail. A bare `curl` returning 400 is it correctly rejecting an empty
body, not a bug.

Consolidating that Worker into this repo would mean migrating off Pages to Workers Static Assets,
since Pages Functions supports neither `send_email` nor rate-limiting bindings. That is a real option
if this ever needs a backend for something else; it is not worth doing for the form alone.
