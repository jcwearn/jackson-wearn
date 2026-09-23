import { describe, expect, it } from 'vitest'
import html from '../../porchfest/index.html?raw'
import image from '../../public/porchfest/invite.jpg?inline'

// The /porchfest share preview is the invite itself, served from
// public/porchfest/invite.jpg and named by absolute URL in porchfest/index.html.
// The same checks as src/og.test.ts, for the same quiet failure: a wrong name or
// a stale size builds green and shows up only as a blank or broken preview in
// someone's messages.
const bytes = Uint8Array.from(atob(image.split(',')[1]), (character) => character.charCodeAt(0))

/**
 * A JPEG's size lives in its start-of-frame segment, which can come after any
 * number of other segments, so walk them rather than reading a fixed offset.
 */
function jpegDimensions(data: Uint8Array): [number, number] {
  const view = new DataView(data.buffer)
  let offset = 2
  while (offset < data.length) {
    const marker = view.getUint16(offset)
    // SOF0 to SOF15, less DHT (C4), JPG (C8) and DAC (CC), which share the range.
    if (marker >= 0xffc0 && marker <= 0xffcf && ![0xffc4, 0xffc8, 0xffcc].includes(marker)) {
      return [view.getUint16(offset + 7), view.getUint16(offset + 5)]
    }
    offset += 2 + view.getUint16(offset + 2)
  }
  throw new Error('no start-of-frame segment')
}

const head = new DOMParser().parseFromString(html, 'text/html')
const content = (selector: string) => head.querySelector(selector)?.getAttribute('content')

describe('the porchfest share preview', () => {
  it('is a JPEG', () => {
    expect([...bytes.subarray(0, 3)]).toEqual([0xff, 0xd8, 0xff])
  })

  // Apple's link fetcher gives up on large images.
  it('is under the 500KB budget', () => {
    expect(bytes.byteLength).toBeLessThan(500_000)
  })

  it('is what og:image and twitter:image point at', () => {
    const url = 'https://jacksonwearn.com/porchfest/invite.jpg'
    expect(content('meta[property="og:image"]')).toBe(url)
    expect(content('meta[name="twitter:image"]')).toBe(url)
  })

  it('is the size og:image:width and og:image:height claim', () => {
    expect([
      Number(content('meta[property="og:image:width"]')),
      Number(content('meta[property="og:image:height"]')),
    ]).toEqual(jpegDimensions(bytes))
  })
})
