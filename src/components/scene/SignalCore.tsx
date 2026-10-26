import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import * as THREE from 'three'
import type { SceneQuality } from '../../lib/device'
import type { SceneSignals } from './sceneSignals'

// ─── The SIGNAL CORE ────────────────────────────────────────────────────────
// A procedural sculpture of "connected intelligence": a polished metallic core,
// a geodesic cage, precise orbital rings with dial ticks, light signals that
// travel the orbits, a handful of particles and a slowly orbiting red light.
// No external models or HDR files — everything is generated here.

const SILVER = '#e8dfcc' // parchment ivory
const RED = '#c9a45c' // antique gold — the signal colour
const EMBER = '#c4562e' // firelight for the orbiting glint
const { damp } = THREE.MathUtils

interface SignalCoreProps {
  signals: RefObject<SceneSignals>
  /** Render continuously only while the hero is visible. */
  active: boolean
  reducedMotion: boolean
  quality: SceneQuality
  onReady: () => void
  onContextLost: () => void
}

export default function SignalCore({ signals, active, reducedMotion, quality, onReady, onContextLost }: SignalCoreProps) {
  const [maxDpr, setMaxDpr] = useState(quality === 'high' ? 1.75 : 1.35)

  return (
    <Canvas
      className="signal-canvas"
      dpr={[1, maxDpr]}
      camera={{ position: [0, 0, 10.5], fov: 32, near: 0.1, far: 60 }}
      gl={(defaults) => {
        const renderer = new THREE.WebGLRenderer({ ...defaults, antialias: true, alpha: true, powerPreference: 'high-performance', stencil: false })
        // Shader log checks only help during development (and surface harmless
        // Direct3D precision notes on Windows); three.js advises disabling them in production.
        renderer.debug.checkShaderErrors = import.meta.env.DEV
        return renderer
      }}
      frameloop={reducedMotion ? 'demand' : active ? 'always' : 'never'}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener('webglcontextlost', onContextLost, { once: true })
      }}
      aria-hidden="true"
    >
      <AdaptiveResolution onSlow={() => setMaxDpr(1)} />
      <Studio />
      <Scene signals={signals} reducedMotion={reducedMotion} quality={quality} />
      <FirstFrame onReady={onReady} />
    </Canvas>
  )
}

/** Calls onReady once the first frame has rendered. */
function FirstFrame({ onReady }: { onReady: () => void }) {
  const done = useRef(false)
  useFrame(() => {
    if (done.current) return
    done.current = true
    onReady()
  })
  return null
}

/** Drops the pixel ratio once if the first second of frames is consistently slow. */
function AdaptiveResolution({ onSlow }: { onSlow: () => void }) {
  const sample = useRef({ frames: 0, time: 0, done: false })
  useFrame((_, delta) => {
    const stats = sample.current
    if (stats.done) return
    stats.frames += 1
    stats.time += delta
    if (stats.frames < 60) return
    stats.done = true
    if (stats.time / stats.frames > 1 / 40) onSlow()
  })
  return null
}

/**
 * Procedural studio lighting: a few emissive panels and a red ring rendered
 * once into a PMREM environment map — reflections for the metal without any
 * HDR download or extra dependency.
 */
function Studio() {
  const gl = useThree((state) => state.gl)

  const environment = useMemo(() => {
    const studio = new THREE.Scene()
    studio.background = new THREE.Color('#2b241b')
    const panel = (color: string, intensity: number, size: [number, number], position: [number, number, number], rotation: [number, number, number]) => {
      const material = new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(intensity), side: THREE.DoubleSide })
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(...size), material)
      mesh.position.set(...position)
      mesh.rotation.set(...rotation)
      studio.add(mesh)
    }
    panel('#ffffff', 3.2, [12, 2], [0, 5, -2], [Math.PI / 2.4, 0, 0])
    panel(SILVER, 1.8, [2.4, 10], [-6, 0.5, 1], [0, Math.PI / 2, 0])
    panel(SILVER, 1.1, [1.6, 10], [6, -0.5, 2], [0, -Math.PI / 2, 0])
    panel(SILVER, 0.7, [12, 3], [0, -5, 1], [-Math.PI / 2.2, 0, 0])
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.1, 0.12, 12, 64),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(RED).multiplyScalar(4) }),
    )
    ring.position.set(3.5, -2.5, -4)
    ring.lookAt(0, 0, 0)
    studio.add(ring)

    const generator = new THREE.PMREMGenerator(gl)
    const target = generator.fromScene(studio, 0.04)
    generator.dispose()
    studio.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose()
        ;(object.material as THREE.Material).dispose()
      }
    })
    return target
  }, [gl])

  useEffect(() => () => environment.dispose(), [environment])

  return (
    <>
      <primitive object={environment.texture} attach="environment" />
      <ambientLight intensity={0.15} />
      <directionalLight position={[-4, 5, 4]} intensity={1.2} color="#ffffff" />
    </>
  )
}

