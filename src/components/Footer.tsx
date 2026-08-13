import React from 'react'
import { FaGithub, FaLinkedin } from 'react-icons/fa'

const Footer: React.FC = () => (
  <footer className="w-full text-center p-6 bg-gray-300 dark:bg-gray-900 dark:text-white mt-auto">
    <div className="flex justify-center space-x-4">
      <a
        href="https://www.linkedin.com/in/jackson-wearn/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaLinkedin size={24} />
      </a>
      <a href="https://github.com/jcwearn" target="_blank" rel="noopener noreferrer">
        <FaGithub size={24} />
      </a>
    </div>
  </footer>
)

export default Footer
