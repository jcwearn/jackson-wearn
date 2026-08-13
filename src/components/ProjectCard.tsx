import React from 'react'
import type { Project } from '../content/projects'

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const { name, url, source, blurb, tags } = project

  return (
    <article className="rounded-lg border border-gray-300 dark:border-gray-700 p-6 text-left">
      <h3 className="text-xl font-bold">
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
      </h3>

      <p className="mt-3 text-gray-700 dark:text-gray-300">{blurb}</p>

      <ul className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <li
            key={tag}
            className="rounded bg-gray-200 dark:bg-gray-700 px-2 py-1 text-sm text-gray-800 dark:text-gray-200"
          >
            {tag}
          </li>
        ))}
      </ul>

      <p className="mt-4">
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
