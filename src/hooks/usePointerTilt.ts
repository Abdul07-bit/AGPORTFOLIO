import { useEffect, type RefObject } from 'react'
import { MEDIA } from '../lib/gsap'

/**
 * Writes pointer position into CSS variables on the element:
 *   --mx / --my  (-1 … 1)  used by cover depth layers
 *   --rx / --ry  (deg)     used for a perspective tilt
 * Fine pointers with motion allowed only.
 */
export function usePointerTilt(ref: RefObject<HTMLElement | null>, maxDegrees = 5) {
  useEffect(() => {
    const element = ref.current
    if (!element || !window.matchMedia(`${MEDIA.finePointer} and ${MEDIA.motionOK}`).matches) return

    let frame = 0
    const set = (x: number, y: number) => {
      element.style.setProperty('--mx', x.toFixed(3))
      element.style.setProperty('--my', y.toFixed(3))
      element.style.setProperty('--rx', `${(-y * maxDegrees).toFixed(2)}deg`)
      element.style.setProperty('--ry', `${(x * maxDegrees).toFixed(2)}deg`)
    }
    const move = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect()
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      const y = ((event.clientY - rect.top) / rect.height) * 2 - 1
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => set(x, y))
    }
    const leave = () => {
      cancelAnimationFrame(frame)
      set(0, 0)
    }

    element.addEventListener('pointermove', move)
    element.addEventListener('pointerleave', leave)
    return () => {
      cancelAnimationFrame(frame)
      element.removeEventListener('pointermove', move)
      element.removeEventListener('pointerleave', leave)
    }
  }, [ref, maxDegrees])
}
