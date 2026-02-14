'use client'
import { motion } from 'framer-motion'
import ThreeScene from './ThreeScene'
import WorkExperience from './WorkExperience'

const projects = [
    {
        title: 'NeuralCore Engine',
        category: 'AI Platform',
        description: 'Enterprise AI inference engine processing 10M+ requests daily with sub-100ms latency.',
        tags: ['PyTorch', 'Kubernetes', 'gRPC'],
        gradient: 'from-cyan-500 to-blue-600',
    },
    {
        title: 'CloudMatrix',
        category: 'Cloud Infrastructure',
        description: 'Multi-region cloud orchestration platform managing 500+ microservices across 3 cloud providers.',
        tags: ['Terraform', 'AWS', 'GCP'],
        gradient: 'from-purple-500 to-indigo-600',
    },
    {
        title: 'DataPulse Analytics',
        category: 'Data Engineering',
        description: 'Real-time analytics pipeline processing 50TB of data daily for a Fortune 500 retail company.',
        tags: ['Apache Spark', 'Kafka', 'BigQuery'],
        gradient: 'from-emerald-500 to-teal-600',
    },
    {
        title: 'VisionGuard AI',
        category: 'Computer Vision',
        description: 'AI-powered surveillance system with 99.7% accuracy for anomaly detection in manufacturing.',
        tags: ['TensorFlow', 'Edge AI', 'ONNX'],
        gradient: 'from-pink-500 to-rose-600',
    },
]

export default function Work() {
    return (
        <section id="work" className="relative py-32 px-6 overflow-hidden min-h-screen">
            {/* 3D Warp Tunnel Background */}
            <ThreeScene cameraPosition={[0, 0, 5]} fov={60}>
                <WorkExperience />
            </ThreeScene>

            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#030014] via-transparent to-[#030014] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_#030014_75%)] pointer-events-none" />

            {/* Scan-lines */}
            <div className="scan-lines absolute inset-0 pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <p className="text-sm uppercase tracking-[0.3em] text-cyan-400 mb-4 font-medium"
                        style={{ textShadow: '0 0 15px rgba(0,212,255,0.5)' }}
                    >Portfolio</p>
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4">
                        Selected <span className="neon-text">Work</span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        A selection of projects that showcase our expertise in AI, cloud, and modern engineering.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {projects.map((project, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-card overflow-hidden group cursor-pointer transition-all duration-500 hover:border-cyan-500/30 hologram-shimmer"
                        >
                            {/* Gradient header */}
                            <div className={`h-48 bg-gradient-to-br ${project.gradient} relative overflow-hidden`}>
                                <div className="absolute inset-0 bg-black/30" />
                                {/* Grid overlay */}
                                <div className="absolute inset-0 opacity-30" style={{
                                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                                    backgroundSize: '20px 20px'
                                }} />
                                {/* Animated scan line */}
                                <div className="absolute inset-0 overflow-hidden">
                                    <div className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent animate-scan" />
                                </div>
                                <div className="absolute bottom-4 left-6">
                                    <span className="text-xs uppercase tracking-widest text-white/70 bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
                                        {project.category}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                                    {project.title}
                                </h3>
                                <p className="text-gray-400 text-sm leading-relaxed mb-5">
                                    {project.description}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {project.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="text-xs px-3 py-1 rounded-full bg-white/5 text-gray-300 border border-white/10 hover:border-cyan-500/30 transition-colors"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
