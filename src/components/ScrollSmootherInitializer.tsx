"use client"

import { useEffect } from 'react'

// Load GSAP and the ScrollSmoother plugin on the client only
let gsap: typeof import('gsap').gsap | null = null

type ScrollSmootherInstance = {
  kill: () => void
}

type ScrollSmootherPlugin = {
  create: (opts: { wrapper: string; content: string; smooth?: number; effects?: boolean }) => ScrollSmootherInstance
  get?: () => ScrollSmootherInstance | undefined
}

let ScrollSmoother: ScrollSmootherPlugin | null = null

type NormalizeScrollInstance = { kill: () => void }

type ScrollTriggerPlugin = {
  normalizeScroll: (opts: {
    target?: Element | Window | string
    allowNestedScroll?: boolean
    type?: string
  }) => NormalizeScrollInstance
}

let ScrollTrigger: ScrollTriggerPlugin | null = null

export default function ScrollSmootherInitializer() {
  useEffect(() => {
    let smoother: ScrollSmootherInstance | null = null
    let normalize: NormalizeScrollInstance | null = null

    const init = async () => {
      if (typeof window === 'undefined') return

      // Dynamically import to avoid SSR issues
      if (!gsap) {
        const gsapModule = await import('gsap')
        const moduleNs = gsapModule as unknown as typeof import('gsap') & {
          default?: typeof import('gsap').gsap
        }
        const core = (moduleNs.gsap || moduleNs.default) as typeof import('gsap').gsap
        gsap = core
      }

      if (!ScrollSmoother) {
        // Avoid static import strings so build doesn't require the plugin
        const tryLoadSmoother = async (): Promise<ScrollSmootherPlugin | null> => {
          try {
            const path = ['gsap', 'ScrollSmoother'].join('/')
            const mod = await import(path)
            return (mod.default || mod) as ScrollSmootherPlugin
          } catch {
            try {
              const pathAlt = ['gsap', 'dist', 'ScrollSmoother'].join('/')
              const modAlt = await import(pathAlt)
              return (modAlt.default || modAlt) as ScrollSmootherPlugin
            } catch {
              return null
            }
          }
        }

        ScrollSmoother = await tryLoadSmoother()
        if (!ScrollSmoother) return
      }

      if (!ScrollTrigger) {
        const tryLoadScrollTrigger = async (): Promise<ScrollTriggerPlugin | null> => {
          try {
            const path = ['gsap', 'ScrollTrigger'].join('/')
            const mod = await import(path)
            return (mod.default || mod) as ScrollTriggerPlugin
          } catch {
            try {
              const pathAlt = ['gsap', 'dist', 'ScrollTrigger'].join('/')
              const modAlt = await import(pathAlt)
              return (modAlt.default || modAlt) as ScrollTriggerPlugin
            } catch {
              return null
            }
          }
        }

        ScrollTrigger = await tryLoadScrollTrigger()
      }

      // Register once
      if (gsap && ScrollSmoother) {
        if (ScrollTrigger) {
          gsap.registerPlugin(ScrollSmoother as unknown as object, ScrollTrigger as unknown as object)
        } else {
          gsap.registerPlugin(ScrollSmoother as unknown as object)
        }

        // Avoid creating multiple instances
        const existing = typeof ScrollSmoother.get === 'function' ? ScrollSmoother.get() : undefined
        if (existing) return

        smoother = ScrollSmoother.create({
          wrapper: '#smooth-wrapper',
          content: '#smooth-content',
          smooth: 1,
          effects: true
        })

        if (ScrollTrigger && typeof ScrollTrigger.normalizeScroll === 'function') {
          const scroller = (document.querySelector('#smooth-content') as Element | null) || window
          // Normalize wheel/touch/pointer deltas across devices and allow nested scrollables
          normalize = ScrollTrigger.normalizeScroll({
            target: scroller,
            allowNestedScroll: true,
            type: 'touch,scroll,pointer'
          })
        }
      }
    }

    init()

    return () => {
      try {
        if (ScrollSmoother) {
          const existing = typeof ScrollSmoother.get === 'function' ? ScrollSmoother.get() : undefined
          if (existing) existing.kill()
        }
        if (normalize && typeof normalize.kill === 'function') normalize.kill()
        if (smoother && typeof smoother.kill === 'function') smoother.kill()
      } catch {
        // no-op
      }
    }
  }, [])

  return null
}


