import { useId } from 'react'

/**
 * Unique, URL-safe ids for SVG defs. The same cover can appear several times
 * on a page, and duplicate gradient ids break rendering in some browsers.
 */
export function useSvgId(prefix: string) {
  const raw = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  return (name: string) => `${prefix}-${raw}-${name}`
}
