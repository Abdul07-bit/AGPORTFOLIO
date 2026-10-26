import { ArrowRight } from 'lucide-react'
import { useRef } from 'react'
import { Link } from 'react-router'
import { AnimatedText } from '../components/motion/AnimatedText'
import { journey } from '../data/content'
import { EASE, MEDIA, gsap, useGSAP } from '../lib/gsap'
import './Journey.css'

export function Journey() {
  const rootRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MEDIA.motionOK, () => {
        gsap.fromTo(
          '.journey__line-fill',
          { scaleY: 0 },
          { scaleY: 1, ease: EASE.none, scrollTrigger: { trigger: '.journey__track', start: 'top 70%', end: 'bottom 70%', scrub: 0.4 } },
        )
        gsap.utils.toArray<HTMLElement>('.journey__item').forEach((item) => {
          gsap.fromTo(
            item,
            { opacity: 0, y: 28 },
            { opacity: 1, y: 0, duration: 1, ease: EASE.out, scrollTrigger: { trigger: item, start: 'top 85%', once: true } },
          )
          gsap.to(item, {
            '--dot-scale': 1,
            duration: 0.01,
            scrollTrigger: { trigger: item, start: 'top 70%', toggleActions: 'play none none reverse' },
          })
        })
      })
      return () => mm.revert()
    },
    { scope: rootRef },
  )

  return (
    <section id="journey" ref={rootRef} className="section journey" aria-labelledby="journey-title">
      <div className="container journey__grid">
        <header className="journey__head">
          <span className="section-label mono" data-reveal="fade">
            <span className="section-label__index">(06)</span>
            Education &amp; journey
          </span>
          <h2 id="journey-title" className="journey__title">
            <AnimatedText lines={['The journey', 'so far.']} reveal />
          </h2>
          <p className="journey__lead" data-reveal="up">
            Projects, milestones, certifications and education — most recent first.
          </p>
        </header>

        <div className="journey__track">
          <span className="journey__line" aria-hidden="true">
            <span className="journey__line-fill" />
          </span>
          <ol className="journey__list">
          {journey.map((entry) => (
            <li key={entry.title} className="journey__item">
              <span className="journey__dot" aria-hidden="true" />
              <div className="journey__meta mono">
                <span className="red">{entry.kind}</span>
                <span className="muted">{entry.when}</span>
              </div>
              <h3 className="journey__item-title">{entry.title}</h3>
              <p className="journey__context mono muted">{entry.context}</p>
              <p className="journey__desc">{entry.description}</p>
              {entry.href && (
                <Link to={entry.href} className="text-link mono journey__link">
                  Read the case study <ArrowRight aria-hidden="true" />
                  <span className="sr-only">: {entry.title}</span>
                </Link>
              )}
            </li>
          ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
