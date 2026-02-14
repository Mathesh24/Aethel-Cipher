'use client'
import { motion } from 'framer-motion'
import ThreeScene from './ThreeScene'
import AboutExperience from './AboutExperience'

const stats = [
    { value: '150+', label: 'Projects Delivered' },
    { value: '99.9%', label: 'Uptime SLA' },
    { value: '50+', label: 'Enterprise Clients' },
    { value: '24/7', label: 'Global Support' },
]

export default function About() {
    return (
        <section className="relative py-32 px-6 overflow-hidden min-h-[80vh]">
            {/* 3D Neural Network Background */}
            <ThreeScene cameraPosition={[0, 0, 5]} fov={60}>
                <AboutExperience />
            </ThreeScene>

            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#030014] via-transparent to-[#030014] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_#030014_80%)] pointer-events-none" />

            {/* Scan-lines */}
            <div className="scan-lines absolute inset-0 pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left: Text */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <p className="text-sm uppercase tracking-[0.3em] text-cyan-400 mb-4 font-medium"
                            style={{ textShadow: '0 0 15px rgba(0,212,255,0.5)' }}
                        >About GrepFlow</p>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-white">
                            Powering the next wave of <span className="neon-text">intelligent systems</span>
                        </h2>
                        <p className="text-gray-400 text-lg leading-relaxed mb-6">
                            We are an AI &amp; Cloud technology company building products and services that transform how businesses operate. From design and prototyping to full-scale cloud architecture, we deliver solutions that push the boundaries of what&apos;s possible.
                        </p>
                        <p className="text-gray-500 leading-relaxed">
                            Our team of engineers, designers, and AI researchers work at the intersection of cutting-edge research and practical application, ensuring every solution we build is robust, scalable, and future-proof.
                        </p>
                    </motion.div>

                    {/* Right: Stats Grid */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="grid grid-cols-2 gap-4"
                    >
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 + i * 0.1 }}
                                className="glass-card p-6 text-center transition-all duration-300 hologram-shimmer"
                            >
                                <p className="text-3xl md:text-4xl font-bold neon-text mb-2">{stat.value}</p>
                                <p className="text-sm text-gray-400">{stat.label}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
