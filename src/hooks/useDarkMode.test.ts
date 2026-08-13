import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useDarkMode } from './useDarkMode'

const isDark = () => document.documentElement.classList.contains('dark')

describe('useDarkMode', () => {
  it('defaults to dark when nothing is stored', () => {
    const { result } = renderHook(() => useDarkMode())

    expect(result.current.dark).toBe(true)
    expect(isDark()).toBe(true)
  })

  it('starts light when "light" is stored', () => {
    localStorage.setItem('theme', 'light')

    const { result } = renderHook(() => useDarkMode())

    expect(result.current.dark).toBe(false)
    expect(isDark()).toBe(false)
  })

  // Anything that is not exactly "light" means dark, including a value left
  // behind by an older version of the site.
  it('treats an unrecognised stored value as dark', () => {
    localStorage.setItem('theme', 'solarized')

    const { result } = renderHook(() => useDarkMode())

    expect(result.current.dark).toBe(true)
  })

  it('toggles the class and the stored value together', () => {
    const { result } = renderHook(() => useDarkMode())
    expect(localStorage.getItem('theme')).toBe('dark')

    act(() => result.current.toggle())

    expect(result.current.dark).toBe(false)
    expect(isDark()).toBe(false)
    expect(localStorage.getItem('theme')).toBe('light')

    act(() => result.current.toggle())

    expect(result.current.dark).toBe(true)
    expect(isDark()).toBe(true)
    expect(localStorage.getItem('theme')).toBe('dark')
  })

  it('writes the theme on mount, so a fresh visitor gets a stored preference', () => {
    expect(localStorage.getItem('theme')).toBeNull()

    renderHook(() => useDarkMode())

    expect(localStorage.getItem('theme')).toBe('dark')
  })
})
