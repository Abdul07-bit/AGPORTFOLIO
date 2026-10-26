import {
  Binary,
  Bot,
  Boxes,
  Braces,
  Brain,
  Cloud,
  CodeXml,
  Container,
  Cpu,
  Database,
  GitBranch,
  Layers,
  Network,
  Server,
  Terminal,
  Workflow,
  type LucideIcon,
} from 'lucide-react'
import { useEffect, useRef, type CSSProperties } from 'react'
import { MEDIA } from '../../lib/gsap'
import './FloatingIcons.css'

const ICONS: LucideIcon[] = [
  CodeXml,
  Database,
  Cloud,
  Cpu,
  GitBranch,
  Terminal,
  Server,
  Bot,
  Braces,
  Container,
  Workflow,
  Network,
  Binary,
  Boxes,
  Brain,
  Layers,
]

// Deterministic layout so the icons sit in the same places on every visit.
let seed = 26
const random = () => {
  seed = (seed * 16807) % 2147483647
  return (seed - 1) / 2147483646
}
const LAYOUT = ICONS.map((Icon, index) => {
  const column = index % 4
  const row = Math.floor(index / 4)
  return {
    Icon,
    x: column * 25 + 3 + random() * 18,
    y: row * 25 + 4 + random() * 16,
    size: 26 + Math.round(random() * 34),
    duration: 24 + Math.round(random() * 26),
    delay: -Math.round(random() * 30),
    depth: 0.04 + random() * 0.1,
    gold: index % 3 !== 0,
  }
})

/** Software icons drifting slowly behind the content, with a light scroll parallax. */
export function FloatingIcons() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const layer = ref.current
    if (!layer || !window.matchMedia(MEDIA.motionOK).matches) return
    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => layer.style.setProperty('--scroll', String(window.scrollY)))
    }
    window.addEventListener('scroll', update, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', update)
    }
  }, [])

  return (
    <div ref={ref} className="float-icons" aria-hidden="true">
      {LAYOUT.map(({ Icon, x, y, size, duration, delay, depth, gold }, index) => (
        <span
          key={index}
          className="float-icons__item"
          data-tone={gold ? 'gold' : 'ivory'}
          style={
            {
              '--x': `${x}%`,
              '--y': `${y}%`,
              '--size': `${size}px`,
              '--duration': `${duration}s`,
              '--delay': `${delay}s`,
              '--depth': depth,
            } as CSSProperties
          }
        >
          <span className="float-icons__drift">
            <Icon strokeWidth={1} />
          </span>
        </span>
      ))}
    </div>
  )
}
