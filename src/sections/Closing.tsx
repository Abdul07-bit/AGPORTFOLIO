import { ArrowUp } from 'lucide-react'
import { useRef } from 'react'
import { Magnetic } from '../components/motion/Magnetic'
import { profile } from '../data/profile'
import { EASE, MEDIA, gsap, useGSAP } from '../lib/gsap'
import { scrollToTarget } from '../lib/scroll'
import './Closing.css'

const [first, ...rest] = profile.name.toUpperCase().split(' ')
const words = [first, rest.join(' ')]

/** Cinematic sign-off: the name assembles letter by letter as the page ends. */
export function Closing() {
  const rootRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MEDIA.motionOK, () => {
        gsap.fromTo(
          '.closing__char',
          { yPercent: 105 },
          {
            yPercent: 0,
            ease: EASE.none,
            stagger: 0.04,
            scrollTrigger: { trigger: '.closing__name', start: 'top 95%', end: 'bottom 85%', scrub: 0.6 },
          },
        )
        gsap.fromTo(
          '.closing__signal span',
          { scaleY: 0 },
          { scaleY: 1, ease: EASE.none, scrollTrigger: { trigger: rootRef.current, start: 'top 90%', end: 'top 30%', scrub: true } },
        )
      })
      return () => mm.revert()
    },
    { scope: rootRef },
  )

  return (
    <section ref={rootRef} className="closing" aria-label="Closing">
      <div className="closing__signal" aria-hidden="true">
        <span />
      </div>
      <div className="container closing__inner">
        <p className="closing__kicker mono">
          <span className="red">●</span> End of signal — thanks for scrolling this far.
        </p>
        <p className="closing__name" aria-hidden="true">
          {words.map((word, wordIndex) => (
            <span key={wordIndex} className="closing__word">
              {word.split('').map((char, index) => (
                <span key={index} className="closing__mask">
                  <span className="closing__char">{char}</span>
                </span>
              ))}
            </span>
          ))}
        </p>
        <div className="closing__actions">
          <Magnetic>
            <button type="button" className="btn" onClick={() => scrollToTarget(0)}>
              Back to top <ArrowUp aria-hidden="true" />
            </button>
          </Magnetic>
          <p className="mono muted">
            {profile.role} — software, automation &amp; cloud.
          </p>
        </div>
      </div>
    </section>
  )
}
