'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import mediaLazyloading from '../utils/lazyLoad'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function LazyLoadInitializer() {
  const pathname = usePathname()

  useEffect(() => {
    // Configure ScrollTrigger to reduce iOS Safari resize jank
    if (typeof window !== 'undefined' && ScrollTrigger) {
      try {
        // Ignore mobile resize caused by iOS URL bar show/hide
        // Requires GSAP 3.12+
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (ScrollTrigger as any).config && (ScrollTrigger as any).config({ ignoreMobileResize: true })
        // Normalize scroll to mitigate momentum/overscroll discrepancies
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (ScrollTrigger as any).normalizeScroll && (ScrollTrigger as any).normalizeScroll(true)
      } catch {}
    }

    // Initialize lazy loading on mount
    mediaLazyloading()
  }, [])

  useEffect(() => {
    // Re-initialize lazy loading when route changes
    // Small delay to ensure DOM is updated
    const timer = setTimeout(() => {
      mediaLazyloading()
      
      // Refresh ScrollTrigger after route change to recalculate positions
      // This ensures scroll effects work correctly when navigating from other pages
      if (typeof window !== 'undefined' && ScrollTrigger) {
        ScrollTrigger.refresh()
      }
    }, 100)
    
    return () => clearTimeout(timer)
  }, [pathname])

  useEffect(() => {
    // Refresh after orientation changes once viewport settles
    const onOrientation = () => {
      setTimeout(() => {
        try {
          ScrollTrigger && ScrollTrigger.refresh()
        } catch {}
      }, 300)
    }

    window.addEventListener('orientationchange', onOrientation)
    return () => window.removeEventListener('orientationchange', onOrientation)
  }, [])

  return null
}
