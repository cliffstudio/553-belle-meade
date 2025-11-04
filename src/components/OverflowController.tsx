"use client"

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function OverflowController() {
  const pathname = usePathname()

  useEffect(() => {
    // Set overflow control based on current route
    const isHomepage = pathname === '/' || pathname === ''
    
    if (isHomepage) {
      // Keep overflow hidden on homepage initially
      // The Header component will enable scrolling after the logo transition (4.5s)
      document.documentElement.classList.remove('scroll-enabled')
      
      // Clean up any existing preventers from the inline script
      const cleanupInlinePreventers = () => {
        if (window.__homepageScrollPreventers) {
          const preventers = window.__homepageScrollPreventers
          const options = { capture: true }
          document.removeEventListener('wheel', preventers.wheel, options)
          document.removeEventListener('touchmove', preventers.touchmove, options)
          document.removeEventListener('touchstart', preventers.touchstart, options)
          document.removeEventListener('keydown', preventers.keydown, options)
          delete window.__homepageScrollPreventers
        }
      }
      
      // Also prevent any scroll attempts during the transition period
      // Use capture phase to catch events early
      const preventWheelScroll = (e: WheelEvent) => {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
      
      const preventTouchScroll = (e: TouchEvent) => {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
      
      const preventTouchStart = () => {
        // Store initial touch position but don't prevent (allows taps)
        // Actual scrolling will be prevented by touchmove handler
      }
      
      const preventKeyboardScroll = (e: KeyboardEvent) => {
        // Prevent arrow keys, space, page up/down, home, end
        const scrollKeys = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ']
        if (scrollKeys.includes(e.key)) {
          e.preventDefault()
          e.stopPropagation()
          return false
        }
      }
      
      // Prevent wheel, touchmove, and keyboard scrolling with capture phase
      const options = { passive: false, capture: true }
      document.addEventListener('wheel', preventWheelScroll, options)
      document.addEventListener('touchmove', preventTouchScroll, options)
      document.addEventListener('touchstart', preventTouchStart, options)
      document.addEventListener('keydown', preventKeyboardScroll, options)
      
      // Function to remove event listeners
      const removeListeners = () => {
        document.removeEventListener('wheel', preventWheelScroll, options)
        document.removeEventListener('touchmove', preventTouchScroll, options)
        document.removeEventListener('touchstart', preventTouchStart, options)
        document.removeEventListener('keydown', preventKeyboardScroll, options)
        cleanupInlinePreventers()
      }
      
      // Watch for when scroll-enabled class is added (Header enables scrolling at 4.5s)
      const observer = new MutationObserver(() => {
        if (document.documentElement.classList.contains('scroll-enabled')) {
          removeListeners()
          observer.disconnect()
        }
      })
      
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class']
      })
      
      // Fallback: Clean up event listeners after 5.5 seconds if observer doesn't catch it
      const cleanupTimer = setTimeout(() => {
        removeListeners()
        observer.disconnect()
      }, 5500)
      
      return () => {
        clearTimeout(cleanupTimer)
        observer.disconnect()
        removeListeners()
      }
    } else {
      // Clean up any homepage preventers when navigating away
      if (window.__homepageScrollPreventers) {
        const preventers = window.__homepageScrollPreventers
        const options = { capture: true }
        document.removeEventListener('wheel', preventers.wheel, options)
        document.removeEventListener('touchmove', preventers.touchmove, options)
        document.removeEventListener('touchstart', preventers.touchstart, options)
        document.removeEventListener('keydown', preventers.keydown, options)
        delete window.__homepageScrollPreventers
      }
      
      // Scrolling is enabled by default on non-homepage pages
      // Ensure scroll-enabled class is present (in case navigating from homepage)
      document.documentElement.classList.add('scroll-enabled')
    }
  }, [pathname])

  // This component doesn't render anything
  return null
}
