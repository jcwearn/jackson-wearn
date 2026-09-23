import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import Page from './Page.tsx'

// Its own stylesheet, not src/index.css: that one sets the main site's dark
// root background and button rules, which this page does not want.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Page />
  </StrictMode>,
)
