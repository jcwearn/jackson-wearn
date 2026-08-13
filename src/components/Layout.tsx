import React from 'react'
import { useDarkMode } from '../hooks/useDarkMode'
import Footer from './Footer'
import Header from './Header'
import ThemeToggle from './ThemeToggle'

/**
 * The page chrome shared by every route: theme toggle, header, footer, and
 * the centred content column.
 *
 * This is the single caller of useDarkMode. When the router lands, `children`
 * becomes an <Outlet />; nothing else about this component needs to change.
 */
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { dark, toggle } = useDarkMode()

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-800 text-black dark:text-white">
      <ThemeToggle darkMode={dark} onToggle={toggle} />
      <Header darkMode={dark} />
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-3xl px-6 mx-auto">
        {children}
      </div>
      <Footer />
    </div>
  )
}

export default Layout
