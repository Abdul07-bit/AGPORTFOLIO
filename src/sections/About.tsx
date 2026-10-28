import { useRef } from 'react'
import { AnimatedText } from '../components/motion/AnimatedText'
import { profile } from '../data/profile'
import { EASE, MEDIA, gsap, useGSAP } from '../lib/gsap'
import './About.css'

const { portrait, education } = profile

export function About() {
  const rootRef = useRef<HTMLElement>(null)

  // Portrait drifts inside its frame as the section passes.
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MEDIA.motionOK, () => {
        gsap.fromTo(
          '.about__portrait img',
          { scale: 1.16, yPercent: -3 },
          {
            scale: 1.02,
            yPercent: 3,
            ease: EASE.none,
            scrollTrigger: { trigger: '.about__portrait', start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
        gsap.fromTo(
          '.about__annotation',
          { opacity: 0, x: -12 },
          { opacity: 1, x: 0, stagger: 0.12, duration: 1, scrollTrigger: { trigger: '.about__figure', start: 'top 70%', once: true } },
        )
      })
      return () => mm.revert()
    },
    { scope: rootRef },
  )

  return (
    <section id="about" ref={rootRef} className="section about" aria-labelledby="about-title">
      <div className="container about__grid">
        <figure className="about__figure">
          {/* Background-removed portrait, frameless, lit from behind */}
          <div className="about__portrait" data-reveal="clip">
            <span className="about__backlight" aria-hidden="true" />
            <picture>
              <source
                type="image/webp"
                srcSet={portrait.widths.map((width) => `${portrait.cutout}-${width}.webp ${width}w`).join(', ')}
                sizes="(min-width: 1024px) 36vw, (min-width: 768px) 44vw, 92vw"
              />
              <img
                className="profile-portrait"
                src={`${portrait.cutout}-768.png`}
                width={portrait.width}
                height={portrait.height}
                alt={portrait.alt}
                loading="lazy"
                decoding="async"
              />
            </picture>
          </div>
          <figcaption className="about__caption mono">
            <span className="red">Fig. 01</span>
            <span>{profile.name}</span>
            <span className="muted">{profile.role}</span>
          </figcaption>
          <div className="about__annotations mono" aria-hidden="true">
            <span className="about__annotation">
              <i /> Subject — {profile.initials}
            </span>
            <span className="about__annotation">
              <i /> Base — {profile.location}
            </span>
          </div>
        </figure>

        <div className="about__content">
          <span className="section-label mono" data-reveal="fade">
            <span className="section-label__index">(02)</span>
            About
          </span>
          <h2 id="about-title" className="about__title">
            <AnimatedText lines={['Curious by default.', 'Engineering by design.']} lineClassName={(index) => (index === 1 ? 'about__title-2' : undefined)} reveal />
          </h2>
          <p className="about__bio" data-reveal="up">
            {profile.bio}
          </p>

          <dl className="about__facts" data-reveal="stagger">
            <div className="about__fact">
              <dt className="mono">Education</dt>
              <dd>
                <strong>{education.degree}</strong>
                <span>
                  {education.institution}, {education.place}
                </span>
                <span className="mono muted">
                  {education.graduation}
                  {education.cgpa && ` · CGPA ${education.cgpa}`}
                </span>
              </dd>
            </div>
            <div className="about__fact">
              <dt className="mono">Focus</dt>
              <dd>
                <ul className="about__list">
                  {profile.focus.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </dd>
            </div>
            <div className="about__fact">
              <dt className="mono">Languages</dt>
              <dd>
                <ul className="about__list">
                  {profile.languages.map((language) => (
                    <li key={language.name}>
                      {language.name}
                      {language.level && <span className="muted"> ({language.level})</span>}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
            <div className="about__fact">
              <dt className="mono">Certifications</dt>
              <dd>
                <ul className="about__certs">
                  {profile.certifications.map((cert) => (
                    <li key={cert.name}>
                      <span>
                        {cert.name}
                        {cert.issuer && <span className="muted"> · {cert.issuer}</span>}
                      </span>
                      <span className="mono muted">{cert.date}</span>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  )
}
