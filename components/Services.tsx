'use client'
import { motion } from 'framer-motion'
import ThreeScene from './ThreeScene'
import ServiceExperience from './ServiceExperience'

const services = [
    {
        icon: '🧠',
        title: 'AI & Machine Learning',
        description: 'Custom AI models, natural language processing, computer vision, and intelligent automation for your business workflows.',
        tags: ['LLMs', 'Computer Vision', 'MLOps'],
        gradient: 'from-cyan-500/20 to-blue-600/20',
        borderColor: 'hover:border-cyan-500/40',
        glowColor: 'rgba(0, 212, 255, 0.3)',
    },
    {
        icon: '☁️',
        title: 'Cloud Architecture',
        description: 'Scalable, resilient cloud infrastructure on AWS, GCP, and Azure. Microservices, serverless, and Kubernetes at scale.',
        tags: ['AWS', 'GCP', 'Kubernetes'],
        gradient: 'from-purple-500/20 to-indigo-600/20',
        borderColor: 'hover:border-purple-500/40',
        glowColor: 'rgba(168, 85, 247, 0.3)',
    },
    {
        icon: '🎨',
        title: 'Design & Prototyping',
        description: 'User-centered design, interactive prototypes, and design systems that bring your digital products to life.',
        tags: ['UI/UX', 'Design Systems', 'Figma'],
        gradient: 'from-pink-500/20 to-rose-600/20',
        borderColor: 'hover:border-pink-500/40',
        glowColor: 'rgba(236, 72, 153, 0.3)',
    },
    {
        icon: '⚡',
        title: 'Full-Stack Development',
        description: 'Modern web and mobile applications built with React, Next.js, Node.js, and cloud-native architectures.',
        tags: ['React', 'Next.js', 'Node.js'],
        gradient: 'from-emerald-500/20 to-teal-600/20',
        borderColor: 'hover:border-emerald-500/40',
        glowColor: 'rgba(52, 211, 153, 0.3)',
    },
    {
        icon: '🔒',
        title: 'DevOps & Security',
        description: 'CI/CD pipelines, infrastructure as code, security audits, and automated monitoring for production-grade systems.',
        tags: ['CI/CD', 'Terraform', 'Security'],
        gradient: 'from-amber-500/20 to-orange-600/20',
        borderColor: 'hover:border-amber-500/40',
        glowColor: 'rgba(251, 191, 36, 0.3)',
    },
    {
        icon: '📊',
        title: 'Data Engineering',
        description: 'Real-time data pipelines, warehousing, ETL processes, and analytics dashboards for data-driven decisions.',
        tags: ['Spark', 'BigQuery', 'dbt'],
        gradient: 'from-violet-500/20 to-fuchsia-600/20',
        borderColor: 'hover:border-violet-500/40',
        glowColor: 'rgba(167, 139, 250, 0.3)',
    },
]

export default function Services() {
    return (
        <section id="services" className="relative py-32 px-6 overflow-hidden min-h-screen">
            {/* 3D Holographic Background */}
            <ThreeScene cameraPosition={[0, 0, 6]} fov={60}>
                <ServiceExperience />
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
                    >What We Do</p>
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4">
                        Our <span className="neon-text">Services</span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        End-to-end technology solutions powered by artificial intelligence and modern cloud infrastructure.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.08 }}
                            className={`glass-card p-8 transition-all duration-500 group cursor-pointer ${service.borderColor} hologram-shimmer`}
                            style={{
                                ['--glow-color' as string]: service.glowColor,
                            }}
                        >
                            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center text-2xl mb-6`}>
                                {service.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                                {service.title}
                            </h3>
                            <p className="text-gray-400 text-sm leading-relaxed mb-5">
                                {service.description}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {service.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="text-xs px-3 py-1 rounded-full bg-white/5 text-gray-300 border border-white/10 hover:border-cyan-500/30 transition-colors"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
