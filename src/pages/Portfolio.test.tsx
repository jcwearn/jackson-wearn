import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { caseStudyFor } from '../content/case-studies'
import { categories, projects } from '../content/projects'
import Portfolio from './Portfolio'

// Cards link to their case study, so this page now needs a router around it.
const renderPortfolio = () =>
  render(
    <MemoryRouter>
      <Portfolio />
    </MemoryRouter>,
  )

describe('Portfolio', () => {
  it('renders one card per project', () => {
    renderPortfolio()

    expect(screen.getAllByRole('article')).toHaveLength(projects.length)
    for (const project of projects) {
      expect(screen.getByText(project.name)).toBeInTheDocument()
    }
  })

  it('gives every public card a source link that opens safely', () => {
    renderPortfolio()

    const linked = projects.filter((project) => project.source !== undefined)
    const links = screen.getAllByRole('link', { name: 'Source' })
    expect(links).toHaveLength(linked.length)
    for (const link of links) {
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'))
    }
  })

  // The failure this catches is a private repo linked as if it were public: it
  // answers 200 to me and 404 to every visitor, so it reads as correct in review.
  it('shows a chip instead of a link for projects with no public source', () => {
    renderPortfolio()

    for (const project of projects.filter((p) => p.source === undefined)) {
      const card = screen.getByText(project.name).closest('article')!
      expect(within(card).getByText('Private repo')).toBeInTheDocument()
      expect(within(card).queryByRole('link', { name: 'Source' })).toBeNull()
    }
  })

  it('links each card that has a case study to its page', () => {
    renderPortfolio()

    for (const project of projects) {
      const card = screen.getByText(project.name).closest('article')!
      const link = within(card).queryByRole('link', { name: /case study/i })

      if (caseStudyFor(project.slug)) {
        expect(link).toHaveAttribute('href', `/portfolio/${project.slug}`)
      } else {
        expect(link).toBeNull()
      }
    }
  })

  it('renders every tag', () => {
    renderPortfolio()

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
    renderPortfolio()

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

describe('Portfolio grouping', () => {
  it('renders every category with its heading and description', () => {
    renderPortfolio()

    for (const category of categories) {
      expect(screen.getByRole('heading', { name: category.label })).toBeInTheDocument()
      expect(screen.getByText(category.blurb)).toBeInTheDocument()
    }
  })

  // The failure worth catching: a filter predicate that puts every project in
  // the first group. Every card still renders and every heading still appears,
  // so the page looks right and only the grouping is wrong.
  it('puts each project inside its own category section', () => {
    renderPortfolio()

    for (const category of categories) {
      const section = screen.getByRole('heading', { name: category.label }).closest('section')!
      const expected = projects.filter((p) => p.category === category.id)

      expect(within(section).getAllByRole('article')).toHaveLength(expected.length)
      for (const project of expected) {
        expect(within(section).getByText(project.name)).toBeInTheDocument()
      }
    }
  })

  // This sentence was true while the mirrors were being set up and quietly
  // stopped being true once they were. Asserting its absence is cheap.
  it('no longer promises more projects are coming', () => {
    const { container } = renderPortfolio()

    expect(container.textContent).not.toMatch(/public snapshots go up/i)
  })
})
