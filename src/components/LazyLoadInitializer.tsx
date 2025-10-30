'use client'

import { useEffect } from 'react'
import { gsap } from 'gsap'
import { usePathname } from 'next/navigation'
import mediaLazyloading from '../utils/lazyLoad'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function LazyLoadInitializer() {
  const pathname = usePathname()

  useEffect(() => {
    // Initialize lazy loading on mount
    mediaLazyloading()
    
    // Configure ScrollTrigger globally
    if (typeof window !== 'undefined' && ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger)
      ScrollTrigger.config({ ignoreMobileResize: true })
      // Normalize wheel/touch input across devices (helps mobile smoothness)
      ScrollTrigger.normalizeScroll(true)
    }
  }, [])

  useEffect(() => {
    // Re-initialize lazy loading when route changes
    // Small delay to ensure DOM is updated
    const timer = setTimeout(() => {
      mediaLazyloading()
      
      // Refresh ScrollTrigger after route change to recalculate positions
      // This ensures scroll effects work correctly when navigating from other pages
      if (typeof window !== 'undefined' && ScrollTrigger) {
        // Ensure plugin stays registered and normalization remains active after route changes
        gsap.registerPlugin(ScrollTrigger)
        ScrollTrigger.normalizeScroll(true)
        ScrollTrigger.refresh()
      }
    }, 100)
    
    return () => clearTimeout(timer)
  }, [pathname])

  return null
}
