'use client'
import { useRef, useMemo, useState } from 'react'
import { Float, MeshDistortMaterial } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* ─────────────────── Data Stream Particles (Matrix rain) ─────────────────── */
function DataStream() {
    const COUNT = 300
    const particlesRef = useRef<THREE.InstancedMesh>(null)
    const dummy = useMemo(() => new THREE.Object3D(), [])

    const streamData = useMemo(() => {
        return Array.from({ length: COUNT }, () => ({
            x: (Math.random() - 0.5) * 12,
            z: (Math.random() - 0.5) * 6,
            speed: 0.5 + Math.random() * 1.5,
            offset: Math.random() * 10,
            size: 0.01 + Math.random() * 0.02,
        }))
    }, [])

    useFrame((state) => {
        if (!particlesRef.current) return
        const t = state.clock.getElapsedTime()
        streamData.forEach((p, i) => {
            const y = ((p.offset + t * p.speed) % 8) - 4
            dummy.position.set(p.x, y, p.z)
            dummy.scale.setScalar(p.size)
            dummy.updateMatrix()
            particlesRef.current!.setMatrixAt(i, dummy.matrix)
        })
        particlesRef.current.instanceMatrix.needsUpdate = true
    })

    return (
        <instancedMesh ref={particlesRef} args={[undefined, undefined, COUNT]}>
            <boxGeometry args={[1, 3, 0.3]} />
            <meshBasicMaterial
                color="#00d4ff"
                transparent
                opacity={0.15}
                blending={THREE.AdditiveBlending}
            />
        </instancedMesh>
    )
}

/* ─────────────────── Holographic Geometry ─────────────────── */
const geometries = [
    { type: 'icosahedron', args: [0.8, 1], position: [-3, 1.5, 0] as [number, number, number], color: '#60a5fa' },
    { type: 'octahedron', args: [0.8, 0], position: [3, 1, 0] as [number, number, number], color: '#c084fc' },
    { type: 'torusKnot', args: [0.5, 0.15, 100, 16], position: [-1.5, -1.5, 1] as [number, number, number], color: '#34d399' },
    { type: 'dodecahedron', args: [0.7, 0], position: [1.5, -1, -1] as [number, number, number], color: '#f472b6' },
    { type: 'torus', args: [0.6, 0.2, 16, 32], position: [-2.5, -0.5, -1] as [number, number, number], color: '#fbbf24' },
    { type: 'tetrahedron', args: [0.8, 0], position: [2.5, 2, 1] as [number, number, number], color: '#a78bfa' },
]

function HologramShape({ type, args, position, color }: {
    type: string; args: number[]; position: [number, number, number]; color: string
}) {
    const [hovered, setHovered] = useState(false)
    const meshRef = useRef<THREE.Mesh>(null)
    const wireRef = useRef<THREE.Mesh>(null)

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += delta * 0.3
            meshRef.current.rotation.y += delta * (hovered ? 1.5 : 0.4)
            const targetScale = hovered ? 1.3 : 1
            meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 5)
        }
        if (wireRef.current) {
            wireRef.current.rotation.x = meshRef.current?.rotation.x || 0
            wireRef.current.rotation.y = meshRef.current?.rotation.y || 0
            wireRef.current.scale.copy(meshRef.current?.scale || new THREE.Vector3(1, 1, 1))
        }
    })

    const GeometryComponent = () => {
        switch (type) {
            case 'icosahedron': return <icosahedronGeometry args={args as [number, number]} />
            case 'octahedron': return <octahedronGeometry args={args as [number, number]} />
            case 'torusKnot': return <torusKnotGeometry args={args as [number, number, number, number]} />
            case 'dodecahedron': return <dodecahedronGeometry args={args as [number, number]} />
            case 'torus': return <torusGeometry args={args as [number, number, number, number]} />
            case 'tetrahedron': return <tetrahedronGeometry args={args as [number, number]} />
            default: return <boxGeometry />
        }
    }

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8} position={position}>
            <group>
                {/* Solid mesh with distort */}
                <mesh
                    ref={meshRef}
                    onPointerOver={() => setHovered(true)}
                    onPointerOut={() => setHovered(false)}
                >
                    <GeometryComponent />
                    <MeshDistortMaterial
                        color={color}
                        speed={2}
                        distort={hovered ? 0.3 : 0.15}
                        radius={1}
                        transparent
                        opacity={0.6}
                    />
                </mesh>

                {/* Wireframe overlay */}
                <mesh ref={wireRef}>
                    <GeometryComponent />
                    <meshBasicMaterial
                        color={color}
                        wireframe
                        transparent
                        opacity={hovered ? 0.5 : 0.2}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>
            </group>
        </Float>
    )
}

/* ─────────────────── Main Export ─────────────────── */
export default function ServiceExperience() {
    return (
        <group>
            <ambientLight intensity={0.3} />
            <pointLight position={[10, 10, 10]} intensity={0.5} color="#00d4ff" />
            <pointLight position={[-10, -5, 5]} intensity={0.3} color="#a855f7" />

            <DataStream />

            {geometries.map((geom, index) => (
                <HologramShape key={index} {...geom} />
            ))}
        </group>
    )
}
