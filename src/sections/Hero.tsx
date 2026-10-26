import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { useEffect, useRef, type MouseEvent } from 'react'
import { AnimatedText } from '../components/motion/AnimatedText'
import { Magnetic } from '../components/motion/Magnetic'
import { HeroScene } from '../components/scene/HeroScene'
import { createSceneSignals, type SceneSignals } from '../components/scene/sceneSignals'
import { profile } from '../data/profile'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { DUR, EASE, MEDIA, gsap, useGSAP } from '../lib/gsap'
import { useIntroComplete } from '../lib/loading'
import { scrollToTarget } from '../lib/scroll'
import './Hero.css'

const jump = (target: string) => (event: MouseEvent<HTMLAnchorElement>) => {
  event.preventDefault()
  scrollToTarget(target)
}

export function Hero() {
  const rootRef = useRef<HTMLElement>(null)
  const pointerReadout = useRef<HTMLSpanElement>(null)
  const signals = useRef<SceneSignals>(createSceneSignals())
  const introDone = useIntroComplete()
  const reducedMotion = useReducedMotion()

  // Entrance — held under the intro, then released line by line.
  useGSAP(
    () => {
      if (reducedMotion) return
      const lines = '.hero__title .line-mask__inner'
      const fades = '[data-hero-fade]'
      const scene = '.hero__scene-wrap'

      if (!introDone) {
        gsap.set(lines, { yPercent: 115 })
        gsap.set(fades, { opacity: 0, y: 24 })
        gsap.set(scene, { opacity: 0, scale: 0.9 })
        return
      }

      gsap
        .timeline()
        .fromTo(lines, { yPercent: 115, rotate: 3 }, { yPercent: 0, rotate: 0, duration: 1.5, ease: EASE.out, stagger: 0.11 })
        .fromTo(scene, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 2.2, ease: EASE.out }, 0)
        .fromTo(fades, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: DUR.slow, stagger: 0.07 }, 0.45)
    },
    { scope: rootRef, dependencies: [introDone, reducedMotion], revertOnUpdate: true },
  )

  // Scroll choreography — lines separate, the core recedes, the grid drifts.
  useGSAP(
    () => {
      const root = rootRef.current
      if (!root) return
      const mm = gsap.matchMedia()
      mm.add(MEDIA.motionOK, () => {
        const timeline = gsap.timeline({
          defaults: { ease: EASE.none },
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.6,
            onUpdate: (self) => {
              signals.current.progress = self.progress
            },
          },
        })
        timeline
          .to('.hero__line--0', { xPercent: -6, yPercent: -40 }, 0)
          .to('.hero__line--1', { xPercent: 9, yPercent: -70 }, 0)
          .to('.hero__line--2', { xPercent: -3, yPercent: -100 }, 0)
          .to('.hero__title', { opacity: 0.15 }, 0)
          .to('.hero__bottom, .hero__top', { yPercent: -60, opacity: 0 }, 0)
          .to('.hero__scene-wrap', { yPercent: 28 }, 0)
          .to('.hero__grid', { yPercent: 18 }, 0)
      })
      return () => mm.revert()
    },
    { scope: rootRef },
  )

  // Pointer → 3D scene + live coordinate readout (fine pointers only).
  useEffect(() => {
    if (!window.matchMedia(MEDIA.finePointer).matches) return
    let frame = 0
    const move = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1
      const y = (event.clientY / window.innerHeight) * 2 - 1
      signals.current.pointerX = x
      signals.current.pointerY = y
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        if (pointerReadout.current) {
          pointerReadout.current.textContent = `${x >= 0 ? '+' : '−'}${Math.abs(x).toFixed(2)}  ${y >= 0 ? '+' : '−'}${Math.abs(y).toFixed(2)}`
        }
      })
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => {
      window.removeEventListener('pointermove', move)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <section id="top" ref={rootRef} className="hero" aria-labelledby="hero-title">
      <div className="hero__grid" aria-hidden="true">
        <span />
        <span />
      </div>

      <div className="hero__scene-wrap">
        <HeroScene signals={signals} />
      </div>

      <div className="hero__inner container">
        <div className="hero__top">
          <p className="hero__eyebrow mono" data-hero-fade>
            <span className="hero__eyebrow-dot" aria-hidden="true" />
            <span>
              <span className="hero__eyebrow-main">AI &amp; Data Science</span>
              <span className="muted">Software engineering / Automation / Cloud</span>
            </span>
          </p>
          <div className="hero__readout mono muted" data-hero-fade aria-hidden="true">
            <span>Signal core — interactive</span>
            <span>
              PTR <span ref={pointerReadout}>+0.00 +0.00</span>
            </span>
          </div>
        </div>

        <h1 id="hero-title" className="hero__title">
          <AnimatedText
            lines={[
              'I build',
              'intelligent',
              <>
                digital systems<span className="hero__period">.</span>
              </>,
            ]}
            lineClassName={(index) => `hero__line hero__line--${index}`}
          />
        </h1>

        <div className="hero__bottom">
          <p className="hero__lead" data-hero-fade>
            From intelligent automation and data systems to full-stack digital products, I turn complex ideas into
            practical, scalable experiences.
          </p>
          <div className="hero__ctas" data-hero-fade>
            <Magnetic>
              <a href="#work" className="btn btn--primary" onClick={jump('#work')}>
                Explore the work
                <ArrowDown aria-hidden="true" data-arrow="down" />
              </a>
            </Magnetic>
            <Magnetic>
              <a href="#contact" className="btn" onClick={jump('#contact')}>
                Let’s build something
                <ArrowUpRight aria-hidden="true" data-arrow="up-right" />
              </a>
            </Magnetic>
          </div>
          {profile.availability && (
            <p className="hero__availability mono" data-hero-fade>
              <span className="hero__eyebrow-dot" aria-hidden="true" />
              {profile.availability}
            </p>
          )}
        </div>
      </div>

      <a href="#work" className="hero__scroll" onClick={jump('#work')} aria-label="Scroll to selected work">
        <span className="mono">Scroll</span>
        <span className="hero__scroll-line" aria-hidden="true">
          <span className="hero__scroll-dot" />
        </span>
      </a>
    </section>
  )
}
