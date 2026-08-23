import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import type { Diagram } from '../content/diagram'
import Topology from './Topology'

const plain: Diagram = {
  label: 'A sends to B, which sends to C.',
  cols: 2,
  rows: 2,
  nodes: [
    { id: 'a', col: 0, row: 0, label: 'Alpha', sub: ['first line', 'second line'] },
    { id: 'b', col: 1, row: 0, label: 'Beta' },
    { id: 'c', col: 0, row: 1, label: 'Gamma', accent: true },
  ],
  edges: [
    { from: 'a', to: 'b', label: 'across' },
    { from: 'a', to: 'c', label: 'down' },
    { from: 'b', to: 'c', label: 'elbow', kind: 'dashed' },
  ],
}

const renderIn = (diagram: Diagram) =>
  render(
    <MemoryRouter>
      <Topology diagram={diagram} />
    </MemoryRouter>,
  )

describe('Topology', () => {
  it('describes the whole diagram to a screen reader', () => {
    renderIn(plain)

    expect(screen.getByRole('img', { name: plain.label })).toBeInTheDocument()
  })

  it('renders every node label and sub line', () => {
    renderIn(plain)

    expect(screen.getByText('Alpha')).toBeInTheDocument()
    expect(screen.getByText('Beta')).toBeInTheDocument()
    expect(screen.getByText('Gamma')).toBeInTheDocument()
    expect(screen.getByText('first line')).toBeInTheDocument()
    expect(screen.getByText('second line')).toBeInTheDocument()
  })

  it('labels every edge', () => {
    renderIn(plain)

    for (const edge of plain.edges) {
      expect(screen.getByText(edge.label!)).toBeInTheDocument()
    }
  })

  it('draws one path per edge', () => {
    const { container } = renderIn(plain)

    // The arrowhead marker also contains a path, hence the marker exclusion.
    const paths = [...container.querySelectorAll('path')].filter(
      (path) => path.closest('marker') === null,
    )
    expect(paths).toHaveLength(plain.edges.length)
  })

  it('links the nodes that have an href', () => {
    renderIn({
      ...plain,
      nodes: plain.nodes.map((node) =>
        node.id === 'c' ? { ...node, href: '/portfolio/gamma' } : node,
      ),
    })

    expect(screen.getByRole('link', { name: 'Gamma' })).toHaveAttribute('href', '/portfolio/gamma')
    expect(screen.queryByRole('link', { name: 'Alpha' })).toBeNull()
  })

  // role="img" makes everything inside it presentational, which would hide the
  // links on the system map from exactly the people who need them announced.
  it('stops being an image once any node is a link', () => {
    renderIn({
      ...plain,
      nodes: plain.nodes.map((node) =>
        node.id === 'c' ? { ...node, href: '/portfolio/gamma' } : node,
      ),
    })

    expect(screen.queryByRole('img')).toBeNull()
    expect(screen.getByRole('group', { name: plain.label })).toBeInTheDocument()
  })

  // The content tests assert edges reference real nodes. If one ever slips
  // through, it should cost that arrow rather than the whole page.
  it('skips an edge pointing at a node that does not exist', () => {
    const { container } = renderIn({
      ...plain,
      edges: [...plain.edges, { from: 'a', to: 'nowhere', label: 'ghost' }],
    })

    expect(screen.queryByText('ghost')).toBeNull()
    expect(container.querySelector('svg')).toBeInTheDocument()
  })
})