// Deterministic pseudo-random numbers keep geometry stable between renders.
function seeded(seed: number) {
  let value = seed
  return () => {
    value |= 0
    value = (value + 0x6d2b79f5) | 0
    let t = Math.imul(value ^ (value >>> 15), 1 | value)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function useGlowTexture() {
  const texture = useMemo(() => {
    const size = 64
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = size
    const context = canvas.getContext('2d')
    if (context) {
      const gradient = context.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
      gradient.addColorStop(0, 'rgba(255,255,255,1)')
      gradient.addColorStop(0.22, 'rgba(255,255,255,0.7)')
      gradient.addColorStop(0.55, 'rgba(255,255,255,0.12)')
      gradient.addColorStop(1, 'rgba(255,255,255,0)')
      context.fillStyle = gradient
      context.fillRect(0, 0, size, size)
    }
    const result = new THREE.CanvasTexture(canvas)
    result.colorSpace = THREE.SRGBColorSpace
    return result
  }, [])
  useEffect(() => () => texture.dispose(), [texture])
  return texture
}

interface RingSpec {
  radius: number
  rotation: [number, number, number]
  opacity: number
  /** Extra scale applied as the visitor scrolls out of the hero. */
  spread: number
  pulses: { speed: number; phase: number; color: string }[]
  ticks?: boolean
  arc?: { start: number; length: number }
}

const RINGS: RingSpec[] = [
  {
    radius: 1.95,
    rotation: [1.22, 0.18, 0.3],
    opacity: 0.55,
    spread: 0.18,
    pulses: [
      { speed: 0.55, phase: 0, color: SILVER },
      { speed: 0.55, phase: Math.PI, color: RED },
    ],
    arc: { start: 0.6, length: 1.1 },
  },
  {
    radius: 2.45,
    rotation: [1.75, -0.45, -0.5],
    opacity: 0.32,
    spread: 0.42,
    pulses: [{ speed: -0.38, phase: 1.4, color: SILVER }],
  },
  {
    radius: 3.05,
    rotation: [1.05, 0.55, -0.85],
    opacity: 0.26,
    spread: 0.7,
    pulses: [
      { speed: 0.26, phase: 2.2, color: RED },
      { speed: 0.26, phase: 4.8, color: SILVER },
    ],
    ticks: true,
  },
]

function Scene({ signals, reducedMotion, quality }: { signals: RefObject<SceneSignals>; reducedMotion: boolean; quality: SceneQuality }) {
  const root = useRef<THREE.Group>(null)
  const spin = useRef<THREE.Group>(null)
  const cage = useRef<THREE.Group>(null)
  const ringRefs = useRef<(THREE.Group | null)[]>([])
  const redLight = useRef<THREE.PointLight>(null)
  const segments = quality === 'high' ? 96 : 48

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05)
    const time = state.clock.elapsedTime
    const { progress, pointerX, pointerY } = signals.current

    if (root.current) {
      root.current.rotation.y = damp(root.current.rotation.y, pointerX * 0.32 + progress * 0.8, 2.8, delta)
      root.current.rotation.x = damp(root.current.rotation.x, -pointerY * 0.2 + progress * 0.55, 2.8, delta)
      root.current.position.y = damp(root.current.position.y, progress * 0.9, 3, delta)
    }

    const { camera } = state
    camera.position.z = damp(camera.position.z, 10.5 + progress * 3.2, 3, delta)
    camera.position.x = damp(camera.position.x, -progress * 0.8, 3, delta)
    camera.lookAt(0, progress * 0.4, 0)

    if (!reducedMotion) {
      if (spin.current) spin.current.rotation.y += delta * 0.07
      if (cage.current) {
        cage.current.rotation.y -= delta * 0.05
        cage.current.rotation.z += delta * 0.02
      }
      if (redLight.current) {
        redLight.current.position.set(Math.cos(time * 0.35) * 3.2, Math.sin(time * 0.5) * 1.6, Math.sin(time * 0.35) * 3.2)
      }
    }

    ringRefs.current.forEach((ring, index) => {
      if (!ring) return
      const target = 1 + progress * RINGS[index].spread
      ring.scale.setScalar(damp(ring.scale.x, target, 3, delta))
    })
  })

  return (
    <group ref={root}>
      <pointLight ref={redLight} color={EMBER} intensity={55} distance={0} decay={2} position={[3, 0.5, 2]} />
      <group ref={spin}>
        <Core segments={segments} />
        <group ref={cage}>
          <GeodesicCage />
        </group>
        {RINGS.map((ring, index) => (
          <group
            key={index}
            ref={(node) => {
              ringRefs.current[index] = node
            }}
          >
            <OrbitRing spec={ring} segments={segments * 3} />
          </group>
        ))}
        <TranslucentPlate />
      </group>
      <Particles count={quality === 'high' ? 220 : 110} />
      <Halo />
    </group>
  )
}

