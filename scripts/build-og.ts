// Builds public/og.png, the 1200x630 card iMessage, Slack and LinkedIn show
// when someone pastes a link to the site.
//
// One card for the whole site, not one per route. The three pages share a
// header and a subject, and scrapers do not run JavaScript, so per-route cards
// would mean a prerender step to give each URL its own <head> -- a lot of
// machinery for three pages. So the card is the site's own header: the same
// portrait, grayscale exactly as dark mode renders it, the same name and the
// same role line. A preview looks like the page it opens.
//
// Rasterizing is done by the Chrome already installed on this machine, which is
// why this is deliberately not part of `npm run build`: the Cloudflare Pages
// builder is a Linux container with no Chrome, and CI builds with no network at
// all. public/og.png is committed, like public/resume.pdf, and index.html
// points at it by absolute URL.
//
// Rerun it after changing the portrait, the name or the role line, and commit
// the result:
//
//   npm run og:build
//
// Unlike scripts/fetch-resume.ts, this fails loudly rather than skipping. That
// one runs unattended in prebuild, where the committed copy is the real source
// of truth and a failed refresh should not stop a deploy. This one is run by a
// person who wants a new card, so a silent skip would just leave the old one in
// place while looking like it worked.

import { spawn } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const WIDTH = 1200
const HEIGHT = 630

// Apple's link fetcher gives up on large images, and a preview that never
// arrives is worse than a plain one.
const BUDGET_BYTES = 500_000

// Straight from src/components/Header.tsx, so the card cannot quietly disagree
// with the page it links to. Nothing enforces that -- see the note in CLAUDE.md.
const NAME = 'Jackson Wearn'
const ROLE = ['Senior Software Engineer', 'Backend &amp; Infrastructure']
const SITE = 'jacksonwearn.com'

// The dark palette, by the Tailwind class each colour is used through. These are
// v4 defaults resolved to hex: the repo has no @theme block, so there is nothing
// to import and the alternative is resolving oklch by hand at render time.
const GRAY_900 = '#101828' // dark:bg-gray-900   -- header and footer
const GRAY_800 = '#1e2939' // dark:bg-gray-800   -- page shell
const GRAY_700 = '#364153' // dark:border-gray-700
const GRAY_300 = '#d1d5dc' // dark:text-gray-300 -- prose
const BLUE_400 = '#51a2ff' // dark:hover:text-blue-400 -- the link accent

/**
 * The portrait is inlined rather than linked because the page is rendered from
 * a temp directory, where a relative path to public/profile.jpg would 404 and
 * Chrome would cheerfully screenshot the broken-image icon. Inlining also means
 * the render needs no network at all -- the site is system fonts only.
 */
function dataUri(path: string): string {
  const bytes = readFileSync(join(ROOT, path))
  // A wrong-but-present file is the failure that survives to production, so
  // check the magic number rather than trusting the extension.
  if (bytes.subarray(0, 3).toString('hex') !== 'ffd8ff') {
    throw new Error(`${path} is not a JPEG`)
  }
  return `data:image/jpeg;base64,${bytes.toString('base64')}`
}

// --- the card ---------------------------------------------------------------

