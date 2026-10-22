import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { caseStudyFor } from '../content/case-studies'
import { systemDiagram } from '../content/system'
import SystemMap from './SystemMap'

const renderMap = () =>
  render(
    <MemoryRouter>
      <SystemMap />
    </MemoryRouter>,
  )

describe('SystemMap', () => {
  it('renders the map and its description', () => {
    renderMap()

    expect(screen.getByRole('heading', { name: /how it fits together/i })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: systemDiagram.label })).toBeInTheDocument()
  })

  it('renders every box on the map', () => {
    renderMap()

    for (const node of systemDiagram.nodes) {
      expect(screen.getByText(node.label)).toBeInTheDocument()
    }
  })

  // The whole point of keeping node ids equal to project slugs: a box becomes a
  // link the moment its writeup lands, with no edit here or in system.ts.
  it('links a box exactly when its project has a case study', () => {
    renderMap()

    for (const node of systemDiagram.nodes) {
      const link = screen.queryByRole('link', { name: node.label })

      if (caseStudyFor(node.id)) {
        expect(link, `${node.id} has a case study and should link`).toHaveAttribute(
          'href',
          `/portfolio/${node.id}`,
        )
      } else {
        expect(link, `${node.id} has no case study and should not link`).toBeNull()
      }
    }
  })

  it('offers a way back to the portfolio', () => {
    renderMap()

    expect(screen.getByRole('link', { name: /portfolio/i })).toHaveAttribute('href', '/portfolio')
  })
})
