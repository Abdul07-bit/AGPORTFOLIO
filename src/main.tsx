import '@fontsource-variable/cinzel'
import '@fontsource-variable/cormorant-garamond'
import '@fontsource-variable/cormorant-garamond/wght-italic.css'
import '@fontsource-variable/inter'
import '@fontsource/courier-prime/400.css'
import '@fontsource/courier-prime/700.css'
import './styles/globals.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { loadSiteSettings } from './lib/siteSettings'

const root = document.getElementById('root')
if (!root) throw new Error('Root element #root is missing from index.html')

const render = () =>
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )

// Admin-panel settings (project selection, links, resume) are applied before the
// first render. The admin panel itself always edits the untouched defaults.
if (window.location.pathname.startsWith('/admin')) render()
else loadSiteSettings().finally(render)
