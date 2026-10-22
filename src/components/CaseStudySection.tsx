import React from 'react'
import type { Section } from '../content/case-studies'
import RichText from './RichText'
import Topology from './Topology'

// One component, one arm per section kind. The union is what lets a small
// project be a short page: it renders whatever sections exist and nothing else,
// so there is no template with empty holes in it to fill.

const Heading: React.FC<{ children?: string }> = ({ children }) =>
  children ? (
    <h3 className="border-b border-gray-300 pb-1 text-sm font-bold tracking-widest uppercase dark:border-gray-700">
      {children}
    </h3>
  ) : null

const Intro: React.FC<{ children?: string }> = ({ children }) =>
  children ? (
    <p className="mt-3 text-gray-700 dark:text-gray-300">
      <RichText>{children}</RichText>
    </p>
  ) : null

const CaseStudySection: React.FC<{ section: Section }> = ({ section }) => {
  switch (section.kind) {
    case 'prose':
      return (
        <section className="mt-10">
          <Heading>{section.heading}</Heading>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph} className="mt-3 text-gray-700 dark:text-gray-300">
              <RichText>{paragraph}</RichText>
            </p>
          ))}
        </section>
      )

    case 'topology':
      return (
        <section className="mt-10">
          <Heading>{section.heading}</Heading>
          <Intro>{section.intro}</Intro>
          <figure className="mt-5">
            <Topology diagram={section.diagram} />
            {section.caption && (
              <figcaption className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                <RichText>{section.caption}</RichText>
              </figcaption>
            )}
          </figure>
        </section>
      )

    case 'table':
      return (
        <section className="mt-10">
          <Heading>{section.heading}</Heading>
          <Intro>{section.intro}</Intro>
          {/* Wide tables scroll inside their own box; the page body must not. */}
          <div className="mt-4 w-full overflow-x-auto">
            <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
              <thead>
                <tr>
                  {section.columns.map((column) => (
                    <th
                      key={column}
                      scope="col"
                      className="border-b border-gray-300 pb-2 pr-4 align-bottom font-semibold dark:border-gray-700"
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {section.rows.map((row) => (
                  <tr key={row.join('|')}>
                    {row.map((cell, i) => (
                      <td
                        key={i}
                        className="border-b border-gray-200 py-2 pr-4 align-top text-gray-700 dark:border-gray-800 dark:text-gray-300"
                      >
                        <RichText>{cell}</RichText>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )

    case 'decisions':
      return (
        <section className="mt-10">
          <Heading>{section.heading}</Heading>
          <Intro>{section.intro}</Intro>
          <ul className="mt-4 space-y-4">
            {section.items.map((item) => (
              <li key={item.title} className="border-l-2 border-gray-300 pl-4 dark:border-gray-700">
                <p className="font-semibold">
                  <RichText>{item.title}</RichText>
                </p>
                <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                  <RichText>{item.body}</RichText>
                </p>
              </li>
            ))}
          </ul>
        </section>
      )

    case 'callout':
      return (
        <aside className="mt-10 rounded-lg border border-gray-300 p-4 dark:border-gray-700">
          <p className="font-semibold">
            <RichText>{section.title}</RichText>
          </p>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            <RichText>{section.body}</RichText>
          </p>
        </aside>
      )
  }
}

export default CaseStudySection
