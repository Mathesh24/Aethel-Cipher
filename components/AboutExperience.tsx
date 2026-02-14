'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* ─────────────────── Neural Network Nodes ─────────────────── */
function NetworkNodes() {
    const nodesRef = useRef<THREE.InstancedMesh>(null)
    const dummy = useMemo(() => new THREE.Object3D(), [])

    const nodePositions = useMemo(() => {
        const count = 40
        const positions: [number, number, number][] = []
        // Create a network-like distribution
        for (let i = 0; i < count; i++) {
            const layer = Math.floor(i / 8)
            const index = i % 8
            const angle = (index / 8) * Math.PI * 2 + layer * 0.3
            const r = 1 + layer * 0.8
            positions.push([
                Math.cos(angle) * r + (Math.random() - 0.5) * 0.5,
                (Math.random() - 0.5) * 2,
                Math.sin(angle) * r + (Math.random() - 0.5) * 0.5,
            ])
        }
        return positions
    }, [])

    useFrame((state) => {
        if (!nodesRef.current) return
        const t = state.clock.getElapsedTime()
        nodePositions.forEach((pos, i) => {
            dummy.position.set(
                pos[0] + Math.sin(t * 0.5 + i) * 0.05,
                pos[1] + Math.cos(t * 0.3 + i * 0.7) * 0.05,
                pos[2] + Math.sin(t * 0.4 + i * 1.3) * 0.05,
            )
            const pulse = 0.04 + Math.sin(t * 2 + i * 0.5) * 0.015
            dummy.scale.setScalar(pulse)
            dummy.updateMatrix()
            nodesRef.current!.setMatrixAt(i, dummy.matrix)
        })
        nodesRef.current.instanceMatrix.needsUpdate = true
    })

    return (
        <instancedMesh ref={nodesRef} args={[undefined, undefined, nodePositions.length]}>
            <sphereGeometry args={[1, 12, 12]} />
            <meshBasicMaterial
                color="#00d4ff"
                transparent
                opacity={0.9}
                blending={THREE.AdditiveBlending}
            />
        </instancedMesh>
    )
}

/* ─────────────────── Connection Lines ─────────────────── */
function Connections() {
    const linesRef = useRef<THREE.Group>(null)

    const connections = useMemo(() => {
        const conns: { start: THREE.Vector3; end: THREE.Vector3; color: string }[] = []
        const nodeCount = 40
        // Create connections between nearby nodes
        for (let i = 0; i < 30; i++) {
            const a = Math.floor(Math.random() * nodeCount)
            const b = Math.floor(Math.random() * nodeCount)
            if (a === b) continue
            const layerA = Math.floor(a / 8)
            const indexA = a % 8
            const layerB = Math.floor(b / 8)
            const indexB = b % 8
            const angleA = (indexA / 8) * Math.PI * 2 + layerA * 0.3
            const angleB = (indexB / 8) * Math.PI * 2 + layerB * 0.3
            const rA = 1 + layerA * 0.8
            const rB = 1 + layerB * 0.8
            conns.push({
                start: new THREE.Vector3(Math.cos(angleA) * rA, (Math.random() - 0.5) * 2, Math.sin(angleA) * rA),
                end: new THREE.Vector3(Math.cos(angleB) * rB, (Math.random() - 0.5) * 2, Math.sin(angleB) * rB),
                color: Math.random() > 0.5 ? '#00d4ff' : '#a855f7',
            })
        }
        return conns
    }, [])

    useFrame((state) => {
        if (!linesRef.current) return
        linesRef.current.rotation.y = state.clock.getElapsedTime() * 0.03
    })

    return (
        <group ref={linesRef}>
            {connections.map((conn, i) => {
                const points = [conn.start, conn.end]
                const geometry = new THREE.BufferGeometry().setFromPoints(points)
                return (
                    <line key={i}>
                        <bufferGeometry attach="geometry" {...geometry} />
                        <lineBasicMaterial
                            color={conn.color}
                            transparent
                            opacity={0.15}
                            blending={THREE.AdditiveBlending}
                        />
                    </line>
                )
            })}
        </group>
    )
}

/* ─────────────────── Data Pulses traveling along connections ─────────────────── */
function DataPulses() {
    const COUNT = 15
    const pulsesRef = useRef<THREE.InstancedMesh>(null)
    const dummy = useMemo(() => new THREE.Object3D(), [])

    const pulseData = useMemo(() => {
        return Array.from({ length: COUNT }, () => ({
            startAngle: Math.random() * Math.PI * 2,
            radius: 1 + Math.random() * 3,
            speed: 0.5 + Math.random() * 1.5,
            yRange: (Math.random() - 0.5) * 2,
            phase: Math.random() * Math.PI * 2,
        }))
    }, [])

    useFrame((state) => {
        if (!pulsesRef.current) return
        const t = state.clock.getElapsedTime()
        pulseData.forEach((pulse, i) => {
            const angle = pulse.startAngle + t * pulse.speed
            dummy.position.set(
                Math.cos(angle) * pulse.radius,
                pulse.yRange + Math.sin(t * 2 + pulse.phase) * 0.3,
                Math.sin(angle) * pulse.radius,
            )
            const glow = 0.03 + Math.sin(t * 5 + i) * 0.01
            dummy.scale.setScalar(glow)
            dummy.updateMatrix()
            pulsesRef.current!.setMatrixAt(i, dummy.matrix)
        })
        pulsesRef.current.instanceMatrix.needsUpdate = true
    })

    return (
        <instancedMesh ref={pulsesRef} args={[undefined, undefined, COUNT]}>
            <sphereGeometry args={[1, 8, 8]} />
            <meshBasicMaterial
                color="#ffffff"
                transparent
                opacity={0.9}
                blending={THREE.AdditiveBlending}
            />
        </instancedMesh>
    )
}

/* ─────────────────── Main Export ─────────────────── */
export default function AboutExperience() {
    return (
        <>
            <ambientLight intensity={0.1} />
            <pointLight position={[3, 3, 3]} intensity={0.5} color="#00d4ff" />
            <pointLight position={[-3, -2, 2]} intensity={0.3} color="#a855f7" />

            <group rotation={[0.3, 0, 0.1]}>
                <NetworkNodes />
                <Connections />
                <DataPulses />
            </group>
        </>
    )
}
