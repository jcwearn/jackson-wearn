import { describe, expect, it } from 'vitest'
import { projects } from './projects'

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

  // The "-public" suffix is the point, not incidental. Every project here is
  // developed in a private repo and published as a filtered snapshot, so
  // linking github.com/jcwearn/<name> instead of <name>-public sends visitors
  // to a 404 while looking entirely plausible in review. If a project ever
  // gets published in place, relax this deliberately rather than by accident.
  it.each(projects.map((p) => [p.name, p] as const))('%s links to public source', (_n, project) => {
    expect(project.source).toMatch(/^https:\/\/github\.com\/jcwearn\/[\w.-]+-public$/)
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
})
