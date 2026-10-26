import type { CSSProperties, ReactNode } from 'react'

/** An SVG group that shifts with the pointer by its depth (see covers.css). */
export function Layer({ depth, children }: { depth: number; children: ReactNode }) {
  return (
    <g className="cover-layer" style={{ '--d': depth } as CSSProperties}>
      {children}
    </g>
  )
}
