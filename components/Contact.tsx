'use client'
import { motion } from 'framer-motion'
import ThreeScene from './ThreeScene'
import ContactExperience from './ContactExperience'

export default function Contact() {
    return (
        <section id="contact" className="relative py-32 px-6 overflow-hidden min-h-[80vh]">
            {/* 3D Particle Vortex Background */}
            <ThreeScene cameraPosition={[0, 0, 5]} fov={60}>
                <ContactExperience />
            </ThreeScene>

            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#030014] via-transparent to-[#030014] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_#030014_80%)] pointer-events-none" />

            {/* Scan-lines */}
            <div className="scan-lines absolute inset-0 pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <p className="text-sm uppercase tracking-[0.3em] text-cyan-400 mb-4 font-medium"
                        style={{ textShadow: '0 0 15px rgba(0,212,255,0.5)' }}
                    >Get In Touch</p>
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4">
                        Let&apos;s Build the <span className="neon-text">Future</span>
                    </h2>
                    <p className="text-gray-400 text-lg">
                        Ready to transform your business with AI? Let&apos;s talk.
                    </p>
                </motion.div>

                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-8 md:p-10 space-y-6 hologram-shimmer"
                    onSubmit={(e) => e.preventDefault()}
                    style={{ background: 'rgba(10, 10, 46, 0.7)' }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Name</label>
                            <input
                                type="text"
                                placeholder="Your name"
                                className="form-input"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Email</label>
                            <input
                                type="email"
                                placeholder="you@company.com"
                                className="form-input"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Subject</label>
                        <input
                            type="text"
                            placeholder="Project inquiry"
                            className="form-input"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Message</label>
                        <textarea
                            placeholder="Tell us about your project..."
                            rows={5}
                            className="form-input resize-none"
                        />
                    </div>
                    <button type="submit" className="btn-primary w-full text-center">
                        Send Message
                    </button>
                </motion.form>
            </div>
        </section>
    )
}
