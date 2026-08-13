import React from 'react'
import Nav from './Nav'

const Header: React.FC<{ darkMode: boolean }> = ({ darkMode }) => {
  return (
    <header className="w-full text-center p-6 bg-gray-300 dark:bg-gray-900 text-black dark:text-white">
      <div className="relative w-24 h-24 mx-auto">
        <img
          src="/profile.jpg"
          alt="Jackson"
          className="w-full h-full rounded-full dark:grayscale"
        />
        <img
          src="/sunglasses.png"
          alt="Sunglasses"
          className={`absolute top-5 left-8 w-1/3 h-1/3 transition-opacity duration-300 ${
            !darkMode ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>
      <h1 className="text-2xl font-bold mt-4">Jackson Wearn</h1>
      <p className="text-lg">Senior Software Engineer · Backend &amp; Infrastructure</p>
      <Nav />
    </header>
  )
}

export default Header
