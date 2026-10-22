import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { describe, expect, it } from 'vitest'
import { caseStudies, caseStudyFor } from '../content/case-studies'
import { projects } from '../content/projects'
import CaseStudy from './CaseStudy'

const renderAt = (slug: string) =>
  render(
    <MemoryRouter initialEntries={[`/portfolio/${slug}`]}>
      <Routes>
        <Route path="/portfolio/:slug" element={<CaseStudy />} />
      </Routes>
    </MemoryRouter>,
  )

// Derived from the content rather than hard-coded, so this keeps testing the
// real tour as writeups are added instead of pinning today's single entry.
const tour = projects.filter((project) => caseStudyFor(project.slug))

describe('CaseStudy', () => {
  it.each(caseStudies.map((s) => [s.slug, s] as const))('%s renders its thesis', (slug, study) => {
    renderAt(slug)

    const project = projects.find((candidate) => candidate.slug === slug)!
    expect(screen.getByRole('heading', { name: project.name, level: 2 })).toBeInTheDocument()
    expect(screen.getByText(study.thesis.replace(/[`*]/g, ''))).toBeInTheDocument()
  })

  it.each(caseStudies.map((s) => [s.slug, s] as const))(
    '%s renders every section',
    (slug, study) => {
      renderAt(slug)

      for (const section of study.sections) {
        if (section.kind !== 'callout' && section.heading) {
          expect(
            screen.getByRole('heading', { name: section.heading, level: 3 }),
          ).toBeInTheDocument()
        }
      }
    },
  )

  it.each(caseStudies.map((s) => [s.slug, s] as const))('%s offers a way back', (slug) => {
    renderAt(slug)

    expect(screen.getByRole('link', { name: /portfolio/i })).toHaveAttribute('href', '/portfolio')
  })

  it.each(tour.map((p, i) => [p.slug, i] as const))('%s links to its neighbours', (slug, i) => {
    renderAt(slug)

    const previous = tour[i - 1]
    const next = tour[i + 1]

    if (previous) {
      expect(screen.getByRole('link', { name: new RegExp(previous.name, 'i') })).toHaveAttribute(
        'href',
        `/portfolio/${previous.slug}`,
      )
    }
    if (next) {
      expect(screen.getByRole('link', { name: new RegExp(next.name, 'i') })).toHaveAttribute(
        'href',
        `/portfolio/${next.slug}`,
      )
    }
    if (!previous && !next) {
      expect(screen.queryByRole('navigation', { name: /more case studies/i })).toBeNull()
    }
  })

  it('renders a private chip rather than a dead source link', () => {
    for (const study of caseStudies) {
      const project = projects.find((candidate) => candidate.slug === study.slug)!
      const { unmount } = renderAt(study.slug)

      if (project.source === undefined) {
        expect(screen.getByText('Private repo')).toBeInTheDocument()
      } else {
        expect(screen.getByRole('link', { name: 'Source' })).toHaveAttribute('href', project.source)
      }
      unmount()
    }
  })

  // <RichText> understands `code` and **bold** and nothing else, so a typo does
  // not throw -- it renders the punctuation onto the page. Nesting the two is
  // the easy mistake: `**\`x\`**` renders bold with the backticks still showing.
  it.each(caseStudies.map((s) => [s.slug, s] as const))('%s leaves no raw markup', (slug) => {
    const { container } = renderAt(slug)
    const text = container.textContent ?? ''

    // Any asterisk at all: single-asterisk emphasis is the habit that keeps
    // producing these, and RichText does not implement it.
    expect(text, 'an unrendered asterisk').not.toMatch(/\*/)
    expect(text, 'an unrendered backtick').not.toContain('`')
  })

  // Pages serves index.html for anything unmatched, so a mistyped slug reaches
  // this component rather than the server's 404.
  it('renders NotFound for a slug with no case study', () => {
    renderAt('no-such-project')

    expect(screen.getByRole('heading', { name: /page not found/i })).toBeInTheDocument()
  })

  // A project can exist without a writeup -- that is the normal state for most
  // of them, and it must not render a page with a name and nothing under it.
  it('renders NotFound for a real project that has no case study', () => {
    const bare = projects.find((project) => !caseStudyFor(project.slug))
    if (!bare) return

    renderAt(bare.slug)
    expect(screen.getByRole('heading', { name: /page not found/i })).toBeInTheDocument()
  })
})
