import { useParams } from 'react-router'
import { ProjectDetail } from '../components/projects/ProjectDetail'
import { getProject } from '../data/projects'
import { NotFoundPage } from './NotFoundPage'

export function ProjectPage() {
  const { slug } = useParams()
  const project = getProject(slug)
  if (!project) return <NotFoundPage />
  // Keyed so animations and scroll triggers reset between case studies.
  return <ProjectDetail key={project.slug} project={project} />
}
