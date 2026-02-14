'use client'
import { useRef, useMemo, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/* ─────────────────── Central AI Core ─────────────────── */
function AICore({ mouse }: { mouse: { x: number; y: number } }) {
    const coreRef = useRef<THREE.Mesh>(null)
    const wireRef = useRef<THREE.Mesh>(null)
    const glowRef = useRef<THREE.Mesh>(null)
    const pulseRef = useRef<THREE.Mesh>(null)

    useFrame((state) => {
        const t = state.clock.getElapsedTime()
        if (coreRef.current) {
            coreRef.current.rotation.x = t * 0.15 + mouse.y * 0.3
            coreRef.current.rotation.y = t * 0.2 + mouse.x * 0.3
            const pulseScale = 1 + Math.sin(t * 2) * 0.05
            coreRef.current.scale.setScalar(pulseScale)
        }
        if (wireRef.current) {
            wireRef.current.rotation.x = -t * 0.1 + mouse.y * 0.3
            wireRef.current.rotation.y = -t * 0.15 + mouse.x * 0.3
        }
        if (glowRef.current) {
            const s = 1.3 + Math.sin(t * 1.5) * 0.15
            glowRef.current.scale.setScalar(s)
        }
        if (pulseRef.current) {
            const pulse = (t * 0.5) % 3
            const s = 1 + pulse * 0.8
            pulseRef.current.scale.setScalar(s)
            const mat = pulseRef.current.material as THREE.MeshBasicMaterial
            mat.opacity = Math.max(0, 0.3 - pulse * 0.1)
        }
    })

    return (
        <group>
            {/* Solid core */}
            <mesh ref={coreRef}>
                <icosahedronGeometry args={[0.45, 1]} />
                <meshStandardMaterial
                    color="#00d4ff"
                    emissive="#00d4ff"
                    emissiveIntensity={0.8}
                    metalness={0.9}
                    roughness={0.1}
                    transparent
                    opacity={0.85}
                />
            </mesh>

            {/* Wireframe overlay */}
            <mesh ref={wireRef}>
                <icosahedronGeometry args={[0.55, 2]} />
                <meshBasicMaterial
                    color="#a855f7"
                    wireframe
                    transparent
                    opacity={0.4}
                />
            </mesh>

            {/* Outer glow */}
            <mesh ref={glowRef}>
                <sphereGeometry args={[0.7, 32, 32]} />
                <meshBasicMaterial
                    color="#00d4ff"
                    transparent
                    opacity={0.08}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* Pulse ring */}
            <mesh ref={pulseRef} rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.5, 0.55, 64]} />
                <meshBasicMaterial
                    color="#00d4ff"
                    transparent
                    opacity={0.3}
                    side={THREE.DoubleSide}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>
        </group>
    )
}

/* ─────────────────── Orbiting Rings ─────────────────── */
function OrbitRing({ radius, speed, tilt, color, mouse }: {
    radius: number; speed: number; tilt: [number, number, number]; color: string;
    mouse: { x: number; y: number }
}) {
    const groupRef = useRef<THREE.Group>(null)
    const ringRef = useRef<THREE.Mesh>(null)
    const PARTICLE_COUNT = 80
    const particlesRef = useRef<THREE.InstancedMesh>(null)
    const dummy = useMemo(() => new THREE.Object3D(), [])

    useFrame((state) => {
        const t = state.clock.getElapsedTime()
        if (groupRef.current) {
            groupRef.current.rotation.x = tilt[0] + mouse.y * 0.1
            groupRef.current.rotation.z = tilt[2] + mouse.x * 0.1
        }
        if (ringRef.current) {
            ringRef.current.rotation.z = t * speed
        }
        if (particlesRef.current) {
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                const angle = (i / PARTICLE_COUNT) * Math.PI * 2 + t * speed * 2
                const px = Math.cos(angle) * radius
                const py = Math.sin(angle) * radius
                const wobble = Math.sin(t * 3 + i * 0.5) * 0.03
                dummy.position.set(px + wobble, wobble, py + wobble)
                const s = 0.02 + Math.sin(t * 2 + i) * 0.01
                dummy.scale.setScalar(Math.max(0.005, s))
                dummy.updateMatrix()
                particlesRef.current.setMatrixAt(i, dummy.matrix)
            }
            particlesRef.current.instanceMatrix.needsUpdate = true
        }
    })

    return (
        <group ref={groupRef}>
            {/* Ring wireframe */}
            <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[radius, 0.008, 8, 128]} />
                <meshBasicMaterial
                    color={color}
                    transparent
                    opacity={0.3}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* Orbiting particles */}
            <instancedMesh ref={particlesRef} args={[undefined, undefined, PARTICLE_COUNT]}>
                <sphereGeometry args={[1, 6, 6]} />
                <meshBasicMaterial
                    color={color}
                    transparent
                    opacity={0.8}
                    blending={THREE.AdditiveBlending}
                />
            </instancedMesh>
        </group>
    )
}

