import Link from 'next/link'

const footerLinks = [
    { name: 'Services', href: '#services' },
    { name: 'Work', href: '#work' },
    { name: 'Contact', href: '#contact' },
]

export default function Footer() {
    return (
        <footer className="relative border-t border-white/5" style={{ background: 'rgba(3, 0, 20, 0.8)' }}>
            {/* Scan-lines */}
            <div className="scan-lines absolute inset-0 pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Brand */}
                    <div>
                        <h3 className="text-xl font-bold tracking-tighter text-white mb-4">
                            <span className="neon-text">GREP</span>FLOW
                        </h3>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                            Next-generation AI &amp; Cloud technology company building the future of intelligent systems.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-sm uppercase tracking-widest text-gray-400 mb-4"
                            style={{ textShadow: '0 0 10px rgba(0,212,255,0.3)' }}
                        >Navigation</h4>
                        <ul className="space-y-3">
                            {footerLinks.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-gray-500 hover:text-cyan-400 transition-colors text-sm">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-sm uppercase tracking-widest text-gray-400 mb-4"
                            style={{ textShadow: '0 0 10px rgba(0,212,255,0.3)' }}
                        >Connect</h4>
                        <ul className="space-y-3 text-sm text-gray-500">
                            <li>hello@grepflow.io</li>
                            <li>San Francisco, CA</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-gray-600">&copy; {new Date().getFullYear()} GrepFlow. All rights reserved.</p>
                    <p className="text-xs text-gray-700" style={{ textShadow: '0 0 8px rgba(0,212,255,0.2)' }}>
                        Built with AI. Powered by Cloud.
                    </p>
                </div>
            </div>
        </footer>
    )
}
