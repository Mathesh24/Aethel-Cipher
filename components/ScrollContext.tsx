'use client'
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import Lenis from 'lenis'

interface ScrollData {
    progress: number
    velocity: number
    direction: number
    scrollY: number
    limit: number
}

const ScrollContext = createContext<ScrollData>({
    progress: 0,
    velocity: 0,
    direction: 0,
    scrollY: 0,
    limit: 1,
})

export function useScrollProgress() {
    return useContext(ScrollContext)
}

export function ScrollProvider({ children }: { children: ReactNode }) {
    const [scrollData, setScrollData] = useState<ScrollData>({
        progress: 0,
        velocity: 0,
        direction: 0,
        scrollY: 0,
        limit: 1,
    })

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
        })

        lenis.on('scroll', (e: { progress: number; velocity: number; direction: number; scroll: number; limit: number }) => {
            setScrollData({
                progress: e.progress,
                velocity: e.velocity,
                direction: e.direction,
                scrollY: e.scroll,
                limit: e.limit,
            })
        })

        function raf(time: number) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }

        requestAnimationFrame(raf)

        return () => {
            lenis.destroy()
        }
    }, [])

    return (
        <ScrollContext.Provider value={scrollData}>
            {children}
        </ScrollContext.Provider>
    )
}
