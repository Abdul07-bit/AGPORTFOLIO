import { Fragment, useRef } from 'react'
import { MEDIA, ScrollTrigger, gsap, useGSAP } from '../../lib/gsap'
import './ScrollMarquee.css'

interface ScrollMarqueeProps {
  /** One row per entry; rows alternate direction. */
  rows: string[][]
  /** Horizontal travel per row across the band's time on screen, in % of its width. */
  travel?: number
}

/**
 * Oversized type that slides sideways with scroll position (scrubbed, so it
 * runs backwards when scrolling up) and leans into fast scrolls.
 * Decorative: the same words appear elsewhere on the page as real content.
 */
export function ScrollMarquee({ rows, travel = 18 }: ScrollMarqueeProps) {
  const rootRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root) return
      const mm = gsap.matchMedia()
      mm.add(MEDIA.motionOK, () => {
        const tracks = gsap.utils.toArray<HTMLElement>('.marquee__track', root)
        tracks.forEach((track, index) => {
          const direction = index % 2 === 0 ? -1 : 1
          gsap.fromTo(
            track,
            { xPercent: direction < 0 ? 0 : -travel },
            {
              xPercent: direction < 0 ? -travel : 0,
              ease: 'none',
              scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: 0.5 },
            },
          )
        })

        // Lean into the scroll: skew follows velocity and settles back to 0.
        const skewTo = gsap.quickTo(tracks, 'skewX', { duration: 0.6, ease: 'power3.out' })
        const clamp = gsap.utils.clamp(-12, 12)
        ScrollTrigger.create({
          trigger: root,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => skewTo(clamp(self.getVelocity() / -320)),
          onLeave: () => skewTo(0),
          onLeaveBack: () => skewTo(0),
        })
      })
      return () => mm.revert()
    },
    { scope: rootRef, dependencies: [travel] },
  )

  return (
    <div ref={rootRef} className="marquee" aria-hidden="true">
      {rows.map((words, rowIndex) => (
        <div key={rowIndex} className={`marquee__row marquee__row--${rowIndex % 2 === 0 ? 'solid' : 'outline'}`}>
          <div className="marquee__track">
            {/* Repeated so the row never runs out while it travels. */}
            {[0, 1, 2].map((copy) => (
              <Fragment key={copy}>
                {words.map((word) => (
                  <span key={`${copy}-${word}`} className="marquee__item">
                    {word}
                    <span className="marquee__sep">✦</span>
                  </span>
                ))}
              </Fragment>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
