/* eslint-disable @next/next/no-img-element */
"use client"

import { urlFor } from '../sanity/utils/imageUrlBuilder'
import { videoUrlFor } from '../sanity/utils/videoUrlBuilder'
import { SanityImage, SanityVideo } from '../types/sanity'
import Logo from './Logo'
import { PortableText, PortableTextBlock } from '@portabletext/react'
import StackedLogo from './StackedLogo'
import Symbol from './Symbol'
import { useState, useRef, useEffect } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Extended types for fullscreen API
interface ExtendedDocument extends Document {
  webkitFullscreenElement?: Element | null
  msFullscreenElement?: Element | null
  webkitExitFullscreen?: () => Promise<void>
  msExitFullscreen?: () => Promise<void>
}

interface ExtendedVideoElement extends HTMLVideoElement {
  _affectedTriggers?: ScrollTrigger[]
  _scrollY?: number
  _fullscreenHandler?: () => void
}

type HomeHeroMediaProps = {
  backgroundMediaType?: 'image' | 'video'
  desktopBackgroundImage?: SanityImage
  mobileBackgroundImage?: SanityImage
  desktopBackgroundVideo?: SanityVideo
  desktopBackgroundVideoPlaceholder?: SanityImage
  showControls?: boolean
  overlayDarkness?: number
  introText?: PortableTextBlock[]
}

