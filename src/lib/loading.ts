// Real loading progress for the intro counter. Each milestone carries a weight;
// the counter can only reach 100 when every milestone has actually resolved.
import { useSyncExternalStore } from 'react'

export type Milestone = 'document' | 'fonts' | 'app' | 'scene'

const weights: Record<Milestone, number> = { document: 20, fonts: 30, app: 20, scene: 30 }
const ready = new Set<Milestone>()
const listeners = new Set<() => void>()

let progress = 0

const emit = () => listeners.forEach((listener) => listener())

export function markReady(milestone: Milestone) {
  if (ready.has(milestone)) return
  ready.add(milestone)
  progress = [...ready].reduce((sum, item) => sum + weights[item], 0)
  emit()
}

export const getProgress = () => progress

export const subscribeProgress = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

if (typeof document !== 'undefined') {
  if (document.readyState !== 'loading') markReady('document')
  else document.addEventListener('DOMContentLoaded', () => markReady('document'), { once: true })

  if ('fonts' in document) {
    document.fonts.ready.then(() => markReady('fonts')).catch(() => markReady('fonts'))
  } else {
    markReady('fonts')
  }
}

// ─── Intro completion ─────────────────────────────────────────────────────

let introDone = false
const introListeners = new Set<() => void>()

export function completeIntro() {
  if (introDone) return
  introDone = true
  introListeners.forEach((listener) => listener())
}

const subscribeIntro = (listener: () => void) => {
  introListeners.add(listener)
  return () => introListeners.delete(listener)
}

/** True once the intro has handed over to the page (immediately if skipped). */
export const useIntroComplete = () => useSyncExternalStore(subscribeIntro, () => introDone, () => true)
