import { describe, expect, it } from 'vitest'
import { categories, projects } from './projects'

// These guard the edits this file invites: adding an entry as each public
// mirror goes live. They catch typos and omissions, not whether the URL is
// actually reachable -- that is a human check before adding the entry.
describe('projects', () => {
  it('has at least one project', () => {
    expect(projects.length).toBeGreaterThan(0)
  })

  it.each(projects.map((p) => [p.name, p] as const))('%s is complete', (_name, project) => {
    expect(project.name.trim()).not.toBe('')
    expect(project.blurb.trim()).not.toBe('')
    expect(project.tags.length).toBeGreaterThan(0)
    expect(project.tags.every((t) => t.trim() !== '')).toBe(true)
  })

  // This used to require a "-public" suffix on every source, back when every
  // project here was a private repo published as a snapshot. Several are now
  // public in place and have no suffix, so the rule is relaxed -- deliberately,
  // and to the thing it was actually protecting against.
  //
  // The suffix was never the point. The point is that linking the private
  // original of a mirrored repo reads as completely correct in review and gives
  // every logged-out visitor a 404, because a private repo returns 200 to its
  // owner. That risk exists only where a mirror exists, so name those.
  const MIRRORED = [
    'borderline',
    'anupamaandjackson',
    'cf-worker-email',
    'homeassistant-config',
    'k3s-cluster',
  ]

  it.each(projects.map((p) => [p.name, p] as const))('%s links to public source', (_n, project) => {
    const match = /^https:\/\/github\.com\/jcwearn\/([\w.-]+)$/.exec(project.source)
    expect(match, `${project.source} is not a github.com/jcwearn repo URL`).not.toBeNull()

    const repo = match![1]
    expect(MIRRORED, `${repo} is mirrored; link ${repo}-public instead`).not.toContain(repo)
  })

  it.each(projects.map((p) => [p.name, p] as const))('%s has a valid live url', (_n, project) => {
    if (project.url !== undefined) {
      expect(project.url).toMatch(/^https:\/\//)
    }
  })

  // source doubles as the React key on the portfolio page.
  it('has a unique source per project', () => {
    const sources = projects.map((p) => p.source)
    expect(new Set(sources).size).toBe(sources.length)
  })

  it.each(projects.map((p) => [p.name, p] as const))('%s has a known category', (_n, project) => {
    expect(categories.map((c) => c.id)).toContain(project.category)
  })

  // A category with nothing in it renders a heading and an empty grid, which
  // looks like a bug to a visitor and like nothing at all in the tests.
  it.each(categories.map((c) => [c.label, c] as const))('%s has projects', (_l, category) => {
    expect(projects.filter((p) => p.category === category.id).length).toBeGreaterThan(0)
  })

  it.each(categories.map((c) => [c.label, c] as const))('%s is described', (_l, category) => {
    expect(category.label.trim()).not.toBe('')
    expect(category.blurb.trim()).not.toBe('')
  })
})
