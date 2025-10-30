"use client"

import { useEffect } from 'react'

// Load GSAP and the ScrollSmoother plugin on the client only
let gsap: typeof import('gsap') | null = null
let ScrollSmoother: any = null

export default function ScrollSmootherInitializer() {
  useEffect(() => {
    let smoother: any

    const init = async () => {
      if (typeof window === 'undefined') return

      // Dynamically import to avoid SSR issues
      if (!gsap) {
        const gsapModule = await import('gsap')
        gsap = gsapModule.gsap || (gsapModule as unknown as typeof import('gsap'))
      }

      if (!ScrollSmoother) {
        // Try official gsap paths only
        let smootherModule: any
        try {
          smootherModule = await import('gsap/ScrollSmoother')
        } catch {
          try {
            smootherModule = await import('gsap/dist/ScrollSmoother')
          } catch {
            // If imports fail, abort silently
            return
          }
        }
        ScrollSmoother = smootherModule.default || (smootherModule as any)
      }

      // Register once
      if (gsap && ScrollSmoother) {
        // @ts-expect-error - registerPlugin exists at runtime
        gsap.registerPlugin(ScrollSmoother)

        // Avoid creating multiple instances
        // @ts-expect-error - get() exists at runtime
        const existing = ScrollSmoother.get && ScrollSmoother.get()
        if (existing) return

        smoother = ScrollSmoother.create({
          wrapper: '#smooth-wrapper',
          content: '#smooth-content',
          smooth: 1,
          effects: true
        })
      }
    }

    init()

    return () => {
      try {
        if (ScrollSmoother) {
          // @ts-expect-error - get() exists at runtime
          const existing = ScrollSmoother.get && ScrollSmoother.get()
          if (existing) existing.kill()
        }
        if (smoother && typeof smoother.kill === 'function') smoother.kill()
      } catch {
        // no-op
      }
    }
  }, [])

  return null
}


