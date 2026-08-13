import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// jsdom shares one document and one localStorage across every test in a file,
// and useDarkMode writes to both. Without this reset a test inherits whatever
// theme the previous one left behind, which makes failures depend on order.
afterEach(() => {
  cleanup()
  localStorage.clear()
  document.documentElement.classList.remove('dark')
})
