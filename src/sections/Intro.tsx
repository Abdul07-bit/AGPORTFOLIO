import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { profile } from '../data/profile'
import { prefersReducedMotion } from '../lib/animations'
import { completeIntro, getProgress, markReady } from '../lib/loading'
import { gsap, useGSAP } from '../lib/gsap'
import { lockScroll, unlockScroll } from '../lib/scroll'
import './Intro.css'

const SEEN_KEY = 'ag:intro-seen'
const MIN_DURATION = 1700 // ms — long enough for the name to form and shimmer once
const SCENE_BUDGET = 1000 // ms — never hold the page for 3D; the static core shows until it is ready
const HARD_LIMIT = 3000 // ms — absolute cap, whatever happens

const readSeen = () => {
  try {
    return sessionStorage.getItem(SEEN_KEY) === '1'
  } catch {
    return false
  }
}
const writeSeen = () => {
  try {
    sessionStorage.setItem(SEEN_KEY, '1')
  } catch {
    // storage unavailable — the intro will simply play again
  }
}

// ─── Particle orbital form ─────────────────────────────────────────────────

interface Orbit {
  rx: number
  ry: number
  rotation: number
  share: number
  speed: number
}

const ORBITS: Orbit[] = [
  { rx: 128, ry: 40, rotation: -0.38, share: 0.38, speed: 0.35 },
  { rx: 98, ry: 62, rotation: 0.6, share: 0.26, speed: -0.28 },
  { rx: 36, ry: 36, rotation: 0, share: 0.2, speed: 0.6 },
  { rx: 156, ry: 26, rotation: 0.14, share: 0.16, speed: 0.18 },
]

interface Particle {
  orbit: Orbit
  angle: number
  startX: number
  startY: number
  delay: number
}

function createParticles(count: number): Particle[] {
  let seed = 11
  const random = () => {
    seed = (seed * 16807) % 2147483647
    return (seed - 1) / 2147483646
  }
  const particles: Particle[] = []
  ORBITS.forEach((orbit) => {
    const amount = Math.round(count * orbit.share)
    for (let i = 0; i < amount; i++) {
      const radius = 140 + random() * 160
      const theta = random() * Math.PI * 2
      particles.push({
        orbit,
        angle: (i / amount) * Math.PI * 2 + random() * 0.05,
        startX: Math.cos(theta) * radius,
        startY: Math.sin(theta) * radius,
        delay: random() * 0.35,
      })
    }
  })
  return particles
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 4)

// The name, split into words and letters for the staggered reveal.
const NAME_WORDS = profile.name.toUpperCase().split(' ')

