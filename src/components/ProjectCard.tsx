import React from 'react'
import type { Project } from '../content/projects'

// Sized for a two-column grid, so it runs tighter than a full-width card would:
// h-full keeps cards in a row the same height whatever the blurb length, and the
// footer is pushed down with mt-auto so the source links line up across a row.
const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const { name, url, source, blurb, tags } = project

  return (
    <article className="flex h-full flex-col rounded-lg border border-gray-300 p-4 text-left dark:border-gray-700">
      <h4 className="text-lg font-bold">
        {/* Linked when there is somewhere to go, plain text otherwise. Several
            of these are infrastructure, not websites. */}
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-blue-600 dark:hover:text-blue-400"
          >
            {name}
          </a>
        ) : (
          name
        )}
      </h4>

      <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{blurb}</p>

      <ul className="mt-3 flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <li
            key={tag}
            className="rounded bg-gray-200 px-1.5 py-0.5 text-xs text-gray-800 dark:bg-gray-700 dark:text-gray-200"
          >
            {tag}
          </li>
        ))}
      </ul>

      <p className="mt-auto pt-3">
        <a
          href={source}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm underline underline-offset-4 hover:text-blue-600 dark:hover:text-blue-400"
        >
          Source
        </a>
      </p>
    </article>
  )
}

export default ProjectCard
