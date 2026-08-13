import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import App from './App'

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )

describe('routing', () => {
  it('renders the bio at /', () => {
    renderAt('/')

    expect(screen.getByText(/seasoned software engineer/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /contact me/i })).toBeInTheDocument()
  })

  it('renders the portfolio at /portfolio', () => {
    renderAt('/portfolio')

    expect(screen.getByRole('heading', { name: 'Portfolio', level: 2 })).toBeInTheDocument()
    expect(screen.queryByText(/seasoned software engineer/i)).not.toBeInTheDocument()
  })

  it('renders the resume at /resume', () => {
    renderAt('/resume')

    expect(screen.getByRole('heading', { name: 'Resume', level: 2 })).toBeInTheDocument()
  })

  it('renders NotFound for an unknown path', () => {
    renderAt('/no-such-page')

    expect(screen.getByRole('heading', { name: /page not found/i })).toBeInTheDocument()
  })

  // The layout is a pathless parent route, so a mistake there silently drops
  // the header and footer from every page.
  it('keeps the shared chrome on every route', () => {
    for (const path of ['/', '/portfolio', '/resume', '/nope']) {
      const { unmount } = renderAt(path)
      expect(screen.getByRole('heading', { name: 'Jackson Wearn', level: 1 })).toBeInTheDocument()
      expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument()
      expect(screen.getByRole('contentinfo')).toBeInTheDocument()
      unmount()
    }
  })
})

describe('nav', () => {
  it('links to all three pages', () => {
    renderAt('/')

    const nav = screen.getByRole('navigation', { name: 'Main' })
    const hrefs = [...nav.querySelectorAll('a')].map((a) => a.getAttribute('href'))
    expect(hrefs).toEqual(['/', '/portfolio', '/resume'])
  })

  it('marks the current page, and only the current page', () => {
    renderAt('/portfolio')

    const nav = screen.getByRole('navigation', { name: 'Main' })
    const current = [...nav.querySelectorAll('a[aria-current="page"]')].map((a) => a.textContent)
    expect(current).toEqual(['Portfolio'])
  })

  // Guards the behaviour, not the `end` prop: react-router 8 exact-matches
  // to="/" on its own, so removing `end` does not currently break this. It
  // would start mattering if a route were nested under "/".
  it('does not mark Home as current on other pages', () => {
    renderAt('/resume')

    const home = screen.getByRole('link', { name: 'Home' })
    expect(home).not.toHaveAttribute('aria-current')
  })
})
