import { lazy, Suspense, useEffect, useLayoutEffect, useRef } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Backdrop } from './components/layout/Backdrop'
import { Footer } from './components/layout/Footer'
import { Navigation } from './components/layout/Navigation'
import { SectionProgress } from './components/layout/SectionProgress'
import { Cursor } from './components/motion/Cursor'
import { ScrollTrigger } from './lib/gsap'
import { completeIntro, markReady } from './lib/loading'
import { scrollToTarget, startSmoothScroll } from './lib/scroll'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ProjectPage } from './pages/ProjectPage'
import { Intro } from './sections/Intro'

// Loaded on demand so the admin panel adds nothing to the public bundle.
const AdminPage = lazy(() => import('./admin/AdminPage'))

function Shell() {
  const location = useLocation()
  const firstRender = useRef(true)

  useEffect(() => startSmoothScroll(), [])

  // Scroll positions are restored by the pages themselves, after pinned
  // sections have been measured — the browser's own restoration would race them.
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  }, [])

  // Only the home page has a 3D scene to wait for.
  useEffect(() => {
    if (location.pathname !== '/') markReady('scene')
    // eslint-disable-next-line react-hooks/exhaustive-deps -- first route only
  }, [])

  // Text metrics change once web fonts arrive — re-measure pinned sections.
  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
  }, [])

  // New route: start at the top (home handles hashes and Back itself) and
  // move focus to the main region so screen readers announce the new page.
  useLayoutEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    if (location.pathname !== '/') scrollToTarget(0, { immediate: true })
    document.getElementById('main')?.focus({ preventScroll: true })
  }, [location.pathname])

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Backdrop />
      <ErrorBoundary onError={completeIntro}>
        <Intro />
      </ErrorBoundary>
      <Navigation />
      <SectionProgress />
      <main id="main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/work/:slug" element={<ProjectPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <Cursor />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/admin"
          element={
            <Suspense fallback={null}>
              <AdminPage />
            </Suspense>
          }
        />
        <Route path="*" element={<Shell />} />
      </Routes>
    </BrowserRouter>
  )
}
