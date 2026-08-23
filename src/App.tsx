import React from 'react'
import { Route, Routes } from 'react-router'
import Layout from './components/Layout'
import CaseStudy from './pages/CaseStudy'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Portfolio from './pages/Portfolio'
import Resume from './pages/Resume'
import SystemMap from './pages/SystemMap'

const App: React.FC = () => (
  <Routes>
    <Route element={<Layout />}>
      <Route index element={<Home />} />
      {/* `system` is static and so ranks above `:slug`; a test also reserves
          the slug, so a project can never claim it by accident. */}
      <Route path="portfolio">
        <Route index element={<Portfolio />} />
        <Route path="system" element={<SystemMap />} />
        <Route path=":slug" element={<CaseStudy />} />
      </Route>
      <Route path="resume" element={<Resume />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
)

export default App
