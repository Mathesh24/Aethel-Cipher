'use client'
import { useEffect, useRef } from 'react'

export default function MouseTrail() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let width = window.innerWidth
        let height = window.innerHeight
        canvas.width = width
        canvas.height = height

        interface Particle {
            x: number
            y: number
            vx: number
            vy: number
            life: number
            maxLife: number
            size: number
            hue: number
        }

        const particles: Particle[] = []
        let mouseX = 0
        let mouseY = 0
        let prevMouseX = 0
        let prevMouseY = 0
        let animId: number

        const handleResize = () => {
            width = window.innerWidth
            height = window.innerHeight
            canvas.width = width
            canvas.height = height
        }

        const handleMouseMove = (e: MouseEvent) => {
            prevMouseX = mouseX
            prevMouseY = mouseY
            mouseX = e.clientX
            mouseY = e.clientY

            const dx = mouseX - prevMouseX
            const dy = mouseY - prevMouseY
            const speed = Math.sqrt(dx * dx + dy * dy)

            const count = Math.min(Math.floor(speed * 0.3), 5)
            for (let i = 0; i < count; i++) {
                particles.push({
                    x: mouseX + (Math.random() - 0.5) * 8,
                    y: mouseY + (Math.random() - 0.5) * 8,
                    vx: (Math.random() - 0.5) * 1.5,
                    vy: (Math.random() - 0.5) * 1.5,
                    life: 1,
                    maxLife: 0.6 + Math.random() * 0.6,
                    size: 1.5 + Math.random() * 2.5,
                    hue: 180 + Math.random() * 90, // cyan to purple
                })
            }
        }

        const animate = () => {
            ctx.clearRect(0, 0, width, height)

            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i]
                p.life -= 0.016 / p.maxLife
                p.x += p.vx
                p.y += p.vy
                p.vx *= 0.98
                p.vy *= 0.98

                if (p.life <= 0) {
                    particles.splice(i, 1)
                    continue
                }

                const alpha = p.life * 0.6
                const size = p.size * p.life
                ctx.beginPath()
                ctx.arc(p.x, p.y, size, 0, Math.PI * 2)

                const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size)
                gradient.addColorStop(0, `hsla(${p.hue}, 100%, 70%, ${alpha})`)
                gradient.addColorStop(1, `hsla(${p.hue}, 100%, 50%, 0)`)

                ctx.fillStyle = gradient
                ctx.fill()
            }

            // Cursor glow
            const glowGradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 30)
            glowGradient.addColorStop(0, 'rgba(0, 212, 255, 0.08)')
            glowGradient.addColorStop(1, 'rgba(0, 212, 255, 0)')
            ctx.beginPath()
            ctx.arc(mouseX, mouseY, 30, 0, Math.PI * 2)
            ctx.fillStyle = glowGradient
            ctx.fill()

            animId = requestAnimationFrame(animate)
        }

        window.addEventListener('resize', handleResize)
        window.addEventListener('mousemove', handleMouseMove)
        animId = requestAnimationFrame(animate)

        return () => {
            window.removeEventListener('resize', handleResize)
            window.removeEventListener('mousemove', handleMouseMove)
            cancelAnimationFrame(animId)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                inset: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 9999,
            }}
        />
    )
}
