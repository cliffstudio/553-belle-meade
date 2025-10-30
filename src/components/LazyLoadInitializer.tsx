'use client'

import { useEffect } from 'react'
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
      ScrollTrigger.config({ ignoreMobileResize: true })
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
        ScrollTrigger.refresh()
      }
    }, 100)
    
    return () => clearTimeout(timer)
  }, [pathname])

  return null
}
