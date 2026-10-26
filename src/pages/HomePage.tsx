import { useEffect, useLayoutEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router'
import { ProjectGallery } from '../components/projects/ProjectGallery'
import { homeSections } from '../data/navigation'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { setupScrollReveals } from '../lib/animations'
import { MEDIA, ScrollTrigger, gsap, useGSAP } from '../lib/gsap'
import { scrollToTarget } from '../lib/scroll'
import { setActiveSection } from '../lib/sections'
import { About } from '../sections/About'
import { Capabilities } from '../sections/Capabilities'
import { CaseFiles } from '../sections/CaseFiles'
import { Closing } from '../sections/Closing'
import { Contact } from '../sections/Contact'
import { EngineeringPhilosophy } from '../sections/EngineeringPhilosophy'
import { FounderSection } from '../sections/FounderSection'
import { Hero } from '../sections/Hero'
import { Journey } from '../sections/Journey'

// Remembered across visits to a case study so "Back" returns to the same spot.
let savedScroll = 0

export function HomePage() {
  const rootRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const navigationType = useNavigationType()
  useDocumentMeta()

  // Child sections create their pins first (effects run child → parent), so
  // everything below measures positions with pin spacing already in place.
  useGSAP(
    () => {
      setupScrollReveals(rootRef.current)

      homeSections.forEach((section) => {
        const element = document.getElementById(section.id)
        if (!element) return
        ScrollTrigger.create({
          trigger: element,
          start: 'top 45%',
          end: 'bottom 45%',
          onToggle: (self) => self.isActive && setActiveSection(section.id),
        })
      })

      // Ambient light drifts between sections.
      const mm = gsap.matchMedia()
      mm.add(MEDIA.motionOK, () => {
        const red = document.querySelector('[data-ambient="red"]')
        const silver = document.querySelector('[data-ambient="silver"]')
        if (!red || !silver) return
        const scrollTrigger = { trigger: rootRef.current, start: 'top top', end: 'bottom bottom', scrub: 1.5 }
        gsap.fromTo(
          red,
          { x: '35vw', y: '-20vh', opacity: 1 },
          {
            keyframes: [
              { x: '-32vw', y: '10vh', opacity: 0.5 },
              { x: '28vw', y: '25vh', opacity: 0.9 },
              { x: '-10vw', y: '-15vh', opacity: 0.6 },
              { x: '0vw', y: '35vh', opacity: 1 },
            ],
            ease: 'none',
            scrollTrigger,
          },
        )
        gsap.fromTo(
          silver,
          { x: '30vw', y: '-30vh' },
          { keyframes: [{ x: '-25vw', y: '-5vh' }, { x: '20vw', y: '-25vh' }, { x: '-30vw', y: '20vh' }], ease: 'none', scrollTrigger },
        )
      })

      return () => {
        mm.revert()
        setActiveSection(null)
      }
    },
    { scope: rootRef },
  )

  // Track scroll position for restoring after a case study. The final value is
  // captured in a layout cleanup, which runs before child sections un-pin and
  // the page shrinks (that shrink would otherwise overwrite it).
  useLayoutEffect(() => {
    let frame = 0
    const save = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => (savedScroll = window.scrollY))
    }
    window.addEventListener('scroll', save, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', save)
      savedScroll = window.scrollY
    }
  }, [])

  // Hash links (/#work) and back/forward restoration.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      ScrollTrigger.refresh()
      if (location.hash) {
        const target = document.getElementById(decodeURIComponent(location.hash.slice(1)))
        if (target) scrollToTarget(target, { immediate: true })
      } else if (navigationType === 'POP' && savedScroll > 0) {
        scrollToTarget(savedScroll, { immediate: true })
      }
    })
    return () => cancelAnimationFrame(frame)
  }, [location.key, location.hash, navigationType])

  return (
    <div ref={rootRef} className="home">
      <Hero />
      <ProjectGallery />
      <About />
      <EngineeringPhilosophy />
      <Capabilities />
      <FounderSection />
      <Journey />
      <CaseFiles />
      <Contact />
      <Closing />
    </div>
  )
}