/* ─────────────────── Electrical Arcs ─────────────────── */
function ElectricalArcs({ mouse }: { mouse: { x: number; y: number } }) {
    const ARC_COUNT = 6
    const linesRef = useRef<THREE.BufferGeometry[]>([])
    const groupRef = useRef<THREE.Group>(null)

    useFrame((state) => {
        const t = state.clock.getElapsedTime()
        if (groupRef.current) {
            groupRef.current.rotation.y = t * 0.05
        }
        linesRef.current.forEach((geom, i) => {
            if (!geom) return
            const positions = geom.attributes.position.array as Float32Array
            const angle = (i / ARC_COUNT) * Math.PI * 2 + t * 0.3
            const targetR = 1.5 + Math.sin(t * 2 + i) * 0.3

            // start at core
            positions[0] = 0
            positions[1] = 0
            positions[2] = 0

            // midpoint with jitter
            const jitter = Math.sin(t * 10 + i * 7) * 0.15
            positions[3] = Math.cos(angle) * targetR * 0.5 + jitter
            positions[4] = Math.sin(angle + t) * 0.3 + jitter
            positions[5] = Math.sin(angle) * targetR * 0.5 + jitter

            // end point
            positions[6] = Math.cos(angle) * targetR
            positions[7] = Math.sin(t * 0.5 + i) * 0.5
            positions[8] = Math.sin(angle) * targetR

            geom.attributes.position.needsUpdate = true
        })
    })

    return (
        <group ref={groupRef}>
            {Array.from({ length: ARC_COUNT }).map((_, i) => {
                const positions = new Float32Array(9)
                return (
                    <line key={i}>
                        <bufferGeometry
                            ref={(el: THREE.BufferGeometry | null) => { if (el) linesRef.current[i] = el }}
                        >
                            <bufferAttribute
                                attach="attributes-position"
                                args={[positions, 3]}
                            />
                        </bufferGeometry>
                        <lineBasicMaterial
                            color={i % 2 === 0 ? '#00d4ff' : '#a855f7'}
                            transparent
                            opacity={0.5}
                            blending={THREE.AdditiveBlending}
                        />
                    </line>
                )
            })}
        </group>
    )
}

/* ─────────────────── Floating Data Nodes ─────────────────── */
function FloatingNodes({ mouse }: { mouse: { x: number; y: number } }) {
    const COUNT = 20
    const nodesRef = useRef<THREE.InstancedMesh>(null)
    const dummy = useMemo(() => new THREE.Object3D(), [])

    const nodeData = useMemo(() => {
        return Array.from({ length: COUNT }, () => ({
            radius: 1.8 + Math.random() * 1.2,
            speed: 0.2 + Math.random() * 0.5,
            offset: Math.random() * Math.PI * 2,
            yOffset: (Math.random() - 0.5) * 1.5,
            size: 0.03 + Math.random() * 0.04,
        }))
    }, [])

    useFrame((state) => {
        if (!nodesRef.current) return
        const t = state.clock.getElapsedTime()
        nodeData.forEach((node, i) => {
            const angle = t * node.speed + node.offset
            dummy.position.set(
                Math.cos(angle) * node.radius,
                node.yOffset + Math.sin(t * 0.5 + node.offset) * 0.3,
                Math.sin(angle) * node.radius
            )
            const pulse = 1 + Math.sin(t * 3 + i) * 0.3
            dummy.scale.setScalar(node.size * pulse)
            dummy.updateMatrix()
            nodesRef.current!.setMatrixAt(i, dummy.matrix)
        })
        nodesRef.current.instanceMatrix.needsUpdate = true
    })

    return (
        <instancedMesh ref={nodesRef} args={[undefined, undefined, COUNT]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial
                color="#00d4ff"
                transparent
                opacity={0.7}
                blending={THREE.AdditiveBlending}
            />
        </instancedMesh>
    )
}

/* ─────────────────── Main Hero Experience ─────────────────── */
export default function HeroExperience({ mouse = { x: 0, y: 0 } }: { mouse?: { x: number; y: number } }) {
    return (
        <>
            <ambientLight intensity={0.15} />
            <pointLight position={[5, 5, 5]} intensity={1.5} color="#00d4ff" />
            <pointLight position={[-5, -3, 3]} intensity={0.8} color="#a855f7" />
            <pointLight position={[0, 0, 3]} intensity={0.5} color="#ffffff" />

            <AICore mouse={mouse} />

            <OrbitRing radius={1} speed={0.3} tilt={[0.5, 0, 0.2]} color="#00d4ff" mouse={mouse} />
            <OrbitRing radius={1.4} speed={-0.2} tilt={[0.8, 0, -0.3]} color="#a855f7" mouse={mouse} />
            <OrbitRing radius={1.8} speed={0.15} tilt={[0.3, 0, 0.5]} color="#ec4899" mouse={mouse} />

            <ElectricalArcs mouse={mouse} />
            <FloatingNodes mouse={mouse} />
        </>
    )
}
