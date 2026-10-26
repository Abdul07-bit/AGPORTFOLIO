import { useRef, type ComponentType } from 'react'
import type { CoverKey } from '../../data/types'
import { useInView } from '../../hooks/useInView'
import { DataFusionCover } from './covers/DataFusionCover'
import { FormLawCover } from './covers/FormLawCover'
import { RizanCover } from './covers/RizanCover'
import { SmartAutoFlexCover } from './covers/SmartAutoFlexCover'
import { TicketingCover } from './covers/TicketingCover'
import { VktCover } from './covers/VktCover'
import './covers/covers.css'

const COVERS: Record<CoverKey, ComponentType> = {
  formlaw: FormLawCover,
  datafusion: DataFusionCover,
  rizan: RizanCover,
  vkt: VktCover,
  smartautoflex: SmartAutoFlexCover,
  ticketing: TicketingCover,
}

/** Original project artwork. Its ambient animation only runs while on screen. */
export function ProjectCover({ cover, className }: { cover: CoverKey; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref)
  const Art = COVERS[cover]
  return (
    <div ref={ref} className={['cover', className].filter(Boolean).join(' ')} data-live={inView} aria-hidden="true">
      <Art />
    </div>
  )
}
