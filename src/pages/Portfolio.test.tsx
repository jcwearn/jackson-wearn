import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { projects } from '../content/projects'
import Portfolio from './Portfolio'

describe('Portfolio', () => {
  it('renders one card per project', () => {
    render(<Portfolio />)

    expect(screen.getAllByRole('article')).toHaveLength(projects.length)
    for (const project of projects) {
      expect(screen.getByText(project.name)).toBeInTheDocument()
    }
  })

  it('gives every card a source link that opens safely', () => {
    render(<Portfolio />)

    const links = screen.getAllByRole('link', { name: 'Source' })
    expect(links).toHaveLength(projects.length)
    for (const link of links) {
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'))
    }
  })

  it('renders every tag', () => {
    render(<Portfolio />)

    for (const project of projects) {
      const card = screen.getByText(project.name).closest('article')!
      for (const tag of project.tags) {
        expect(within(card).getByText(tag)).toBeInTheDocument()
      }
    }
  })

  // Several projects are infrastructure with nowhere to visit, so the title is
  // only a link when there is a live site.
  it('links the title only when the project has a live url', () => {
    render(<Portfolio />)

    for (const project of projects) {
      const heading = screen.getByText(project.name)
      if (project.url) {
        expect(heading.closest('a')).toHaveAttribute('href', project.url)
      } else {
        expect(heading.closest('a')).toBeNull()
      }
    }
  })
})
