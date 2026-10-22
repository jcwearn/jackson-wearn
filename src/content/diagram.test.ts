import { describe, expect, it } from 'vitest'
import { caseStudies } from './case-studies'
import { MAX_LABEL, MAX_SUB_LINE, type Diagram } from './diagram'
import { systemDiagram } from './system'

// Diagrams are laid out by hand on a grid and rendered without measuring
// anything, which is what keeps them authorable as data. The cost is that the
// renderer cannot notice a box placed off the grid, two boxes stacked on the
// same cell, or a label too long for its width -- SVG text does not wrap and
// does not clip, it just runs across whatever is beside it. These assert the
// things the renderer cannot.

const named: { name: string; diagram: Diagram }[] = [
  { name: 'system map', diagram: systemDiagram },
  ...caseStudies.flatMap((study) =>
    study.sections.flatMap((section) =>
      section.kind === 'topology'
        ? [{ name: `${study.slug}: ${section.heading ?? 'diagram'}`, diagram: section.diagram }]
        : [],
    ),
  ),
]

describe.each(named.map((d) => [d.name, d.diagram] as const))('%s', (_name, diagram) => {
  it('describes itself for anyone who cannot see it', () => {
    expect(diagram.label.trim()).not.toBe('')
  })

  it('has nodes and edges', () => {
    expect(diagram.nodes.length).toBeGreaterThan(0)
    expect(diagram.edges.length).toBeGreaterThan(0)
  })

  it('gives every node a unique id', () => {
    const ids = diagram.nodes.map((node) => node.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('keeps every node on the grid', () => {
    for (const node of diagram.nodes) {
      expect(node.col, `${node.id} col`).toBeGreaterThanOrEqual(0)
      expect(node.row, `${node.id} row`).toBeGreaterThanOrEqual(0)
      expect(node.row, `${node.id} overflows ${diagram.rows} rows`).toBeLessThan(diagram.rows)
      expect(
        node.col + (node.colSpan ?? 1),
        `${node.id} overflows ${diagram.cols} cols`,
      ).toBeLessThanOrEqual(diagram.cols)
    }
  })

  // Two boxes on one cell render exactly on top of each other, which reads as
  // one box with doubled text rather than as a mistake.
  it('never stacks two nodes on the same cell', () => {
    const taken = new Set<string>()
    for (const node of diagram.nodes) {
      for (let i = 0; i < (node.colSpan ?? 1); i++) {
        const cell = `${node.row}:${node.col + i}`
        expect(taken.has(cell), `${node.id} overlaps another node at ${cell}`).toBe(false)
        taken.add(cell)
      }
    }
  })

  it('routes every edge between nodes that exist', () => {
    const ids = new Set(diagram.nodes.map((node) => node.id))
    for (const edge of diagram.edges) {
      expect(ids.has(edge.from), `edge from unknown node "${edge.from}"`).toBe(true)
      expect(ids.has(edge.to), `edge to unknown node "${edge.to}"`).toBe(true)
      expect(edge.from, 'an edge points at itself').not.toBe(edge.to)
    }
  })

  it('keeps node text inside its box', () => {
    for (const node of diagram.nodes) {
      // A wide node has room for proportionally more, but the budget is written
      // against a single cell so that widening a box is never load-bearing.
      expect(node.label.length, `"${node.label}" is too long`).toBeLessThanOrEqual(MAX_LABEL)
      for (const line of node.sub ?? []) {
        expect(line.length, `"${line}" is too long`).toBeLessThanOrEqual(MAX_SUB_LINE)
      }
    }
  })
})
