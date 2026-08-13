import React from 'react'
import { Route, Routes } from 'react-router'
import Layout from './components/Layout'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Portfolio from './pages/Portfolio'
import Resume from './pages/Resume'

const App: React.FC = () => (
  <Routes>
    <Route element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="portfolio" element={<Portfolio />} />
      <Route path="resume" element={<Resume />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
)

export default App
