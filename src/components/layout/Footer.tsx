import { ArrowUp } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import { activeSocialLinks, profile } from '../../data/profile'
import { useLocalTime } from '../../hooks/useLocalTime'
import { scrollToTarget } from '../../lib/scroll'
import './Footer.css'

export function Footer() {
  const time = useLocalTime(profile.timeZone)
  const socials = activeSocialLinks()
  // The home page ends with its own back-to-top control in the closing section.
  const isHome = useLocation().pathname === '/'

  return (
    <footer className="footer">
      <div className="container footer__inner mono">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <span className="footer__meta muted">
          {profile.location} — <time>{time}</time> {profile.timeZoneLabel}
        </span>
        <nav className="footer__links" aria-label="Footer">
          <Link to="/#work">Work</Link>
          <Link to="/#about">About</Link>
          <Link to="/#contact">Contact</Link>
          {socials.map((link) => (
            <a key={link.id} href={link.href} target="_blank" rel="noopener noreferrer">
              {link.label} <span aria-hidden="true">↗</span>
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          ))}
        </nav>
        {!isHome && (
          <button type="button" className="footer__top" onClick={() => scrollToTarget(0)}>
            Back to top <ArrowUp aria-hidden="true" />
          </button>
        )}
      </div>
    </footer>
  )
}
