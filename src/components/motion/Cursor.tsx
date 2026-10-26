import { useEffect, useRef } from 'react'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { MEDIA, gsap } from '../../lib/gsap'
import './Cursor.css'

const INTERACTIVE = 'a, button, [role="button"], [data-cursor], label, summary'

/**
 * Precise dot + trailing ring. Only on fine pointers with motion allowed;
 * everywhere else the native cursor is untouched.
 */
export function Cursor() {
  const enabled = useMediaQuery(`${MEDIA.finePointer} and ${MEDIA.motionOK}`)
  const rootRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const ring = ringRef.current
    const dot = dotRef.current
    const label = labelRef.current
    if (!enabled || !root || !ring || !dot || !label) return

    document.documentElement.classList.add('has-custom-cursor')

    const ringX = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3.out' })
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3.out' })
    const dotX = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'none' })
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'none' })

    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      root.dataset.visible = 'true'
      ringX(event.clientX)
      ringY(event.clientY)
      dotX(event.clientX)
      dotY(event.clientY)
    }

    const over = (event: PointerEvent) => {
      const target = event.target as Element | null
      if (!target) return
      if (target.closest('input, textarea, select, [contenteditable="true"]')) {
        root.dataset.state = 'text'
        return
      }
      const interactive = target.closest<HTMLElement>(INTERACTIVE)
      const text = interactive?.dataset.cursor ?? ''
      root.dataset.state = interactive ? (text ? 'label' : 'link') : 'default'
      label.textContent = text
    }

    const down = () => root.classList.add('is-pressed')
    const up = () => root.classList.remove('is-pressed')
    const hide = () => (root.dataset.visible = 'false')

    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerover', over, { passive: true })
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)
    document.documentElement.addEventListener('pointerleave', hide)

    return () => {
      document.documentElement.classList.remove('has-custom-cursor')
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      document.documentElement.removeEventListener('pointerleave', hide)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div ref={rootRef} className="cursor" data-visible="false" data-state="default" aria-hidden="true">
      <div ref={ringRef} className="cursor__ring">
        <span ref={labelRef} className="cursor__label" />
      </div>
      <div ref={dotRef} className="cursor__dot" />
    </div>
  )
}
