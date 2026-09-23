import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { porchfestUrl, rsvpUrl, whatIsPorchfest } from './content'
import Page from './Page'

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

const invite = () => screen.getByRole('img', { name: /pregame brunch/i })

// Render and play the envelope through to the reveal.
const renderOpened = () => {
  vi.useFakeTimers()
  render(<Page />)
  fireEvent.load(invite())
  fireEvent.click(screen.getByRole('button', { name: /tap to open/i }))
  act(() => vi.advanceTimersByTime(2500))
}

describe('the porchfest page', () => {
  it('links to the RSVP form and the Porchfest site, both in a new tab', () => {
    renderOpened()

    const rsvp = screen.getByRole('link', { name: 'RSVP' })
    const site = screen.getByRole('link', { name: /porchfest website/i })
    expect(rsvp).toHaveAttribute('href', rsvpUrl)
    expect(site).toHaveAttribute('href', porchfestUrl)
    for (const link of [rsvp, site]) {
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'))
    }
  })

  it('says what Porchfest is', () => {
    renderOpened()

    expect(screen.getByRole('heading', { name: 'What is Porchfest?' })).toBeInTheDocument()
    expect(screen.getByText(whatIsPorchfest)).toBeInTheDocument()
  })

  // The invite image is the only place these appear, so the alt text is what a
  // screen reader gets instead.
  it('describes the invite in its alt text', () => {
    render(<Page />)

    expect(invite()).toHaveAccessibleName(expect.stringMatching(/October 10 at 10 AM/))
    expect(invite()).toHaveAccessibleName(expect.stringMatching(/44 Spence Ave SE/))
  })

  it('waits for the invite to load before it can be opened', () => {
    render(<Page />)

    expect(screen.getByRole('button', { name: /tap to open/i })).toBeDisabled()
    fireEvent.load(invite())
    expect(screen.getByRole('button', { name: /tap to open/i })).toBeEnabled()
  })

  // Hidden rather than just transparent, so a closed envelope leaves nothing
  // below it to scroll to.
  it('keeps everything below the envelope hidden until it is opened', () => {
    vi.useFakeTimers()
    render(<Page />)
    expect(screen.queryByRole('link', { name: 'RSVP' })).not.toBeInTheDocument()

    fireEvent.load(invite())
    fireEvent.click(screen.getByRole('button', { name: /tap to open/i }))
    act(() => vi.advanceTimersByTime(2499))
    expect(screen.queryByRole('link', { name: 'RSVP' })).not.toBeInTheDocument()

    act(() => vi.advanceTimersByTime(1))
    expect(screen.getByRole('link', { name: 'RSVP' })).toBeVisible()
    expect(screen.queryByRole('button', { name: /tap to open/i })).not.toBeInTheDocument()
  })

  it('skips the envelope for reduced motion', () => {
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
    }))
    render(<Page />)

    expect(screen.queryByRole('button', { name: /tap to open/i })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'RSVP' })).toBeVisible()
  })
})
