import { useRef } from 'react'
import { useLocation } from 'react-router'
import { homeSections } from '../../data/navigation'
import { ScrollTrigger, useGSAP } from '../../lib/gsap'
import { useActiveSection } from '../../lib/sections'
import './SectionProgress.css'

/** Overall journey indicator: a thin line that fills with scroll, plus the current section. */
export function SectionProgress() {
  const rootRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const active = useActiveSection()
  const isHome = location.pathname === '/'

  const index = homeSections.findIndex((section) => section.id === active)
  const current = isHome && index >= 0 ? homeSections[index] : null

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root) return
      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => root.style.setProperty('--progress', self.progress.toFixed(4)),
      })
    },
    { scope: rootRef, dependencies: [location.pathname], revertOnUpdate: true },
  )

  return (
    <div ref={rootRef} className="progress" data-section={current?.id ?? 'none'} aria-hidden="true">
      <div className="progress__bar" />
      <div className="progress__rail">
        <span className="progress__index mono">{current ? String(index).padStart(2, '0') : isHome ? '00' : 'CS'}</span>
        <span className="progress__track">
          <span className="progress__fill" />
        </span>
        <span className="progress__label mono">{current?.label ?? (isHome ? 'Index' : 'Case study')}</span>
      </div>
    </div>
  )
}
