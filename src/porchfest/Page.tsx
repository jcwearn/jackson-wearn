import React, { useEffect, useRef } from 'react'
import Envelope from './Envelope'
import { porchfestUrl, rsvpUrl, tagline, whatIsPorchfest } from './content'
import { useEnvelope } from './useEnvelope'

// A burst of notes out of the card as it lands. Fixed rather than random so a
// reload looks the same, and so nothing differs between renders.
const NOTES = [
  { glyph: '♪', left: '12%', dx: '-3rem', rot: '-25deg', delay: '0ms', color: 'text-rose' },
  { glyph: '♫', left: '28%', dx: '-1rem', rot: '15deg', delay: '180ms', color: 'text-mustard' },
  { glyph: '♪', left: '45%', dx: '1.5rem', rot: '-10deg', delay: '60ms', color: 'text-leaf' },
  { glyph: '♫', left: '62%', dx: '-1.5rem', rot: '20deg', delay: '260ms', color: 'text-rose' },
  { glyph: '♪', left: '78%', dx: '2rem', rot: '30deg', delay: '120ms', color: 'text-mustard' },
  { glyph: '♫', left: '90%', dx: '3rem', rot: '-20deg', delay: '340ms', color: 'text-leaf' },
]

// One almond-shaped leaf, pointing up from the origin.
const LEAF = 'M0 0 C-6 -6 -6 -16 0 -22 C6 -16 6 -6 0 0 Z'

// The olive sprigs in the invite's bottom corners.
const Sprig: React.FC<{ flip?: boolean }> = ({ flip }) => (
  <svg
    viewBox="0 0 48 64"
    className={`h-14 w-11 shrink-0 fill-leaf ${flip ? '-scale-x-100' : ''}`}
    aria-hidden="true"
  >
    <path d="M6 62 Q16 40 38 8" stroke="#3d5a2e" strokeWidth="2.5" fill="none" />
    <path d={LEAF} transform="translate(12 48) rotate(-70)" />
    <path d={LEAF} transform="translate(14 44) rotate(15)" />
    <path d={LEAF} transform="translate(21 32) rotate(-60)" />
    <path d={LEAF} transform="translate(23 29) rotate(25)" />
    <path d={LEAF} transform="translate(31 18) rotate(-50)" />
    <path d={LEAF} transform="translate(33 16) rotate(35)" />
    <path d={LEAF} transform="translate(38 8) rotate(-10) scale(0.8)" />
  </svg>
)

const Heart: React.FC = () => (
  <svg viewBox="0 0 24 24" className="inline size-4 fill-rose" aria-hidden="true">
    <path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.1 0 3.9 1.3 5.3 3 1.4-1.7 3.2-3 5.3-3 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21z" />
  </svg>
)

const Page: React.FC = () => {
  const { phase, open, still } = useEnvelope()
  const revealed = phase === 'revealed'
  const stage = useRef<HTMLElement>(null)

  // The stage and the open card are sized from the screen height, measured once
  // rather than read live from a viewport unit. Mobile Safari changes the
  // viewport height as its toolbar collapses and expands while scrolling, which
  // made the card jump between sizes. Re-measured only when the width changes,
  // which is what a rotation does and a toolbar does not.
  useEffect(() => {
    let width = 0
    const measure = () => {
      if (window.innerWidth === width) return
      width = window.innerWidth
      stage.current?.style.setProperty('--screen-h', `${window.innerHeight}px`)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  return (
    <div className="min-h-svh overflow-x-clip font-body text-ink">
      <h1 className="sr-only">Oakhurst Porchfest Pregame Brunch with the Wearn Family</h1>

      <section
        ref={stage}
        className="stage relative flex items-center justify-center"
        data-revealed={revealed || undefined}
      >
        <div
          className="absolute inset-x-0 top-[max(3rem,10svh)] text-center transition-opacity duration-500"
          style={{ opacity: phase === 'closed' ? 1 : 0 }}
          aria-hidden="true"
        >
          <p className="font-script text-5xl leading-none sm:text-6xl">Oakhurst PorchFest</p>
          <p className="mt-3 font-hand text-lg tracking-[0.2em] text-leaf uppercase">
            Pregame Brunch · Sat, Oct 10
          </p>
        </div>

        <Envelope phase={phase} onOpen={open} />

        {revealed && !still && (
          <div className="pointer-events-none absolute inset-x-0 top-1/2" aria-hidden="true">
            {NOTES.map((note) => (
              <span
                key={note.left}
                className={`note absolute font-hand text-4xl ${note.color}`}
                style={
                  {
                    left: note.left,
                    '--dx': note.dx,
                    '--rot': note.rot,
                    '--delay': note.delay,
                  } as React.CSSProperties
                }
              >
                {note.glyph}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* Not rendered as space until the reveal, so there is nothing to scroll to
          while the envelope is still closed. */}
      <main
        hidden={!revealed}
        className="fade-in mx-auto flex max-w-xl flex-col items-center gap-12 px-6 pb-16"
      >
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          <a
            href={rsvpUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-rose px-10 py-3 text-center font-hand text-2xl text-paper shadow-md shadow-rose/30 transition hover:-translate-y-0.5 hover:bg-[#d13453] focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-rose"
          >
            RSVP
          </a>
          <a
            href={porchfestUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border-2 border-ink px-8 py-3 text-center font-hand text-xl transition hover:-translate-y-0.5 hover:bg-ink hover:text-paper focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            Oakhurst Porchfest website
          </a>
        </div>

        <section aria-labelledby="what-is" className="w-full">
          <h2 id="what-is" className="font-hand text-2xl tracking-wide text-rose uppercase">
            What is Porchfest?
          </h2>
          <p className="mt-2 text-lg leading-relaxed">{whatIsPorchfest}</p>
        </section>

        <footer className="flex w-full items-end justify-between gap-2">
          <Sprig />
          <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 pb-1 font-hand text-sm tracking-[0.15em] uppercase sm:text-base">
            {tagline.map((word, i) => (
              <React.Fragment key={word}>
                {i > 0 && <Heart />}
                <span>{word}</span>
              </React.Fragment>
            ))}
          </p>
          <Sprig flip />
        </footer>
      </main>
    </div>
  )
}

export default Page