const card = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body {
        width: ${WIDTH}px;
        height: ${HEIGHT}px;
        overflow: hidden;
        /* The same stack as :root in src/index.css, rendered by the same Mac,
           so the card is set in the face the site is actually set in. */
        font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        color: #ffffff;
      }
      .card {
        position: relative;
        display: flex;
        align-items: center;
        gap: 80px;
        width: ${WIDTH}px;
        height: ${HEIGHT}px;
        padding: 0 96px;
        /* gray-900 falling to gray-800, the way the site's header sits above its
           page shell, plus a blue-400 wash at 10% behind the portrait -- enough
           to lift it off a flat panel, too faint to read as a colour. */
        background:
          radial-gradient(620px 620px at 246px 315px, rgba(81, 162, 255, 0.1), rgba(81, 162, 255, 0) 70%),
          linear-gradient(158deg, ${GRAY_900} 0%, ${GRAY_900} 52%, ${GRAY_800} 100%);
      }
      .portrait {
        flex: none;
        width: 300px;
        height: 300px;
        border-radius: 50%;
        border: 4px solid ${GRAY_700};
        object-fit: cover;
        /* Dark mode renders this photo grayscale and fades the sunglasses out.
           The card is a dark-mode card, so it does both. */
        filter: grayscale(1);
        box-shadow: 0 24px 64px rgba(0, 0, 0, 0.45);
      }
      .text { flex: 1; min-width: 0; }
      h1 {
        font-size: 76px;
        font-weight: 700;
        line-height: 1;
        letter-spacing: -0.02em;
        /* A two-word name broken over two lines looks like a mistake. If a
           longer one ever overflows, that is visible in the render, which is
           the point of looking at it. */
        white-space: nowrap;
      }
      .rule {
        width: 104px;
        height: 6px;
        margin: 30px 0;
        border-radius: 3px;
        background: ${BLUE_400};
      }
      p {
        font-size: 34px;
        font-weight: 500;
        line-height: 1.32;
        color: ${GRAY_300};
      }
      .site {
        position: absolute;
        right: 96px;
        bottom: 56px;
        font-size: 26px;
        font-weight: 600;
        letter-spacing: 0.04em;
        color: ${BLUE_400};
      }
    </style>
  </head>
  <body>
    <div class="card">
      <img class="portrait" src="${dataUri('public/profile.jpg')}" alt="" />
      <div class="text">
        <h1>${NAME}</h1>
        <div class="rule"></div>
        <!-- Two lines, and the middot from Header.tsx dropped: the single
             string is 51 characters and needs about 760px at a size legible in
             a thumbnail, and the column is 628px. The break separates the two
             halves the way the middot did. -->
        <p>${ROLE[0]}<br />${ROLE[1]}</p>
      </div>
      <div class="site">${SITE}</div>
    </div>
  </body>
</html>`

// --- rasterize --------------------------------------------------------------

const scratch = mkdtempSync(join(tmpdir(), 'jackson-wearn-og-'))

/**
 * Chrome writes the screenshot and then declines to exit, so waiting on the
 * process would wait forever. Wait on the file instead: once it has appeared
 * and stopped growing, the picture is taken and Chrome has nothing left to say.
 */
async function written(path: string, timeoutMs = 30_000): Promise<void> {
  const deadline = Date.now() + timeoutMs
  let previous = -1

  while (Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, 250))
    const size = statSync(path, { throwIfNoEntry: false })?.size ?? -1
    if (size > 0 && size === previous) return
    previous = size
  }
  throw new Error(`Chrome never produced ${path}`)
}

async function shoot(html: string, output: string): Promise<void> {
  const page = join(scratch, 'card.html')
  const target = join(ROOT, 'public', output)
  writeFileSync(page, html)
  // Otherwise a stale file from an earlier run satisfies the wait immediately
  // and the checks below pass on the wrong picture.
  rmSync(target, { force: true })

  const chrome = spawn(
    CHROME,
    [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--no-first-run',
      '--no-default-browser-check',
      '--force-device-scale-factor=1',
      `--user-data-dir=${join(scratch, 'profile')}`,
      `--window-size=${WIDTH},${HEIGHT}`,
      `--screenshot=${target}`,
      `file://${page}`,
    ],
    { stdio: 'ignore', detached: true },
  )

  try {
    await written(target)
  } finally {
    // Detached, so the whole process group goes -- Chrome leaves helpers behind.
    try {
      process.kill(-chrome.pid!, 'SIGKILL')
    } catch {
      chrome.kill('SIGKILL')
    }
  }

  // Read the dimensions back out of the PNG header rather than trusting the
  // flag: a device-scale surprise produces a 2400x1260 file that looks fine
  // locally and blows the byte budget in front of a scraper.
  const png = readFileSync(target)
  const [width, height] = [png.readUInt32BE(16), png.readUInt32BE(20)]
  if (width !== WIDTH || height !== HEIGHT) {
    throw new Error(`${output} came out ${width}x${height}, wanted ${WIDTH}x${HEIGHT}`)
  }

  const bytes = png.byteLength
  if (bytes > BUDGET_BYTES) {
    throw new Error(
      `${output} is ${Math.round(bytes / 1024)}KB, over the ${BUDGET_BYTES / 1024}KB budget`,
    )
  }

  console.log(`[build-og] public/${output}: ${width}x${height}, ${Math.round(bytes / 1024)}KB`)
}

try {
  await shoot(card, 'og.png')
} finally {
  rmSync(scratch, { recursive: true, force: true })
}
