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
      
      // Global function to fix video positions that might be affected by ScrollTrigger
      const fixAllVideoPositions = () => {
        const videoWraps = document.querySelectorAll('.fill-space-video-wrap')
        videoWraps.forEach((wrap: Element) => {
          const element = wrap as HTMLElement
          const computedStyle = window.getComputedStyle(element)
          const transform = computedStyle.transform
          
          // Reset transforms that might be causing issues
          if (transform && transform !== 'none' && transform.includes('matrix')) {
            const matrixMatch = transform.match(/matrix\([^,]+,\s*[^,]+,\s*[^,]+,\s*[^,]+,\s*([^,]+),\s*([^)]+)\)/)
            if (matrixMatch) {
              const translateY = parseFloat(matrixMatch[2])
              // If translateY is greater than 1000px, it's likely an unwanted GSAP transform
              if (Math.abs(translateY) > 1000) {
                element.style.transform = 'none'
              }
            }
          }
          
          // Ensure visibility is not hidden
          if (computedStyle.visibility === 'hidden' || computedStyle.opacity === '0') {
            element.style.visibility = 'visible'
            element.style.opacity = '1'
          }
        })
      }
      
      // Fix video positions on resize with debounce
      let resizeTimeout: NodeJS.Timeout | null = null
      const handleResize = () => {
        if (resizeTimeout) {
          clearTimeout(resizeTimeout)
        }
        resizeTimeout = setTimeout(() => {
          // Refresh ScrollTrigger first, then fix video positions
          ScrollTrigger.refresh()
          setTimeout(fixAllVideoPositions, 100)
        }, 150)
      }
      window.addEventListener('resize', handleResize)
      
      // Initial fix
      setTimeout(fixAllVideoPositions, 200)
      
      // Cleanup
      return () => {
        if (resizeTimeout) {
          clearTimeout(resizeTimeout)
        }
        window.removeEventListener('resize', handleResize)
      }
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
