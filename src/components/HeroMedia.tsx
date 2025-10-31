/* eslint-disable @next/next/no-img-element */
"use client"

import { urlFor } from '../sanity/utils/imageUrlBuilder'
import { videoUrlFor } from '../sanity/utils/videoUrlBuilder'
import { SanityImage, SanityVideo } from '../types/sanity'
import { useState, useRef, useEffect } from 'react'
import { PortableText } from '@portabletext/react'
import { PortableTextBlock } from '@portabletext/react'

type PageReference = {
  _ref: string
  _type: 'reference'
  slug?: string
  title?: string
}

type Link = {
  linkType?: 'internal' | 'external' | 'jump'
  label?: string
  href?: string
  pageLink?: PageReference
  jumpLink?: string
}

type HeroMediaProps = {
  layout?: 'layout-1' | 'layout-2' | 'layout-3'
  desktopTitle?: string
  mobileTitle?: string
  backgroundMediaType?: 'image' | 'video'
  desktopBackgroundImage?: SanityImage
  mobileBackgroundImage?: SanityImage
  desktopBackgroundVideo?: SanityVideo
  desktopBackgroundVideoPlaceholder?: SanityImage
  mobileBackgroundVideo?: SanityVideo
  mobileBackgroundVideoPlaceholder?: SanityImage
  showControls?: boolean
  overlayDarkness?: number
  body?: PortableTextBlock[]
  cta?: Link
}

// Helper function to get link text and href from cta
const getLinkInfo = (cta?: Link) => {
  if (!cta) return { text: '', href: '' }
  
  if (cta.linkType === 'external') {
    return { text: cta.label || '', href: cta.href || '' }
  } else if (cta.linkType === 'jump') {
    return { text: cta.label || '', href: cta.jumpLink || '' }
  } else {
    return { text: cta.label || cta.pageLink?.title || '', href: cta.pageLink?.slug ? `/${cta.pageLink.slug}` : '' }
  }
}

export default function HeroMedia({ 
  layout,
  desktopTitle, 
  mobileTitle, 
  backgroundMediaType, 
  desktopBackgroundImage, 
  mobileBackgroundImage,
  desktopBackgroundVideo,
  desktopBackgroundVideoPlaceholder,
  mobileBackgroundVideo,
  mobileBackgroundVideoPlaceholder,
  showControls = false,
  overlayDarkness = 0.3,
  body,
  cta
}: HeroMediaProps) {
  const { text, href } = getLinkInfo(cta)
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
    const desktopVideo = desktopVideoRef.current
    const mobileVideo = mobileVideoRef.current
    const fullscreenVideo = fullscreenVideoRef.current
    
    // Determine which video to use based on screen size or availability
    const sourceVideo = window.innerWidth >= 768 ? desktopVideo : mobileVideo
    
    if (!sourceVideo) return

    try {
      if (!isFullscreen) {
        // Create a dedicated fullscreen video element
        const fullscreenVideoElement = document.createElement('video')
        fullscreenVideoElement.src = sourceVideo.src
        fullscreenVideoElement.controls = true
        fullscreenVideoElement.muted = false
        fullscreenVideoElement.autoplay = true
        fullscreenVideoElement.loop = true
        fullscreenVideoElement.style.width = '100%'
        fullscreenVideoElement.style.height = '100%'
        fullscreenVideoElement.style.objectFit = 'cover'
        
        // Add to body temporarily
        document.body.appendChild(fullscreenVideoElement)
        
        // Enter fullscreen
        if (fullscreenVideoElement.requestFullscreen) {
          await fullscreenVideoElement.requestFullscreen()
        } else if ('webkitRequestFullscreen' in fullscreenVideoElement) {
          await (fullscreenVideoElement as HTMLVideoElement & { webkitRequestFullscreen: () => Promise<void> }).webkitRequestFullscreen()
        } else if ('msRequestFullscreen' in fullscreenVideoElement) {
          await (fullscreenVideoElement as HTMLVideoElement & { msRequestFullscreen: () => Promise<void> }).msRequestFullscreen()
        }
        
        // Store reference for cleanup
        fullscreenVideoRef.current = fullscreenVideoElement
        
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
        
        // Clean up the fullscreen video element
        if (fullscreenVideo) {
          document.body.removeChild(fullscreenVideo)
          fullscreenVideoRef.current = null
        }
        
        setIsFullscreen(false)
        setIsMuted(true)
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error)
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
          document.body.removeChild(fullscreenVideo)
          fullscreenVideoRef.current = null
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
    <>
      {layout === 'layout-1' && (
        <section className="hero-media-block layout-1 full-height flex items-center text-white relative">
          {backgroundMediaType === 'video' && desktopBackgroundVideo && (
            <div className="fill-space-video-wrap media-wrap z-1">
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
            <div className="fill-space-image-wrap media-wrap z-1">
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

          <div className="opacity-overlay z-2" style={{ opacity: overlayDarkness }}></div>
          
          <div className="z-3 h-pad out-of-view">
            {desktopTitle && <div className="desktop"><h1>{desktopTitle}</h1></div>}
            {mobileTitle && <div className="mobile"><h1>{mobileTitle}</h1></div>}
          </div>

          {showControls && ( <div className="video-controls z-4">
            <div className="play-pause-button" onClick={togglePlayPause}>
              <svg className={`pause ${isPlaying ? 'active' : ''} button`} xmlns="http://www.w3.org/2000/svg" width="11" height="20" viewBox="0 0 11 20">
                <line x1="0.5" x2="0.5" y2="20"/>
                <line x1="10.5" x2="10.5" y2="20"/>
              </svg>

              <svg className={`play ${!isPlaying ? 'active' : ''} button`} xmlns="http://www.w3.org/2000/svg" width="11" height="20" viewBox="0 0 11 20">
                <path d="M0.5 1L10.5 10L0.5 19"/>
              </svg>
            </div>
            
            <div className="full-screen-button" onClick={toggleFullscreen}>
              <svg className="button active" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22">
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
          </div> )}
        </section>
      )}

      {layout === 'layout-2' && (
        <section className="hero-media-block layout-2 flex items-center justify-center text-white relative">
          <div className="inner-wrap h-pad out-of-view">
            {body && <h2 className="text-wrap"><PortableText value={body} /></h2>}

            {cta && <div className="cta-font underline-link link cream">
              <a href={href} target={cta?.linkType === 'external' ? '_blank' : undefined} rel={cta?.linkType === 'external' ? 'noopener noreferrer' : undefined}>{text || 'Learn More'}</a>

              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 27">
                <path d="M1 1L13.5 13.5L0.999999 26"/>
              </svg>
            </div>}
          </div>
        </section>
      )}

      {layout === 'layout-3' && (
        <section className="hero-media-block layout-3 flex items-center text-white relative">
          <div className="h-pad out-of-view">
            {desktopTitle && <div className="desktop"><h2>{desktopTitle}</h2></div>}
            {mobileTitle && <div className="mobile"><h2>{mobileTitle}</h2></div>}
          </div>
        </section>
      )}
    </>
  )
}
