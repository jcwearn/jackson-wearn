import React from 'react'
import ProjectCard from '../components/ProjectCard'
import { projects } from '../content/projects'

const Portfolio: React.FC = () => (
  <section className="w-full max-w-2xl mx-auto p-6">
    <h2 className="text-2xl font-bold">Portfolio</h2>
    <p className="mt-2 text-gray-700 dark:text-gray-300">
      Things I&apos;ve built outside work. More are being published as their public snapshots go up.
    </p>

    <div className="mt-6 flex flex-col gap-6">
      {projects.map((project) => (
        <ProjectCard key={project.source} project={project} />
      ))}
    </div>
  </section>
)

export default Portfolio
