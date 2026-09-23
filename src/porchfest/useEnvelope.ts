import { useCallback, useEffect, useRef, useState } from 'react'

// The same four steps and timings as the wedding invite's envelope: the flap
// opens, the card rises out as the envelope drops away, the card turns upright,
// and then it settles and grows to fill the column.
export type Phase = 'closed' | 'flap-opening' | 'rising' | 'rotating' | 'revealed'

const STEPS: [Phase, number][] = [
  ['rising', 700],
  ['rotating', 1500],
  ['revealed', 2500],
]

const prefersReducedMotion = () =>
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function useEnvelope() {
  // Reduced motion skips the envelope entirely rather than playing it fast.
  const [still] = useState(prefersReducedMotion)
  const [phase, setPhase] = useState<Phase>(still ? 'revealed' : 'closed')
  const timers = useRef<number[]>([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const open = useCallback(() => {
    if (phase !== 'closed') return
    setPhase('flap-opening')
    timers.current = STEPS.map(([next, at]) => window.setTimeout(() => setPhase(next), at))
  }, [phase])

  return { phase, open, still }
}
