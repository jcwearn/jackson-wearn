import React, { useId } from 'react'
import { Link } from 'react-router'
import type { Diagram, DiagramEdge, DiagramNode } from '../content/diagram'

// Renders a Diagram as SVG on a fixed grid.
//
// There is no layout engine and nothing is measured: a box lands where the
// author put it, and an edge is routed from the grid positions of its ends.
// That is the whole trick -- it keeps diagrams authorable as data without
// pulling in a graph library, at the cost of the author having to think about
// where things go, which they were going to do anyway.
//
// SVG text does not wrap. Node text is budgeted in characters and asserted in
// the content tests, so an over-long label fails CI rather than quietly running
// out of its box on a shared screen.

const CELL_W = 190
const CELL_H = 66
// Wide enough for a one-word edge label to sit in the gutter between two boxes
// without touching either. That is what sets it, not the look of the spacing.
const GAP_X = 66
const GAP_Y = 52
const PAD = 10

/** How far along an elbow's first leg its label sits. See the note in `route`. */
const LABEL_ALONG = 0.3

const trackX = CELL_W + GAP_X
const trackY = CELL_H + GAP_Y

const span = (node: DiagramNode) => node.colSpan ?? 1
const boxX = (node: DiagramNode) => PAD + node.col * trackX
const boxY = (node: DiagramNode) => PAD + node.row * trackY
const boxW = (node: DiagramNode) => span(node) * CELL_W + (span(node) - 1) * GAP_X
const midX = (node: DiagramNode) => boxX(node) + boxW(node) / 2
const midY = (node: DiagramNode) => boxY(node) + CELL_H / 2

/** Do two nodes share any column? Decides whether an edge can run straight down. */
function columnsOverlap(a: DiagramNode, b: DiagramNode) {
  return a.col < b.col + span(b) && b.col < a.col + span(a)
}

/** The horizontal centre of the columns two nodes have in common. */
function sharedX(a: DiagramNode, b: DiagramNode) {
  const first = Math.max(a.col, b.col)
  const width = Math.min(a.col + span(a), b.col + span(b)) - first
  return PAD + first * trackX + (width * CELL_W + (width - 1) * GAP_X) / 2
}

type Route = { d: string; labelX: number; labelY: number; anchor: 'start' | 'middle' }

function route(from: DiagramNode, to: DiagramNode, edge: DiagramEdge): Route {
  const down = to.row > from.row
  const right = midX(to) > midX(from)

  // Straight down or up: the common case, and the only one worth a plain line.
  if (columnsOverlap(from, to) && from.row !== to.row) {
    const x = sharedX(from, to)
    const y1 = down ? boxY(from) + CELL_H : boxY(from)
    const y2 = down ? boxY(to) : boxY(to) + CELL_H
    return {
      d: `M ${x} ${y1} V ${y2}`,
      labelX: x + 8,
      labelY: (y1 + y2) / 2,
      anchor: 'start',
    }
  }

  // Straight across.
  if (from.row === to.row) {
    const y = midY(from)
    const x1 = right ? boxX(from) + boxW(from) : boxX(from)
    const x2 = right ? boxX(to) : boxX(to) + boxW(to)
    return {
      d: `M ${x1} ${y} H ${x2}`,
      labelX: (x1 + x2) / 2,
      labelY: y - 8,
      anchor: 'middle',
    }
  }

  // An elbow. Left to itself it leaves along whichever axis it has further to
  // travel, which reads better than always turning the same way; `elbow` on the
  // edge overrides it for the cases where that guess looks wrong.
  const dx = Math.abs(midX(to) - midX(from))
  const dy = Math.abs(midY(to) - midY(from))
  const kind = edge.elbow ?? (dy >= dx ? 'vh' : 'hv')

  if (kind === 'vh') {
    const x = midX(from)
    const y1 = down ? boxY(from) + CELL_H : boxY(from)
    const y2 = midY(to)
    const x2 = right ? boxX(to) : boxX(to) + boxW(to)
    return {
      d: `M ${x} ${y1} V ${y2} H ${x2}`,
      labelX: x + 8,
      // Near the start rather than the middle. An elbow's corner is where it is
      // most likely to meet another run, and two labels landing on each other
      // is the failure that actually shows up.
      labelY: y1 + (y2 - y1) * LABEL_ALONG,
      anchor: 'start',
    }
  }

  const y = midY(from)
  const x1 = right ? boxX(from) + boxW(from) : boxX(from)
  const x2 = midX(to)
  const y2 = down ? boxY(to) : boxY(to) + CELL_H
  return {
    d: `M ${x1} ${y} H ${x2} V ${y2}`,
    labelX: x1 + (x2 - x1) * LABEL_ALONG,
    labelY: y - 8,
    anchor: 'middle',
  }
}

