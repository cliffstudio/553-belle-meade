'use client'

/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef } from 'react'
import { PortableText } from '@portabletext/react'
import { urlFor } from '@/sanity/utils/imageUrlBuilder'
import { videoUrlFor } from '@/sanity/utils/videoUrlBuilder'
import { SanityImage, SanityVideo, PortableTextBlock } from '../types/sanity'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePathname } from 'next/navigation'

interface Artefact {
  image?: SanityImage
  caption?: string
  title?: string
  description?: string
}

interface TextWithArtefactsProps {
  layout?: 'layout-1' | 'layout-2'
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
  artefact1?: Artefact
  artefact2?: Artefact
  artefact3?: Artefact
  artefact4?: Artefact
}

export default function TextWithArtefacts({
  layout = 'layout-1',
  desktopTitle,
  mobileTitle,
  backgroundMediaType,
  desktopBackgroundImage,
  mobileBackgroundImage,
  desktopBackgroundVideo,
  desktopBackgroundVideoPlaceholder,
  mobileBackgroundVideo,
  mobileBackgroundVideoPlaceholder,
  showControls,
  overlayDarkness,
  body,
  artefact1,
  artefact2,
  artefact3,
  artefact4
}: TextWithArtefactsProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const desktopVideoRef = useRef<HTMLVideoElement>(null)
  const mobileVideoRef = useRef<HTMLVideoElement>(null)
  const pathname = usePathname()
  
  // Video control state
  const [isPlaying, setIsPlaying] = React.useState(true)
  const [isMuted, setIsMuted] = React.useState(true)
  
  // Video control functions
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
    if (desktopVideoRef.current) {
      if (isPlaying) {
        desktopVideoRef.current.pause()
      } else {
        desktopVideoRef.current.play()
      }
    }
    if (mobileVideoRef.current) {
      if (isPlaying) {
        mobileVideoRef.current.pause()
      } else {
        mobileVideoRef.current.play()
      }
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (desktopVideoRef.current) {
      desktopVideoRef.current.muted = !isMuted
    }
    if (mobileVideoRef.current) {
      mobileVideoRef.current.muted = !isMuted
    }
  }

  const toggleFullscreen = () => {
    const videoElement = desktopVideoRef.current || mobileVideoRef.current
    if (videoElement) {
      if (videoElement.requestFullscreen) {
        videoElement.requestFullscreen()
      }
    }
  }
  
  useEffect(() => {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger)
    
    // Fix any video elements that might have been shifted by GSAP transforms
    const fixVideoPositions = () => {
      // Scope to this component instance to avoid affecting other instances
      const videoWraps = sectionRef.current?.querySelectorAll('.fill-space-video-wrap')
      if (videoWraps) {
        videoWraps.forEach((wrap: Element) => {
          const element = wrap as HTMLElement
          const computedStyle = window.getComputedStyle(element)
          const transform = computedStyle.transform
          
          // Check if transform contains a large translateY value (indicating unwanted shift)
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
        })
      }
    }
    
    // Fix positions immediately and after a short delay
    fixVideoPositions()
    setTimeout(fixVideoPositions, 100)
    
    // Function to setup ScrollTrigger with proper timing
    const setupScrollTriggerEffects = () => {
      // Only apply ScrollTrigger for carousel page
      if (document.body.classList.contains('page-carousel') || document.body.classList.contains('page-heritage')) {
       // Scope selectors to this component instance to avoid conflicts with multiple instances
       const pageCarouselHeroElements = sectionRef.current?.querySelectorAll('.hero-media-block .media-wrap, .hero-media-block .opacity-overlay, .hero-media-block .video-controls')
       const textBlock = sectionRef.current?.querySelector('.text-block')
       const artefactsGrid = sectionRef.current?.querySelector('.artefacts-grid')
       const footer = document.querySelector('.site-footer')
       
        if (pageCarouselHeroElements && pageCarouselHeroElements.length > 0 && textBlock && artefactsGrid && footer) {
          // Wait for lazy images to load before setting up ScrollTriggers
          const setupScrollTriggers = () => {
            // 1. Pin hero / media block elements when they reach viewport top
            pageCarouselHeroElements.forEach((element: Element) => {
              ScrollTrigger.create({
                trigger: element,
                start: "top top",
                endTrigger: footer,
                end: "bottom bottom",
                pin: true,
                pinSpacing: false,
              })
            })
          
            // 2. Pin text block when it reaches viewport top (only on screens larger than 768px)
            if (window.innerWidth > 768) {
              ScrollTrigger.create({
                trigger: textBlock,
                start: "top top",
                endTrigger: footer,
                end: "bottom bottom",
                pin: true,
                pinSpacing: false,
              })
            }

            // 3. Pin artefacts grid when it reaches viewport bottom
            if (window.innerWidth > 768) {
              ScrollTrigger.create({
                trigger: artefactsGrid,
                start: "bottom bottom",
                endTrigger: footer,
                end: "bottom bottom",
                pin: true,
                pinSpacing: false,
              })
            }

          }

          // Check if lazy images exist and wait for them to load
          const lazyImages = artefactsGrid.querySelectorAll('img.lazy')
          if (lazyImages.length > 0) {
            let loadedImages = 0
            const totalImages = lazyImages.length
            
            const checkAllImagesLoaded = () => {
              loadedImages++
              if (loadedImages === totalImages) {
                // All lazy images loaded, now setup ScrollTrigger
                setTimeout(setupScrollTriggers, 100) // small delay to ensure layout is complete
              }
            }
            
            lazyImages.forEach((img: Element) => {
              img.addEventListener('load', checkAllImagesLoaded)
              // Also check if already loaded
              if ((img as HTMLImageElement).complete) {
                checkAllImagesLoaded()
              }
            })
            
            // Fallback: setup triggers after timeout even if images don't all load
            setTimeout(() => {
              if (loadedImages < totalImages) {
                console.warn('Some lazy images failed to load, setting up ScrollTrigger anyway')
                setupScrollTriggers()
              }
            }, 3000)
          } else {
            // No lazy images, setup triggers immediately
            setupScrollTriggers()
          }
        }
      }
    }
    
    // Initial setup with delay to ensure body classes are applied
    const initialTimer = setTimeout(() => {
      setupScrollTriggerEffects()
    }, 200)
    
    // Handle window resize to reinitialize animations if needed
    const handleResize = () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
      setTimeout(setupScrollTriggerEffects, 100)
    }

    window.addEventListener('resize', handleResize)

    // Cleanup function
    return () => {
      clearTimeout(initialTimer)
      window.removeEventListener('resize', handleResize)
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [pathname]) // Add pathname as dependency to re-run on route changes

  useEffect(() => {
    const addOrientationClasses = () => {
      if (!sectionRef.current) return

      const artefacts = sectionRef.current.querySelectorAll('.artefact')
      
      artefacts.forEach((artefact) => {
        const img = artefact.querySelector('img') as HTMLImageElement
        if (!img) return

        const setOrientationClass = () => {
          const { naturalWidth: width, naturalHeight: height } = img
          
          // Only proceed if we have valid dimensions
          if (width === 0 || height === 0) return
          
          // Remove existing orientation classes
          artefact.classList.remove('landscape', 'portrait', 'square')
          
          // Add appropriate class based on orientation
          if (width === height) {
            artefact.classList.add('square')
          } else if (width > height) {
            artefact.classList.add('landscape')
          } else {
            artefact.classList.add('portrait')
          }
        }

        // For lazy loaded images, prevent layout jumps by setting aspect ratio immediately
        if (img.classList.contains('lazy') && img.dataset.src) {
          // Extract dimensions from URL if possible (Sanity URLs include dimensions)
          const urlParams = new URLSearchParams(img.dataset.src.split('?')[1])
          const width = urlParams.get('w') || urlParams.get('width')
          const height = urlParams.get('h') || urlParams.get('height')
          
          if (width && height) {
            // Set CSS aspect-ratio to prevent layout jumps
            img.style.aspectRatio = `${width} / ${height}`
            
            // Still apply orientation classes for styling
            const aspectRatio = parseInt(width) / parseInt(height)
            artefact.classList.remove('landscape', 'portrait', 'square')
            if (Math.abs(aspectRatio - 1) < 0.1) {
              artefact.classList.add('square')
            } else if (aspectRatio > 1) {
              artefact.classList.add('landscape')
            } else {
              artefact.classList.add('portrait')
            }
          } else {
            // Fallback: preload to get dimensions
            const preloader = new Image()
            preloader.onload = () => {
              const { naturalWidth: w, naturalHeight: h } = preloader
              
              // Set aspect ratio to prevent layout jump when real image loads
              img.style.aspectRatio = `${w} / ${h}`
              
              artefact.classList.remove('landscape', 'portrait', 'square')
              if (w === h) {
                artefact.classList.add('square')
              } else if (w > h) {
                artefact.classList.add('landscape')
              } else {
                artefact.classList.add('portrait')
              }
            }
            preloader.src = img.dataset.src
          }
        } else {
          // Regular image loading
          if (img.complete && img.naturalWidth > 0 && img.naturalHeight > 0) {
            setOrientationClass()
          } else {
            img.onload = () => {
              setTimeout(setOrientationClass, 10)
            }
          }
        }
      })
    }

    const addClickHandlers = () => {
      if (!sectionRef.current) return

      const artefactsWithContent = sectionRef.current.querySelectorAll('.artefact.has-content')
      
      artefactsWithContent.forEach((artefact) => {
        const artefactContent = artefact.querySelector('.artefact-content') as HTMLElement
        if (!artefactContent) return

        // Add click handler to the artefact
        const handleArtefactClick = (e: Event) => {
          e.preventDefault()
          e.stopPropagation()
          
          // Toggle visible class on the artefact element
          artefact.classList.toggle('visible')
        }

        // Add click handler to close button (X icon)
        const closeButton = artefactContent.querySelector('.title-wrap svg')
        if (closeButton) {
          const handleCloseClick = (e: Event) => {
            e.preventDefault()
            e.stopPropagation()
            artefact.classList.remove('visible')
          }
          closeButton.addEventListener('click', handleCloseClick)
        }

        // Add click handler to the artefact element
        artefact.addEventListener('click', handleArtefactClick)
      })
    }

    // Run after component mounts
    addOrientationClasses()
    addClickHandlers()

    // Re-run when images load (for lazy loaded images)
    const observer = new MutationObserver(() => {
      addOrientationClasses()
      addClickHandlers()
    })

    if (sectionRef.current) {
      observer.observe(sectionRef.current, {
        childList: true,
        subtree: true
      })
    }

    return () => {
      observer.disconnect()
    }
  }, [artefact1, artefact2, artefact3, artefact4])

  return (
    <>
      <section ref={sectionRef} className="text-with-artefacts">
        <div className="hero-media-block h-svh flex items-center text-white relative z-6">
          {backgroundMediaType === 'video' && (desktopBackgroundVideo || mobileBackgroundVideo) && (
            <div className="fill-space-video-wrap media-wrap z-1">
              {/* Desktop Video */}
              {desktopBackgroundVideo && (
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
              )}
              
              {/* Mobile Video */}
              {mobileBackgroundVideo && (
                <video
                  ref={mobileVideoRef}
                  src={videoUrlFor(mobileBackgroundVideo)}
                  poster={mobileBackgroundVideoPlaceholder ? urlFor(mobileBackgroundVideoPlaceholder).url() : undefined}
                  className="mobile"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
              )}
              
              {/* Fallback to desktop video for mobile if no mobile video provided */}
              {!mobileBackgroundVideo && desktopBackgroundVideo && (
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
              )}
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
          
          {(desktopTitle || mobileTitle) && ( <div className="z-3 h-pad out-of-view">
            {desktopTitle && <div className="desktop"><h1>{desktopTitle}</h1></div>}
            {mobileTitle && <div className="mobile"><h1>{mobileTitle}</h1></div>}
          </div> )}

          {showControls && ( <div className="video-controls z-4 out-of-view">
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
        </div>

        {body && (
          <div className="text-block h-pad z-5">
            <div className="row-lg">
              <div className="col-3-12_lg desktop"></div>

              <div className="col-6-12_lg">
                <h2 className="text-wrap">
                  <PortableText value={body} />
                </h2>
              </div>

              <div className="col-3-12_lg desktop"></div>
            </div>
          </div>
        )}
          
        <div className={`artefacts-grid ${layout} h-pad z-6`}>
          {layout === 'layout-1' ? (
            <>
              {/* Row 1 */}
              <div className="artefacts-row-1 row-lg">
                {artefact1 && (
                  <div className={`artefact artefact-1 col-3-12_lg ${artefact1.title || artefact1.description ? 'has-content' : ''}`}>
                    {artefact1.image && (
                      <div className="artefact-image">
                        <div className="media-wrap relative">
                          <img 
                          data-src={urlFor(artefact1.image).url()} 
                          alt="" 
                          className="lazy"
                          style={{
                            objectPosition: artefact1.image?.hotspot
                              ? `${artefact1.image.hotspot.x * 100}% ${artefact1.image.hotspot.y * 100}%`
                              : "center",
                          }}
                          />
                          <div className="loading-overlay" />
                          <div className="opacity-overlay" />
                          <div className="learn-more">Learn More</div>
                        </div>

                        {artefact1.caption && (
                          <div className="caption">
                            <div className="caption-font">{artefact1.caption}</div>

                            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 11 11">
                              <line x1="5.5" y1="11" x2="5.5" y2="0"/>
                              <line y1="5.5" x2="11" y2="5.5"/>
                            </svg>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Start Popup */}
                    {(artefact1.title || artefact1.description) && ( 
                      <>
                        <div className="artefact-overlay"></div>

                        <div className="artefact-content">
                          <div className="inner-wrap">
                            <div className="mobile">
                              <div className="title-wrap">
                                <h2 className="artefact-title">{artefact1.title}</h2>

                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                                  <line y1="-0.6" x2="42.23" y2="-0.6" transform="matrix(0.703601 -0.710596 0.703601 0.710596 1.29761 31.0078)" stroke="#FFF9F2" strokeWidth="1.2"/>
                                  <line y1="-0.6" x2="42.23" y2="-0.6" transform="matrix(-0.703601 -0.710596 -0.703601 0.710596 30.7131 31.0059)" stroke="#FFF9F2" strokeWidth="1.2"/>
                                </svg>
                              </div>
                            </div>
                            
                            <div className="media-wrap relative">
                              <img 
                              data-src={urlFor(artefact1.image!).url()} 
                              alt="" 
                              className="lazy"
                              style={{
                                objectPosition: artefact1.image?.hotspot
                                  ? `${artefact1.image.hotspot.x * 100}% ${artefact1.image.hotspot.y * 100}%`
                                  : "center",
                              }}
                              />
                              <div className="loading-overlay" />
                            </div>

                            <div className="text-wrap">
                              <div className="desktop">
                                <div className="title-wrap">
                                  <h2 className="artefact-title">{artefact1.title}</h2>

                                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                                    <line y1="-0.6" x2="42.23" y2="-0.6" transform="matrix(0.703601 -0.710596 0.703601 0.710596 1.29761 31.0078)" stroke="#FFF9F2" strokeWidth="1.2"/>
                                    <line y1="-0.6" x2="42.23" y2="-0.6" transform="matrix(-0.703601 -0.710596 -0.703601 0.710596 30.7131 31.0059)" stroke="#FFF9F2" strokeWidth="1.2"/>
                                  </svg>
                                </div>
                              </div>
                              
                              <p className="artefact-description">{artefact1.description}</p>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                    {/* End Popup */}
                  </div>
                )}

                <div className="col-6-12_lg desktop"></div>

                {artefact2 && (
                  <div className={`artefact artefact-2 col-3-12_lg ${artefact2.title || artefact2.description ? 'has-content' : ''}`}>
                    {artefact2.image && (
                      <div className="artefact-image">
                        <div className="media-wrap relative">
                          <img 
                          data-src={urlFor(artefact2.image).url()} 
                          alt="" 
                          className="lazy"
                          style={{
                            objectPosition: artefact2.image?.hotspot
                              ? `${artefact2.image.hotspot.x * 100}% ${artefact2.image.hotspot.y * 100}%`
                              : "center",
                          }}
                          />
                          <div className="loading-overlay" />
                          <div className="opacity-overlay" />
                          <div className="learn-more">Learn More</div>
                        </div>

                        {artefact2.caption && (
                          <div className="caption">
                            <div className="caption-font">{artefact2.caption}</div>

                            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 11 11">
                              <line x1="5.5" y1="11" x2="5.5" y2="0"/>
                              <line y1="5.5" x2="11" y2="5.5"/>
                            </svg>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Start Popup */}
                    {(artefact2.title || artefact2.description) && ( 
                      <>
                        <div className="artefact-overlay"></div>

                        <div className="artefact-content">
                          <div className="inner-wrap">
                            <div className="mobile">
                              <div className="title-wrap">
                                <h2 className="artefact-title">{artefact2.title}</h2>

                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                                  <line y1="-0.6" x2="42.23" y2="-0.6" transform="matrix(0.703601 -0.710596 0.703601 0.710596 1.29761 31.0078)" stroke="#FFF9F2" strokeWidth="1.2"/>
                                  <line y1="-0.6" x2="42.23" y2="-0.6" transform="matrix(-0.703601 -0.710596 -0.703601 0.710596 30.7131 31.0059)" stroke="#FFF9F2" strokeWidth="1.2"/>
                                </svg>
                              </div>
                            </div>

                            <div className="media-wrap relative">
                              <img 
                              data-src={urlFor(artefact2.image!).url()} 
                              alt="" 
                              className="lazy"
                              style={{
                                objectPosition: artefact2.image?.hotspot
                                  ? `${artefact2.image.hotspot.x * 100}% ${artefact2.image.hotspot.y * 100}%`
                                  : "center",
                              }}
                              />
                              <div className="loading-overlay" />
                            </div>

                            <div className="text-wrap">
                              <div className="desktop">
                                <div className="title-wrap">
                                  <h2 className="artefact-title">{artefact2.title}</h2>

                                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                                    <line y1="-0.6" x2="42.23" y2="-0.6" transform="matrix(0.703601 -0.710596 0.703601 0.710596 1.29761 31.0078)" stroke="#FFF9F2" strokeWidth="1.2"/>
                                    <line y1="-0.6" x2="42.23" y2="-0.6" transform="matrix(-0.703601 -0.710596 -0.703601 0.710596 30.7131 31.0059)" stroke="#FFF9F2" strokeWidth="1.2"/>
                                  </svg>
                                </div>
                              </div>
                              
                              <p className="artefact-description">{artefact2.description}</p>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                    {/* End Popup */}
                  </div>
                )}
              </div>
              
              {/* Row 2 */}
              <div className="artefacts-row-2 row-lg">
                {artefact3 && (
                  <div className={`artefact artefact-3 col-3-12_lg ${artefact3.title || artefact3.description ? 'has-content' : ''}`}>
                    {artefact3.image && (
                      <div className="artefact-image">
                        <div className="media-wrap relative">
                          <img 
                          data-src={urlFor(artefact3.image).url()} 
                          alt="" 
                          className="lazy"
                          style={{
                            objectPosition: artefact3.image?.hotspot
                              ? `${artefact3.image.hotspot.x * 100}% ${artefact3.image.hotspot.y * 100}%`
                              : "center",
                          }}
                          />
                          <div className="loading-overlay" />
                          <div className="opacity-overlay" />
                          <div className="learn-more">Learn More</div>
                        </div>

                        {artefact3.caption && (
                          <div className="caption">
                            <div className="caption-font">{artefact3.caption}</div>

                            {(artefact3.title || artefact3.description) && ( 
                              <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 11 11">
                                <line x1="5.5" y1="11" x2="5.5" y2="0"/>
                                <line y1="5.5" x2="11" y2="5.5"/>
                              </svg>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Start Popup */}
                    {(artefact3.title || artefact3.description) && ( 
                      <>
                        <div className="artefact-overlay"></div>
                        
                        <div className="artefact-content">
                          <div className="inner-wrap">
                            <div className="mobile">
                              <div className="title-wrap">
                                <h2 className="artefact-title">{artefact3.title}</h2>

                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                                  <line y1="-0.6" x2="42.23" y2="-0.6" transform="matrix(0.703601 -0.710596 0.703601 0.710596 1.29761 31.0078)" stroke="#FFF9F2" strokeWidth="1.2"/>
                                  <line y1="-0.6" x2="42.23" y2="-0.6" transform="matrix(-0.703601 -0.710596 -0.703601 0.710596 30.7131 31.0059)" stroke="#FFF9F2" strokeWidth="1.2"/>
                                </svg>
                              </div>
                            </div>

                            <div className="media-wrap relative">
                              <img 
                              data-src={urlFor(artefact3.image!).url()} 
                              alt="" 
                              className="lazy"
                              style={{
                                objectPosition: artefact3.image?.hotspot
                                  ? `${artefact3.image.hotspot.x * 100}% ${artefact3.image.hotspot.y * 100}%`
                                  : "center",
                              }}
                              />
                              <div className="loading-overlay" />
                            </div>

                            <div className="text-wrap">
                              <div className="desktop">
                                <div className="title-wrap">
                                  <h2 className="artefact-title">{artefact3.title}</h2>

                                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                                    <line y1="-0.6" x2="42.23" y2="-0.6" transform="matrix(0.703601 -0.710596 0.703601 0.710596 1.29761 31.0078)" stroke="#FFF9F2" strokeWidth="1.2"/>
                                    <line y1="-0.6" x2="42.23" y2="-0.6" transform="matrix(-0.703601 -0.710596 -0.703601 0.710596 30.7131 31.0059)" stroke="#FFF9F2" strokeWidth="1.2"/>
                                  </svg>
                                </div>
                              </div>
                              
                              <p className="artefact-description">{artefact3.description}</p>
                            </div>
                          </div>
                        </div> 
                      </>
                    )}
                    {/* End Popup */}
                  </div>
                )}

                <div className="col-4-12_lg desktop"></div>

                {artefact4 && (
                  <div className={`artefact artefact-4 col-3-12_lg ${artefact4.title || artefact4.description ? 'has-content' : ''}`}>
                    {artefact4.image && (
                      <div className="artefact-image">
                        <div className="media-wrap relative">
                          <img 
                          data-src={urlFor(artefact4.image).url()} 
                          alt="" 
                          className="lazy"
                          style={{
                            objectPosition: artefact4.image?.hotspot
                              ? `${artefact4.image.hotspot.x * 100}% ${artefact4.image.hotspot.y * 100}%`
                              : "center",
                          }}
                          />
                          <div className="loading-overlay" />
                          <div className="opacity-overlay" />
                          <div className="learn-more">Learn More</div>
                        </div>

                        {artefact4.caption && (
                          <div className="caption">
                            <div className="caption-font">{artefact4.caption}</div>

                            {(artefact4.title || artefact4.description) && ( 
                              <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 11 11">
                                <line x1="5.5" y1="11" x2="5.5" y2="0"/>
                                <line y1="5.5" x2="11" y2="5.5"/>
                              </svg>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Start Popup */}
                    {(artefact4.title || artefact4.description) && ( 
                      <>
                        <div className="artefact-overlay"></div>
                        
                        <div className="artefact-content">
                          <div className="inner-wrap">
                            <div className="mobile">
                              <div className="title-wrap">
                                <h2 className="artefact-title">{artefact4.title}</h2>

                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                                  <line y1="-0.6" x2="42.23" y2="-0.6" transform="matrix(0.703601 -0.710596 0.703601 0.710596 1.29761 31.0078)" stroke="#FFF9F2" strokeWidth="1.2"/>
                                  <line y1="-0.6" x2="42.23" y2="-0.6" transform="matrix(-0.703601 -0.710596 -0.703601 0.710596 30.7131 31.0059)" stroke="#FFF9F2" strokeWidth="1.2"/>
                                </svg>
                              </div>
                            </div>

                            <div className="media-wrap relative">
                              <img 
                              data-src={urlFor(artefact4.image!).url()} 
                              alt="" 
                              className="lazy"
                              style={{
                                objectPosition: artefact4.image?.hotspot
                                  ? `${artefact4.image.hotspot.x * 100}% ${artefact4.image.hotspot.y * 100}%`
                                  : "center",
                              }}
                              />
                              <div className="loading-overlay" />
                            </div>

                            <div className="text-wrap">
                              <div className="desktop">
                                <div className="title-wrap">
                                  <h2 className="artefact-title">{artefact4.title}</h2>

                                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                                    <line y1="-0.6" x2="42.23" y2="-0.6" transform="matrix(0.703601 -0.710596 0.703601 0.710596 1.29761 31.0078)" stroke="#FFF9F2" strokeWidth="1.2"/>
                                    <line y1="-0.6" x2="42.23" y2="-0.6" transform="matrix(-0.703601 -0.710596 -0.703601 0.710596 30.7131 31.0059)" stroke="#FFF9F2" strokeWidth="1.2"/>
                                  </svg>
                                </div>
                              </div>
                              
                              <p className="artefact-description">{artefact4.description}</p>
                            </div>
                          </div>
                        </div> 
                      </>
                    )}
                    {/* End Popup */}
                  </div>
                )}
              </div>
            </>
          ) : layout === 'layout-2' ? (
            <>
              {/* Row 1 */}
              <div className="artefacts-row-1 row-lg">
                {artefact1 && (
                  <div className={`artefact artefact-1 col-3-12_lg ${artefact1.title || artefact1.description ? 'has-content' : ''}`}>
                    {artefact1.image && (
                      <div className="artefact-image">
                        <div className="media-wrap relative">
                          <img 
                          data-src={urlFor(artefact1.image).url()} 
                          alt="" 
                          className="lazy"
                          style={{
                            objectPosition: artefact1.image?.hotspot
                              ? `${artefact1.image.hotspot.x * 100}% ${artefact1.image.hotspot.y * 100}%`
                              : "center",
                          }}
                          />
                          <div className="loading-overlay" />
                          <div className="opacity-overlay" />
                          <div className="learn-more">Learn More</div>
                        </div>

                        {artefact1.caption && (
                          <div className="caption">
                            <div className="caption-font">{artefact1.caption}</div>

                            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 11 11">
                              <line x1="5.5" y1="11" x2="5.5" y2="0"/>
                              <line y1="5.5" x2="11" y2="5.5"/>
                            </svg>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Start Popup */}
                    {(artefact1.title || artefact1.description) && ( 
                      <>
                        <div className="artefact-overlay"></div>
                        
                        <div className="artefact-content">
                          <div className="inner-wrap">
                            <div className="mobile">
                              <div className="title-wrap">
                                <h2 className="artefact-title">{artefact1.title}</h2>

                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                                  <line y1="-0.6" x2="42.23" y2="-0.6" transform="matrix(0.703601 -0.710596 0.703601 0.710596 1.29761 31.0078)" stroke="#FFF9F2" strokeWidth="1.2"/>
                                  <line y1="-0.6" x2="42.23" y2="-0.6" transform="matrix(-0.703601 -0.710596 -0.703601 0.710596 30.7131 31.0059)" stroke="#FFF9F2" strokeWidth="1.2"/>
                                </svg>
                              </div>
                            </div>

                            <div className="media-wrap relative">
                              <img 
                              data-src={urlFor(artefact1.image!).url()} 
                              alt="" 
                              className="lazy"
                              style={{
                                objectPosition: artefact1.image?.hotspot
                                  ? `${artefact1.image.hotspot.x * 100}% ${artefact1.image.hotspot.y * 100}%`
                                  : "center",
                              }}
                              />
                              <div className="loading-overlay" />
                            </div>

                            <div className="text-wrap">
                              <div className="desktop">
                                <div className="title-wrap">
                                  <h2 className="artefact-title">{artefact1.title}</h2>

                                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                                    <line y1="-0.6" x2="42.23" y2="-0.6" transform="matrix(0.703601 -0.710596 0.703601 0.710596 1.29761 31.0078)" stroke="#FFF9F2" strokeWidth="1.2"/>
                                    <line y1="-0.6" x2="42.23" y2="-0.6" transform="matrix(-0.703601 -0.710596 -0.703601 0.710596 30.7131 31.0059)" stroke="#FFF9F2" strokeWidth="1.2"/>
                                  </svg>
                                </div>
                              </div>
                              
                              <p className="artefact-description">{artefact1.description}</p>
                            </div>
                          </div>
                        </div> 
                      </>
                    )}
                    {/* End Popup */}
                  </div>
                )}

                <div className="col-6-12_lg desktop"></div>

                {artefact2 && (
                  <div className={`artefact artefact-2 col-2-12_lg ${artefact2.title || artefact2.description ? 'has-content' : ''}`}>
                    {artefact2.image && (
                      <div className="artefact-image">
                        <div className="media-wrap relative">
                          <img 
                          data-src={urlFor(artefact2.image).url()} 
                          alt="" 
                          className="lazy"
                          style={{
                            objectPosition: artefact2.image?.hotspot
                              ? `${artefact2.image.hotspot.x * 100}% ${artefact2.image.hotspot.y * 100}%`
                              : "center",
                          }}
                          />
                          <div className="loading-overlay" />
                          <div className="opacity-overlay" />
                          <div className="learn-more">Learn More</div>
                        </div>

                        {artefact2.caption && (
                          <div className="caption">
                            <div className="caption-font">{artefact2.caption}</div>

                            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 11 11">
                              <line x1="5.5" y1="11" x2="5.5" y2="0"/>
                              <line y1="5.5" x2="11" y2="5.5"/>
                            </svg>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Start Popup */}
                    {(artefact2.title || artefact2.description) && ( 
                      <>
                        <div className="artefact-overlay"></div>
                        
                        <div className="artefact-content">
                          <div className="inner-wrap">
                            <div className="mobile">
                              <div className="title-wrap">
                                <h2 className="artefact-title">{artefact2.title}</h2>

                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                                  <line y1="-0.6" x2="42.23" y2="-0.6" transform="matrix(0.703601 -0.710596 0.703601 0.710596 1.29761 31.0078)" stroke="#FFF9F2" strokeWidth="1.2"/>
                                  <line y1="-0.6" x2="42.23" y2="-0.6" transform="matrix(-0.703601 -0.710596 -0.703601 0.710596 30.7131 31.0059)" stroke="#FFF9F2" strokeWidth="1.2"/>
                                </svg>
                              </div>
                            </div>

                            <div className="media-wrap relative">
                              <img 
                              data-src={urlFor(artefact2.image!).url()} 
                              alt="" 
                              className="lazy"
                              style={{
                                objectPosition: artefact2.image?.hotspot
                                  ? `${artefact2.image.hotspot.x * 100}% ${artefact2.image.hotspot.y * 100}%`
                                  : "center",
                              }}
                              />
                              <div className="loading-overlay" />
                            </div>

                            <div className="text-wrap">
                              <div className="desktop">
                                <div className="title-wrap">
                                  <h2 className="artefact-title">{artefact2.title}</h2>

                                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                                    <line y1="-0.6" x2="42.23" y2="-0.6" transform="matrix(0.703601 -0.710596 0.703601 0.710596 1.29761 31.0078)" stroke="#FFF9F2" strokeWidth="1.2"/>
                                    <line y1="-0.6" x2="42.23" y2="-0.6" transform="matrix(-0.703601 -0.710596 -0.703601 0.710596 30.7131 31.0059)" stroke="#FFF9F2" strokeWidth="1.2"/>
                                  </svg>
                                </div>
                              </div>
                              
                              <p className="artefact-description">{artefact2.description}</p>
                            </div>
                          </div>
                        </div> 
                      </>
                    )}
                    {/* End Popup */}
                  </div>
                )}

                <div className="col-1-12_lg desktop"></div>
              </div>
              
              {/* Row 2 */}
              <div className="artefacts-row-2 row-lg">
                <div className="col-9-12_lg desktop"></div>

                {artefact3 && (
                  <div className={`artefact artefact-3 col-3-12_lg ${artefact3.title || artefact3.description ? 'has-content' : ''}`}>
                    {artefact3.image && (
                      <div className="artefact-image">
                        <div className="media-wrap relative">
                          <img 
                          data-src={urlFor(artefact3.image).url()} 
                          alt="" 
                          className="lazy"
                          style={{
                            objectPosition: artefact3.image?.hotspot
                              ? `${artefact3.image.hotspot.x * 100}% ${artefact3.image.hotspot.y * 100}%`
                              : "center",
                          }}
                          />
                          <div className="loading-overlay" />
                          <div className="opacity-overlay" />
                          <div className="learn-more">Learn More</div>
                        </div>

                        {artefact3.caption && (
                          <div className="caption">
                            <div className="caption-font">{artefact3.caption}</div>

                            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 11 11">
                              <line x1="5.5" y1="11" x2="5.5" y2="0"/>
                              <line y1="5.5" x2="11" y2="5.5"/>
                            </svg>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Start Popup */}
                    {(artefact3.title || artefact3.description) && ( 
                      <>
                        <div className="artefact-overlay"></div>
                        
                        <div className="artefact-content">
                          <div className="inner-wrap">
                            <div className="mobile">
                              <div className="title-wrap">
                                <h2 className="artefact-title">{artefact3.title}</h2>

                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                                  <line y1="-0.6" x2="42.23" y2="-0.6" transform="matrix(0.703601 -0.710596 0.703601 0.710596 1.29761 31.0078)" stroke="#FFF9F2" strokeWidth="1.2"/>
                                  <line y1="-0.6" x2="42.23" y2="-0.6" transform="matrix(-0.703601 -0.710596 -0.703601 0.710596 30.7131 31.0059)" stroke="#FFF9F2" strokeWidth="1.2"/>
                                </svg>
                              </div>
                            </div>

                            <div className="media-wrap relative">
                              <img 
                              data-src={urlFor(artefact3.image!).url()} 
                              alt="" 
                              className="lazy"
                              style={{
                                objectPosition: artefact3.image?.hotspot
                                  ? `${artefact3.image.hotspot.x * 100}% ${artefact3.image.hotspot.y * 100}%`
                                  : "center",
                              }}
                              />
                              <div className="loading-overlay" />
                            </div>

                            <div className="text-wrap">
                              <div className="desktop">
                                <div className="title-wrap">
                                  <h2 className="artefact-title">{artefact3.title}</h2>

                                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                                    <line y1="-0.6" x2="42.23" y2="-0.6" transform="matrix(0.703601 -0.710596 0.703601 0.710596 1.29761 31.0078)" stroke="#FFF9F2" strokeWidth="1.2"/>
                                    <line y1="-0.6" x2="42.23" y2="-0.6" transform="matrix(-0.703601 -0.710596 -0.703601 0.710596 30.7131 31.0059)" stroke="#FFF9F2" strokeWidth="1.2"/>
                                  </svg>
                                </div>
                              </div>
                              
                              <p className="artefact-description">{artefact3.description}</p>
                            </div>
                          </div>
                        </div> 
                      </>
                    )}
                    {/* End Popup */}
                  </div>
                )}
              </div>
            </>
          ) : layout === 'layout-3' ? (
            <>
              {/* Row 1 */}
              <div className="artefacts-row-1 row-lg">
                {artefact1 && (
                  <div className={`artefact artefact-1 col-2-12_lg ${artefact1.title || artefact1.description ? 'has-content' : ''}`}>
                    {artefact1.image && (
                      <div className="artefact-image">
                        <div className="media-wrap relative">
                          <img 
                          data-src={urlFor(artefact1.image).url()} 
                          alt="" 
                          className="lazy"
                          style={{
                            objectPosition: artefact1.image?.hotspot
                              ? `${artefact1.image.hotspot.x * 100}% ${artefact1.image.hotspot.y * 100}%`
                              : "center",
                          }}
                          />
                          <div className="loading-overlay" />
                          <div className="opacity-overlay" />
                          <div className="learn-more">Learn More</div>
                        </div>

                        {artefact1.caption && (
                          <div className="caption">
                            <div className="caption-font">{artefact1.caption}</div>

                            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 11 11">
                              <line x1="5.5" y1="11" x2="5.5" y2="0"/>
                              <line y1="5.5" x2="11" y2="5.5"/>
                            </svg>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Start Popup */}
                    {(artefact1.title || artefact1.description) && ( 
                      <>
                        <div className="artefact-overlay"></div>
                        
                        <div className="artefact-content">
                          <div className="inner-wrap">
                            <div className="mobile">
                              <div className="title-wrap">
                                <h2 className="artefact-title">{artefact1.title}</h2>

                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                                  <line y1="-0.6" x2="42.23" y2="-0.6" transform="matrix(0.703601 -0.710596 0.703601 0.710596 1.29761 31.0078)" stroke="#FFF9F2" strokeWidth="1.2"/>
                                  <line y1="-0.6" x2="42.23" y2="-0.6" transform="matrix(-0.703601 -0.710596 -0.703601 0.710596 30.7131 31.0059)" stroke="#FFF9F2" strokeWidth="1.2"/>
                                </svg>
                              </div>
                            </div>

                            <div className="media-wrap relative">
                              <img 
                              data-src={urlFor(artefact1.image!).url()} 
                              alt="" 
                              className="lazy"
                              style={{
                                objectPosition: artefact1.image?.hotspot
                                  ? `${artefact1.image.hotspot.x * 100}% ${artefact1.image.hotspot.y * 100}%`
                                  : "center",
                              }}
                              />
                              <div className="loading-overlay" />
                            </div>

                            <div className="text-wrap">
                              <div className="desktop">
                                <div className="title-wrap">
                                  <h2 className="artefact-title">{artefact1.title}</h2>

                                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                                    <line y1="-0.6" x2="42.23" y2="-0.6" transform="matrix(0.703601 -0.710596 0.703601 0.710596 1.29761 31.0078)" stroke="#FFF9F2" strokeWidth="1.2"/>
                                    <line y1="-0.6" x2="42.23" y2="-0.6" transform="matrix(-0.703601 -0.710596 -0.703601 0.710596 30.7131 31.0059)" stroke="#FFF9F2" strokeWidth="1.2"/>
                                  </svg>
                                </div>
                              </div>
                              
                              <p className="artefact-description">{artefact1.description}</p>
                            </div>
                          </div>
                        </div> 
                      </>
                    )}
                    {/* End Popup */}
                  </div>
                )}

                <div className="col-7-12_lg desktop"></div>

                {artefact2 && (
                  <div className={`artefact artefact-2 col-3-12_lg ${artefact2.title || artefact2.description ? 'has-content' : ''}`}>
                    {artefact2.image && (
                      <div className="artefact-image">
                        <div className="media-wrap relative">
                          <img 
                          data-src={urlFor(artefact2.image).url()} 
                          alt="" 
                          className="lazy"
                          style={{
                            objectPosition: artefact2.image?.hotspot
                              ? `${artefact2.image.hotspot.x * 100}% ${artefact2.image.hotspot.y * 100}%`
                              : "center",
                          }}
                          />
                          <div className="loading-overlay" />
                          <div className="opacity-overlay" />
                          <div className="learn-more">Learn More</div>
                        </div>

                        {artefact2.caption && (
                          <div className="caption">
                            <div className="caption-font">{artefact2.caption}</div>

                            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 11 11">
                              <line x1="5.5" y1="11" x2="5.5" y2="0"/>
                              <line y1="5.5" x2="11" y2="5.5"/>
                            </svg>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Start Popup */}
                    {(artefact2.title || artefact2.description) && ( 
                      <>
                        <div className="artefact-overlay"></div>
                        
                        <div className="artefact-content">
                          <div className="inner-wrap">
                            <div className="mobile">
                              <div className="title-wrap">
                                <h2 className="artefact-title">{artefact2.title}</h2>

                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                                  <line y1="-0.6" x2="42.23" y2="-0.6" transform="matrix(0.703601 -0.710596 0.703601 0.710596 1.29761 31.0078)" stroke="#FFF9F2" strokeWidth="1.2"/>
                                  <line y1="-0.6" x2="42.23" y2="-0.6" transform="matrix(-0.703601 -0.710596 -0.703601 0.710596 30.7131 31.0059)" stroke="#FFF9F2" strokeWidth="1.2"/>
                                </svg>
                              </div>
                            </div>

                            <div className="media-wrap relative">
                              <img 
                              data-src={urlFor(artefact2.image!).url()} 
                              alt="" 
                              className="lazy"
                              style={{
                                objectPosition: artefact2.image?.hotspot
                                  ? `${artefact2.image.hotspot.x * 100}% ${artefact2.image.hotspot.y * 100}%`
                                  : "center",
                              }}
                              />
                              <div className="loading-overlay" />
                            </div>

                            <div className="text-wrap">
                              <div className="desktop">
                                <div className="title-wrap">
                                  <h2 className="artefact-title">{artefact2.title}</h2>

                                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                                    <line y1="-0.6" x2="42.23" y2="-0.6" transform="matrix(0.703601 -0.710596 0.703601 0.710596 1.29761 31.0078)" stroke="#FFF9F2" strokeWidth="1.2"/>
                                    <line y1="-0.6" x2="42.23" y2="-0.6" transform="matrix(-0.703601 -0.710596 -0.703601 0.710596 30.7131 31.0059)" stroke="#FFF9F2" strokeWidth="1.2"/>
                                  </svg>
                                </div>
                              </div>
                              
                              <p className="artefact-description">{artefact2.description}</p>
                            </div>
                          </div>
                        </div> 
                      </>
                    )}
                    {/* End Popup */}
                  </div>
                )}
              </div>
              
              {/* Row 2 */}
              <div className="artefacts-row-2 row-lg">
                {artefact3 && (
                  <div className={`artefact artefact-3 col-2-12_lg ${artefact3.title || artefact3.description ? 'has-content' : ''}`}>
                    {artefact3.image && (
                      <div className="artefact-image">
                        <div className="media-wrap relative">
                          <img 
                          data-src={urlFor(artefact3.image).url()} 
                          alt="" 
                          className="lazy"
                          style={{
                            objectPosition: artefact3.image?.hotspot
                              ? `${artefact3.image.hotspot.x * 100}% ${artefact3.image.hotspot.y * 100}%`
                              : "center",
                          }}
                          />
                          <div className="loading-overlay" />
                          <div className="opacity-overlay" />
                          <div className="learn-more">Learn More</div>
                        </div>

                        {artefact3.caption && (
                          <div className="caption">
                            <div className="caption-font">{artefact3.caption}</div>

                            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 11 11">
                              <line x1="5.5" y1="11" x2="5.5" y2="0"/>
                              <line y1="5.5" x2="11" y2="5.5"/>
                            </svg>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Start Popup */}
                    {(artefact3.title || artefact3.description) && ( 
                      <>
                        <div className="artefact-overlay"></div>
                        
                        <div className="artefact-content">
                          <div className="artefact-content">
                            <div className="inner-wrap">
                              <div className="mobile">
                              <div className="title-wrap">
                                <h2 className="artefact-title">{artefact3.title}</h2>

                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                                  <line y1="-0.6" x2="42.23" y2="-0.6" transform="matrix(0.703601 -0.710596 0.703601 0.710596 1.29761 31.0078)" stroke="#FFF9F2" strokeWidth="1.2"/>
                                  <line y1="-0.6" x2="42.23" y2="-0.6" transform="matrix(-0.703601 -0.710596 -0.703601 0.710596 30.7131 31.0059)" stroke="#FFF9F2" strokeWidth="1.2"/>
                                </svg>
                              </div>
                            </div>

                              <div className="media-wrap relative">
                                <img 
                                data-src={urlFor(artefact3.image!).url()} 
                                alt="" 
                                className="lazy"
                                />
                                <div className="loading-overlay" />
                              </div>

                              <div className="text-wrap">
                                <div className="desktop">
                                  <div className="title-wrap">
                                    <h2 className="artefact-title">{artefact3.title}</h2>

                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                                      <line y1="-0.6" x2="42.23" y2="-0.6" transform="matrix(0.703601 -0.710596 0.703601 0.710596 1.29761 31.0078)" stroke="#FFF9F2" strokeWidth="1.2"/>
                                      <line y1="-0.6" x2="42.23" y2="-0.6" transform="matrix(-0.703601 -0.710596 -0.703601 0.710596 30.7131 31.0059)" stroke="#FFF9F2" strokeWidth="1.2"/>
                                    </svg>
                                  </div>
                                </div>
                                
                                <p className="artefact-description">{artefact3.description}</p>
                              </div>
                            </div>
                          </div> 
                        </div>
                      </>
                    )}
                    {/* End Popup */}
                  </div>
                )}

                <div className="col-8-12_lg desktop"></div>

                {artefact4 && (
                  <div className={`artefact artefact-4 col-2-12_lg ${artefact4.title || artefact4.description ? 'has-content' : ''}`}>
                    {artefact4.image && (
                      <div className="artefact-image">
                        <div className="media-wrap relative">
                          <img 
                          data-src={urlFor(artefact4.image).url()} 
                          alt="" 
                          className="lazy"
                          style={{
                            objectPosition: artefact4.image?.hotspot
                              ? `${artefact4.image.hotspot.x * 100}% ${artefact4.image.hotspot.y * 100}%`
                              : "center",
                          }}
                          />
                          <div className="loading-overlay" />
                          <div className="opacity-overlay" />
                          <div className="learn-more">Learn More</div>
                        </div>

                        {artefact4.caption && (
                          <div className="caption">
                            <div className="caption-font">{artefact4.caption}</div>

                            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 11 11">
                              <line x1="5.5" y1="11" x2="5.5" y2="0"/>
                              <line y1="5.5" x2="11" y2="5.5"/>
                            </svg>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Start Popup */}
                    {(artefact4.title || artefact4.description) && ( 
                      <>
                        <div className="artefact-overlay"></div>
                        
                        <div className="artefact-content">
                          <div className="inner-wrap">
                            <div className="mobile">
                              <div className="title-wrap">
                                <h2 className="artefact-title">{artefact4.title}</h2>

                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                                  <line y1="-0.6" x2="42.23" y2="-0.6" transform="matrix(0.703601 -0.710596 0.703601 0.710596 1.29761 31.0078)" stroke="#FFF9F2" strokeWidth="1.2"/>
                                  <line y1="-0.6" x2="42.23" y2="-0.6" transform="matrix(-0.703601 -0.710596 -0.703601 0.710596 30.7131 31.0059)" stroke="#FFF9F2" strokeWidth="1.2"/>
                                </svg>
                              </div>
                            </div>

                            <div className="media-wrap relative">
                              <img 
                              data-src={urlFor(artefact4.image!).url()} 
                              alt="" 
                              className="lazy"
                              style={{
                                objectPosition: artefact4.image?.hotspot
                                  ? `${artefact4.image.hotspot.x * 100}% ${artefact4.image.hotspot.y * 100}%`
                                  : "center",
                              }}
                              />
                              <div className="loading-overlay" />
                            </div>

                            <div className="text-wrap">
                              <div className="desktop">
                                <div className="title-wrap">
                                  <h2 className="artefact-title">{artefact4.title}</h2>

                                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                                    <line y1="-0.6" x2="42.23" y2="-0.6" transform="matrix(0.703601 -0.710596 0.703601 0.710596 1.29761 31.0078)" stroke="#FFF9F2" strokeWidth="1.2"/>
                                    <line y1="-0.6" x2="42.23" y2="-0.6" transform="matrix(-0.703601 -0.710596 -0.703601 0.710596 30.7131 31.0059)" stroke="#FFF9F2" strokeWidth="1.2"/>
                                  </svg>
                                </div>
                              </div>
                              
                              <p className="artefact-description">{artefact4.description}</p>
                            </div>
                          </div>
                        </div> 
                      </>
                    )}
                    {/* End Popup */}
                  </div>
                )}
              </div>

              <div className="carousel-image">
                <img src="/images/carousel.png" alt="" />
              </div>
            </>
          ) : null}
        </div>
      </section>

      <section className="scroll-buffer"></section>
    </>
  )
}
