import { MEDIA } from '../lib/gsap'
import { useMediaQuery } from './useMediaQuery'

/** True when the visitor asked the OS to reduce motion. */
export const useReducedMotion = () => useMediaQuery(MEDIA.reducedMotion)
