import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { resume } from '../content/resume'
import Resume from './Resume'

describe('Resume', () => {
  it('offers the PDF as a download', () => {
    render(<Resume />)

    const link = screen.getByRole('link', { name: /download pdf/i })
    expect(link).toHaveAttribute('href', '/resume.pdf')
    expect(link).toHaveAttribute('download')
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

  it('renders contact details as usable links', () => {
    render(<Resume />)

    expect(screen.getByRole('link', { name: resume.profile.email })).toHaveAttribute(
      'href',
      `mailto:${resume.profile.email}`,
    )
    for (const link of resume.profile.link_lines.flat()) {
      expect(screen.getByRole('link', { name: link.label })).toHaveAttribute('href', link.url)
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