function Core({ segments }: { segments: number }) {
  return (
    <group>
      <mesh>
        <sphereGeometry args={[1, segments, segments]} />
        {/* Gilded antique brass */}
        <meshPhysicalMaterial color="#c9a467" metalness={1} roughness={0.28} clearcoat={0.6} clearcoatRoughness={0.18} envMapIntensity={1.35} />
      </mesh>
      {/* Red equatorial seam */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.004, 0.006, 8, segments * 2]} />
        <meshBasicMaterial color={RED} toneMapped={false} />
      </mesh>
      <DashedOrbit radius={1.26} rotation={[1.4, 0, 0.6]} />
    </group>
  )
}

function DashedOrbit({ radius, rotation }: { radius: number; rotation: [number, number, number] }) {
  const line = useMemo(() => {
    const points = new THREE.EllipseCurve(0, 0, radius, radius, 0, Math.PI * 2).getPoints(180)
    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    const material = new THREE.LineDashedMaterial({ color: SILVER, dashSize: 0.045, gapSize: 0.06, transparent: true, opacity: 0.55 })
    const loop = new THREE.LineLoop(geometry, material)
    loop.computeLineDistances()
    return loop
  }, [radius])
  useEffect(
    () => () => {
      line.geometry.dispose()
      ;(line.material as THREE.Material).dispose()
    },
    [line],
  )
  return <primitive object={line} rotation={rotation} />
}

function GeodesicCage() {
  const { edges, vertices } = useMemo(() => {
    const ico = new THREE.IcosahedronGeometry(1.5, 1)
    const edgeGeometry = new THREE.EdgesGeometry(ico)
    // Unique vertices for the node points
    const position = ico.getAttribute('position')
    const seen = new Set<string>()
    const unique: number[] = []
    for (let i = 0; i < position.count; i++) {
      const key = `${position.getX(i).toFixed(3)},${position.getY(i).toFixed(3)},${position.getZ(i).toFixed(3)}`
      if (seen.has(key)) continue
      seen.add(key)
      unique.push(position.getX(i), position.getY(i), position.getZ(i))
    }
    ico.dispose()
    return { edges: edgeGeometry, vertices: new Float32Array(unique) }
  }, [])
  const glow = useGlowTexture()
  useEffect(() => () => edges.dispose(), [edges])

  return (
    <group>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color={SILVER} transparent opacity={0.13} />
      </lineSegments>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[vertices, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.07} map={glow} color={SILVER} transparent opacity={0.7} depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
    </group>
  )
}

