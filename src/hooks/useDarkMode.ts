import { useEffect, useState } from 'react'

const STORAGE_KEY = 'theme'

/**
 * Reads and writes the site theme, which lives in localStorage under "theme"
 * and as a `dark` class on the document element.
 *
 * Call this exactly once per tree. It owns state that it mirrors onto a
 * global, so a second caller would get its own useState writing the same
 * class and the two would drift apart on the first toggle. Layout is the
 * single caller; anything else takes the value as a prop.
 *
 * Dark is the default: only an explicit "light" opts out.
 */
export function useDarkMode() {
  const [dark, setDark] = useState<boolean>(() => localStorage.getItem(STORAGE_KEY) !== 'light')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light')
  }, [dark])

  return { dark, toggle: () => setDark((d) => !d) }
}
