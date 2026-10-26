import { Menu, X } from 'lucide-react'
import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { homeSections, primaryNav, type NavId } from '../../data/navigation'
import { activeSocialLinks, profile } from '../../data/profile'
import { lockScroll, scrollToTarget, unlockScroll } from '../../lib/scroll'
import { useActiveSection } from '../../lib/sections'
import './Navigation.css'

export function Navigation() {
  const location = useLocation()
  const navigate = useNavigate()
  const activeSection = useActiveSection()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  const isHome = location.pathname === '/'
  const activeNav: NavId | null = isHome
    ? (homeSections.find((section) => section.id === activeSection)?.nav ?? null)
    : location.pathname.startsWith('/work')
      ? 'work'
      : null

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Mobile menu: lock scroll, trap focus, close on Escape.
  useEffect(() => {
    if (!menuOpen) return
    lockScroll()
    const menu = menuRef.current
    const focusables = () =>
      Array.from(menu?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? [])
    focusables()[0]?.focus()

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        toggleRef.current?.focus()
        return
      }
      if (event.key !== 'Tab') return
      const items = [toggleRef.current, ...focusables()].filter(Boolean) as HTMLElement[]
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      unlockScroll()
    }
  }, [menuOpen])

  const goTo = (id: NavId) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey) return
    event.preventDefault()
    setMenuOpen(false)
    if (isHome) {
      // Wait a frame so the scroll lock from the menu is released first.
      requestAnimationFrame(() => scrollToTarget(`#${id}`))
    } else {
      navigate(`/#${id}`)
    }
  }

  const goHome = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey) return
    setMenuOpen(false)
    if (isHome) {
      event.preventDefault()
      scrollToTarget(0)
    }
  }

  const socials = activeSocialLinks()

  return (
    <header className="nav" data-scrolled={scrolled || menuOpen} data-menu-open={menuOpen}>
      <div className="nav__bar">
        <Link to="/" className="nav__brand" onClick={goHome} aria-label={`${profile.name} — home`}>
          <span className="nav__mark" aria-hidden="true">
            <span className="nav__mark-orbit" />
            <span className="nav__mark-core" />
          </span>
          <span className="nav__brand-text mono">
            <span className="nav__initials">{profile.initials}</span>
            <span className="nav__slash" aria-hidden="true">/</span>
            <span>{profile.name}</span>
          </span>
        </Link>

        <nav className="nav__links" aria-label="Primary">
          <ul>
            {primaryNav.map((item) => (
              <li key={item.id}>
                <a
                  href={`/#${item.id}`}
                  onClick={goTo(item.id)}
                  className="nav__link mono"
                  aria-current={activeNav === item.id ? 'location' : undefined}
                >
                  <span className="nav__link-dot" aria-hidden="true" />
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <button
          ref={toggleRef}
          type="button"
          className="nav__toggle"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="mono">{menuOpen ? 'Close' : 'Menu'}</span>
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

      <div
        ref={menuRef}
        id="mobile-menu"
        className="nav__menu"
        data-open={menuOpen}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <nav aria-label="Mobile">
          <ol className="nav__menu-list">
            {primaryNav.map((item, index) => (
              <li key={item.id} style={{ '--i': index } as CSSProperties}>
                <a href={`/#${item.id}`} onClick={goTo(item.id)} aria-current={activeNav === item.id ? 'location' : undefined}>
                  <span className="mono red">0{index + 1}</span>
                  <span className="nav__menu-label">{item.label}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="nav__menu-foot mono muted">
          <span>
            {profile.role} — {profile.location}
          </span>
          {profile.email && <a href={`mailto:${profile.email}`}>{profile.email}</a>}
          {socials.map((link) => (
            <a key={link.id} href={link.href} target="_blank" rel="noopener noreferrer">
              {link.label} ↗
            </a>
          ))}
        </div>
      </div>
    </header>
  )
}
