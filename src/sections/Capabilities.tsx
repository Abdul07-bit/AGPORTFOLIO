import { ArrowUpRight } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { AnimatedText } from '../components/motion/AnimatedText'
import { projectHref, projects } from '../data/projects'
import { skillCategories } from '../data/skills'
import type { SkillCategory } from '../data/types'
import './Capabilities.css'

type CategoryId = SkillCategory['id']

const projectName = (slug: string) => projects.find((project) => project.slug === slug)?.name ?? slug

export function Capabilities() {
  const [hoverCategory, setHoverCategory] = useState<CategoryId | null>(null)
  const [pinnedCategory, setPinnedCategory] = useState<CategoryId | null>(null)
  const [skill, setSkill] = useState<{ name: string; related: string[] } | null>(null)

  const category = hoverCategory ?? pinnedCategory

  // Projects lit by the hovered skill, or by everything in the focused category.
  const lit = useMemo(() => {
    if (skill) return new Set(skill.related)
    if (!category) return new Set<string>()
    const group = skillCategories.find((item) => item.id === category)
    return new Set(group?.skills.flatMap((item) => item.related ?? []))
  }, [skill, category])

  return (
    <section id="stack" className="section capabilities" aria-labelledby="stack-title">
      <div className="container">
        <header className="capabilities__head">
          <span className="section-label mono" data-reveal="fade">
            <span className="section-label__index">(04)</span>
            Stack
          </span>
          <h2 id="stack-title" className="capabilities__title">
            <AnimatedText lines={['The tools are different.', 'The engineering mindset', 'is the same.']} lineClassName={(index) => (index > 0 ? 'muted' : undefined)} reveal />
          </h2>
        </header>

        <div className="capabilities__grid">
          <aside className="capabilities__aside">
            <p className="capabilities__intro" data-reveal="up">
              No proficiency bars or invented percentages — just the tools I work with, grouped by what they are for.
              Skills marked <span className="red">●</span> connect to project work.
            </p>
            <div className="capabilities__index" role="group" aria-label="Highlight a category" onMouseLeave={() => setHoverCategory(null)}>
              {skillCategories.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="capabilities__category"
                  aria-pressed={pinnedCategory === item.id}
                  data-active={category === item.id}
                  onMouseEnter={() => setHoverCategory(item.id)}
                  onFocus={() => setHoverCategory(item.id)}
                  onBlur={() => setHoverCategory(null)}
                  onClick={() => setPinnedCategory((current) => (current === item.id ? null : item.id))}
                >
                  <span className="mono red">{item.index}</span>
                  <span className="capabilities__category-name">{item.name}</span>
                  <span className="mono muted">{String(item.skills.length).padStart(2, '0')}</span>
                </button>
              ))}
            </div>

            <div className="capabilities__related">
              <p className="mono muted" aria-live="polite">
                {skill ? (
                  <>
                    <span className="capabilities__related-skill">{skill.name}</span> → related work
                  </>
                ) : (
                  'Related project work'
                )}
              </p>
              <ul>
                {projects.map((project) => (
                  <li key={project.slug}>
                    <Link to={projectHref(project.slug)} className="capabilities__project" data-lit={lit.has(project.slug)}>
                      <span className="mono">{project.index}</span>
                      {project.name}
                      <ArrowUpRight aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="capabilities__map" data-focus={category ?? 'none'}>
            {skillCategories.map((group) => (
              <div key={group.id} className="capabilities__group" data-dim={category !== null && category !== group.id} data-reveal="up">
                <h3 className="capabilities__group-title">
                  <span className="mono red">{group.index}</span>
                  {group.name}
                </h3>
                <p className="capabilities__group-desc">{group.description}</p>
                <ul className="capabilities__skills">
                  {group.skills.map((item) => (
                    <li key={item.name}>
                      {item.related ? (
                        <button
                          type="button"
                          className="skill skill--linked"
                          data-tip={`Related: ${item.related.map(projectName).join(', ')}`}
                          onMouseEnter={() => setSkill({ name: item.name, related: item.related ?? [] })}
                          onMouseLeave={() => setSkill(null)}
                          onFocus={() => setSkill({ name: item.name, related: item.related ?? [] })}
                          onBlur={() => setSkill(null)}
                        >
                          {item.name}
                          <span className="skill__mark" aria-hidden="true">
                            ●
                          </span>
                          <span className="sr-only">(related work: {item.related.map(projectName).join(', ')})</span>
                        </button>
                      ) : (
                        <span className="skill">{item.name}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
