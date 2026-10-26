/**
 * Mutable values shared between the DOM and the 3D scene. Written by the hero
 * (pointer + scroll) and read every frame inside useFrame — no React renders.
 */
export interface SceneSignals {
  /** 0 → 1 as the visitor scrolls out of the hero. */
  progress: number
  /** Pointer position, normalised to -1 … 1. */
  pointerX: number
  pointerY: number
}

export const createSceneSignals = (): SceneSignals => ({ progress: 0, pointerX: 0, pointerY: 0 })
