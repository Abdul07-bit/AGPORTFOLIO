// Capability checks for the 3D scene.

let webglSupport: boolean | undefined

/**
 * True when hardware-accelerated WebGL is available. Software renderers
 * (SwiftShader, llvmpipe…) report a "major performance caveat" and would run
 * the scene at a few frames per second, so they get the static fallback, as do
 * visitors who asked to save data.
 */
export function hasWebGL(): boolean {
  if (webglSupport !== undefined) return webglSupport
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData
  if (saveData) return (webglSupport = false)
  try {
    const canvas = document.createElement('canvas')
    const options = { failIfMajorPerformanceCaveat: true }
    const context = (canvas.getContext('webgl2', options) ?? canvas.getContext('webgl', options)) as WebGLRenderingContext | null
    webglSupport = Boolean(context)
    context?.getExtension('WEBGL_lose_context')?.loseContext()
  } catch {
    webglSupport = false
  }
  return webglSupport
}

export type SceneQuality = 'high' | 'low'

/** Lower quality on touch devices, small screens and low-end hardware. */
export function getSceneQuality(): SceneQuality {
  const coarse = window.matchMedia('(pointer: coarse)').matches
  const small = window.innerWidth < 900
  const cores = navigator.hardwareConcurrency ?? 4
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8
  return coarse || small || cores < 4 || memory < 4 ? 'low' : 'high'
}
