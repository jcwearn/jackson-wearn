import React from 'react'
import { resume } from '../content/resume'

const PDF = '/resume.pdf'

const { profile, experience, projects, skills, education } = resume
const links = profile.link_lines.flat()

const Bullets: React.FC<{ items: { text: string }[] }> = ({ items }) => (
  <ul className="mt-2 list-disc space-y-1 pl-5 text-gray-700 dark:text-gray-300">
    {items.map((bullet) => (
      <li key={bullet.text}>{bullet.text}</li>
    ))}
  </ul>
)

const SectionHeading: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="mt-8 border-b border-gray-300 pb-1 text-sm font-bold tracking-widest uppercase dark:border-gray-700">
    {children}
  </h3>
)

const Resume: React.FC = () => (
  <section className="w-full max-w-2xl mx-auto p-6 text-left">
    <div className="flex flex-wrap items-baseline justify-between gap-3">
      <h2 className="text-2xl font-bold">Resume</h2>
      <a
        href={PDF}
        download
        className="underline underline-offset-4 hover:text-blue-600 dark:hover:text-blue-400"
      >
        Download PDF
      </a>
    </div>

    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
      {profile.location} ·{' '}
      <a href={`mailto:${profile.email}`} className="underline underline-offset-4">
        {profile.email}
      </a>
      {links.map((link) => (
        <React.Fragment key={link.url}>
          {' · '}
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4"
          >
            {link.label}
          </a>
        </React.Fragment>
      ))}
    </p>

    <p className="mt-4 text-gray-700 dark:text-gray-300">{profile.summary}</p>

    <SectionHeading>Experience</SectionHeading>
    {experience.map((role) => (
      <article key={`${role.company}-${role.start}`} className="mt-5">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3">
          <h4 className="font-bold">{role.company}</h4>
          <span className="text-sm text-gray-600 dark:text-gray-400">{role.dates}</span>
        </div>
        <div className="flex flex-wrap items-baseline justify-between gap-x-3">
          <p className="italic text-gray-700 dark:text-gray-300">
            {role.title}
            {role.subtitle ? ` — ${role.subtitle}` : ''}
          </p>
          {role.location && (
            <span className="text-sm text-gray-600 dark:text-gray-400">{role.location}</span>
          )}
        </div>
        <Bullets items={role.bullets} />
      </article>
    ))}

    <SectionHeading>{projects.heading}</SectionHeading>
    <article className="mt-5">
      <h4 className="font-bold">{projects.name}</h4>
      {projects.meta && <p className="text-sm text-gray-600 dark:text-gray-400">{projects.meta}</p>}
      <Bullets items={projects.bullets} />
    </article>

    <SectionHeading>Skills</SectionHeading>
    <dl className="mt-3 space-y-2">
      {skills.groups.map((group) => (
        <div key={group.label} className="sm:flex sm:gap-3">
          <dt className="font-bold sm:w-36 sm:shrink-0">{group.label}</dt>
          <dd className="text-gray-700 dark:text-gray-300">{group.text}</dd>
        </div>
      ))}
    </dl>

    <SectionHeading>Education</SectionHeading>
    <ul className="mt-3 space-y-1">
      {education.entries.map((entry) => (
        <li key={entry.degree} className="sm:flex sm:justify-between sm:gap-3">
          <span>{entry.degree}</span>
          {entry.detail && (
            <span className="text-sm text-gray-600 dark:text-gray-400">{entry.detail}</span>
          )}
        </li>
      ))}
    </ul>
  </section>
)

export default Resume