function OrbitRing({ spec, segments }: { spec: RingSpec; segments: number }) {
  const ticks = useMemo(() => {
    if (!spec.ticks) return null
    const count = 120
    const positions: number[] = []
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      const length = i % 10 === 0 ? 0.16 : i % 5 === 0 ? 0.09 : 0.045
      const inner = spec.radius + 0.03
      positions.push(Math.cos(angle) * inner, Math.sin(angle) * inner, 0)
      positions.push(Math.cos(angle) * (inner + length), Math.sin(angle) * (inner + length), 0)
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    return geometry
  }, [spec.ticks, spec.radius])
  useEffect(() => () => ticks?.dispose(), [ticks])

  return (
    <group rotation={spec.rotation}>
      <mesh>
        <torusGeometry args={[spec.radius, 0.0045, 6, segments]} />
        <meshBasicMaterial color={SILVER} transparent opacity={spec.opacity} toneMapped={false} />
      </mesh>
      {spec.arc && (
        <mesh rotation={[0, 0, spec.arc.start]}>
          <torusGeometry args={[spec.radius, 0.009, 6, Math.round(segments / 3), spec.arc.length]} />
          <meshBasicMaterial color={RED} toneMapped={false} />
        </mesh>
      )}
      {ticks && (
        <lineSegments geometry={ticks}>
          <lineBasicMaterial color={SILVER} transparent opacity={0.3} />
        </lineSegments>
      )}
      {spec.pulses.map((pulse, index) => (
        <Pulse key={index} radius={spec.radius} {...pulse} />
      ))}
    </group>
  )
}

/** A light signal travelling along an orbit, with a fading trail. */
function Pulse({ radius, speed, phase, color }: { radius: number; speed: number; phase: number; color: string }) {
  const length = 18
  const ref = useRef<THREE.Points>(null)
  const glow = useGlowTexture()
  const { positions, colors } = useMemo(() => {
    const tint = new THREE.Color(color)
    const colorArray = new Float32Array(length * 3)
    for (let i = 0; i < length; i++) {
      const fade = Math.pow(1 - i / length, 2.2)
      colorArray.set([tint.r * fade, tint.g * fade, tint.b * fade], i * 3)
    }
    return { positions: new Float32Array(length * 3), colors: colorArray }
  }, [color])

  useFrame(({ clock }) => {
    const attribute = ref.current?.geometry.getAttribute('position') as THREE.BufferAttribute | undefined
    if (!attribute) return
    const head = phase + clock.elapsedTime * speed
    const direction = Math.sign(speed) || 1
    for (let i = 0; i < length; i++) {
      const angle = head - i * 0.028 * direction
      attribute.setXYZ(i, Math.cos(angle) * radius, Math.sin(angle) * radius, 0)
    }
    attribute.needsUpdate = true
  })

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.16} map={glow} vertexColors transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
    </points>
  )
}

function TranslucentPlate() {
  return (
    <mesh rotation={[1.22, 0.18, 0.3]}>
      <ringGeometry args={[1.6, 1.9, 128]} />
      <meshBasicMaterial color={SILVER} transparent opacity={0.04} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  )
}

function Particles({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null)
  const glow = useGlowTexture()
  const { positions, colors } = useMemo(() => {
    const random = seeded(7)
    const positionArray = new Float32Array(count * 3)
    const colorArray = new Float32Array(count * 3)
    const silver = new THREE.Color(SILVER)
    const red = new THREE.Color(RED)
    for (let i = 0; i < count; i++) {
      const radius = 3.4 + random() * 3.2
      const theta = random() * Math.PI * 2
      const phi = Math.acos(2 * random() - 1)
      positionArray.set(
        [radius * Math.sin(phi) * Math.cos(theta), radius * Math.cos(phi) * 0.55, radius * Math.sin(phi) * Math.sin(theta)],
        i * 3,
      )
      const tint = random() < 0.08 ? red : silver
      const brightness = 0.25 + random() * 0.6
      colorArray.set([tint.r * brightness, tint.g * brightness, tint.b * brightness], i * 3)
    }
    return { positions: positionArray, colors: colorArray }
  }, [count])

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += Math.min(delta, 0.05) * 0.02
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.06} map={glow} vertexColors transparent depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  )
}

/** Soft additive halo — a cheap stand-in for bloom. */
function Halo() {
  const glow = useGlowTexture()
  return (
    <sprite scale={[6.5, 6.5, 1]} position={[0, 0, -1.5]}>
      <spriteMaterial map={glow} color={SILVER} transparent opacity={0.09} depthWrite={false} blending={THREE.AdditiveBlending} />
    </sprite>
  )
}
