import { ArrowRight, ArrowUpRight, CalendarCheck, LayoutDashboard, Phone, Workflow, type LucideIcon } from 'lucide-react'
import { useRef } from 'react'
import { Link } from 'react-router'
import { AnimatedText } from '../components/motion/AnimatedText'
import { Magnetic } from '../components/motion/Magnetic'
import { founderLayers, founderNeeds, founderPreviews, founderStages } from '../data/content'
import { profile } from '../data/profile'
import { getProject, projectHref } from '../data/projects'
import { DUR, EASE, MEDIA, gsap, useGSAP } from '../lib/gsap'
import './FounderSection.css'

// Grid placement: needs in the corners, technology layers on the edges, core in the centre.
const needCells = ['tl', 'tr', 'bl', 'br']
const layerCells = ['t', 'l', 'r', 'b']
const cellCenter: Record<string, [number, number]> = {
  tl: [50, 50],
  t: [150, 50],
  tr: [250, 50],
  l: [50, 150],
  r: [250, 150],
  bl: [50, 250],
  b: [150, 250],
  br: [250, 250],
}
const previewIcons: LucideIcon[] = [Phone, CalendarCheck, Workflow, LayoutDashboard]

export function FounderSection() {
  const rootRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MEDIA.motionOK, () => {
        const scrollTrigger = { trigger: '.founder__diagram', start: 'top 72%', once: true }
        gsap
          .timeline({ scrollTrigger })
          .fromTo('.founder__core', { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: DUR.slow, ease: EASE.out })
          .fromTo('.founder__wire', { opacity: 0 }, { opacity: 1, duration: 1.1, ease: EASE.inOut, stagger: 0.06 }, 0.2)
          .fromTo('.founder__layer', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: DUR.base, stagger: 0.08 }, 0.5)
          .fromTo('.founder__need', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: DUR.base, stagger: 0.08 }, 0.7)
      })
      return () => mm.revert()
    },
    { scope: rootRef },
  )

  const externalUrl = profile.smartAutoFlexUrl
  // The case study can be hidden from the admin panel.
  const hasCaseStudy = Boolean(getProject('smartautoflex'))

  return (
    <section id="founder" ref={rootRef} className="section founder" aria-labelledby="founder-title">
      <div className="container">
        <header className="founder__head">
          <span className="section-label mono" data-reveal="fade">
            <span className="section-label__index">(05)</span>
            Founder — SmartAutoFlex
          </span>
          <h2 id="founder-title" className="founder__title">
            <AnimatedText
              lines={['Don’t just imagine', 'the product.', 'Build the system', 'behind it.']}
              lineClassName={(index) => (index >= 2 ? 'founder__title-accent' : undefined)}
              reveal
            />
          </h2>
          <p className="founder__lead" data-reveal="up">
            I founded SmartAutoFlex in December 2025 — an AI automation startup that builds chatbots, voice agents and
            automation workflows so businesses spend less time on repetitive operational work and serve customers better.
          </p>
        </header>

        <figure className="founder__diagram">
          <svg className="founder__wires" viewBox="0 0 300 300" preserveAspectRatio="none" aria-hidden="true">
            {[...needCells, ...layerCells].map((cell) => {
              const [x, y] = cellCenter[cell]
              return (
                <line
                  key={cell}
                  className="founder__wire"
                  data-kind={needCells.includes(cell) ? 'need' : 'layer'}
                  x1={x}
                  y1={y}
                  x2="150"
                  y2="150"
                  vectorEffect="non-scaling-stroke"
                />
              )
            })}
          </svg>

          {founderNeeds.map((need, index) => (
            <div key={need.id} className="founder__need" data-cell={needCells[index]}>
              <span className="mono muted">Business need</span>
              <strong>{need.label}</strong>
              <span className="founder__need-detail">{need.detail}</span>
            </div>
          ))}

          {founderLayers.map((layer, index) => (
            <div key={layer.id} className="founder__layer" data-cell={layerCells[index]}>
              <strong>{layer.label}</strong>
              <span className="mono muted">{layer.detail}</span>
            </div>
          ))}

          <div className="founder__core" data-cell="c">
            <span className="founder__core-ring" aria-hidden="true" />
            <span className="founder__core-ring founder__core-ring--outer" aria-hidden="true" />
            <span className="founder__core-dot" aria-hidden="true" />
            <strong>SmartAutoFlex</strong>
            <span className="mono muted">Intelligence layer</span>
          </div>

          <figcaption className="sr-only">
            SmartAutoFlex connects business needs — repeated enquiries, bookings and calls, manual data entry and the lack
            of a single operational view — through AI, applications, automation and infrastructure.
          </figcaption>
        </figure>

        <ol className="founder__stages" data-reveal="stagger">
          {founderStages.map((stage) => (
            <li key={stage.index} className="founder__stage">
              <span className="mono red">{stage.index}</span>
              <h3>{stage.title}</h3>
              <p>{stage.body}</p>
            </li>
          ))}
        </ol>

        <div className="founder__previews">
          <p className="mono muted founder__previews-label" data-reveal="fade">
            What SmartAutoFlex builds — clearly labelled
          </p>
          <ul className="founder__preview-grid" data-reveal="stagger">
            {founderPreviews.map((preview, index) => {
              const Icon = previewIcons[index]
              return (
                <li key={preview.title} className="founder__preview">
                  <div className="founder__preview-top">
                    <Icon aria-hidden="true" />
                    <span className="chip" data-kind={preview.status === 'Concept' ? 'concept' : 'live'}>
                      {preview.status}
                    </span>
                  </div>
                  <div className="founder__preview-ui" aria-hidden="true" data-variant={index}>
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>
                  <strong>{preview.title}</strong>
                  <span className="muted">{preview.detail}</span>
                </li>
              )
            })}
          </ul>
          <p className="founder__note muted">
            Built items are in use with SmartAutoFlex today; items marked Concept are ideas still being explored.
          </p>
        </div>

        {(externalUrl || hasCaseStudy) && (
          <div className="founder__cta" data-reveal="up">
            <Magnetic>
              {externalUrl ? (
                <a href={externalUrl} className="btn btn--primary" target="_blank" rel="noopener noreferrer">
                  Explore SmartAutoFlex <ArrowUpRight aria-hidden="true" data-arrow="up-right" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              ) : (
                <Link to={projectHref('smartautoflex')} className="btn btn--primary">
                  Explore SmartAutoFlex <ArrowRight aria-hidden="true" data-arrow="right" />
                </Link>
              )}
            </Magnetic>
          </div>
        )}
      </div>
    </section>
  )
}
