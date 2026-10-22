import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import RichText from './RichText'

describe('RichText', () => {
  it('leaves plain text alone', () => {
    const { container } = render(<RichText>Nothing special here.</RichText>)

    expect(container.textContent).toBe('Nothing special here.')
    expect(container.querySelector('code')).toBeNull()
    expect(container.querySelector('strong')).toBeNull()
  })

  it('renders backticks as code', () => {
    render(<RichText>{'Flux decrypts `secrets.sops.yaml` during reconciliation.'}</RichText>)

    const code = screen.getByText('secrets.sops.yaml')
    expect(code.tagName).toBe('CODE')
  })

  it('renders double asterisks as strong', () => {
    render(<RichText>{'Owned by **this repo**, and nothing else.'}</RichText>)

    const strong = screen.getByText('this repo')
    expect(strong.tagName).toBe('STRONG')
  })

  it('handles both in one string without eating the text between them', () => {
    const { container } = render(<RichText>{'**Never** copy a `.sops.yaml` file.'}</RichText>)

    expect(container.textContent).toBe('Never copy a .sops.yaml file.')
    expect(container.querySelector('strong')).toHaveTextContent('Never')
    expect(container.querySelector('code')).toHaveTextContent('.sops.yaml')
  })

  // An unmatched marker is a content typo, not a crash. It should render as the
  // punctuation it is, so the mistake is visible on the page.
  it('leaves an unclosed marker as literal text', () => {
    const { container } = render(<RichText>{'A stray ` backtick and ** asterisks'}</RichText>)

    expect(container.textContent).toBe('A stray ` backtick and ** asterisks')
    expect(container.querySelector('code')).toBeNull()
  })
})
