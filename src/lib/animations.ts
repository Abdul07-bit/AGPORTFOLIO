// Reusable animation builders. Call them inside useGSAP so every tween and
// ScrollTrigger is collected by the hook's context and reverted on unmount.
//
// Reveals animate `opacity`, never `autoAlpha`: visibility:hidden would remove
// not-yet-revealed links from the tab order and the accessibility tree.
import { DUR, EASE, STAGGER, gsap } from './gsap'

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const START = 'top 86%'

/**
 * Scroll-triggered reveals driven by data attributes:
 *   data-reveal="up"      fade + rise
 *   data-reveal="fade"    opacity only
 *   data-reveal="lines"   masked lines (AnimatedText)
 *   data-reveal="clip"    clip-path wipe from the bottom
 *   data-reveal="stagger" direct children rise in sequence
 *   data-reveal-delay="0.2"
 * Elements inside [data-reveal-skip] are animated by their own section.
 */
export function setupScrollReveals(scope: Element | null) {
  if (!scope || prefersReducedMotion()) return

  scope.querySelectorAll<HTMLElement>('[data-reveal]').forEach((element) => {
    if (element.closest('[data-reveal-skip]')) return
    const type = element.dataset.reveal
    const delay = Number(element.dataset.revealDelay ?? 0)
    const scrollTrigger = { trigger: element, start: START, once: true }

    switch (type) {
      case 'lines':
        gsap.fromTo(
          element.querySelectorAll('.line-mask__inner'),
          { yPercent: 110, rotate: 2 },
          { yPercent: 0, rotate: 0, duration: DUR.slow, stagger: STAGGER, delay, scrollTrigger },
        )
        break
      case 'clip':
        gsap.fromTo(
          element,
          { clipPath: 'inset(100% 0% 0% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: DUR.slow * 1.2, ease: EASE.inOut, delay, scrollTrigger },
        )
        break
      case 'fade':
        gsap.fromTo(element, { opacity: 0 }, { opacity: 1, duration: DUR.slow, ease: EASE.soft, delay, scrollTrigger })
        break
      case 'stagger':
        gsap.fromTo(
          element.children,
          { y: 36, opacity: 0 },
          { y: 0, opacity: 1, duration: DUR.slow, stagger: STAGGER, delay, scrollTrigger },
        )
        break
      default:
        gsap.fromTo(element, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: DUR.slow, delay, scrollTrigger })
    }
  })
}
