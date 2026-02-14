'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useScrollProgress } from './ScrollContext'

/* ─────────────────── Warp Tunnel Particles ─────────────────── */
function WarpTunnel() {
    const particlesRef = useRef<THREE.InstancedMesh>(null)
    const COUNT = 800
    const dummy = useMemo(() => new THREE.Object3D(), [])
    const scroll = useScrollProgress()

    const particleData = useMemo(() => {
        return Array.from({ length: COUNT }, () => ({
            angle: Math.random() * Math.PI * 2,
            radius: 1.5 + Math.random() * 2.5,
            z: Math.random() * 30 - 15,
            speed: 0.5 + Math.random() * 2,
            size: 0.02 + Math.random() * 0.03,
        }))
    }, [])

    useFrame((state) => {
        if (!particlesRef.current) return
        const t = state.clock.getElapsedTime()
        const velocity = Math.abs(scroll.velocity) * 0.5
        const warpSpeed = 0.3 + velocity * 2

        particleData.forEach((p, i) => {
            // Particles move along Z axis (tunnel depth)
            let z = ((p.z + t * warpSpeed * p.speed) % 30) - 15
            const angle = p.angle + t * 0.1
            const wobble = Math.sin(t * 2 + i * 0.1) * 0.05

            dummy.position.set(
                Math.cos(angle) * (p.radius + wobble),
                Math.sin(angle) * (p.radius + wobble),
                z
            )

            // Scale based on distance (closer = bigger)
            const distScale = 1 - Math.abs(z) / 15
            dummy.scale.setScalar(p.size * (0.5 + distScale * 0.5))
            dummy.updateMatrix()
            particlesRef.current!.setMatrixAt(i, dummy.matrix)
        })
        particlesRef.current.instanceMatrix.needsUpdate = true
    })

    return (
        <instancedMesh ref={particlesRef} args={[undefined, undefined, COUNT]}>
            <sphereGeometry args={[1, 6, 6]} />
            <meshBasicMaterial
                color="#00d4ff"
                transparent
                opacity={0.6}
                blending={THREE.AdditiveBlending}
            />
        </instancedMesh>
    )
}

/* ─────────────────── Tunnel Rings ─────────────────── */
function TunnelRings() {
    const ringsRef = useRef<THREE.Group>(null)
    const RING_COUNT = 12
    const scroll = useScrollProgress()

    useFrame((state) => {
        if (!ringsRef.current) return
        const t = state.clock.getElapsedTime()
        const velocity = Math.abs(scroll.velocity) * 0.3

        ringsRef.current.children.forEach((child, i) => {
            const mesh = child as THREE.Mesh
            let z = ((i * 2.5 + t * (0.5 + velocity * 2)) % 30) - 15
            mesh.position.z = z

            // Fade based on distance
            const dist = Math.abs(z) / 15
            const mat = mesh.material as THREE.MeshBasicMaterial
            mat.opacity = Math.max(0, 0.15 - dist * 0.1)

            // Rotate
            mesh.rotation.z = t * 0.1 + i * 0.2
        })
    })

    return (
        <group ref={ringsRef}>
            {Array.from({ length: RING_COUNT }).map((_, i) => (
                <mesh key={i} position={[0, 0, i * 2.5 - 15]}>
                    <ringGeometry args={[2.5, 2.6, 64]} />
                    <meshBasicMaterial
                        color={i % 2 === 0 ? '#00d4ff' : '#a855f7'}
                        transparent
                        opacity={0.15}
                        side={THREE.DoubleSide}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>
            ))}
        </group>
    )
}

/* ─────────────────── Floating Data Cubes ─────────────────── */
function DataCubes() {
    const cubesRef = useRef<THREE.InstancedMesh>(null)
    const COUNT = 20
    const dummy = useMemo(() => new THREE.Object3D(), [])

    const cubeData = useMemo(() => {
        return Array.from({ length: COUNT }, () => ({
            angle: Math.random() * Math.PI * 2,
            radius: 3 + Math.random() * 1.5,
            z: Math.random() * 20 - 10,
            speed: 0.2 + Math.random() * 0.5,
            rotSpeed: 0.5 + Math.random() * 2,
            size: 0.04 + Math.random() * 0.06,
        }))
    }, [])

    useFrame((state) => {
        if (!cubesRef.current) return
        const t = state.clock.getElapsedTime()

        cubeData.forEach((cube, i) => {
            const angle = cube.angle + t * cube.speed
            dummy.position.set(
                Math.cos(angle) * cube.radius,
                Math.sin(angle) * cube.radius,
                cube.z + Math.sin(t * 0.5 + i) * 1
            )
            dummy.rotation.set(t * cube.rotSpeed, t * cube.rotSpeed * 0.7, 0)
            dummy.scale.setScalar(cube.size)
            dummy.updateMatrix()
            cubesRef.current!.setMatrixAt(i, dummy.matrix)
        })
        cubesRef.current.instanceMatrix.needsUpdate = true
    })

    return (
        <instancedMesh ref={cubesRef} args={[undefined, undefined, COUNT]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial
                color="#ec4899"
                transparent
                opacity={0.5}
                blending={THREE.AdditiveBlending}
            />
        </instancedMesh>
    )
}

/* ─────────────────── Main Export ─────────────────── */
export default function WorkExperience() {
    return (
        <>
            <fog attach="fog" args={['#030014', 5, 20]} />
            <ambientLight intensity={0.05} />

            <WarpTunnel />
            <TunnelRings />
            <DataCubes />
        </>
    )
}
