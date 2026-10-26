// Tracks which home-page section is in view (written by HomePage's
// ScrollTriggers, read by the navigation and progress indicator).
import { useSyncExternalStore } from 'react'

let active: string | null = null
const listeners = new Set<() => void>()

export function setActiveSection(id: string | null) {
  if (id === active) return
  active = id
  listeners.forEach((listener) => listener())
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export const useActiveSection = () => useSyncExternalStore(subscribe, () => active, () => null)
