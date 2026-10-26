import { ArrowUpRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { AnimatedText } from '../components/motion/AnimatedText'
import { ProjectCover } from '../components/projects/ProjectCover'
import { projectHref, projects } from '../data/projects'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { MEDIA, gsap } from '../lib/gsap'
import './CaseFiles.css'

/** Editorial index of every case study, with a cursor-following preview on desktop. */
export function CaseFiles() {
  const tableRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const preview = useMediaQuery(`${MEDIA.finePointer} and ${MEDIA.motionOK} and (min-width: 900px)`)

  useEffect(() => {
    const table = tableRef.current
    const card = previewRef.current
    if (!preview || !table || !card) return
    const xTo = gsap.quickTo(card, 'x', { duration: 0.6, ease: 'power3.out' })
    const yTo = gsap.quickTo(card, 'y', { duration: 0.6, ease: 'power3.out' })
    const move = (event: PointerEvent) => {
      const rect = table.getBoundingClientRect()
      xTo(event.clientX - rect.left)
      yTo(event.clientY - rect.top)
    }
    table.addEventListener('pointermove', move)
    return () => table.removeEventListener('pointermove', move)
  }, [preview])

  const active = projects.find((project) => project.slug === hovered)

  return (
    <section id="case-files" className="section case-files" aria-labelledby="case-files-title">
      <div className="container">
        <header className="case-files__head">
          <span className="section-label mono" data-reveal="fade">
            <span className="section-label__index">(07)</span>
            Case files
          </span>
          <h2 id="case-files-title" className="case-files__title">
            <AnimatedText lines={['Case files']} reveal />
          </h2>
          <p className="case-files__lead" data-reveal="up">
            The full story behind each build — problem, contribution, workflow, stack and lessons. Status labels say
            exactly what each one is.
          </p>
        </header>

        <div ref={tableRef} className="case-files__table">
          <div className="case-files__columns mono muted" aria-hidden="true">
            <span>No.</span>
            <span>Project</span>
            <span>Type</span>
            <span>Status</span>
          </div>
          <ul className="case-files__list" onMouseLeave={() => setHovered(null)}>
            {projects.map((project) => (
              <li key={project.slug} data-reveal="up">
                <Link
                  to={projectHref(project.slug)}
                  className="case-row"
                  data-cursor="Read"
                  onMouseEnter={() => setHovered(project.slug)}
                  onFocus={() => setHovered(project.slug)}
                  onBlur={() => setHovered(null)}
                >
                  <span className="case-row__index mono">{project.index}</span>
                  <span className="case-row__name">
                    {project.name}
                    <span className="case-row__subtitle">{project.subtitle}</span>
                  </span>
                  <span className="case-row__type mono muted">{project.type}</span>
                  <span className="case-row__status">
                    <span className="chip" data-kind={project.status.kind}>
                      {project.status.label}
                    </span>
                  </span>
                  <ArrowUpRight className="case-row__arrow" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
          {preview && (
            <div ref={previewRef} className="case-files__preview" aria-hidden="true">
              <div className="case-files__preview-inner" data-visible={Boolean(active)}>
                {active && <ProjectCover key={active.slug} cover={active.cover} className="case-files__preview-cover" />}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
