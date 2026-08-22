import React from 'react'
import { Link, useParams } from 'react-router'
import CaseStudySection from '../components/CaseStudySection'
import RichText from '../components/RichText'
import { caseStudyFor } from '../content/case-studies'
import { projects } from '../content/projects'
import NotFound from './NotFound'

// Tour order follows the portfolio page rather than the case studies array, so
// that previous/next moves through the projects in the order someone just saw
// them. A project without a writeup is skipped rather than linked to an empty
// page.
const tour = projects.filter((project) => caseStudyFor(project.slug))

const CaseStudy: React.FC = () => {
  const { slug } = useParams()
  const study = caseStudyFor(slug)
  const project = projects.find((candidate) => candidate.slug === slug)

  // Both have to exist: a study whose slug matches no project would render a
  // page with no name, no tags and nowhere to go back to.
  if (!study || !project) return <NotFound />

  const at = tour.findIndex((candidate) => candidate.slug === slug)
  const previous = at > 0 ? tour[at - 1] : undefined
  const next = at >= 0 && at < tour.length - 1 ? tour[at + 1] : undefined

  return (
    <section className="mx-auto w-full max-w-2xl p-6 text-left">
      <Link
        to="/portfolio"
        className="text-sm text-gray-600 underline underline-offset-4 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
      >
        &larr; Portfolio
      </Link>

      {study.eyebrow && (
        <p className="mt-6 text-xs font-bold tracking-widest text-gray-500 uppercase dark:text-gray-400">
          {study.eyebrow}
        </p>
      )}

      <h2 className="mt-2 text-2xl font-bold">{project.name}</h2>

      <p className="mt-3 text-lg text-gray-700 dark:text-gray-300">
        <RichText>{study.thesis}</RichText>
      </p>

      <ul className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        {project.url && (
          <li>
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Visit
            </a>
          </li>
        )}
        <li>
          {project.source ? (
            <a
              href={project.source}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Source
            </a>
          ) : (
            <span className="rounded bg-gray-200 px-1.5 py-0.5 text-xs text-gray-800 dark:bg-gray-700 dark:text-gray-200">
              Private repo
            </span>
          )}
        </li>
      </ul>

      {study.facts && (
        <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 border-t border-gray-300 pt-4 dark:border-gray-700">
          {study.facts.map((fact) => (
            <div key={fact.label}>
              <dt className="text-xs tracking-widest text-gray-500 uppercase dark:text-gray-400">
                {fact.label}
              </dt>
              <dd className="mt-0.5 font-mono text-lg tabular-nums">{fact.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {study.sections.map((section, i) => (
        <CaseStudySection key={i} section={section} />
      ))}

      {(previous || next) && (
        <nav
          aria-label="More case studies"
          className="mt-12 flex justify-between gap-4 border-t border-gray-300 pt-4 text-sm dark:border-gray-700"
        >
          {previous ? (
            <Link
              to={`/portfolio/${previous.slug}`}
              className="underline underline-offset-4 hover:text-blue-600 dark:hover:text-blue-400"
            >
              &larr; {previous.name}
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              to={`/portfolio/${next.slug}`}
              className="text-right underline underline-offset-4 hover:text-blue-600 dark:hover:text-blue-400"
            >
              {next.name} &rarr;
            </Link>
          )}
        </nav>
      )}
    </section>
  )
}

export default CaseStudy
