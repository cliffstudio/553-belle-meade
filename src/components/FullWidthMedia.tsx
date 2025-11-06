/* eslint-disable @next/next/no-img-element */
"use client"

import { videoUrlFor } from '@/sanity/utils/videoUrlBuilder'
import { urlFor } from '../sanity/utils/imageUrlBuilder'
import { SanityImage, SanityVideo } from '../types/sanity'
import { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

type FullWidthMediaProps = {
  mediaType?: 'image' | 'video'
  image?: SanityImage
  video?: SanityVideo
  showControls?: boolean
}

export default function FullWidthMedia({ mediaType, image, video, showControls = false }: FullWidthMediaProps) {
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const fullscreenVideoRef = useRef<HTMLVideoElement>(null)

  const togglePlayPause = () => {
    const video = videoRef.current
    
    if (isPlaying) {
      // Pause video
      if (video) video.pause()
      setIsPlaying(false)
    } else {
      // Play video
      if (video) video.play()
      setIsPlaying(true)
    }
  }

  const toggleMute = () => {
    const video = videoRef.current
    
    if (isMuted) {
      // Unmute video
      if (video) video.muted = false
      setIsMuted(false)
    } else {
      // Mute video
      if (video) video.muted = true
      setIsMuted(true)
    }
  }

  const toggleFullscreen = async () => {
    console.log('FullWidthMedia: toggleFullscreen called!')
    const video = videoRef.current
    
    if (!video) return

    try {
      if (!isFullscreen) {
        // Save current scroll position and video state before entering fullscreen
        const scrollY = window.scrollY
        const videoWrap = video.closest('.fill-space-video-wrap') as HTMLElement
        
        // Temporarily disable ScrollTrigger instances that might affect the video
        let affectedTriggers: any[] = []
        if (typeof window !== 'undefined' && ScrollTrigger) {
          const allTriggers = ScrollTrigger.getAll()
          affectedTriggers = allTriggers.filter(trigger => {
            const triggerElement = trigger.vars?.trigger as Element
            if (!triggerElement) return false
            
            // Check if trigger affects the video or its wrapper
            const isVideoRelated = 
              videoWrap?.contains(triggerElement) || 
              triggerElement.contains(video) ||
              triggerElement.contains(videoWrap) ||
              (videoWrap && triggerElement === videoWrap) ||
              triggerElement === video
            
            // Also check if trigger is pinning a parent element that contains the video
            const isPinningParent = trigger.vars?.pin && (
              triggerElement.contains(video) ||
              triggerElement.contains(videoWrap)
            )
            
            return isVideoRelated || isPinningParent
          })
          // Disable these specific triggers
          affectedTriggers.forEach(trigger => trigger.disable())
          // Prevent ScrollTrigger from refreshing
          ScrollTrigger.config({ autoRefreshEvents: 'none' })
        }
        
        // Create a clone of the video element for fullscreen
        const fullscreenVideoClone = video.cloneNode(true) as HTMLVideoElement
        
        // Copy all important properties
        fullscreenVideoClone.src = video.src
        fullscreenVideoClone.currentTime = video.currentTime
        fullscreenVideoClone.muted = false
        fullscreenVideoClone.autoplay = true
        fullscreenVideoClone.loop = video.loop
        fullscreenVideoClone.playsInline = false
        fullscreenVideoClone.controls = true
        fullscreenVideoClone.setAttribute('controls', '')
        
        // Set styles for fullscreen
        fullscreenVideoClone.style.position = 'fixed'
        fullscreenVideoClone.style.top = '0'
        fullscreenVideoClone.style.left = '0'
        fullscreenVideoClone.style.width = '100%'
        fullscreenVideoClone.style.height = '100%'
        fullscreenVideoClone.style.zIndex = '999999'
        fullscreenVideoClone.style.transform = 'none'
        fullscreenVideoClone.style.visibility = 'visible'
        fullscreenVideoClone.style.opacity = '1'
        fullscreenVideoClone.style.pointerEvents = 'auto'
        fullscreenVideoClone.className = ''
        
        // Add clone to body
        document.body.appendChild(fullscreenVideoClone)
        
        // Wait for clone to be ready
        await new Promise<void>((resolve) => {
          if (fullscreenVideoClone.readyState >= 2) {
            resolve()
          } else {
            fullscreenVideoClone.addEventListener('loadedmetadata', () => resolve(), { once: true })
            fullscreenVideoClone.load()
          }
        })
        
        // Wait a moment for DOM to update
        await new Promise(resolve => setTimeout(resolve, 50))
        
        // Enter fullscreen with the clone
        if (fullscreenVideoClone.requestFullscreen) {
          await fullscreenVideoClone.requestFullscreen()
        } else if ('webkitRequestFullscreen' in fullscreenVideoClone) {
          await (fullscreenVideoClone as HTMLVideoElement & { webkitRequestFullscreen: () => Promise<void> }).webkitRequestFullscreen()
        } else if ('msRequestFullscreen' in fullscreenVideoClone) {
          await (fullscreenVideoClone as HTMLVideoElement & { msRequestFullscreen: () => Promise<void> }).msRequestFullscreen()
        }
        
        // Ensure controls are visible after entering fullscreen
        const ensureControls = () => {
          const isFullscreen = document.fullscreenElement === fullscreenVideoClone || 
              (document as any).webkitFullscreenElement === fullscreenVideoClone ||
              (document as any).msFullscreenElement === fullscreenVideoClone
          
          if (isFullscreen) {
            fullscreenVideoClone.removeAttribute('controls')
            fullscreenVideoClone.controls = false
            void fullscreenVideoClone.offsetWidth
            fullscreenVideoClone.controls = true
            fullscreenVideoClone.setAttribute('controls', '')
            fullscreenVideoClone.style.visibility = 'visible'
            fullscreenVideoClone.style.opacity = '1'
            fullscreenVideoClone.style.pointerEvents = 'auto'
          }
        }
        
        const handleFullscreenEnter = () => {
          if (document.fullscreenElement === fullscreenVideoClone || 
              (document as any).webkitFullscreenElement === fullscreenVideoClone ||
              (document as any).msFullscreenElement === fullscreenVideoClone) {
            ensureControls()
            setTimeout(ensureControls, 10)
            setTimeout(ensureControls, 50)
            setTimeout(ensureControls, 100)
            setTimeout(ensureControls, 200)
            setTimeout(ensureControls, 300)
            setTimeout(ensureControls, 500)
          }
        }
        
        document.addEventListener('fullscreenchange', handleFullscreenEnter)
        document.addEventListener('webkitfullscreenchange', handleFullscreenEnter)
        document.addEventListener('msfullscreenchange', handleFullscreenEnter)
        ;(fullscreenVideoClone as any)._fullscreenHandler = handleFullscreenEnter
        
        ensureControls()
        setTimeout(ensureControls, 10)
        setTimeout(ensureControls, 50)
        setTimeout(ensureControls, 100)
        setTimeout(ensureControls, 200)
        
        // Store reference to clone for cleanup
        fullscreenVideoRef.current = fullscreenVideoClone
        ;(video as any)._affectedTriggers = affectedTriggers
        ;(video as any)._scrollY = scrollY
        
        setIsFullscreen(true)
        setIsMuted(false)
      } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
          await document.exitFullscreen()
        } else if ('webkitExitFullscreen' in document) {
          await (document as Document & { webkitExitFullscreen: () => Promise<void> }).webkitExitFullscreen()
        } else if ('msExitFullscreen' in document) {
          await (document as Document & { msExitFullscreen: () => Promise<void> }).msExitFullscreen()
        }
        
        // Clean up the fullscreen video clone
        const fullscreenVideo = fullscreenVideoRef.current
        if (fullscreenVideo) {
          // Remove fullscreen change listener
          const fullscreenHandler = (fullscreenVideo as any)._fullscreenHandler
          if (fullscreenHandler) {
            document.removeEventListener('fullscreenchange', fullscreenHandler)
            document.removeEventListener('webkitfullscreenchange', fullscreenHandler)
            document.removeEventListener('msfullscreenchange', fullscreenHandler)
          }
          
          // Remove clone from body
          if (fullscreenVideo.parentElement === document.body) {
            document.body.removeChild(fullscreenVideo)
          }
          fullscreenVideoRef.current = null
        }
        
        // Restore ScrollTrigger instances and refresh
        const originalVideo = videoRef.current
        const affectedTriggers = (originalVideo as any)?._affectedTriggers || []
        const savedScrollY = (originalVideo as any)?._scrollY
        
        if (typeof window !== 'undefined' && ScrollTrigger) {
          // Re-enable the affected triggers
          affectedTriggers.forEach(trigger => trigger.enable())
          // Restore ScrollTrigger refresh events
          ScrollTrigger.config({ autoRefreshEvents: 'resize,visibilitychange,DOMContentLoaded,load' })
          
          // Restore scroll position first, then refresh ScrollTrigger
          if (savedScrollY !== undefined) {
            window.scrollTo(0, savedScrollY)
          }
          
          // Small delay before refresh to ensure fullscreen cleanup is complete
          setTimeout(() => {
            ScrollTrigger.refresh()
            
            // Ensure original video is visible and playing after ScrollTrigger refresh
            if (videoRef.current) {
              videoRef.current.style.transform = ''
              videoRef.current.style.visibility = 'visible'
              videoRef.current.style.opacity = '1'
              
              // Also fix the video wrapper if it exists
              const videoWrap = videoRef.current.closest('.fill-space-video-wrap') as HTMLElement
              if (videoWrap) {
                videoWrap.style.transform = ''
                videoWrap.style.visibility = 'visible'
                videoWrap.style.opacity = '1'
              }
              
              // Fix opacity-overlay if it exists (might be set to 2 by ScrollTrigger)
              const opacityOverlay = videoRef.current.closest('.hero-media-block, .full-bleed-media-block')?.querySelector('.opacity-overlay') as HTMLElement
              if (opacityOverlay) {
                // Get the original overlayDarkness value
                const overlayDarkness = parseFloat(opacityOverlay.getAttribute('data-overlay-darkness') || '0.3')
                const targetOpacity = Math.min(overlayDarkness, 1)
                
                // Kill any GSAP animations on the overlay
                gsap.killTweensOf(opacityOverlay)
                
                // Reset opacity multiple times to catch ScrollTrigger's callback
                const resetOpacity = () => {
                  gsap.killTweensOf(opacityOverlay)
                  opacityOverlay.style.opacity = String(targetOpacity)
                }
                
                // Reset immediately
                resetOpacity()
                
                // Reset after delays to catch ScrollTrigger callbacks
                setTimeout(resetOpacity, 100)
                setTimeout(resetOpacity, 200)
                setTimeout(resetOpacity, 300)
              }
              
              if (videoRef.current.paused) {
                videoRef.current.play().catch(() => {})
              }
            }
          }, 100)
        } else {
          // If ScrollTrigger not available, still restore video
          if (videoRef.current) {
            videoRef.current.style.transform = ''
            videoRef.current.style.visibility = 'visible'
            videoRef.current.style.opacity = '1'
            const videoWrap = videoRef.current.closest('.fill-space-video-wrap') as HTMLElement
            if (videoWrap) {
              videoWrap.style.transform = ''
              videoWrap.style.visibility = 'visible'
              videoWrap.style.opacity = '1'
            }
            
            // Fix opacity-overlay if it exists (might be set to 2 by ScrollTrigger)
            const opacityOverlay = videoRef.current.closest('.hero-media-block, .full-bleed-media-block')?.querySelector('.opacity-overlay') as HTMLElement
            if (opacityOverlay) {
              const computedOpacity = parseFloat(window.getComputedStyle(opacityOverlay).opacity)
              // If opacity is greater than 1, reset it to a reasonable value
              if (computedOpacity > 1) {
                opacityOverlay.style.opacity = ''
                // Let the component's overlayDarkness prop handle it, or default to 0.3
                const overlayDarkness = parseFloat(opacityOverlay.getAttribute('data-overlay-darkness') || '0.3')
                opacityOverlay.style.opacity = String(Math.min(overlayDarkness, 1))
              }
            }
            
            if (videoRef.current.paused) {
              videoRef.current.play().catch(() => {})
            }
          }
        }
        
        setIsFullscreen(false)
        setIsMuted(true)
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error)
      // Restore ScrollTrigger on error
      const fullscreenVideo = fullscreenVideoRef.current
      const affectedTriggers = (fullscreenVideo as any)?._affectedTriggers || []
      const savedScrollY = (fullscreenVideo as any)?._scrollY
      
      if (typeof window !== 'undefined' && ScrollTrigger) {
        // Re-enable the affected triggers
        affectedTriggers.forEach(trigger => trigger.enable())
        // Restore ScrollTrigger refresh events
        ScrollTrigger.config({ autoRefreshEvents: 'resize,visibilitychange,DOMContentLoaded,load' })
        
        // Restore scroll position if saved
        if (savedScrollY !== undefined) {
          window.scrollTo(0, savedScrollY)
        }
      }
      
      // Clean up fullscreen video element if it exists
      if (fullscreenVideo) {
        try {
          document.body.removeChild(fullscreenVideo)
        } catch (e) {
          // Element might already be removed
        }
        fullscreenVideoRef.current = null
      }
      
      setIsFullscreen(false)
      setIsMuted(true)
    }
  }

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        ('webkitFullscreenElement' in document ? (document as Document & { webkitFullscreenElement: Element | null }).webkitFullscreenElement : null) ||
        ('msFullscreenElement' in document ? (document as Document & { msFullscreenElement: Element | null }).msFullscreenElement : null)
      )
      
      if (!isCurrentlyFullscreen && isFullscreen) {
        // User exited fullscreen via browser controls
        const fullscreenVideo = fullscreenVideoRef.current
        
        if (fullscreenVideo) {
          // Remove fullscreen change listener
          const fullscreenHandler = (fullscreenVideo as any)._fullscreenHandler
          if (fullscreenHandler) {
            document.removeEventListener('fullscreenchange', fullscreenHandler)
            document.removeEventListener('webkitfullscreenchange', fullscreenHandler)
            document.removeEventListener('msfullscreenchange', fullscreenHandler)
          }
          
          // Remove clone from body
          if (fullscreenVideo.parentElement === document.body) {
            document.body.removeChild(fullscreenVideo)
          }
          fullscreenVideoRef.current = null
        }
        
        // Restore ScrollTrigger instances and refresh
        const originalVideo = videoRef.current
        const affectedTriggers = (originalVideo as any)?._affectedTriggers || []
        const savedScrollY = (originalVideo as any)?._scrollY
        
        if (typeof window !== 'undefined' && ScrollTrigger) {
          // Re-enable the affected triggers
          affectedTriggers.forEach(trigger => trigger.enable())
          // Restore ScrollTrigger refresh events
          ScrollTrigger.config({ autoRefreshEvents: 'resize,visibilitychange,DOMContentLoaded,load' })
          
          // Restore scroll position first, then refresh ScrollTrigger
          if (savedScrollY !== undefined) {
            window.scrollTo(0, savedScrollY)
          }
          
          // Small delay before refresh to ensure fullscreen cleanup is complete
          setTimeout(() => {
            ScrollTrigger.refresh()
            
            // Ensure original video is visible and playing after ScrollTrigger refresh
            if (videoRef.current) {
              videoRef.current.style.transform = ''
              videoRef.current.style.visibility = 'visible'
              videoRef.current.style.opacity = '1'
              
              // Also fix the video wrapper if it exists
              const videoWrap = videoRef.current.closest('.fill-space-video-wrap') as HTMLElement
              if (videoWrap) {
                videoWrap.style.transform = ''
                videoWrap.style.visibility = 'visible'
                videoWrap.style.opacity = '1'
              }
              
              // Fix opacity-overlay if it exists (might be set to 2 by ScrollTrigger)
              const opacityOverlay = videoRef.current.closest('.hero-media-block, .full-bleed-media-block')?.querySelector('.opacity-overlay') as HTMLElement
              if (opacityOverlay) {
                // Get the original overlayDarkness value
                const overlayDarkness = parseFloat(opacityOverlay.getAttribute('data-overlay-darkness') || '0.3')
                const targetOpacity = Math.min(overlayDarkness, 1)
                
                // Kill any GSAP animations on the overlay
                gsap.killTweensOf(opacityOverlay)
                
                // Reset opacity multiple times to catch ScrollTrigger's callback
                const resetOpacity = () => {
                  gsap.killTweensOf(opacityOverlay)
                  opacityOverlay.style.opacity = String(targetOpacity)
                }
                
                // Reset immediately
                resetOpacity()
                
                // Reset after delays to catch ScrollTrigger callbacks
                setTimeout(resetOpacity, 100)
                setTimeout(resetOpacity, 200)
                setTimeout(resetOpacity, 300)
              }
              
              if (videoRef.current.paused) {
                videoRef.current.play().catch(() => {})
              }
            }
          }, 100)
        } else {
          // If ScrollTrigger not available, still restore video
          if (videoRef.current) {
            videoRef.current.style.transform = ''
            videoRef.current.style.visibility = 'visible'
            videoRef.current.style.opacity = '1'
            const videoWrap = videoRef.current.closest('.fill-space-video-wrap') as HTMLElement
            if (videoWrap) {
              videoWrap.style.transform = ''
              videoWrap.style.visibility = 'visible'
              videoWrap.style.opacity = '1'
            }
            
            // Fix opacity-overlay if it exists (might be set to 2 by ScrollTrigger)
            const opacityOverlay = videoRef.current.closest('.hero-media-block, .full-bleed-media-block')?.querySelector('.opacity-overlay') as HTMLElement
            if (opacityOverlay) {
              const computedOpacity = parseFloat(window.getComputedStyle(opacityOverlay).opacity)
              // If opacity is greater than 1, reset it to a reasonable value
              if (computedOpacity > 1) {
                opacityOverlay.style.opacity = ''
                // Let the component's overlayDarkness prop handle it, or default to 0.3
                const overlayDarkness = parseFloat(opacityOverlay.getAttribute('data-overlay-darkness') || '0.3')
                opacityOverlay.style.opacity = String(Math.min(overlayDarkness, 1))
              }
            }
            
            if (videoRef.current.paused) {
              videoRef.current.play().catch(() => {})
            }
          }
        }
        
        setIsFullscreen(false)
        setIsMuted(true)
      }
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.addEventListener('msfullscreenchange', handleFullscreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
      document.removeEventListener('msfullscreenchange', handleFullscreenChange)
    }
  }, [isFullscreen])

  if (!mediaType) {
    return null
  }

  if (mediaType === 'image' && !image) {
    return null
  }

  if (mediaType === 'video' && !video) {
    return null
  }

  return (
    <section className="full-bleed-media-block relative">
      {mediaType === 'video' && video && (
        <div className="fill-space-video-wrap">
          <video
            ref={videoRef}
            src={videoUrlFor(video)}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
        </div>
      )}

      {mediaType === 'image' && image && (
        <div className="fill-space-image-wrap">
          <img 
            data-src={urlFor(image).url()} 
            alt="" 
            className="lazy full-bleed-image"
            style={{
              objectPosition: image?.hotspot
                ? `${image.hotspot.x * 100}% ${image.hotspot.y * 100}%`
                : "center",
            }}
          />
          <div className="loading-overlay" />
        </div>
      )}

      {showControls && mediaType === 'video' && (
        <div className="video-controls visible fade-in z-10" style={{ pointerEvents: 'auto' }}>
          <div className="play-pause-button" onClick={togglePlayPause}>
            <svg className={`pause ${isPlaying ? 'active' : ''} button`} xmlns="http://www.w3.org/2000/svg" width="11" height="20" viewBox="0 0 11 20">
              <line x1="0.5" x2="0.5" y2="20"/>
              <line x1="10.5" x2="10.5" y2="20"/>
            </svg>

            <svg className={`play ${!isPlaying ? 'active' : ''} button`} xmlns="http://www.w3.org/2000/svg" width="11" height="20" viewBox="0 0 11 20">
              <path d="M0.5 1L10.5 10L0.5 19"/>
            </svg>
          </div>
          
          <div className="full-screen-button" onClick={(e) => {
            console.log('FullWidthMedia: Button clicked!', e)
            e.preventDefault()
            e.stopPropagation()
            toggleFullscreen()
          }} style={{ cursor: 'pointer', pointerEvents: 'auto' }}>
            <svg className="button active" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" style={{ pointerEvents: 'auto' }}>
              <path d="M1 9V1H9"/>
              <path d="M1 13V21H9"/>
              <path d="M21 9V1H13"/>
              <path d="M21 13V21H13"/>
            </svg>
          </div>

          <div className="volume-button" onClick={toggleMute}>
            <svg className={`mute button ${!isMuted ? 'active' : ''}`} xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 23 23">
              <path d="M2.02539 14.876L2.03068 8.44525H5.75376L12.5177 2.69141V20.4607L5.74846 14.876H2.02539Z"/>
              <line x1="0.353553" y1="0.646447" x2="22.3536" y2="22.6464"/>
              <path d="M15.0615 7.66797C16.204 8.69055 16.9231 10.1766 16.9231 11.8306C16.9231 13.4308 16.25 14.8739 15.1715 15.8921"/>
              <path d="M17.9004 18.5992C19.7904 16.9548 20.9852 14.5319 20.9852 11.8299C20.9852 9.06625 19.7352 6.59452 17.7698 4.94922"/>
            </svg>

            <svg className={`volume button ${isMuted ? 'active' : ''}`} xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 23 23">
              <path d="M2.02539 14.876L2.03068 8.44525H5.75376L12.5177 2.69141V20.4607L5.74846 14.876H2.02539Z"/>
              <path d="M15.0615 7.66797C16.204 8.69055 16.9231 10.1766 16.9231 11.8306C16.9231 13.4308 16.25 14.8739 15.1715 15.8921"/>
              <path d="M17.9004 18.5992C19.7904 16.9548 20.9852 14.5319 20.9852 11.8299C20.9852 9.06625 19.7352 6.59452 17.7698 4.94922"/>
            </svg>
          </div>
        </div>
      )}
    </section>
  )
}
