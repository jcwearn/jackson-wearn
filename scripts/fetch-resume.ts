// Refreshes the resume assets from the resume repo at build time.
//
// Two files: resume.json, which the page renders as HTML, and resume.pdf,
// which it offers for download. Both are committed here, and both are rebuilt
// and published by the resume repo's own CI on every merge.
//
// Runs as `prebuild`, so it happens on `npm run build` -- including the one
// Cloudflare Pages runs -- and never on `npm run dev`.
//
// This never fails the build. The committed copies are the source of truth for
// whether the page works; this only tries to make them newer. If GitHub is
// unreachable, rate-limited, or serving something unexpected, the build
// carries on with what is already in the repo.

import { createHash } from 'node:crypto'
import { readFile, writeFile } from 'node:fs/promises'

// raw.githubusercontent.com rather than api.github.com on purpose: the API
// allows 60 unauthenticated requests per hour per IP, and Cloudflare Pages
// builders share egress addresses. These are plain file fetches with no such
// limit. (The repo also has no releases, so releases/latest would 404.)
const BASE = 'https://raw.githubusercontent.com/jcwearn/resume/main/out'
const TIMEOUT_MS = 15_000

type Asset = {
  url: string
  dest: string
  minBytes: number
  /** Rejects a 200 carrying the wrong thing -- see the note in fetchAsset. */
  looksRight: (body: Buffer) => boolean
}

const assets: Asset[] = [
  {
    url: `${BASE}/resume.json`,
    dest: 'src/content/resume.json',
    minBytes: 2_000,
    looksRight: (body) => {
      try {
        const parsed = JSON.parse(body.toString('utf8'))
        return Boolean(parsed?.profile?.name) && Array.isArray(parsed?.experience)
      } catch {
        return false
      }
    },
  },
  {
    url: `${BASE}/jackson-wearn-resume.pdf`,
    dest: 'public/resume.pdf',
    minBytes: 10_000,
    looksRight: (body) => body.subarray(0, 5).toString() === '%PDF-',
  },
]

const digest = (b: Buffer) => createHash('sha256').update(b).digest('hex')

async function fetchAsset({ url, dest, minBytes, looksRight }: Asset) {
  const skip = (why: string) => console.warn(`[fetch-resume] ${dest}: skipped, ${why}`)

  let body: Buffer
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) })
    if (!res.ok) {
      skip(`${res.status} ${res.statusText}`)
      return
    }
    body = Buffer.from(await res.arrayBuffer())
  } catch (error) {
    skip(error instanceof Error ? error.message : String(error))
    return
  }

  // GitHub answers a missing path with an HTML 404 page, which is a perfectly
  // valid 200-with-body from fetch's point of view. Without this check that
  // HTML lands in resume.json or resume.pdf and the build goes green while
  // shipping a page that renders nothing.
  if (!looksRight(body)) {
    skip('response is not the expected file type')
    return
  }

  if (body.byteLength < minBytes) {
    skip(`suspiciously small (${body.byteLength} bytes)`)
    return
  }

  const current = await readFile(dest).catch(() => null)

  // Writing unconditionally would dirty the working tree on every build. Only
  // writing on a real change means `git status` after a build is a signal that
  // the resume actually moved and wants committing.
  if (current && digest(current) === digest(body)) {
    console.log(`[fetch-resume] ${dest}: already current (${body.byteLength} bytes)`)
    return
  }

  await writeFile(dest, body)
  console.log(`[fetch-resume] ${dest}: wrote ${body.byteLength} bytes`)
}

async function main() {
  if (process.env.SKIP_RESUME_FETCH) {
    console.warn('[fetch-resume] skipped: SKIP_RESUME_FETCH is set')
    return
  }
  // Sequential rather than parallel: two small files, and interleaved warnings
  // are harder to read than they are slow.
  for (const asset of assets) {
    await fetchAsset(asset)
  }
}

// Belt and braces around the never-fail promise: an unforeseen throw still
// leaves the build using the committed files.
main().catch((error) =>
  console.warn(`[fetch-resume] skipped: ${error instanceof Error ? error.message : String(error)}`),
)
