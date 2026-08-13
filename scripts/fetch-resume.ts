// Refreshes public/resume.pdf from the resume repo at build time.
//
// Runs as `prebuild`, so it happens on `npm run build` -- including the one
// Cloudflare Pages runs -- and never on `npm run dev`.
//
// This never fails the build. A committed copy of the PDF is the source of
// truth for whether the page works; this only tries to make it newer. If
// GitHub is unreachable, rate-limited, or serving something unexpected, the
// build carries on with the copy already in the repo.

import { createHash } from 'node:crypto'
import { readFile, writeFile } from 'node:fs/promises'

// raw.githubusercontent.com rather than api.github.com on purpose: the API
// allows 60 unauthenticated requests per hour per IP, and Cloudflare Pages
// builders share egress addresses. This is a plain file fetch with no such
// limit. (The repo also has no releases, so releases/latest would 404.)
const URL = 'https://raw.githubusercontent.com/jcwearn/resume/main/out/jackson-wearn-resume.pdf'
const DEST = 'public/resume.pdf'
const TIMEOUT_MS = 15_000
const MIN_BYTES = 10_000

const skip = (why: string) => console.warn(`[fetch-resume] skipped: ${why}`)

async function main() {
  if (process.env.SKIP_RESUME_FETCH) {
    skip('SKIP_RESUME_FETCH is set')
    return
  }

  let body: Buffer
  try {
    const res = await fetch(URL, { signal: AbortSignal.timeout(TIMEOUT_MS) })
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
  // HTML would be written to resume.pdf and the build would go green while
  // shipping a viewer that renders nothing.
  if (body.subarray(0, 5).toString() !== '%PDF-') {
    skip('response is not a PDF')
    return
  }

  if (body.byteLength < MIN_BYTES) {
    skip(`suspiciously small (${body.byteLength} bytes)`)
    return
  }

  const digest = (b: Buffer) => createHash('sha256').update(b).digest('hex')
  const current = await readFile(DEST).catch(() => null)

  // Writing unconditionally would dirty the working tree on every build. Only
  // writing on a real change means `git status` after a build is a signal that
  // the resume actually moved and wants committing.
  if (current && digest(current) === digest(body)) {
    console.log(`[fetch-resume] ${DEST} already current (${body.byteLength} bytes)`)
    return
  }

  await writeFile(DEST, body)
  console.log(`[fetch-resume] wrote ${DEST} (${body.byteLength} bytes)`)
}

// Belt and braces around the never-fail promise: an unforeseen throw still
// leaves the build using the committed PDF.
main().catch((error) => skip(error instanceof Error ? error.message : String(error)))