const NodeBox: React.FC<{ node: DiagramNode }> = ({ node }) => (
  <>
    <rect
      x={boxX(node)}
      y={boxY(node)}
      width={boxW(node)}
      height={CELL_H}
      rx={6}
      className={
        node.accent
          ? 'fill-blue-50 stroke-blue-400 dark:fill-blue-950 dark:stroke-blue-500'
          : 'fill-transparent stroke-gray-300 group-hover:stroke-blue-500 dark:stroke-gray-600'
      }
      strokeWidth={1.5}
    />
    <text
      x={boxX(node) + 14}
      y={boxY(node) + 26}
      className="fill-gray-900 text-[15px] font-semibold dark:fill-gray-100"
    >
      {node.label}
    </text>
    {node.sub?.map((line, i) => (
      <text
        key={line}
        x={boxX(node) + 14}
        y={boxY(node) + 43 + i * 14}
        className="fill-gray-500 text-[11.5px] dark:fill-gray-400"
      >
        {line}
      </text>
    ))}
  </>
)

const Topology: React.FC<{ diagram: Diagram }> = ({ diagram }) => {
  // Two diagrams on one page would collide on a fixed marker id, and the second
  // one would silently lose its arrowheads.
  const arrow = `arrow-${useId()}`
  const byId = new Map(diagram.nodes.map((node) => [node.id, node]))

  const width = PAD * 2 + diagram.cols * CELL_W + (diagram.cols - 1) * GAP_X
  const height = PAD * 2 + diagram.rows * CELL_H + (diagram.rows - 1) * GAP_Y

  // role="img" makes everything inside presentational, which would bury the
  // links on the system map. So the linked variant is a labelled group instead.
  const interactive = diagram.nodes.some((node) => node.href)

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        role={interactive ? 'group' : 'img'}
        aria-label={diagram.label}
        className="h-auto w-full min-w-[560px]"
      >
        <defs>
          <marker
            id={arrow}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-gray-400 dark:fill-gray-500" />
          </marker>
        </defs>

        {diagram.edges.map((edge) => {
          const from = byId.get(edge.from)
          const to = byId.get(edge.to)
          // Asserted in the content tests; skipped rather than thrown here so a
          // bad id costs one arrow, not the whole page.
          if (!from || !to) return null

          const { d, labelX, labelY, anchor } = route(from, to, edge)

          return (
            <g key={`${edge.from}-${edge.to}-${edge.label ?? ''}`}>
              <path
                d={d}
                fill="none"
                strokeWidth={1.5}
                strokeDasharray={edge.kind === 'dashed' ? '5 4' : undefined}
                markerEnd={`url(#${arrow})`}
                className="stroke-gray-400 dark:stroke-gray-500"
              />
              {edge.label && (
                <text
                  x={labelX}
                  y={labelY}
                  textAnchor={anchor}
                  // The halo is what keeps a label legible where it sits on top
                  // of its own line or crosses another.
                  paintOrder="stroke"
                  strokeWidth={3}
                  className="fill-gray-500 stroke-white text-[11px] dark:fill-gray-400 dark:stroke-gray-800"
                >
                  {edge.label}
                </text>
              )}
            </g>
          )
        })}

        {diagram.nodes.map((node) =>
          node.href ? (
            // SVG <a> has no implicit role in the mappings testing-library uses,
            // so the role is explicit -- otherwise these are unreachable both to
            // a screen reader and to the routing test.
            <Link
              key={node.id}
              to={node.href}
              role="link"
              aria-label={node.label}
              className="group"
            >
              <NodeBox node={node} />
            </Link>
          ) : (
            <g key={node.id}>
              <NodeBox node={node} />
            </g>
          ),
        )}
      </svg>
    </div>
  )
}

export default Topology
