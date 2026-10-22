import { describe, expect, it } from 'vitest'
import { projects } from '../projects'
import { caseStudies } from './index'

// A case study is reached only by its slug, so a typo here does not throw --
// it renders NotFound at a URL that looks correct in a link. These guard that,
// and the emptiness that a template with optional sections invites.
describe('case studies', () => {
  it('has at least one', () => {
    expect(caseStudies.length).toBeGreaterThan(0)
  })

  it('has a unique slug per study', () => {
    const slugs = caseStudies.map((study) => study.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it.each(caseStudies.map((s) => [s.slug, s] as const))('%s belongs to a project', (slug) => {
    expect(projects.map((project) => project.slug)).toContain(slug)
  })

  it.each(caseStudies.map((s) => [s.slug, s] as const))('%s says something', (_slug, study) => {
    expect(study.thesis.trim()).not.toBe('')
    expect(study.sections.length).toBeGreaterThan(0)
  })

  // Every section kind renders a heading or a border. An empty one renders the
  // chrome and nothing inside it, which looks like a loading state.
  it.each(caseStudies.map((s) => [s.slug, s] as const))('%s has no empty section', (_s, study) => {
    for (const section of study.sections) {
      switch (section.kind) {
        case 'prose':
          expect(section.paragraphs.length).toBeGreaterThan(0)
          expect(section.paragraphs.every((p) => p.trim() !== '')).toBe(true)
          break
        case 'table':
          expect(section.columns.length).toBeGreaterThan(0)
          expect(section.rows.length).toBeGreaterThan(0)
          // A short row silently shifts every cell after it into the wrong column.
          for (const row of section.rows) {
            expect(row.length, `row "${row[0]}" does not match the columns`).toBe(
              section.columns.length,
            )
          }
          break
        case 'decisions':
          expect(section.items.length).toBeGreaterThan(0)
          expect(section.items.every((i) => i.title.trim() !== '' && i.body.trim() !== '')).toBe(
            true,
          )
          break
        case 'callout':
          expect(section.title.trim()).not.toBe('')
          expect(section.body.trim()).not.toBe('')
          break
        case 'topology':
          // Covered in depth by diagram.test.ts.
          expect(section.diagram.nodes.length).toBeGreaterThan(0)
          break
      }
    }
  })

  it.each(caseStudies.map((s) => [s.slug, s] as const))('%s has facts with values', (_s, study) => {
    for (const fact of study.facts ?? []) {
      expect(fact.label.trim()).not.toBe('')
      expect(fact.value.trim()).not.toBe('')
    }
  })
})
