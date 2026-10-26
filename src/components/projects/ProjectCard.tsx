import { ArrowRight } from 'lucide-react'
import { useRef, type CSSProperties } from 'react'
import { Link } from 'react-router'
import { projectHref } from '../../data/projects'
import type { Project } from '../../data/types'
import { usePointerTilt } from '../../hooks/usePointerTilt'
import { ProjectCover } from './ProjectCover'
import './ProjectCard.css'

const pad = (value: number) => String(value).padStart(2, '0')

export function ProjectCard({ project, position, total }: { project: Project; position: number; total: number }) {
  const visualRef = useRef<HTMLAnchorElement>(null)
  usePointerTilt(visualRef)
  const href = projectHref(project.slug)
  const titleId = `work-title-${project.slug}`

  return (
    <article className="work-card" aria-labelledby={titleId} style={{ '--accent': project.theme.accent } as CSSProperties}>
      {/* Duplicate, mouse-only link on the artwork; the keyboard link is the button below. */}
      <Link ref={visualRef} to={href} className="work-card__visual" tabIndex={-1} aria-hidden="true" data-cursor="View">
        <div className="work-card__art">
          <ProjectCover cover={project.cover} />
        </div>
        <span className="work-card__art-label mono">Original artwork</span>
      </Link>

      <div className="work-card__body">
        <span className="work-card__number" aria-hidden="true">
          {project.index}
        </span>
        <div className="work-card__meta">
          <span className="chip" data-kind={project.status.kind}>
            {project.status.label}
          </span>
          <span className="mono muted">{project.type}</span>
        </div>
        <h3 id={titleId} className="work-card__title">
          <span className="work-card__name">{project.name}</span>
          <span className="work-card__subtitle">{project.subtitle}</span>
        </h3>
        <p className="work-card__summary">{project.summary}</p>
        <ul className="work-card__tags" aria-label="Categories">
          {project.categories.map((category) => (
            <li key={category} className="tag">
              {category}
            </li>
          ))}
        </ul>
        <div className="work-card__foot">
          <Link to={href} className="btn btn--small">
            View case study<span className="sr-only">: {project.name}</span>
            <ArrowRight aria-hidden="true" data-arrow="right" />
          </Link>
          <span className="mono muted" aria-hidden="true">
            {pad(position)} / {pad(total)}
          </span>
        </div>
      </div>
    </article>
  )
}
