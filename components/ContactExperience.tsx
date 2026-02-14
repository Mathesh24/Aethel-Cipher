'use client'
import { useRef, useMemo, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/* ─────────────────── Particle Vortex ─────────────────── */
function ParticleVortex() {
    const COUNT = 4000
    const particlesRef = useRef<THREE.InstancedMesh>(null)
    const dummy = useMemo(() => new THREE.Object3D(), [])
    const mouse = useRef({ x: 0, y: 0 })
    const { viewport } = useThree()

    useEffect(() => {
        const handleMove = (e: MouseEvent) => {
            mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
            mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
        }
        window.addEventListener('mousemove', handleMove)
        return () => window.removeEventListener('mousemove', handleMove)
    }, [])

    const particleData = useMemo(() => {
        return Array.from({ length: COUNT }, (_, i) => ({
            angle: (i / COUNT) * Math.PI * 2 * 6, // spiral
            radius: 0.2 + (i / COUNT) * 3,
            speed: 0.3 + Math.random() * 0.7,
            yOffset: (Math.random() - 0.5) * 2,
            size: 0.008 + Math.random() * 0.015,
            colorPhase: Math.random(),
        }))
    }, [])

    useFrame((state) => {
        if (!particlesRef.current) return
        const t = state.clock.getElapsedTime()

        const mouseX = mouse.current.x * viewport.width * 0.5
        const mouseY = mouse.current.y * viewport.height * 0.5

        particleData.forEach((p, i) => {
            const angle = p.angle + t * p.speed
            let x = Math.cos(angle) * p.radius
            let y = p.yOffset + Math.sin(t * 0.5 + i * 0.01) * 0.3
            let z = Math.sin(angle) * p.radius

            // Mouse attraction (pull particles toward cursor)
            const dx = mouseX - x
            const dy = mouseY - y
            const dist = Math.sqrt(dx * dx + dy * dy)
            const attractionStrength = Math.max(0, 1 - dist / 4) * 0.3
            x += dx * attractionStrength
            y += dy * attractionStrength

            dummy.position.set(x, y, z)
            const pulse = p.size * (1 + Math.sin(t * 3 + i * 0.1) * 0.3)
            dummy.scale.setScalar(pulse)
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

/* ─────────────────── Vortex Core Glow ─────────────────── */
function VortexCore() {
    const coreRef = useRef<THREE.Mesh>(null)
    const outerRef = useRef<THREE.Mesh>(null)

    useFrame((state) => {
        const t = state.clock.getElapsedTime()
        if (coreRef.current) {
            const s = 0.3 + Math.sin(t * 1.5) * 0.05
            coreRef.current.scale.setScalar(s)
        }
        if (outerRef.current) {
            const s = 0.6 + Math.sin(t * 1) * 0.1
            outerRef.current.scale.setScalar(s)
            outerRef.current.rotation.z = t * 0.2
        }
    })

    return (
        <group>
            <mesh ref={coreRef}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshBasicMaterial
                    color="#a855f7"
                    transparent
                    opacity={0.15}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>
            <mesh ref={outerRef}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshBasicMaterial
                    color="#00d4ff"
                    transparent
                    opacity={0.05}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>
        </group>
    )
}

/* ─────────────────── Purple Accent Particles ─────────────────── */
function AccentParticles() {
    const COUNT = 500
    const particlesRef = useRef<THREE.InstancedMesh>(null)
    const dummy = useMemo(() => new THREE.Object3D(), [])

    const data = useMemo(() => {
        return Array.from({ length: COUNT }, () => ({
            angle: Math.random() * Math.PI * 2,
            radius: 2.5 + Math.random() * 2,
            speed: -0.2 - Math.random() * 0.5, // opposite rotation
            y: (Math.random() - 0.5) * 3,
            size: 0.01 + Math.random() * 0.02,
        }))
    }, [])

    useFrame((state) => {
        if (!particlesRef.current) return
        const t = state.clock.getElapsedTime()
        data.forEach((p, i) => {
            const angle = p.angle + t * p.speed
            dummy.position.set(
                Math.cos(angle) * p.radius,
                p.y + Math.sin(t * 0.3 + i * 0.05) * 0.2,
                Math.sin(angle) * p.radius,
            )
            dummy.scale.setScalar(p.size)
            dummy.updateMatrix()
            particlesRef.current!.setMatrixAt(i, dummy.matrix)
        })
        particlesRef.current.instanceMatrix.needsUpdate = true
    })

    return (
        <instancedMesh ref={particlesRef} args={[undefined, undefined, COUNT]}>
            <sphereGeometry args={[1, 6, 6]} />
            <meshBasicMaterial
                color="#a855f7"
                transparent
                opacity={0.5}
                blending={THREE.AdditiveBlending}
            />
        </instancedMesh>
    )
}

/* ─────────────────── Main Export ─────────────────── */
export default function ContactExperience() {
    return (
        <>
            <ambientLight intensity={0.05} />
            <pointLight position={[0, 0, 3]} intensity={0.5} color="#00d4ff" />

            <group rotation={[0.3, 0, 0]}>
                <ParticleVortex />
                <AccentParticles />
                <VortexCore />
            </group>
        </>
    )
}
