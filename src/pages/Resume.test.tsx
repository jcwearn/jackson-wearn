import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { resume } from '../content/resume'
import Resume from './Resume'

describe('Resume', () => {
  it('opens the PDF in a new tab rather than forcing a download', () => {
    render(<Resume />)

    const link = screen.getByRole('link', { name: /view pdf/i })
    expect(link).toHaveAttribute('href', '/resume.pdf')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'))
    // `download` saves the file with no prompt and no chance to look first.
    expect(link).not.toHaveAttribute('download')
  })

  // The whole point of rendering from JSON: the text is really in the page,
  // not locked inside a plugin.
  //
  // Counted rather than fetched singly, because two roles share an employer --
  // CNN appears twice, for the Elections and Lego teams -- and each should get
  // its own heading.
  it('renders every role with its dates', () => {
    render(<Resume />)

    for (const role of resume.experience) {
      const expected = resume.experience.filter((r) => r.company === role.company).length
      expect(screen.getAllByRole('heading', { name: role.company })).toHaveLength(expected)
      expect(screen.getAllByText(role.dates).length).toBeGreaterThan(0)
    }
  })

  it('renders every bullet from every role', () => {
    render(<Resume />)

    const bullets = resume.experience.flatMap((r) => r.bullets)
    expect(bullets.length).toBeGreaterThan(0)
    for (const bullet of bullets) {
      expect(screen.getByText(bullet.text)).toBeInTheDocument()
    }
  })

  it('renders the summary, skills and education', () => {
    render(<Resume />)

    expect(screen.getByText(resume.profile.summary)).toBeInTheDocument()
    for (const group of resume.skills.groups) {
      expect(screen.getByText(group.label)).toBeInTheDocument()
      expect(screen.getByText(group.text)).toBeInTheDocument()
    }
    for (const entry of resume.education.entries) {
      expect(screen.getByText(entry.degree)).toBeInTheDocument()
    }
  })

  // The PDF's contact header is not repeated on this page: the footer carries
  // the social links site-wide and the contact form lives on the home page.
  // Asserted rather than assumed, because resume.json still contains all of it
  // and rendering it back is a one-line change.
  it('does not repeat the contact header', () => {
    const { container } = render(<Resume />)

    expect(container.textContent).not.toContain(resume.profile.email)
    expect(container.querySelector('a[href^="mailto:"]')).toBeNull()
    // Not asserting profile.location is absent: roles carry their own
    // location, and "Atlanta, GA" is legitimately all over the page.
    for (const link of resume.profile.link_lines.flat()) {
      expect(screen.queryByRole('link', { name: link.label })).toBeNull()
    }
  })

  // The embedded viewer is what this page replaced.
  it('does not embed a PDF viewer', () => {
    const { container } = render(<Resume />)

    expect(container.querySelector('object')).toBeNull()
    expect(container.querySelector('iframe')).toBeNull()
    expect(container.querySelector('embed')).toBeNull()
  })
})
