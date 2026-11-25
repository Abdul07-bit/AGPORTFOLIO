import { useRef } from 'react'
import { Link } from 'react-router'
import { ScrollMarquee } from '../components/motion/ScrollMarquee'
import { projectHref } from '../data/projects'
import { MEDIA, gsap, useGSAP } from '../lib/gsap'
import './Highlights.css'

// Every figure comes straight from the resume (November 2026).
const stats = [
  { value: 7, label: 'Small-business clients', detail: 'AI agents designed and deployed, requirements to production', href: projectHref('smartautoflex') },
  { value: 12, label: 'Orchestrated agents', detail: 'Stateful, tool-using agents in FormLaw', href: projectHref('formlaw') },
  { value: 226, label: 'Automated tests', detail: '183 pytest + 6 Playwright (FormLaw) and 37 (IntelliScrutiny)', href: projectHref('intelliscrutiny') },
  { value: 3, label: 'Businesses, one login', detail: 'Restaurant, hotel and retail modules in SAF Flow', href: projectHref('saf-flow') },
]

const marqueeRows = [
  ['Multi-agent systems', 'LangGraph', 'RAG', 'Human-in-the-loop'],
  ['FastAPI', 'pgvector', 'Docker', 'Prompt engineering'],
]

/** A band between chapters: words that move with the scroll, then numbers that count up with it. */
export function Highlights() {
  const rootRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MEDIA.motionOK, () => {
        gsap.utils.toArray<HTMLElement>('.highlights__stat', rootRef.current).forEach((stat, index) => {
          const number = stat.querySelector<HTMLElement>('.highlights__number')
          if (!number) return
          const target = Number(number.dataset.value)
          const counter = { value: 0 }
          number.textContent = '0'
          // Scrubbed: the count is tied to scroll position, so it rewinds on the way back up.
          gsap.to(counter, {
            value: target,
            ease: 'none',
            onUpdate: () => (number.textContent = String(Math.round(counter.value))),
            scrollTrigger: { trigger: stat, start: 'top 92%', end: 'top 45%', scrub: 0.6 },
          })
          gsap.fromTo(
            stat,
            { y: 60 + index * 24, opacity: 0.15 },
            { y: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: stat, start: 'top 98%', end: 'top 55%', scrub: 0.6 } },
          )
          gsap.fromTo(
            stat.querySelector('.highlights__rule'),
            { scaleX: 0 },
            { scaleX: 1, ease: 'none', scrollTrigger: { trigger: stat, start: 'top 90%', end: 'top 50%', scrub: 0.6 } },
          )
        })
      })
      return () => {
        mm.revert()
        rootRef.current?.querySelectorAll<HTMLElement>('.highlights__number').forEach((number) => (number.textContent = number.dataset.value ?? ''))
      }
    },
    { scope: rootRef },
  )

  return (
    <section ref={rootRef} className="highlights" aria-labelledby="highlights-title">
      <ScrollMarquee rows={marqueeRows} />
      <div className="container">
        <h2 id="highlights-title" className="sr-only">
          At a glance
        </h2>
        <ul className="highlights__grid">
          {stats.map((stat) => (
            <li key={stat.label} className="highlights__stat">
              <span className="highlights__rule" aria-hidden="true" />
              <Link to={stat.href} className="highlights__link">
                <span className="highlights__number" data-value={stat.value}>
                  {stat.value}
                </span>
                <span className="highlights__label mono">{stat.label}</span>
                <span className="highlights__detail">{stat.detail}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
