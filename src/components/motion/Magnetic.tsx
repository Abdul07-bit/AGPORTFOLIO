import { useRef, type ReactNode } from 'react'
import { MEDIA, gsap, useGSAP } from '../../lib/gsap'

interface MagneticProps {
  children: ReactNode
  /** Fraction of the pointer offset the element follows. */
  strength?: number
  className?: string
}

/** Subtly pulls its child towards the pointer on desktop. */
export function Magnetic({ children, strength = 0.25, className }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      const element = ref.current
      if (!element || !window.matchMedia(`${MEDIA.finePointer} and ${MEDIA.motionOK}`).matches) return

      const xTo = gsap.quickTo(element, 'x', { duration: 0.7, ease: 'power3.out' })
      const yTo = gsap.quickTo(element, 'y', { duration: 0.7, ease: 'power3.out' })

      const move = (event: PointerEvent) => {
        const rect = element.getBoundingClientRect()
        xTo((event.clientX - (rect.left + rect.width / 2)) * strength)
        yTo((event.clientY - (rect.top + rect.height / 2)) * strength)
      }
      const leave = () => {
        xTo(0)
        yTo(0)
      }

      element.addEventListener('pointermove', move)
      element.addEventListener('pointerleave', leave)
      return () => {
        element.removeEventListener('pointermove', move)
        element.removeEventListener('pointerleave', leave)
      }
    },
    { scope: ref, dependencies: [strength] },
  )

  return (
    <span ref={ref} className={['magnetic', className].filter(Boolean).join(' ')}>
      {children}
    </span>
  )
}
