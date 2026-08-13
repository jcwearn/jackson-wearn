import React from 'react'
import { NavLink } from 'react-router'

// `end` on the index link is belt and braces. react-router 8 already treats
// to="/" as an exact match -- verified: it reports no aria-current on /resume
// even with end={false} -- but a non-root link like to="/portfolio" does
// prefix-match, so /portfolio/detail would mark it current. Stating the
// intent here means adding a nested route later cannot quietly change it.
const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/portfolio', label: 'Portfolio', end: false },
  { to: '/resume', label: 'Resume', end: false },
]

// NavLink sets aria-current="page" on the active link by itself, which is both
// the accessible answer and what the tests assert against -- more durable than
// matching class strings.
const Nav: React.FC = () => (
  <nav aria-label="Main" className="mt-4 flex justify-center gap-6">
    {links.map(({ to, label, end }) => (
      <NavLink
        key={to}
        to={to}
        end={end}
        className={({ isActive }) =>
          `text-base transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
            isActive
              ? 'font-semibold underline underline-offset-4'
              : 'text-gray-700 dark:text-gray-300'
          }`
        }
      >
        {label}
      </NavLink>
    ))}
  </nav>
)

export default Nav