export default function HomeHeroMedia(props: HomeHeroMediaProps) {
  const { 
    backgroundMediaType = 'image',
    desktopBackgroundImage,
    mobileBackgroundImage,
    desktopBackgroundVideo,
    desktopBackgroundVideoPlaceholder,
    showControls = false,
    overlayDarkness = 0.3,
    introText 
  } = props

  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const desktopVideoRef = useRef<HTMLVideoElement>(null)
  const mobileVideoRef = useRef<HTMLVideoElement>(null)
  const fullscreenVideoRef = useRef<HTMLVideoElement>(null)

  const togglePlayPause = () => {
    const desktopVideo = desktopVideoRef.current
    const mobileVideo = mobileVideoRef.current
    
    if (isPlaying) {
      // Pause videos
      if (desktopVideo) desktopVideo.pause()
      if (mobileVideo) mobileVideo.pause()
      setIsPlaying(false)
    } else {
      // Play videos
      if (desktopVideo) desktopVideo.play()
      if (mobileVideo) mobileVideo.play()
      setIsPlaying(true)
    }
  }

  const toggleMute = () => {
    const desktopVideo = desktopVideoRef.current
    const mobileVideo = mobileVideoRef.current
    
    if (isMuted) {
      // Unmute videos
      if (desktopVideo) desktopVideo.muted = false
      if (mobileVideo) mobileVideo.muted = false
      setIsMuted(false)
    } else {
      // Mute videos
      if (desktopVideo) desktopVideo.muted = true
      if (mobileVideo) mobileVideo.muted = true
      setIsMuted(true)
    }
  }

  const toggleFullscreen = async () => {
    console.log('HomeHeroMedia: toggleFullscreen called!')
    const desktopVideo = desktopVideoRef.current
    const mobileVideo = mobileVideoRef.current
    
    // Determine which video to use based on screen size or availability
    const sourceVideo = window.innerWidth >= 768 ? desktopVideo : mobileVideo
    
    if (!sourceVideo) return

    try {
      if (!isFullscreen) {
        // Save current scroll position
        const scrollY = window.scrollY
        const videoWrap = sourceVideo.closest('.fill-space-video-wrap') as HTMLElement
        
        // Temporarily disable ScrollTrigger instances that might affect the video
        let affectedTriggers: ScrollTrigger[] = []
        if (typeof window !== 'undefined' && ScrollTrigger) {
          const allTriggers = ScrollTrigger.getAll()
          affectedTriggers = allTriggers.filter(trigger => {
            const triggerElement = trigger.vars?.trigger as Element
            if (!triggerElement) return false
            
            const isVideoRelated = 
              videoWrap?.contains(triggerElement) || 
              triggerElement.contains(sourceVideo) ||
              triggerElement.contains(videoWrap) ||
              (videoWrap && triggerElement === videoWrap) ||
              triggerElement === sourceVideo
            
            const isPinningParent = trigger.vars?.pin && (
              triggerElement.contains(sourceVideo) ||
              triggerElement.contains(videoWrap)
            )
            
            return isVideoRelated || isPinningParent
          })
          affectedTriggers.forEach((trigger) => trigger.disable())
          ScrollTrigger.config({ autoRefreshEvents: 'none' })
        }
        
        // Create a clone of the video element for fullscreen
        const fullscreenVideoClone = sourceVideo.cloneNode(true) as HTMLVideoElement
        
        // Copy all important properties
        fullscreenVideoClone.src = sourceVideo.src
        fullscreenVideoClone.currentTime = sourceVideo.currentTime
        fullscreenVideoClone.muted = false
        fullscreenVideoClone.autoplay = true
        fullscreenVideoClone.loop = sourceVideo.loop
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
          const doc = document as ExtendedDocument
          const isFullscreen = document.fullscreenElement === fullscreenVideoClone || 
              doc.webkitFullscreenElement === fullscreenVideoClone ||
              doc.msFullscreenElement === fullscreenVideoClone
          
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
          const doc = document as ExtendedDocument
          if (document.fullscreenElement === fullscreenVideoClone || 
              doc.webkitFullscreenElement === fullscreenVideoClone ||
              doc.msFullscreenElement === fullscreenVideoClone) {
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
        ;(fullscreenVideoClone as ExtendedVideoElement)._fullscreenHandler = handleFullscreenEnter
        
        ensureControls()
        setTimeout(ensureControls, 10)
        setTimeout(ensureControls, 50)
        setTimeout(ensureControls, 100)
        setTimeout(ensureControls, 200)
        
        // Store reference to clone for cleanup
        fullscreenVideoRef.current = fullscreenVideoClone
        ;(sourceVideo as ExtendedVideoElement)._affectedTriggers = affectedTriggers
        ;(sourceVideo as ExtendedVideoElement)._scrollY = scrollY
        
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
          const fullscreenHandler = (fullscreenVideo as ExtendedVideoElement)._fullscreenHandler
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
        const originalVideo = window.innerWidth >= 768 ? desktopVideoRef.current : mobileVideoRef.current
        const affectedTriggers = (originalVideo as ExtendedVideoElement)?._affectedTriggers || []
        const savedScrollY = (originalVideo as ExtendedVideoElement)?._scrollY
        
        if (typeof window !== 'undefined' && ScrollTrigger) {
          // Restore scroll position first
          if (savedScrollY !== undefined) {
            window.scrollTo(0, savedScrollY)
          }
          
          // Small delay before re-enabling and refreshing
          setTimeout(() => {
            // Re-enable the affected triggers
            affectedTriggers.forEach((trigger) => trigger.enable())
            // Restore ScrollTrigger refresh events
            ScrollTrigger.config({ autoRefreshEvents: 'resize,visibilitychange,DOMContentLoaded,load' })
            
            // Refresh ScrollTrigger
            ScrollTrigger.refresh()
            
            // Ensure original video is visible and playing after ScrollTrigger refresh
            if (originalVideo) {
              originalVideo.style.transform = ''
              originalVideo.style.visibility = 'visible'
              originalVideo.style.opacity = '1'
              
              const videoWrap = originalVideo.closest('.fill-space-video-wrap') as HTMLElement
              if (videoWrap) {
                videoWrap.style.transform = ''
                videoWrap.style.visibility = 'visible'
                videoWrap.style.opacity = '1'
              }
              
              if (originalVideo.paused) {
                originalVideo.play().catch(() => {})
              }
            }
          }, 50)
        } else {
          // If ScrollTrigger not available, still restore video
          if (originalVideo) {
            originalVideo.style.transform = ''
            originalVideo.style.visibility = 'visible'
            originalVideo.style.opacity = '1'
            const videoWrap = originalVideo.closest('.fill-space-video-wrap') as HTMLElement
            if (videoWrap) {
              videoWrap.style.transform = ''
              videoWrap.style.visibility = 'visible'
              videoWrap.style.opacity = '1'
            }
            
            if (originalVideo.paused) {
              originalVideo.play().catch(() => {})
            }
          }
        }
        
        setIsFullscreen(false)
        setIsMuted(true)
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error)
      // Restore ScrollTrigger on error
      const originalVideo = window.innerWidth >= 768 ? desktopVideoRef.current : mobileVideoRef.current
      const affectedTriggers = (originalVideo as ExtendedVideoElement)?._affectedTriggers || []
      const savedScrollY = (originalVideo as ExtendedVideoElement)?._scrollY
      
      if (typeof window !== 'undefined' && ScrollTrigger) {
        // Restore scroll position if saved
        if (savedScrollY !== undefined) {
          window.scrollTo(0, savedScrollY)
        }
        
        // Re-enable the affected triggers
        affectedTriggers.forEach((trigger) => trigger.enable())
        // Restore ScrollTrigger refresh events
        ScrollTrigger.config({ autoRefreshEvents: 'resize,visibilitychange,DOMContentLoaded,load' })
        // Refresh ScrollTrigger
        ScrollTrigger.refresh(true)
      }
      
      setIsFullscreen(false)
      setIsMuted(true)
    }
  }

  const handleScrollDown = () => {
    window.scrollBy({
      top: window.innerHeight,
      behavior: 'smooth'
    })
  }

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      const doc = document as ExtendedDocument
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.msFullscreenElement
      )
      
      if (!isCurrentlyFullscreen && isFullscreen) {
        // User exited fullscreen via browser controls (ESC key or browser button)
        const fullscreenVideo = fullscreenVideoRef.current
        
        if (fullscreenVideo) {
          // Remove fullscreen change listener
          const fullscreenHandler = (fullscreenVideo as ExtendedVideoElement)._fullscreenHandler
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
        const originalVideo = window.innerWidth >= 768 ? desktopVideoRef.current : mobileVideoRef.current
        const affectedTriggers = (originalVideo as ExtendedVideoElement)?._affectedTriggers || []
        const savedScrollY = (originalVideo as ExtendedVideoElement)?._scrollY
        
        if (typeof window !== 'undefined' && ScrollTrigger) {
          // Restore scroll position first
          if (savedScrollY !== undefined) {
            window.scrollTo(0, savedScrollY)
          }
          
          // Small delay before re-enabling and refreshing
          setTimeout(() => {
            // Re-enable the affected triggers
            affectedTriggers.forEach((trigger) => trigger.enable())
            // Restore ScrollTrigger refresh events
            ScrollTrigger.config({ autoRefreshEvents: 'resize,visibilitychange,DOMContentLoaded,load' })
            
            // Refresh ScrollTrigger
            ScrollTrigger.refresh()
            
            // Ensure original video is visible and playing after ScrollTrigger refresh
            if (originalVideo) {
              originalVideo.style.transform = ''
              originalVideo.style.visibility = 'visible'
              originalVideo.style.opacity = '1'
              
              const videoWrap = originalVideo.closest('.fill-space-video-wrap') as HTMLElement
              if (videoWrap) {
                videoWrap.style.transform = ''
                videoWrap.style.visibility = 'visible'
                videoWrap.style.opacity = '1'
              }
              
              if (originalVideo.paused) {
                originalVideo.play().catch(() => {})
              }
            }
          }, 50)
        } else {
          // If ScrollTrigger not available, still restore video
          if (originalVideo) {
            originalVideo.style.transform = ''
            originalVideo.style.visibility = 'visible'
            originalVideo.style.opacity = '1'
            const videoWrap = originalVideo.closest('.fill-space-video-wrap') as HTMLElement
            if (videoWrap) {
              videoWrap.style.transform = ''
              videoWrap.style.visibility = 'visible'
              videoWrap.style.opacity = '1'
            }
            
            if (originalVideo.paused) {
              originalVideo.play().catch(() => {})
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

  return (
    <section className="home-hero-media-block full-height flex items-center text-white relative">
      {backgroundMediaType === 'video' && desktopBackgroundVideo && (
        <div className="fill-space-video-wrap">
          {/* Desktop Video */}
          <video
            ref={desktopVideoRef}
            src={videoUrlFor(desktopBackgroundVideo)}
            poster={desktopBackgroundVideoPlaceholder ? urlFor(desktopBackgroundVideoPlaceholder).url() : undefined}
            className="desktop"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
          
          {/* Mobile Video - using desktop video */}
          <video
            ref={mobileVideoRef}
            src={videoUrlFor(desktopBackgroundVideo)}
            poster={desktopBackgroundVideoPlaceholder ? urlFor(desktopBackgroundVideoPlaceholder).url() : undefined}
            className="mobile"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
        </div>
      )}

      {backgroundMediaType === 'image' && (desktopBackgroundImage || mobileBackgroundImage) && (
        <div className="fill-space-image-wrap">
          {/* Desktop Image */}
          {desktopBackgroundImage && (
            <img 
              data-src={urlFor(desktopBackgroundImage).url()} 
              alt="" 
              className="lazy full-bleed-image desktop"
              style={{
                objectPosition: desktopBackgroundImage?.hotspot
                  ? `${desktopBackgroundImage.hotspot.x * 100}% ${desktopBackgroundImage.hotspot.y * 100}%`
                  : "center",
              }}
            />
          )}
          
          {/* Mobile Image */}
          {mobileBackgroundImage && (
            <img 
              data-src={urlFor(mobileBackgroundImage).url()} 
              alt="" 
              className="lazy full-bleed-image mobile"
              style={{
                objectPosition: mobileBackgroundImage?.hotspot
                  ? `${mobileBackgroundImage.hotspot.x * 100}% ${mobileBackgroundImage.hotspot.y * 100}%`
                  : "center",
              }}
            />
          )}
          
          {/* Fallback to desktop image for mobile if no mobile image provided */}
          {!mobileBackgroundImage && desktopBackgroundImage && (
            <img 
              data-src={urlFor(desktopBackgroundImage).url()} 
              alt="" 
              className="lazy full-bleed-image mobile"
              style={{
                objectPosition: desktopBackgroundImage?.hotspot
                  ? `${desktopBackgroundImage.hotspot.x * 100}% ${desktopBackgroundImage.hotspot.y * 100}%`
                  : "center",
              }}
            />
          )}
          
          <div className="loading-overlay" />
        </div>
      )}

      <div className="opacity-overlay opacity-overlay-home z-5" style={{ opacity: overlayDarkness }} />

      <div className="logo z-10 h-pad">
        <div className="desktop">
          <Logo />
        </div>

        <div className="mobile">
          <StackedLogo />
        </div>
      </div>

      <div className="symbol z-500">
        <Symbol />
      </div>
      
      <div className="z-10 text-wrap h-pad">
        {introText && <h2 className="intro-text"><PortableText value={introText} /></h2>}
      </div>

      <div className="down-arrow z-10" onClick={handleScrollDown} style={{ cursor: 'pointer' }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="12" viewBox="0 0 22 12" fill="none" >
          <path d="M21 1L11 11L1 0.999999" stroke="#FFF9F2"/>
        </svg>
      </div>

      <div className={`video-controls ${showControls ? 'visible' : ''} z-10`}>
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
          console.log('HomeHeroMedia: Button clicked!', e)
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
    </section>
  )
}
