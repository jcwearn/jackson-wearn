import React from 'react'
import ContactForm from '../components/ContactForm'

const Home: React.FC = () => (
  <>
    <section className="w-full max-w-2xl mx-auto p-6 text-left mt-4">
      <p className="text-black dark:text-gray-300 text-lg">
        Hi, I'm Jackson, a seasoned software engineer with a strong passion for backend
        architecture. While I have worn many hats and can comfortably work across the full stack, my
        expertise and interests lie in designing scalable and efficient backend systems. In recent
        years, I’ve worked extensively with Go, which has become my preferred language. I’ve also
        spent a lot of time in PHP on the backend and JavaScript/TypeScript with React on the
        frontend.
      </p>
      <br />
      <p className="text-black dark:text-gray-300 text-lg">
        Beyond coding, I have a deep appreciation for outdoor adventures and strategic games. I
        spend my free time mountain biking, hiking, camping, and, most recently, rollerblading. I
        also love board games and experimenting with vegetarian cooking.
      </p>
      <br />
      <p className="text-black dark:text-gray-300 text-lg">
        If you're interested in discussing technology, backend architecture, or any of my hobbies,
        feel free to reach out!
      </p>
    </section>
    <ContactForm />
  </>
)

export default Home
