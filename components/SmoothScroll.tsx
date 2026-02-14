'use client'
import { ReactNode } from 'react'
import { ScrollProvider } from './ScrollContext'
import dynamic from 'next/dynamic'

const SpaceBackground = dynamic(() => import('./SpaceBackground'), { ssr: false })
const MouseTrail = dynamic(() => import('./MouseTrail'), { ssr: false })

export default function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ScrollProvider>
      <SpaceBackground />
      <MouseTrail />
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </ScrollProvider>
  )
}
