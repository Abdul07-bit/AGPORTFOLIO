// Central GSAP setup. Import gsap, ScrollTrigger and useGSAP from here so the
// plugins are registered exactly once and motion tokens stay consistent.
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/** Easing vocabulary — premium, decisive, never springy. */
export const EASE = {
  out: 'expo.out',
  soft: 'power3.out',
  inOut: 'power3.inOut',
  none: 'none',
} as const

/** Durations in seconds (mirrors --dur-* tokens in tokens.css). */
export const DUR = {
  fast: 0.45,
  base: 0.9,
  slow: 1.3,
} as const

export const STAGGER = 0.08

export const MEDIA = {
  desktop: '(min-width: 1024px)',
  finePointer: '(hover: hover) and (pointer: fine)',
  motionOK: '(prefers-reduced-motion: no-preference)',
  reducedMotion: '(prefers-reduced-motion: reduce)',
} as const

/** Desktop with a mouse and motion allowed — pinned, scrubbed choreography. */
export const CINEMATIC = `${MEDIA.desktop} and ${MEDIA.finePointer} and ${MEDIA.motionOK}`

gsap.defaults({ ease: EASE.out, duration: DUR.base })
ScrollTrigger.config({ ignoreMobileResize: true })

export { gsap, ScrollTrigger, useGSAP }
