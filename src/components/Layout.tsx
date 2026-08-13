import React from 'react'
import { Outlet } from 'react-router'
import { useDarkMode } from '../hooks/useDarkMode'
import Footer from './Footer'
import Header from './Header'
import ThemeToggle from './ThemeToggle'

/**
 * The page chrome shared by every route: theme toggle, header, nav, footer,
 * and the centred content column.
 *
 * This is the single caller of useDarkMode -- see the note on the hook for
 * why that matters.
 */
const Layout: React.FC = () => {
  const { dark, toggle } = useDarkMode()

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-800 text-black dark:text-white">
      <ThemeToggle darkMode={dark} onToggle={toggle} />
      <Header darkMode={dark} />
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-3xl px-6 mx-auto">
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}

export default Layout
