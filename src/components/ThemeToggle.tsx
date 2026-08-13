import React from 'react'
import { FaMoon, FaSun } from 'react-icons/fa'

const ThemeToggle: React.FC<{ darkMode: boolean; onToggle: () => void }> = ({
  darkMode,
  onToggle,
}) => (
  <button
    onClick={onToggle}
    className="absolute top-4 right-4 p-2 rounded-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
  >
    {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
  </button>
)

export default ThemeToggle
