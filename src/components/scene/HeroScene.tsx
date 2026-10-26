import { lazy, Suspense, useCallback, useEffect, useRef, useState, type RefObject } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { getSceneQuality, hasWebGL } from '../../lib/device'
import { markReady } from '../../lib/loading'
import { ErrorBoundary } from '../ErrorBoundary'
import { SceneFallback } from './SceneFallback'
import type { SceneSignals } from './sceneSignals'
import './HeroScene.css'

// three.js + R3F live in their own chunk so the page never waits for them.
const SignalCore = lazy(() => import('./SignalCore'))

/**
 * Hosts the 3D Signal Core with a static fallback underneath. The fallback is
 * visible until the first WebGL frame renders, and stays if WebGL fails.
 */
export function HeroScene({ signals }: { signals: RefObject<SceneSignals> }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const [supported] = useState(hasWebGL)
  const [quality] = useState(getSceneQuality)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const [visible, setVisible] = useState(true)

  const useWebGL = supported && !failed

  useEffect(() => {
    if (!useWebGL) markReady('scene')
  }, [useWebGL])

  // Pause rendering when the hero is off-screen or the tab is hidden.
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    let inView = true
    const update = () => setVisible(inView && document.visibilityState === 'visible')
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      update()
    })
    observer.observe(container)
    document.addEventListener('visibilitychange', update)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', update)
    }
  }, [])

  const handleReady = useCallback(() => {
    setReady(true)
    markReady('scene')
  }, [])

  const handleFailure = useCallback(() => {
    setFailed(true)
    markReady('scene')
  }, [])

  return (
    <div ref={containerRef} className="hero-scene" data-ready={ready && useWebGL}>
      <SceneFallback className="hero-scene__fallback" />
      {useWebGL && (
        <ErrorBoundary onError={handleFailure}>
          <Suspense fallback={null}>
            <SignalCore
              signals={signals}
              active={visible}
              reducedMotion={reducedMotion}
              quality={quality}
              onReady={handleReady}
              onContextLost={handleFailure}
            />
          </Suspense>
        </ErrorBoundary>
      )}
    </div>
  )
}
