'use client'
import { useRef, useMemo, useCallback, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import * as THREE from 'three'
import { useScrollProgress } from './ScrollContext'

/* ─────────────────── Star Field (InstancedMesh) ─────────────────── */
function Starfield() {
    const meshRef = useRef<THREE.InstancedMesh>(null)
    const COUNT = 12000
    const scroll = useScrollProgress()
    const dummy = useMemo(() => new THREE.Object3D(), [])

    const [positions, sizes] = useMemo(() => {
        const pos = new Float32Array(COUNT * 3)
        const sz = new Float32Array(COUNT)
        for (let i = 0; i < COUNT; i++) {
            const r = 8 + Math.random() * 60
            const theta = Math.random() * Math.PI * 2
            const phi = Math.acos(2 * Math.random() - 1)
            pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
            pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
            pos[i * 3 + 2] = r * Math.cos(phi)
            sz[i] = 0.02 + Math.random() * 0.06
        }
        return [pos, sz]
    }, [])

    useFrame((state) => {
        if (!meshRef.current) return
        const t = state.clock.getElapsedTime()
        // Slow rotation + scroll parallax
        meshRef.current.rotation.y = t * 0.008 + scroll.progress * Math.PI * 0.3
        meshRef.current.rotation.x = Math.sin(t * 0.003) * 0.1 + scroll.progress * 0.2
    })

    useEffect(() => {
        if (!meshRef.current) return
        for (let i = 0; i < COUNT; i++) {
            dummy.position.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2])
            const s = sizes[i]
            dummy.scale.set(s, s, s)
            dummy.updateMatrix()
            meshRef.current.setMatrixAt(i, dummy.matrix)
        }
        meshRef.current.instanceMatrix.needsUpdate = true
    }, [positions, sizes, dummy])

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]}>
            <sphereGeometry args={[1, 6, 6]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
        </instancedMesh>
    )
}

/* ─────────────────── Nebula Clouds ─────────────────── */
function NebulaClouds() {
    const ref = useRef<THREE.Points>(null)
    const COUNT = 4000

    const positions = useMemo(() => {
        const pos = new Float32Array(COUNT * 3)
        for (let i = 0; i < COUNT; i++) {
            // Spiral arm distribution
            const arm = Math.floor(Math.random() * 3)
            const armAngle = (arm / 3) * Math.PI * 2
            const spread = Math.random() * 15
            const angle = armAngle + spread * 0.15
            const r = 3 + spread
            pos[i * 3] = Math.cos(angle) * r + (Math.random() - 0.5) * 3
            pos[i * 3 + 1] = (Math.random() - 0.5) * 4
            pos[i * 3 + 2] = Math.sin(angle) * r + (Math.random() - 0.5) * 3
        }
        return pos
    }, [])

    const colors = useMemo(() => {
        const cols = new Float32Array(COUNT * 3)
        const cyan = new THREE.Color('#00d4ff')
        const purple = new THREE.Color('#a855f7')
        const pink = new THREE.Color('#ec4899')
        for (let i = 0; i < COUNT; i++) {
            const t = Math.random()
            const color = t < 0.4 ? cyan.clone().lerp(purple, t / 0.4)
                : purple.clone().lerp(pink, (t - 0.4) / 0.6)
            cols[i * 3] = color.r
            cols[i * 3 + 1] = color.g
            cols[i * 3 + 2] = color.b
        }
        return cols
    }, [])

    useFrame((state) => {
        if (!ref.current) return
        const t = state.clock.getElapsedTime()
        ref.current.rotation.y = t * 0.01
        ref.current.rotation.z = Math.sin(t * 0.005) * 0.05
    })

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
                <bufferAttribute attach="attributes-color" args={[colors, 3]} />
            </bufferGeometry>
            <pointsMaterial
                size={0.12}
                transparent
                opacity={0.35}
                vertexColors
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                sizeAttenuation
            />
        </points>
    )
}

/* ─────────────────── Shooting Stars ─────────────────── */
function ShootingStars() {
    const groupRef = useRef<THREE.Group>(null)
    const STAR_COUNT = 5
    const meshRefs = useRef<THREE.Mesh[]>([])

    const starData = useMemo(() => {
        return Array.from({ length: STAR_COUNT }, () => ({
            startPos: new THREE.Vector3(
                (Math.random() - 0.5) * 40,
                10 + Math.random() * 20,
                -10 - Math.random() * 30
            ),
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 0.8,
                -0.5 - Math.random() * 0.5,
                (Math.random() - 0.5) * 0.3
            ),
            delay: Math.random() * 20,
            duration: 1.5 + Math.random() * 2,
            active: false,
        }))
    }, [])

    useFrame((state) => {
        const t = state.clock.getElapsedTime()
        starData.forEach((star, i) => {
            const mesh = meshRefs.current[i]
            if (!mesh) return
            const cycleTime = (t - star.delay) % (star.duration + 8)
            if (cycleTime > 0 && cycleTime < star.duration) {
                const progress = cycleTime / star.duration
                mesh.visible = true
                mesh.position.copy(star.startPos)
                mesh.position.addScaledVector(star.velocity, cycleTime * 15)
                mesh.scale.setScalar(1 - progress)
                const mat = mesh.material as THREE.MeshBasicMaterial
                mat.opacity = (1 - progress) * 0.8
            } else {
                mesh.visible = false
            }
        })
    })

    return (
        <group ref={groupRef}>
            {starData.map((_, i) => (
                <mesh
                    key={i}
                    ref={(el) => { if (el) meshRefs.current[i] = el }}
                    visible={false}
                >
                    <sphereGeometry args={[0.05, 4, 4]} />
                    <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
                </mesh>
            ))}
        </group>
    )
}

/* ─────────────────── Mouse Spotlight ─────────────────── */
function MouseSpotlight() {
    const lightRef = useRef<THREE.PointLight>(null)
    const { viewport } = useThree()
    const mouse = useRef({ x: 0, y: 0 })

    useEffect(() => {
        const handleMove = (e: MouseEvent) => {
            mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
            mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
        }
        window.addEventListener('mousemove', handleMove)
        return () => window.removeEventListener('mousemove', handleMove)
    }, [])

    useFrame(() => {
        if (!lightRef.current) return
        const targetX = mouse.current.x * viewport.width * 0.5
        const targetY = mouse.current.y * viewport.height * 0.5
        lightRef.current.position.x += (targetX - lightRef.current.position.x) * 0.05
        lightRef.current.position.y += (targetY - lightRef.current.position.y) * 0.05
        lightRef.current.position.z = 5
    })

    return (
        <pointLight
            ref={lightRef}
            color="#00d4ff"
            intensity={8}
            distance={25}
            decay={2}
        />
    )
}

/* ─────────────────── Scene Composition ─────────────────── */
function SpaceScene() {
    return (
        <>
            <color attach="background" args={['#030014']} />
            <fog attach="fog" args={['#030014', 30, 80]} />
            <ambientLight intensity={0.05} />
            <Starfield />
            <NebulaClouds />
            <ShootingStars />
            <MouseSpotlight />
        </>
    )
}

/* ─────────────────── Main Export ─────────────────── */
export default function SpaceBackground() {
    return (
        <div className="fixed inset-0 w-full h-full" style={{ zIndex: 0 }}>
            <Canvas
                camera={{ position: [0, 0, 15], fov: 60, near: 0.1, far: 200 }}
                gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
                dpr={[1, 1.5]}
            >
                <SpaceScene />
                <Preload all />
            </Canvas>
        </div>
    )
}
