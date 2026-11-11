import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { dogModel, shots, type StopId } from '../lib/dogAssets'

interface Props { breedId: string; stop: StopId; accent: string; glow: string; lowPower: boolean }

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const MOVE = 0.85

/** Moves the camera between shots in 850ms, easeInOutCubic. */
function Rig({ stop }: { stop: StopId }) {
  const { camera, size } = useThree()
  // A narrow canvas (phone) needs the camera further back to keep the same framing.
  const far = size.width / size.height < 1 ? 1.45 : 1
  const from = useRef({ p: new THREE.Vector3(...shots.intro.position), t: new THREE.Vector3(...shots.intro.target) })
  const look = useRef(new THREE.Vector3(...shots.intro.target))
  const start = useRef(-1)
  const first = useRef(true)
  const to = useMemo(() => {
    const t = new THREE.Vector3(...shots[stop].target)
    return { p: new THREE.Vector3(...shots[stop].position).sub(t).multiplyScalar(far).add(t), t }
  }, [stop, far])

  useEffect(() => {
    if (first.current) {
      first.current = false
      camera.position.copy(to.p).multiplyScalar(1.5)
      from.current = { p: camera.position.clone(), t: to.t.clone() }
    } else {
      from.current = { p: camera.position.clone(), t: look.current.clone() }
    }
    start.current = -1
  }, [to, camera])

  useFrame(({ clock }) => {
    if (start.current < 0) start.current = clock.elapsedTime
    const k = easeInOutCubic(Math.min(1, (clock.elapsedTime - start.current) / MOVE))
    camera.position.lerpVectors(from.current.p, to.p, k)
    look.current.lerpVectors(from.current.t, to.t, k)
    camera.lookAt(look.current)
  })
  return null
}

function Dog({ breedId, stop, accent }: { breedId: string; stop: StopId; accent: string }) {
  const { scene } = useGLTF(dogModel(breedId))
  const group = useRef<THREE.Group>(null)
  const born = useRef(-1)
  const anchor = shots[stop].anchor
  const tail = useMemo(() => scene.getObjectByName('TailPivot'), [scene])

  useFrame(({ clock }) => {
    const g = group.current
    if (!g) return
    if (born.current < 0) born.current = clock.elapsedTime
    // Entrance: one full turn in 1.2s.
    const k = Math.min(1, (clock.elapsedTime - born.current) / 1.2)
    g.rotation.y = (1 - easeInOutCubic(k)) * Math.PI * 2
    // Idle: breathing, and a wagging tail.
    const s = 1 + Math.sin(clock.elapsedTime * 1.6) * 0.008
    g.scale.set(1, s, 1)
    if (tail) tail.rotation.x = Math.sin(clock.elapsedTime * 7) * 0.35
  })

  return (
    <group ref={group}>
      <primitive object={scene} />
      {anchor && (
        <>
          <spotLight position={[anchor[0] + 0.8, anchor[1] + 1.2, anchor[2] + 1.4]} target-position={anchor} angle={0.32} penumbra={0.9} intensity={26} color={accent} distance={5} />
          <Html position={anchor} center zIndexRange={[5, 0]}><span className="hotspot block" aria-hidden="true" /></Html>
        </>
      )}
    </group>
  )
}

export default function DogStage({ breedId, stop, accent, glow, lowPower }: Props) {
  const focused = !!shots[stop].anchor
  return (
    <Canvas dpr={[1, lowPower ? 1.25 : 1.75]} camera={{ fov: 32, near: 0.1, far: 30, position: shots.intro.position }} gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }} aria-hidden="true">
      <ambientLight intensity={focused ? 0.35 : 0.8} />
      <directionalLight position={[2.5, 4, 3]} intensity={focused ? 1.1 : 2.2} />
      <directionalLight position={[-3, 2.2, -3]} intensity={2.4} color={accent} />
      <pointLight position={[0, -0.4, 1.5]} intensity={3} color={glow} distance={6} />
      <Suspense fallback={null}>
        <Dog key={breedId} breedId={breedId} stop={stop} accent={accent} />
      </Suspense>
      <Rig stop={stop} />
    </Canvas>
  )
}

export const preloadDog = (id: string) => useGLTF.preload(dogModel(id))
