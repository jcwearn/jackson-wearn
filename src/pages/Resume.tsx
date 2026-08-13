import React from 'react'

const PDF = '/resume.pdf'

const Resume: React.FC = () => (
  <section className="w-full max-w-2xl mx-auto p-6">
    <div className="flex flex-wrap items-baseline justify-between gap-3">
      <h2 className="text-2xl font-bold">Resume</h2>
      {/* Outside the viewer and always rendered: on the browsers most likely
          to fail at showing a PDF inline, this is the only way through. */}
      <a
        href={PDF}
        download
        className="underline underline-offset-4 hover:text-blue-600 dark:hover:text-blue-400"
      >
        Download PDF
      </a>
    </div>

    {/* <object> rather than <iframe> or <embed>: it is the only one of the
        three that renders its children when the browser cannot display the
        PDF, which iOS Safari and most mobile browsers cannot. */}
    <object
      data={PDF}
      type="application/pdf"
      aria-label="Resume"
      className="mt-6 hidden h-[80vh] w-full rounded border border-gray-300 sm:block dark:border-gray-700"
    >
      <p className="p-4 text-gray-700 dark:text-gray-300">
        Your browser can&apos;t display PDFs inline.{' '}
        <a href={PDF} download className="underline underline-offset-4">
          Download it instead
        </a>
        .
      </p>
    </object>

    <p className="mt-6 text-gray-700 sm:hidden dark:text-gray-300">
      Inline PDFs don&apos;t render reliably on mobile, so use the download link above.
    </p>
  </section>
)

export default Resume
