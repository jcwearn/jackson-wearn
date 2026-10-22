// ---------------------------------------------------------------------------
// Long-form writeups, one module per project, keyed by the project's slug.
//
// A case study is optional. A project with no entry here is finished by its card
// on the portfolio page, which is the honest outcome for the small ones -- the
// point of the section union below is that a short project renders as a short
// page instead of being padded out to fill a template.
//
// Every string here goes through <RichText>, which understands `backticks` and
// **bold** and nothing else.
// ---------------------------------------------------------------------------

import type { Diagram } from '../diagram'
import { k3sCluster } from './k3s-cluster'

export type Fact = { label: string; value: string }

export type Section =
  /** Paragraphs of narrative. The default section. */
  | { kind: 'prose'; heading?: string; paragraphs: string[] }
  /** A diagram, with optional lead-in prose and a caption under it. */
  | { kind: 'topology'; heading?: string; intro?: string; diagram: Diagram; caption?: string }
  /** Anything comparative: ownership boundaries, routes, streams. */
  | { kind: 'table'; heading?: string; intro?: string; columns: string[]; rows: string[][] }
  /** Choices with a reason, and usually a cost. The section interviewers read. */
  | {
      kind: 'decisions'
      heading?: string
      intro?: string
      items: { title: string; body: string }[]
    }
  /** One boxed aside. Use sparingly; two in a row is just prose with borders. */
  | { kind: 'callout'; title: string; body: string }

export type CaseStudy = {
  /** Must match a Project.slug. Asserted, because a typo here 404s silently. */
  slug: string
  /** Kicker above the title, e.g. "Homelab · GitOps". */
  eyebrow?: string
  /** The twenty-second version. One or two sentences, no more. */
  thesis: string
  facts?: Fact[]
  sections: Section[]
}

/**
 * Declaration order does not matter here -- the portfolio's own order drives the
 * previous/next links, so that the tour follows the page a visitor came from.
 */
export const caseStudies: CaseStudy[] = [k3sCluster]

export function caseStudyFor(slug: string | undefined): CaseStudy | undefined {
  return caseStudies.find((study) => study.slug === slug)
}
