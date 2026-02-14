'use client'
import { Canvas } from '@react-three/fiber'
import { ReactNode, Suspense } from 'react'
import { Preload } from '@react-three/drei'

export default function ThreeScene({
    children,
    cameraPosition = [0, 0, 1],
    fov = 75
}: {
    children: ReactNode,
    cameraPosition?: [number, number, number],
    fov?: number
}) {
    return (
        <div className="absolute inset-0 -z-10 w-full h-full">
            <Canvas
                camera={{ position: cameraPosition, fov: fov }}
                gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
                dpr={[1, 1.5]}
                style={{ background: 'transparent' }}
            >
                <Suspense fallback={null}>
                    {children}
                    <Preload all />
                </Suspense>
            </Canvas>
        </div>
    )
}
