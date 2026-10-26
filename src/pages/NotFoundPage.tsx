import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { SceneFallback } from '../components/scene/SceneFallback'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import './NotFoundPage.css'

export function NotFoundPage() {
  useDocumentMeta('Page not found')

  return (
    <section className="not-found container" aria-labelledby="not-found-title">
      <div className="not-found__art" aria-hidden="true">
        <SceneFallback />
      </div>
      <p className="mono red">Error 404 — signal lost</p>
      <h1 id="not-found-title" className="not-found__title">
        This page isn’t part of the system.
      </h1>
      <p className="muted not-found__text">The link may be outdated, or the address mistyped.</p>
      <div className="not-found__actions">
        <Link to="/" className="btn btn--primary">
          <ArrowLeft aria-hidden="true" /> Back to home
        </Link>
        <Link to="/#work" className="btn">
          See the work <ArrowRight aria-hidden="true" data-arrow="right" />
        </Link>
      </div>
    </section>
  )
}
