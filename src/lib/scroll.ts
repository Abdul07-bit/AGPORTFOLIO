// Smooth scrolling (Lenis) coordinated with GSAP's ticker so ScrollTrigger and
// the scroll position never disagree. Lenis only runs on fine pointers with
// motion allowed — touch devices keep native scrolling.
import Lenis from 'lenis'
import { prefersReducedMotion } from './animations'
import { MEDIA, ScrollTrigger, gsap } from './gsap'

let lenis: Lenis | null = null

export function startSmoothScroll(): () => void {
  if (lenis || prefersReducedMotion() || !window.matchMedia(MEDIA.finePointer).matches) {
    return () => {}
  }

  const instance = new Lenis({ lerp: 0.11, wheelMultiplier: 0.95, autoRaf: false })
  lenis = instance
  instance.on('scroll', ScrollTrigger.update)

  const tick = (time: number) => instance.raf(time * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)

  return () => {
    gsap.ticker.remove(tick)
    gsap.ticker.lagSmoothing(500, 33)
    instance.destroy()
    lenis = null
  }
}

type Target = string | HTMLElement | number

const resolveTop = (target: Target): number | null => {
  if (typeof target === 'number') return target
  const element = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target
  if (!element) return null
  return element.getBoundingClientRect().top + window.scrollY
}

export function scrollToTarget(target: Target, { immediate = false, offset = 0 } = {}) {
  const instant = immediate || prefersReducedMotion()
  if (lenis) {
    // Lenis caches the scroll limit; after a route change or pin refresh the
    // page height may have changed, so re-measure before jumping.
    lenis.resize()
    lenis.scrollTo(target, {
      offset,
      immediate: instant,
      force: true,
      duration: 1.5,
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
    })
    return
  }
  const top = resolveTop(target)
  if (top === null) return
  window.scrollTo({ top: top + offset, behavior: instant ? 'auto' : 'smooth' })
}

export function lockScroll() {
  lenis?.stop()
  document.documentElement.style.overflow = 'hidden'
}

export function unlockScroll() {
  document.documentElement.style.overflow = ''
  lenis?.start()
}
