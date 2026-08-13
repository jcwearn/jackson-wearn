import React from 'react'
import { Link } from 'react-router'

// Cloudflare Pages serves index.html for unmatched paths, so this renders with
// a 200 rather than a 404 status. That is the trade for having a client-side
// router on Pages without a _redirects file; see CLAUDE.md.
const NotFound: React.FC = () => (
  <section className="w-full max-w-2xl mx-auto p-6 text-center">
    <h2 className="text-2xl font-bold">Page not found</h2>
    <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
      That page doesn&apos;t exist. Try the{' '}
      <Link to="/" className="underline underline-offset-4">
        home page
      </Link>
      .
    </p>
  </section>
)

export default NotFound
