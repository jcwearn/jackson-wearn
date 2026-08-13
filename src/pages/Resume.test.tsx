import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Resume from './Resume'

describe('Resume', () => {
  it('offers a download link outside the viewer', () => {
    render(<Resume />)

    const link = screen.getByRole('link', { name: /download pdf/i })
    expect(link).toHaveAttribute('href', '/resume.pdf')
    expect(link).toHaveAttribute('download')
  })

  // jsdom does not render PDFs, so this checks the element contract rather
  // than the rendering: <object> is the only one of object/iframe/embed that
  // shows fallback children when the browser cannot display the file.
  it('embeds the PDF with fallback content for browsers that cannot show it', () => {
    const { container } = render(<Resume />)

    const object = container.querySelector('object')
    expect(object).not.toBeNull()
    expect(object).toHaveAttribute('data', '/resume.pdf')
    expect(object).toHaveAttribute('type', 'application/pdf')
    expect(object!.textContent).toMatch(/download it instead/i)
  })

  it('always reaches the PDF, even if the viewer shows nothing', () => {
    render(<Resume />)

    const hrefs = screen
      .getAllByRole('link')
      .map((a) => a.getAttribute('href'))
      .filter((h) => h === '/resume.pdf')
    expect(hrefs.length).toBeGreaterThan(0)
  })
})
