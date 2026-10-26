import { useRef, useState, type CSSProperties } from 'react'
import { AnimatedText } from '../components/motion/AnimatedText'
import { StageGlyph } from '../components/StageGlyph'
import { principles } from '../data/content'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { CINEMATIC, EASE, ScrollTrigger, gsap, useGSAP } from '../lib/gsap'
import './EngineeringPhilosophy.css'

const STEPS = principles.length

export function EngineeringPhilosophy() {
  const rootRef = useRef<HTMLElement>(null)
  const cinematic = useMediaQuery(CINEMATIC)
  const [active, setActive] = useState(0)

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root) return

      if (!cinematic) {
        // Vertical layout: each stage lights up as it crosses the middle of the screen.
        gsap.utils.toArray<HTMLElement>('.approach__stage', root).forEach((stage, index) => {
          ScrollTrigger.create({
            trigger: stage,
            start: 'top 65%',
            end: 'bottom 65%',
            onToggle: (self) => self.isActive && setActive(index),
          })
        })
        return
      }

      // Pinned system map: the signal line travels IDEA → IMPROVE as you scroll.
      gsap
        .timeline({
          scrollTrigger: {
            trigger: root.querySelector('.approach__pin'),
            pin: true,
            start: 'top top',
            end: () => `+=${window.innerHeight * 3}`,
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: (self) => setActive(Math.min(STEPS - 1, Math.floor(self.progress * STEPS))),
          },
        })
        .fromTo('.approach__signal', { scaleX: 0 }, { scaleX: 1, ease: EASE.none })
    },
    { scope: rootRef, dependencies: [cinematic], revertOnUpdate: true },
  )

  return (
    <section id="approach" ref={rootRef} className="approach" data-mode={cinematic ? 'cinematic' : 'native'} aria-labelledby="approach-title">
      <div className="approach__pin">
        <div className="container approach__inner">
          <header className="approach__head">
            <span className="section-label mono" data-reveal="fade">
              <span className="section-label__index">(03)</span>
              Engineering philosophy
            </span>
            <h2 id="approach-title" className="approach__title">
              <AnimatedText lines={['From signal', 'to system.']} reveal />
            </h2>
            <p className="approach__lead" data-reveal="up">
              The loop I follow on every project — whatever its size. Not a large-team process, just the habits that keep
              a build honest.
            </p>
          </header>

          {/* Decorative map; the ordered list below carries the content. */}
          <div className="approach__map" aria-hidden="true">
            <div className="approach__line">
              <span className="approach__signal" />
            </div>
            {principles.map((principle, index) => (
              <div
                key={principle.stage}
                className="approach__node"
                data-state={index < active ? 'done' : index === active ? 'active' : 'idle'}
                style={{ '--x': index / (STEPS - 1) } as CSSProperties}
              >
                <span className="approach__dot">
                  <i />
                </span>
                <span className="approach__node-index mono">{principle.index}</span>
                <span className="approach__node-label">{principle.stage}</span>
              </div>
            ))}
          </div>

          <ol className="approach__stages">
            {principles.map((principle, index) => (
              <li key={principle.stage} className="approach__stage" data-active={index === active}>
                <StageGlyph index={index} className="approach__glyph" />
                <span className="approach__stage-index mono">
                  <span className="red">{principle.index}</span> — {principle.stage}
                </span>
                <h3 className="approach__stage-title">{principle.title}</h3>
                <p className="approach__stage-body">{principle.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
