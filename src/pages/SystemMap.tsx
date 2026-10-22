import React from 'react'
import { Link } from 'react-router'
import Topology from '../components/Topology'
import { caseStudyFor } from '../content/case-studies'
import { systemDiagram, systemIntro } from '../content/system'

// A node becomes a link when a case study exists for its id, which is why the
// ids in system.ts are project slugs. New writeups light up boxes here on their
// own; there is no second list to keep in step.
const linked = {
  ...systemDiagram,
  nodes: systemDiagram.nodes.map((node) =>
    caseStudyFor(node.id) ? { ...node, href: `/portfolio/${node.id}` } : node,
  ),
}

const SystemMap: React.FC = () => (
  <section className="mx-auto w-full max-w-2xl p-6 text-left">
    <Link
      to="/portfolio"
      className="text-sm text-gray-600 underline underline-offset-4 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
    >
      &larr; Portfolio
    </Link>

    <h2 className="mt-6 text-2xl font-bold">How it fits together</h2>

    {systemIntro.map((paragraph) => (
      <p key={paragraph} className="mt-3 text-gray-700 dark:text-gray-300">
        {paragraph}
      </p>
    ))}

    <figure className="mt-8">
      <Topology diagram={linked} />
      <figcaption className="mt-3 text-sm text-gray-600 dark:text-gray-400">
        Boxes with a writeup are links. Dashed arrows are runtime dependencies; solid ones are
        something being deployed or configured.
      </figcaption>
    </figure>
  </section>
)

export default SystemMap
