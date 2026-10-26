import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import { useRef, type CSSProperties, type ReactNode } from 'react'
import { Link } from 'react-router'
import { getAdjacentProject, projectHref, projects } from '../../data/projects'
import type { Project } from '../../data/types'
import { useDocumentMeta } from '../../hooks/useDocumentMeta'
import { useScrollReveals } from '../../hooks/useScrollReveals'
import { EASE, MEDIA, gsap, useGSAP } from '../../lib/gsap'
import { AnimatedText } from '../motion/AnimatedText'
import { Magnetic } from '../motion/Magnetic'
import { ProjectCover } from './ProjectCover'
import './ProjectDetail.css'

const pad = (value: number) => String(value).padStart(2, '0')

function SectionHeading({ id, index, title }: { id: string; index: string; title: string }) {
  return (
    <div className="case__heading" data-reveal="up">
      <span className="mono case__heading-index">{index}</span>
      <h2 id={id}>{title}</h2>
    </div>
  )
}

interface CaseSection {
  key: string
  title: string
  className?: string
  content: ReactNode
}

export function ProjectDetail({ project }: { project: Project }) {
  const rootRef = useRef<HTMLElement>(null)
  useDocumentMeta(project.title, project.summary)
  useScrollReveals(rootRef)

  const next = getAdjacentProject(project.slug, 1)
  const position = projects.findIndex((item) => item.slug === project.slug) + 1
  const links = project.links.filter((link) => link.verified)
  const screenshots = project.screenshots

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MEDIA.motionOK, () => {
        gsap
          .timeline()
          .fromTo('.case__title .line-mask__inner', { yPercent: 110 }, { yPercent: 0, duration: 1.3, ease: EASE.out, stagger: 0.1 })
          .fromTo('[data-case-fade]', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, stagger: 0.06 }, 0.3)
          .fromTo('.case__cover', { clipPath: 'inset(12% 6% 12% 6% round 20px)' }, { clipPath: 'inset(0% 0% 0% 0% round 20px)', duration: 1.6, ease: EASE.inOut }, 0.2)
        gsap.fromTo(
          '.case__cover .cover',
          { yPercent: -4, scale: 1.08 },
          { yPercent: 4, scale: 1.08, ease: EASE.none, scrollTrigger: { trigger: '.case__cover', start: 'top bottom', end: 'bottom top', scrub: true } },
        )
      })
      return () => mm.revert()
    },
    { scope: rootRef, dependencies: [project.slug] },
  )

  // Steps per row in the workflow diagram (3-step flows stay on one line).
  const workflowColumns = project.workflow.steps.length <= 4 ? project.workflow.steps.length : 3

  // Optional sections drop out and the numbering closes up automatically.
  const sections: CaseSection[] = [
    {
      key: 'overview',
      title: 'Overview',
      content: (
        <p className="case__lead" data-reveal="up">
          {project.overview}
        </p>
      ),
    },
    {
      key: 'problem',
      title: 'Problem & goals',
      className: 'case__two-col',
      content: (
        <>
          <p className="case__text" data-reveal="up">
            {project.problem}
          </p>
          <ul className="case__list" data-reveal="stagger">
            {project.goals.map((goal) => (
              <li key={goal}>{goal}</li>
            ))}
          </ul>
        </>
      ),
    },
    {
      key: 'contribution',
      title: 'My contribution',
      content: (
        <ul className="case__list case__list--numbered" data-reveal="stagger">
          {project.contribution.map((item, index) => (
            <li key={item}>
              <span className="mono">{pad(index + 1)}</span>
              {item}
            </li>
          ))}
        </ul>
      ),
    },
    ...(project.visualDirection
      ? [
          {
            key: 'visual',
            title: 'Visual direction',
            content: (
              <p className="case__text" data-reveal="up">
                {project.visualDirection}
              </p>
            ),
          },
        ]
      : []),
    {
      key: 'workflow',
      title: project.workflow.title,
      content: (
        <>
          {project.workflow.caption && (
            <p className="case__caption mono" data-reveal="fade">
              {project.workflow.caption}
            </p>
          )}
          <ol
            className="case__flow"
            style={{ '--columns': workflowColumns } as CSSProperties}
            data-columns={workflowColumns}
            data-reveal="stagger"
          >
            {project.workflow.steps.map((step, index) => (
              <li key={step.label} className="case__flow-step">
                <span className="case__flow-index mono">{pad(index + 1)}</span>
                <strong>{step.label}</strong>
                <p>{step.detail}</p>
              </li>
            ))}
          </ol>
        </>
      ),
    },
    {
      key: 'features',
      title: 'Key features',
      content: (
        <ul className="case__features" data-reveal="stagger">
          {project.features.map((feature) => (
            <li key={feature.title} className="case__feature">
              <div className="case__feature-head">
                <strong>{feature.title}</strong>
                {feature.status && (
                  <span className="chip" data-kind={feature.status === 'Built' || feature.status === 'Offered' ? 'live' : 'concept'}>
                    {feature.status}
                  </span>
                )}
              </div>
              <p>{feature.detail}</p>
            </li>
          ))}
        </ul>
      ),
    },
    {
      key: 'stack',
      title: project.stack.title,
      content: (
        <>
          {project.stack.note && (
            <p className="case__caption mono" data-reveal="fade">
              {project.stack.note}
            </p>
          )}
          <dl className="case__stack" data-reveal="stagger">
            {project.stack.groups.map((group) => (
              <div key={group.label} className="case__stack-group">
                <dt className="mono">{group.label}</dt>
                <dd>
                  {group.items.map((item) => (
                    <span key={item} className="case__stack-item">
                      {item}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </>
      ),
    },
    ...(screenshots.length
      ? [
          {
            key: 'screenshots',
            title: 'Screenshots',
            className: 'case__shots',
            content: screenshots.map((shot) => (
              <figure key={shot.src} className="case__shot" data-device={shot.device} data-reveal="up">
                <div className="case__shot-frame">
                  {shot.device === 'desktop' && (
                    <div className="case__shot-bar" aria-hidden="true">
                      <i />
                      <i />
                      <i />
                    </div>
                  )}
                  <img src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} loading="lazy" decoding="async" />
                </div>
                <figcaption className="mono muted">{shot.caption}</figcaption>
              </figure>
            )),
          },
        ]
      : []),
    {
      key: 'lessons',
      title: project.lessonsTitle,
      content: (
        <ol className="case__lessons" data-reveal="stagger">
          {project.lessons.map((lesson) => (
            <li key={lesson.title}>
              <strong>{lesson.title}</strong>
              <p>{lesson.detail}</p>
            </li>
          ))}
        </ol>
      ),
    },
  ]

  return (
    <article ref={rootRef} className="case" style={{ '--accent': project.theme.accent } as CSSProperties} aria-labelledby="case-title">
      <header className="case__hero container">
        <nav className="case__crumbs mono" aria-label="Breadcrumb" data-case-fade>
          <Link to="/#work" className="text-link">
            <ArrowLeft aria-hidden="true" /> All work
          </Link>
          <span className="muted">
            Case study {pad(position)} / {pad(projects.length)}
          </span>
        </nav>

        <div className="case__intro">
          <span className="case__index" aria-hidden="true">
            {project.index}
          </span>
          <h1 id="case-title" className="case__title">
            <AnimatedText lines={[project.name]} />
            <span className="case__subtitle" data-case-fade>
              {project.subtitle}
            </span>
          </h1>
        </div>

        <div className="case__summary-row">
          <p className="case__summary" data-case-fade>
            {project.summary}
          </p>
          <dl className="case__meta" data-case-fade>
            <div>
              <dt className="mono">Status</dt>
              <dd>
                <span className="chip" data-kind={project.status.kind}>
                  {project.status.label}
                </span>
              </dd>
            </div>
            <div>
              <dt className="mono">Type</dt>
              <dd>{project.type}</dd>
            </div>
            <div>
              <dt className="mono">Role</dt>
              <dd>{project.role}</dd>
            </div>
            {links.length > 0 && (
              <div>
                <dt className="mono">Link</dt>
                <dd>
                  {links.map((link) => (
                    <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="text-link">
                      {link.label} <ArrowUpRight aria-hidden="true" />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  ))}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </header>

      <div className="container">
        <figure className="case__cover">
          <ProjectCover cover={project.cover} />
          <figcaption className="case__cover-label mono">Original artwork — not a product screenshot</figcaption>
        </figure>
      </div>

      <div className="container case__body">
        {sections.map((section, index) => (
          <section key={section.key} className="case__section" aria-labelledby={`case-${section.key}`}>
            <SectionHeading id={`case-${section.key}`} index={pad(index + 1)} title={section.title} />
            <div className={['case__content', section.className].filter(Boolean).join(' ')}>{section.content}</div>
          </section>
        ))}

        <aside className="case__actions" data-reveal="up">
          {links.map((link) => (
            <Magnetic key={link.href}>
              <a href={link.href} target="_blank" rel="noopener noreferrer" className="btn btn--primary">
                {link.label} <ArrowUpRight aria-hidden="true" data-arrow="up-right" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </Magnetic>
          ))}
          <Magnetic>
            <Link to="/#contact" className="btn">
              Discuss a similar project <ArrowRight aria-hidden="true" data-arrow="right" />
            </Link>
          </Magnetic>
          <p className="case__source mono muted">{project.sourceNote}</p>
        </aside>
      </div>

      <Link to={projectHref(next.slug)} className="case__next" data-cursor="Next">
        <div className="container case__next-inner">
          <span className="mono muted">Next case study — {next.index}</span>
          <span className="case__next-title">
            {next.name} <ArrowRight aria-hidden="true" />
          </span>
          <span className="case__next-subtitle muted">{next.subtitle}</span>
        </div>
        <div className="case__next-art" aria-hidden="true">
          <ProjectCover cover={next.cover} />
        </div>
      </Link>
    </article>
  )
}
