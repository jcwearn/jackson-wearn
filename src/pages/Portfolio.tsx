import React from 'react'
import { Link } from 'react-router'
import ProjectCard from '../components/ProjectCard'
import { categories, projects } from '../content/projects'

// No max-w here: the page uses the width Layout already gives it, which is what
// leaves room for two columns. Every other page sets its own narrower max-w, so
// widening the shared container would have been a bigger change than this needs.
const Portfolio: React.FC = () => (
  <section className="w-full p-6">
    <h2 className="text-2xl font-bold">Portfolio</h2>
    <p className="mt-2 text-gray-700 dark:text-gray-300">
      Things I&apos;ve built outside work.{' '}
      <Link
        to="/portfolio/system"
        className="underline underline-offset-4 hover:text-blue-600 dark:hover:text-blue-400"
      >
        See how they fit together
      </Link>
      .
    </p>

    {categories.map((category) => {
      const inGroup = projects.filter((project) => project.category === category.id)

      return (
        <section key={category.id} className="mt-10" aria-labelledby={`group-${category.id}`}>
          <h3
            id={`group-${category.id}`}
            className="border-b border-gray-300 pb-1 text-sm font-bold tracking-widest uppercase dark:border-gray-700"
          >
            {category.label}
          </h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{category.blurb}</p>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {inGroup.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </section>
      )
    })}
  </section>
)

export default Portfolio