export function Intro() {
  const [done, setDone] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const redRef = useRef({ mix: 0 })
  const { contextSafe } = useGSAP({ scope: rootRef })

  useEffect(() => {
    document.getElementById('boot')?.remove()
    markReady('app')

    const root = rootRef.current
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!root || !canvas || !context) {
      completeIntro()
      setDone(true)
      return
    }

    const quick = readSeen() || prefersReducedMotion()
    root.dataset.quick = String(quick)
    // Repeat visits and reduced motion never wait for the 3D scene — it fades in behind.
    if (quick) markReady('scene')
    const particles = createParticles(170)
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const size = canvas.clientWidth || 360
    canvas.width = size * dpr
    canvas.height = size * dpr
    context.scale(dpr, dpr)

    lockScroll()

    const startTime = performance.now()
    let previous = startTime
    let shown = 0
    let frame = 0
    let exiting = false

    const draw = (elapsed: number) => {
      const assembly = quick ? 1 : Math.min(1, elapsed / 1000)
      const red = redRef.current.mix
      context.clearRect(0, 0, size, size)
      context.save()
      context.translate(size / 2, size / 2)
      const scale = size / 360

      for (const particle of particles) {
        const local = quick ? 1 : easeOut(Math.min(1, Math.max(0, (assembly - particle.delay) / 0.65)))
        const { orbit } = particle
        const angle = particle.angle + (quick ? 0 : (elapsed / 1000) * orbit.speed)
        const ox = Math.cos(angle) * orbit.rx
        const oy = Math.sin(angle) * orbit.ry
        const tx = ox * Math.cos(orbit.rotation) - oy * Math.sin(orbit.rotation)
        const ty = ox * Math.sin(orbit.rotation) + oy * Math.cos(orbit.rotation)
        const x = (particle.startX + (tx - particle.startX) * local) * scale
        const y = (particle.startY + (ty - particle.startY) * local) * scale
        // Parchment ivory → burnished gold as the form "illuminates".
        const r = Math.round(232 + (226 - 232) * red)
        const g = Math.round(223 + (172 - 223) * red)
        const b = Math.round(204 + (78 - 204) * red)
        context.fillStyle = `rgba(${r},${g},${b},${0.2 + 0.8 * local})`
        context.beginPath()
        context.arc(x, y, 1.15, 0, Math.PI * 2)
        context.fill()
      }

      // Core: appears once the form has assembled.
      const coreAlpha = Math.max(0, (assembly - 0.55) / 0.45)
      if (coreAlpha > 0) {
        const glow = context.createRadialGradient(0, 0, 0, 0, 0, 34 * scale)
        glow.addColorStop(0, `rgba(201,164,92,${0.55 * red * coreAlpha})`)
        glow.addColorStop(0.35, `rgba(232,223,204,${0.22 * coreAlpha})`)
        glow.addColorStop(1, 'rgba(232,223,204,0)')
        context.fillStyle = glow
        context.beginPath()
        context.arc(0, 0, 34 * scale, 0, Math.PI * 2)
        context.fill()
        context.fillStyle = red > 0.5 ? `rgba(201,164,92,${coreAlpha})` : `rgba(232,223,204,${coreAlpha})`
        context.beginPath()
        context.arc(0, 0, 3.2 * scale, 0, Math.PI * 2)
        context.fill()
      }
      context.restore()
    }

    const exit = contextSafe(() => {
      exiting = true
      const timeline = gsap.timeline({
        onComplete: () => {
          writeSeen()
          unlockScroll()
          setDone(true)
        },
      })
      if (quick) {
        completeIntro()
        timeline.to(root, { autoAlpha: 0, duration: 0.45, ease: 'power2.out' })
        return
      }
      // ≈1.2 s: the halo glows gold, the name's letters lift away one by one,
      // then the overlay wipes up while the hero headline rises underneath.
      timeline
        .to(redRef.current, { mix: 1, duration: 0.25, ease: 'power2.out' })
        .to(
          '.intro__char',
          { yPercent: -60, autoAlpha: 0, filter: 'blur(8px)', duration: 0.55, ease: 'power3.in', stagger: { each: 0.03, from: 'center' } },
          0.05,
        )
        .to(canvas, { scale: 1.4, autoAlpha: 0, duration: 0.6, ease: 'power3.in' }, 0.1)
        .to(redRef.current, { mix: 0.2, duration: 0.4 }, 0.25)
        .to(root, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.85, ease: 'power4.inOut' }, 0.4)
        .add(completeIntro, 0.55)
    })

    const loop = (now: number) => {
      const elapsed = now - startTime
      const seconds = Math.min(0.1, (now - previous) / 1000)
      previous = now
      if (elapsed > SCENE_BUDGET) markReady('scene')
      const target = elapsed > HARD_LIMIT ? 100 : getProgress()
      // Time-based easing towards real progress, so slow frames never stall the counter.
      shown = quick ? target : shown + (target - shown) * (1 - Math.exp(-seconds * 10)) + seconds * 70
      shown = Math.min(shown, target)

      draw(elapsed)

      const finished = shown >= 99.5 && (quick || elapsed >= MIN_DURATION)
      if (finished && !exiting) exit()
      frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(frame)
      unlockScroll()
    }
  }, [contextSafe])

  if (done) return null

  return (
    // Purely visual: the page underneath is already in the accessibility tree.
    <div ref={rootRef} className="intro" aria-hidden="true">
      <canvas ref={canvasRef} className="intro__canvas" aria-hidden="true" />

      {/* Only the name — no labels or counter. Loading progress is still tracked
          internally so the loader waits for real readiness. */}
      <div className="intro__title">
        <span className="intro__name">
          {NAME_WORDS.map((word, wordIndex) => (
            <span key={wordIndex} className="intro__word">
              {word.split('').map((char, charIndex) => {
                const order = NAME_WORDS.slice(0, wordIndex).join('').length + charIndex
                return (
                  <span key={charIndex} className="intro__char" style={{ '--i': order } as CSSProperties}>
                    {char}
                  </span>
                )
              })}
            </span>
          ))}
        </span>
      </div>
    </div>
  )
}
