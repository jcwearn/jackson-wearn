// ---------------------------------------------------------------------------
// The shape of an architecture diagram, as data.
//
// Diagrams are authored here and rendered by <Topology>, rather than drawn as
// bespoke SVG per project, so that adding a project stays a content edit like
// everything else in this directory.
//
// Nodes sit on a coarse grid; the renderer turns col/row into pixels and routes
// the edges between them. There is no layout engine and nothing is measured --
// where a box lands is entirely what the author wrote.
// ---------------------------------------------------------------------------

export type DiagramNode = {
  id: string
  /** Zero-based grid position. `col + colSpan` must stay within `cols`. */
  col: number
  row: number
  colSpan?: number
  label: string
  /**
   * Secondary text under the label. SVG does not wrap, so this is an array and
   * the author decides where the lines break. See the budgets below.
   */
  sub?: string[]
  /** Draws the box in the accent fill. For the one or two boxes that matter. */
  accent?: boolean
  /** Internal route. Makes the whole box a link -- used by the system map. */
  href?: string
}

export type DiagramEdge = {
  from: string
  to: string
  label?: string
  kind?: 'solid' | 'dashed'
  /**
   * Force the corner of an L-shaped run: 'hv' leaves horizontally and arrives
   * vertically, 'vh' the reverse. Omitted, the renderer leaves along whichever
   * axis it has further to travel, which is usually but not always right.
   *
   * Reach for it when the default route would cross a box -- that is the one
   * thing the renderer cannot see, because it never measures anything. Ignored
   * when the two nodes share a column or a row, where the run is straight and
   * there is no corner to place.
   */
  elbow?: 'hv' | 'vh'
}

export type Diagram = {
  /**
   * The whole diagram in a sentence, for anyone who cannot see it. Required:
   * a picture no screen reader can describe is not a picture, it is a gap.
   */
  label: string
  cols: number
  rows: number
  nodes: DiagramNode[]
  edges: DiagramEdge[]
}

/**
 * Text budgets, in characters.
 *
 * SVG text does not wrap and does not clip -- an over-long label simply runs out
 * of its box and across whatever is next to it, which looks like a rendering bug
 * and is really a content bug. Asserting the budget in the test means an
 * overflowing diagram fails CI instead of being noticed on a shared screen.
 */
export const MAX_LABEL = 22
export const MAX_SUB_LINE = 30
