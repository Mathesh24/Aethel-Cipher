'use client'
import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import ThreeScene from './ThreeScene'
import HeroExperience from './HeroExperience'

export default function Hero() {
    const [mouse, setMouse] = useState({ x: 0, y: 0 })

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        const x = (e.clientX / window.innerWidth) * 2 - 1
        const y = -(e.clientY / window.innerHeight) * 2 + 1
        setMouse({ x, y })
    }, [])

    return (
        <section
            className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden"
            onMouseMove={handleMouseMove}
        >
            {/* 3D Background */}
            <ThreeScene cameraPosition={[0, 0, 4]} fov={60}>
                <HeroExperience mouse={mouse} />
            </ThreeScene>

            {/* Scan-lines overlay */}
            <div className="scan-lines absolute inset-0 pointer-events-none" />

            {/* Radial gradient overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_#030014_75%)] pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                >
                    <p className="text-sm md:text-base uppercase tracking-[0.3em] text-cyan-400 mb-6 font-medium"
                        style={{ textShadow: '0 0 20px rgba(0,212,255,0.5)' }}
                    >
                        Next-Generation Intelligence
                    </p>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-none mb-6"
                >
                    <span className="neon-text">GREP</span>
                    <span className="text-white" style={{ textShadow: '0 0 40px rgba(255,255,255,0.2)' }}>FLOW</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
                >
                    Building the future with AI-powered cloud infrastructure.
                    Design, develop, and deploy at the speed of thought.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <a href="#services" className="btn-primary text-center">
                        Explore Services
                    </a>
                    <a href="#work" className="btn-secondary text-center">
                        View Our Work
                    </a>
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            >
                <p className="text-xs text-gray-500 uppercase tracking-widest">Scroll</p>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-5 h-8 rounded-full border border-gray-600 flex justify-center pt-1.5"
                >
                    <div className="w-1 h-2 bg-cyan-400 rounded-full" style={{ boxShadow: '0 0 8px rgba(0,212,255,0.8)' }} />
                </motion.div>
            </motion.div>
        </section>
    )
}
