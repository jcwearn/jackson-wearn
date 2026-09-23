import React, { useEffect, useRef, useState } from 'react'
import { invite } from './content'
import type { Phase } from './useEnvelope'

const EASE = 'cubic-bezier(0.4, 0, 0.2, 1)'

// Ported from the wedding invite (anupamaandjackson, src/routes/Invite.tsx), cut
// down to one card and recoloured from the invite: the owl's dark green outside,
// mustard inside, and a rose heart seal where the flap meets.
const Envelope: React.FC<{ phase: Phase; onOpen: () => void }> = ({ phase, onOpen }) => {
  const image = useRef<HTMLImageElement>(null)
  const [ready, setReady] = useState(false)
  const [slow, setSlow] = useState(false)

  // Opening onto a half-loaded card would spoil the reveal, so the button waits
  // for the image. A cached image can finish before React attaches onLoad.
  useEffect(() => {
    if (image.current?.complete && image.current.naturalWidth > 0) setReady(true)
    const timer = window.setTimeout(() => setSlow(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const revealed = phase === 'revealed'
  const flapOpen = phase !== 'closed'
  const rising = phase === 'rising' || phase === 'rotating'
  const upright = phase === 'rotating' || revealed
  const hidden = upright

  const envelopeTransform = revealed
    ? 'translateY(0) scale(1)'
    : rising
      ? 'translateY(100%) scale(1.2)'
      : flapOpen
        ? 'scale(1.05)'
        : 'scale(1)'

  const fade = { opacity: hidden ? 0 : 1, transition: 'opacity 700ms ease-out' }

  return (
    <div className="envelope relative">
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <clipPath id="lid-shape" clipPathUnits="objectBoundingBox">
            <path d="M 0 0 L 0.48 0.94 Q 0.5 0.98, 0.52 0.94 L 1 0 Z" />
          </clipPath>
          <clipPath id="envelope-cutout" clipPathUnits="objectBoundingBox">
            <path d="M 0 0 L 0 1 L 1 1 L 1 0 L 0.97 0 L 0.52 0.48 Q 0.5 0.52, 0.48 0.48 L 0.03 0 Z" />
          </clipPath>
        </defs>
      </svg>

      <div
        className="relative w-full"
        style={{
          aspectRatio: '4/3',
          zIndex: rising ? 4 : 20,
          transform: envelopeTransform,
          transition: `transform 900ms ${EASE}`,
        }}
      >
        {/* Inside of the envelope */}
        <div
          className="absolute inset-0 rounded-b-lg bg-gradient-to-b from-[#e8bd3f] to-[#d6a21f]"
          style={{ zIndex: 1, ...fade }}
        />

        {/* Back half of the flap, which swings up behind the card */}
        <div
          className="absolute top-0 -right-px -left-px"
          style={{
            transformOrigin: 'top center',
            transform: flapOpen ? 'rotateX(180deg)' : 'rotateX(90deg)',
            transition: 'transform 350ms ease-out 350ms, opacity 700ms ease-out',
            zIndex: 3,
            opacity: hidden ? 0 : 1,
          }}
        >
          <div
            className="w-full bg-gradient-to-b from-[#e8bd3f] to-[#d6a21f]"
            style={{ clipPath: 'url(#lid-shape)', aspectRatio: '1.9/1' }}
          />
        </div>

        {/* Front of the envelope, with the V cut out so the flap sits in it */}
        <div
          className="absolute inset-0 overflow-hidden rounded-b-lg bg-gradient-to-b from-[#2c3f29] to-[#1f2d1d] shadow-xl"
          style={{ zIndex: 10, clipPath: 'url(#envelope-cutout)', ...fade }}
        >
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent" />
          <p className="absolute inset-x-0 bottom-[9%] text-center font-script text-3xl text-mustard sm:text-4xl">
            You're invited!
          </p>
        </div>

        {/* The card: rises out sideways, turns upright, then settles and grows */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            zIndex: revealed ? 30 : 5,
            transform: rising ? 'translateY(-95%)' : 'translateY(0)',
            transition: `transform 900ms ${EASE}`,
          }}
        >
          <div
            style={{
              transform: upright ? 'rotate(0deg)' : 'rotate(-90deg)',
              transition: 'transform 800ms ease-out',
            }}
          >
            <img
              ref={image}
              src={invite.src}
              alt={invite.alt}
              width={1024}
              height={1536}
              onLoad={() => setReady(true)}
              className="card block h-auto max-w-none rounded-lg"
              style={{
                boxShadow: upright
                  ? '0 20px 35px -5px rgb(0 0 0 / 0.18), 0 10px 15px -6px rgb(0 0 0 / 0.12)'
                  : 'none',
                transition: `width 900ms ${EASE}, box-shadow 800ms ease-out`,
              }}
            />
          </div>
        </div>

        {/* Front half of the flap, with the seal on its point */}
        <div
          className="absolute top-0 -right-px -left-px"
          style={{
            transformOrigin: 'top center',
            transform: flapOpen ? 'rotateX(90deg)' : 'rotateX(0deg)',
            transition: 'transform 350ms ease-out, opacity 700ms ease-out',
            zIndex: flapOpen ? 5 : 15,
            opacity: hidden ? 0 : 1,
          }}
        >
          <div
            className="w-full bg-gradient-to-b from-[#3a5236] to-[#2c3f29] shadow-md"
            style={{ clipPath: 'url(#lid-shape)', aspectRatio: '1.9/1' }}
          />
          <span
            className="absolute top-[88%] left-1/2 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-rose shadow-md ring-4 ring-paper/25 sm:size-14"
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24" className="size-6 fill-paper sm:size-7">
              <path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.1 0 3.9 1.3 5.3 3 1.4-1.7 3.2-3 5.3-3 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21z" />
            </svg>
          </span>
        </div>
      </div>

      {phase === 'closed' && (
        <button
          type="button"
          onClick={onOpen}
          disabled={!ready}
          aria-busy={!ready}
          className="absolute inset-0 z-50 flex cursor-pointer items-end justify-center disabled:cursor-default"
        >
          <span className="nudge translate-y-16 rounded-full bg-ink px-6 py-3 font-hand text-xl text-paper shadow-lg">
            {ready || !slow ? 'Tap to open' : 'Loading invitation…'}
          </span>
        </button>
      )}
    </div>
  )
}

export default Envelope
