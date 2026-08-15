import { describe, expect, it } from 'vitest'
import html from '../index.html?raw'
import card from '../public/og.png?inline'

// The share card is built by `npm run og:build`, which the Cloudflare builder
// cannot run -- it has no Chrome -- so public/og.png is committed and index.html
// points at it by absolute URL. Nothing else checks that those two agree, and
// the failure is a quiet one: a renamed or forgotten file reads as fine in
// review, builds green, and shows up only as a blank rectangle in someone
// else's iMessage.
//
// Both files are pulled in through Vite rather than node:fs so this stays
// inside the browser project -- tsconfig.app.json has no Node types, and adding
// them for one test would let any component reach for `process` and still
// typecheck. `?inline` hands back the real bytes as a data URI.
//
// This asserts the artefact, not the copy or the layout. Whether the card looks
// right is a human check -- see the README.
const bytes = Uint8Array.from(atob(card.split(',')[1]), (character) => character.charCodeAt(0))
const header = new DataView(bytes.buffer)

// Width and height live at fixed offsets in the IHDR chunk, which is always
// first. Cheaper than a dependency for two integers.
const dimensions = [header.getUint32(16), header.getUint32(20)]

// Parsed rather than grepped: `meta[property="og:image"]` cannot accidentally
// match og:image:type the way a loose regex can.
const head = new DOMParser().parseFromString(html, 'text/html')
const content = (selector: string) => head.querySelector(selector)?.getAttribute('content')

describe('the share card', () => {
  it('is a 1200x630 PNG', () => {
    expect(String.fromCharCode(...bytes.subarray(1, 4))).toBe('PNG')
    expect(dimensions).toEqual([1200, 630])
  })

  // Apple's link fetcher gives up on large images.
  it('is under the 500KB budget', () => {
    expect(bytes.byteLength).toBeLessThan(500_000)
  })

  it('is what og:image and twitter:image point at', () => {
    // Absolute, because a relative og:image is the usual reason a preview comes
    // out blank.
    expect(content('meta[property="og:image"]')).toBe('https://jacksonwearn.com/og.png')
    expect(content('meta[name="twitter:image"]')).toBe('https://jacksonwearn.com/og.png')
  })

  it('is the size og:image:width and og:image:height claim', () => {
    expect([
      Number(content('meta[property="og:image:width"]')),
      Number(content('meta[property="og:image:height"]')),
    ]).toEqual(dimensions)
  })
})
