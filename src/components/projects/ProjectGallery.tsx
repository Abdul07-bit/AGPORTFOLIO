import { ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react'
import { useEffect, useRef, useState, type FocusEvent, type MouseEvent } from 'react'
import { projects } from '../../data/projects'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { prefersReducedMotion } from '../../lib/animations'
import { CINEMATIC, EASE, ScrollTrigger, gsap, useGSAP } from '../../lib/gsap'
import { scrollToTarget } from '../../lib/scroll'
import { AnimatedText } from '../motion/AnimatedText'
import { ProjectCard } from './ProjectCard'
import './ProjectGallery.css'

const pad = (value: number) => String(value).padStart(2, '0')
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))
/** Scroll offset at which a panel sits flush with the track's start padding. */
const panelStart = (panel: HTMLElement, track: HTMLElement) => panel.offsetLeft - parseFloat(getComputedStyle(track).paddingLeft)

/**
 * Featured work. Desktop (fine pointer, motion allowed): a pinned section whose
 * track moves horizontally with real scroll progress. Everywhere else: a native,
 * touch-friendly scroll-snap carousel that never traps vertical scrolling.
 */
export function ProjectGallery() {
  const rootRef = useRef<HTMLElement>(null)
  const railRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLOListElement>(null)
  const barRef = useRef<HTMLSpanElement>(null)
  const triggerRef = useRef<ScrollTrigger | null>(null)
  const metrics = useRef({ distance: 0, centers: [] as number[] })
  const cinematic = useMediaQuery(CINEMATIC)
  const [active, setActive] = useState(0)

  // ── Cinematic: pinned horizontal track ────────────────────────────────
  useGSAP(
    () => {
      const root = rootRef.current
      const rail = railRef.current
      triggerRef.current = null
      if (!cinematic || !root || !rail) return

      const panels = gsap.utils.toArray<HTMLElement>('.work__panel', root)
      const distance = () => Math.max(0, rail.scrollWidth - window.innerWidth)
      const measure = () => {
        metrics.current.distance = distance()
        metrics.current.centers = panels.map((panel) => panel.offsetLeft + panel.offsetWidth / 2)
      }

      const tween = gsap.to(rail, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: root.querySelector('.work__pin'),
          pin: true,
          start: 'top top',
          end: () => `+=${distance()}`,
          scrub: 0.8,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onRefresh: measure,
          onUpdate: (self) => {
            const center = self.progress * metrics.current.distance + window.innerWidth / 2
            let nearest = 0
            metrics.current.centers.forEach((value, index) => {
              if (Math.abs(value - center) < Math.abs(metrics.current.centers[nearest] - center)) nearest = index
            })
            setActive(nearest)
            barRef.current?.style.setProperty('transform', `scaleX(${self.progress.toFixed(4)})`)
          },
        },
      })
      triggerRef.current = tween.scrollTrigger ?? null
      measure()

      panels.forEach((panel) => {
        const shared = { trigger: panel, containerAnimation: tween }
        const visual = panel.querySelector('.work-card__visual')
        const art = panel.querySelector('.work-card__art > .cover')
        const number = panel.querySelector('.work-card__number')
        const body = panel.querySelectorAll('.work-card__body > :not(.work-card__number)')

        gsap.fromTo(
          visual,
          { clipPath: 'inset(6% 0% 6% 100%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { ...shared, start: 'left 100%', end: 'left 40%', scrub: true } },
        )
        gsap.fromTo(art, { xPercent: -4 }, { xPercent: 4, ease: 'none', scrollTrigger: { ...shared, start: 'left right', end: 'right left', scrub: true } })
        gsap.fromTo(
          number,
          { yPercent: 70, opacity: 0 },
          { yPercent: 0, opacity: 1, ease: 'none', scrollTrigger: { ...shared, start: 'left 90%', end: 'left 35%', scrub: true } },
        )
        gsap.fromTo(
          body,
          { y: 36, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: EASE.out,
            stagger: 0.07,
            scrollTrigger: { ...shared, start: 'left 72%', toggleActions: 'play none none reverse' },
          },
        )
        gsap.to(panel.querySelector('.work-card'), {
          scale: 0.94,
          opacity: 0.45,
          ease: 'none',
          scrollTrigger: { ...shared, start: 'right 55%', end: 'right 0%', scrub: true },
        })
      })
    },
    { scope: rootRef, dependencies: [cinematic], revertOnUpdate: true },
  )

  // ── Native: track scroll position → indicator ─────────────────────────
  useEffect(() => {
    const track = trackRef.current
    if (cinematic || !track) return
    const update = () => {
      const panels = Array.from(track.children) as HTMLElement[]
      const max = track.scrollWidth - track.clientWidth
      const progress = max > 0 ? track.scrollLeft / max : 0
      const index =
        max > 0 && track.scrollLeft >= max - 4
          ? panels.length - 1
          : panels.reduce(
              (best, panel, i) =>
                Math.abs(panelStart(panel, track) - track.scrollLeft) < Math.abs(panelStart(panels[best], track) - track.scrollLeft)
                  ? i
                  : best,
              0,
            )
      setActive(index)
      barRef.current?.style.setProperty('transform', `scaleX(${progress.toFixed(4)})`)
    }
    update()
    track.addEventListener('scroll', update, { passive: true })
    return () => track.removeEventListener('scroll', update)
  }, [cinematic])

  const goTo = (target: number) => {
    const index = clamp(target, 0, projects.length - 1)
    const trigger = triggerRef.current
    if (cinematic && trigger) {
      const { distance, centers } = metrics.current
      const x = clamp(centers[index] - window.innerWidth / 2, 0, distance)
      scrollToTarget(trigger.start + (distance ? x / distance : 0) * (trigger.end - trigger.start))
      return
    }
    const track = trackRef.current
    const panel = track?.children[index] as HTMLElement | undefined
    if (!track || !panel) return
    track.scrollTo({ left: panelStart(panel, track), behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }

  // Keep keyboard focus visible: bring a focused panel into view.
  const handleFocus = (event: FocusEvent<HTMLOListElement>) => {
    if (!cinematic) return
    const panel = (event.target as Element).closest('.work__panel')
    const index = panel ? Array.from(panel.parentElement?.children ?? []).indexOf(panel) : -1
    if (index >= 0) goTo(index)
  }

  const toCaseFiles = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    scrollToTarget('#case-files')
  }

  return (
    <section id="work" ref={rootRef} className="work" data-mode={cinematic ? 'cinematic' : 'native'} aria-labelledby="work-title">
      <div className="work__pin">
        <div ref={railRef} className="work__rail">
          <header className="work__intro">
            <span className="section-label mono" data-reveal="fade">
              <span className="section-label__index">(01)</span>
              Selected work
            </span>
            <h2 id="work-title" className="work__title">
              <AnimatedText lines={['Selected', 'work']} reveal />
            </h2>
            <p className="work__sub" data-reveal="up">
              A collection of systems, products &amp; experiments.
            </p>
            <p className="work__hint mono muted" data-reveal="fade" aria-hidden="true">
              {cinematic ? 'Keep scrolling' : 'Swipe to browse'}
              <ArrowRight />
            </p>
          </header>

          <ol ref={trackRef} className="work__track" aria-label="Featured projects" onFocus={handleFocus}>
            {projects.map((project, index) => (
              <li key={project.slug} className="work__panel">
                <ProjectCard project={project} position={index + 1} total={projects.length} />
              </li>
            ))}
          </ol>

          <div className="work__outro">
            <p className="work__outro-text">Every build has a full case study — the problem, the workflow, the stack and the lessons.</p>
            <a href="#case-files" className="text-link mono" onClick={toCaseFiles}>
              Browse the case files <ArrowDown aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="work__hud">
          <span className="work__count mono" aria-hidden="true">
            <span className="red">{pad(active + 1)}</span> / {pad(projects.length)}
          </span>
          <span className="work__bar" aria-hidden="true">
            <span ref={barRef} />
          </span>
          <span className="work__current mono muted" aria-hidden="true">
            {projects[active]?.name}
          </span>
          <div className="work__buttons">
            <button type="button" className="icon-btn" onClick={() => goTo(active - 1)} disabled={active === 0} aria-label="Previous project">
              <ArrowLeft aria-hidden="true" />
            </button>
            <button
              type="button"
              className="icon-btn"
              onClick={() => goTo(active + 1)}
              disabled={active === projects.length - 1}
              aria-label="Next project"
            >
              <ArrowRight aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
