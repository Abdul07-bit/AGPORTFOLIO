import type { RefObject } from 'react'
import { setupScrollReveals } from '../lib/animations'
import { useGSAP } from '../lib/gsap'

/** Wires up every [data-reveal] element inside the scope; reverted on unmount. */
export function useScrollReveals(scope: RefObject<HTMLElement | null>) {
  useGSAP(() => setupScrollReveals(scope.current), { scope })
}
