/* eslint-disable @next/next/no-img-element */
"use client"

import { urlFor } from '../sanity/utils/imageUrlBuilder'
import { PortableText } from '@portabletext/react'
import { SanityImage, PortableTextBlock, SanityVideo } from '../types/sanity'
import { videoUrlFor } from '@/sanity/utils/videoUrlBuilder'
import { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

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

type StackedMediaTextProps = {
  layout?: 'layout-1' | 'layout-2'
  mediaType?: 'image' | 'video'
  image?: SanityImage
  video?: SanityVideo
  heading?: string
  body?: PortableTextBlock[]
  cta?: Link
  showControls?: boolean
  backgroundColour?: 'Lilac' | 'Green' | 'Tan'
}

// Helper function to get link text and href from cta
const getLinkInfo = (cta?: Link) => {
  if (!cta) return { text: '', href: '' }
  
  if (cta.linkType === 'external') {
    return { text: cta.label || '', href: cta.href || '' }
  } else if (cta.linkType === 'jump') {
    return { text: cta.label || '', href: cta.jumpLink || '' }
  } else {
    return { text: cta.pageLink?.title || '', href: cta.pageLink?.slug ? `/${cta.pageLink.slug}` : '' }
  }
}

export default function StackedMediaText({ layout = 'layout-1', mediaType = 'image', image, video, heading, body, cta, showControls = false, backgroundColour = 'Lilac' }: StackedMediaTextProps) {
  const { text, href } = getLinkInfo(cta)
  
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const fullscreenVideoRef = useRef<HTMLVideoElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

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
    const video = videoRef.current
    const fullscreenVideo = fullscreenVideoRef.current
    
    if (!video) return

    try {
      if (!isFullscreen) {
        // Create a dedicated fullscreen video element
        const fullscreenVideoElement = document.createElement('video')
        fullscreenVideoElement.src = video.src
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

  // Color mapping for background colours
  const getBackgroundColor = (colour: string) => {
    switch (colour) {
      case 'Lilac':
        return '#E3DDE7' // $colour-light-purple
      case 'Green':
        return '#C4C7B2' // $colour-green
      case 'Tan':
        return '#E6D3C3' // $colour-tan
      default:
        return '#E3DDE7' // Default to Lilac
    }
  }

  // Background color scroll trigger for creek and architecture pages
  useEffect(() => {
    // Only set up scroll trigger if on a page with page-type-creek or page-type-architecture class
    if (!sectionRef.current) return
    
    const isCreekPage = document.body.classList.contains('page-type-creek')
    const isArchitecturePage = document.body.classList.contains('page-type-architecture')
    if (!isCreekPage && !isArchitecturePage) return

    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger)

    // Get the colour-background elements
    const colourBackgrounds = sectionRef.current.querySelectorAll('.colour-background')

    // Initialize opacity to 0 if backgrounds exist
    if (colourBackgrounds.length > 0) {
      gsap.set(colourBackgrounds, { opacity: 0 })
    }

    // Create scroll trigger to fade in colour background when section comes into view
    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 50%",
      end: "bottom top",
      onEnter: () => {
        colourBackgrounds.forEach(bg => {
          gsap.to(bg, {
            opacity: 1,
            duration: 0.8,
            ease: "cubic-bezier(0.25,0.1,0.25,1)"
          })
        })
      },
      onEnterBack: () => {
        colourBackgrounds.forEach(bg => {
          gsap.to(bg, {
            opacity: 1,
            duration: 0.8,
            ease: "cubic-bezier(0.25,0.1,0.25,1)"
          })
        })
      },
    })

    // Cleanup
    return () => {
      trigger.kill()
    }
  }, [backgroundColour])

  return (
    <>
    
      {layout === 'layout-1' && (
        <section ref={sectionRef} className="stacked-media-text-block layout-1 h-pad">
          {backgroundColour && (
            <div className="colour-background" style={{ backgroundColor: getBackgroundColor(backgroundColour) }}></div>
          )}

          <div className="row-lg">
            <div className="col-4-12_lg">
              <div className="text-wrap out-of-view">
                {heading && <h2 className="heading">{heading}</h2>}
                
                {body && <div><PortableText value={body} /></div>}

                {href && <div className="cta-font underline-link link">
                  <a href={href} target={cta?.linkType === 'external' ? '_blank' : undefined} rel={cta?.linkType === 'external' ? 'noopener noreferrer' : undefined}>{text}</a>

                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 27">
                    <path d="M1 1L13.5 13.5L0.999999 26"/>
                  </svg>
                </div>}
              </div>
            </div>

            <div className="col-8-12_lg desktop"></div>
          </div>

          <div className="">
            {mediaType === 'image' && image && (
              <div className="media-wrap out-of-view">
                <img 
                data-src={urlFor(image).url()} 
                alt="" 
                className="lazy full-bleed-image"
                />
                <div className="loading-overlay" />
              </div>
            )}
            
            {mediaType === 'video' && video && (
              <div className="media-wrap out-of-view">
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
                
                {showControls && (
                  <div className="video-controls z-10">
                    <div className="play-pause-button" onClick={togglePlayPause} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <svg className={`pause ${isPlaying ? 'active' : ''} button`} xmlns="http://www.w3.org/2000/svg" width="11" height="20" viewBox="0 0 11 20" style={{ opacity: isPlaying ? 1 : 0, stroke: '#FFF9F2', strokeWidth: '1px', fill: 'none' }}>
                        <line x1="0.5" x2="0.5" y2="20"/>
                        <line x1="10.5" x2="10.5" y2="20"/>
                      </svg>

                      <svg className={`play ${!isPlaying ? 'active' : ''} button`} xmlns="http://www.w3.org/2000/svg" width="11" height="20" viewBox="0 0 11 20" style={{ opacity: !isPlaying ? 1 : 0, stroke: '#FFF9F2', strokeWidth: '1px', fill: 'none' }}>
                        <path d="M0.5 1L10.5 10L0.5 19"/>
                      </svg>
                    </div>
                    
                    <div className="full-screen-button" onClick={toggleFullscreen} style={{ cursor: 'pointer' }}>
                      <svg className="button active" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" style={{ opacity: 1, stroke: '#FFF9F2', strokeWidth: '1px', fill: 'none' }}>
                        <path d="M1 9V1H9"/>
                        <path d="M1 13V21H9"/>
                        <path d="M21 9V1H13"/>
                        <path d="M21 13V21H13"/>
                      </svg>
                    </div>

                    <div className="volume-button" onClick={toggleMute} style={{ cursor: 'pointer' }}>
                      <svg className={`mute button ${!isMuted ? 'active' : ''}`} xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 23 23" style={{ opacity: !isMuted ? 1 : 0, stroke: '#FFF9F2', strokeWidth: '1px', fill: 'none' }}>
                        <path d="M2.02539 14.876L2.03068 8.44525H5.75376L12.5177 2.69141V20.4607L5.74846 14.876H2.02539Z"/>
                        <line x1="0.353553" y1="0.646447" x2="22.3536" y2="22.6464"/>
                        <path d="M15.0615 7.66797C16.204 8.69055 16.9231 10.1766 16.9231 11.8306C16.9231 13.4308 16.25 14.8739 15.1715 15.8921"/>
                        <path d="M17.9004 18.5992C19.7904 16.9548 20.9852 14.5319 20.9852 11.8299C20.9852 9.06625 19.7352 6.59452 17.7698 4.94922"/>
                      </svg>

                      <svg className={`volume button ${isMuted ? 'active' : ''}`} xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 23 23" style={{ opacity: isMuted ? 1 : 0, stroke: '#FFF9F2', strokeWidth: '1px', fill: 'none' }}>
                        <path d="M2.02539 14.876L2.03068 8.44525H5.75376L12.5177 2.69141V20.4607L5.74846 14.876H2.02539Z"/>
                        <path d="M15.0615 7.66797C16.204 8.69055 16.9231 10.1766 16.9231 11.8306C16.9231 13.4308 16.25 14.8739 15.1715 15.8921"/>
                        <path d="M17.9004 18.5992C19.7904 16.9548 20.9852 14.5319 20.9852 11.8299C20.9852 9.06625 19.7352 6.59452 17.7698 4.94922"/>
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {layout === 'layout-2' && (
        <section ref={sectionRef} className="stacked-media-text-block layout-2 h-pad">
          {backgroundColour && (
            <div className="colour-background" style={{ backgroundColor: getBackgroundColor(backgroundColour) }}></div>
          )}

          <div className="row-lg">
            <div className="col-9-12_lg">
              {mediaType === 'image' && image && (
                <div className="media-wrap out-of-view">
                  <img 
                  data-src={urlFor(image).url()} 
                  alt="" 
                  className="lazy full-bleed-image"
                  />
                  <div className="loading-overlay" />
                </div>
              )}
            
              {mediaType === 'video' && video && (
                <div className="media-wrap out-of-view">
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
                </div>
              )}
            </div>

            <div className="col-3-12_lg desktop"></div>
          </div>

          <div className="row-lg">
            <div className="col-4-12_lg">
              <div className="text-wrap out-of-view">
                {heading && <h2 className="heading">{heading}</h2>}
                
                {body && <div><PortableText value={body} /></div>}

                {href && <div className="cta-font underline-link link">
                  <a href={href} target={cta?.linkType === 'external' ? '_blank' : undefined} rel={cta?.linkType === 'external' ? 'noopener noreferrer' : undefined}>{text}</a>

                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 27">
                    <path d="M1 1L13.5 13.5L0.999999 26"/>
                  </svg>
                </div>}
              </div>
            </div>

            <div className="col-8-12_lg desktop"></div>
          </div>
        </section>
      )}

    </>
  )
}
