'use client'

/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef } from 'react'
import { PortableText } from '@portabletext/react'
import { urlFor } from '@/sanity/utils/imageUrlBuilder'
import { SanityImage, PortableTextBlock } from '../types/sanity'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface Artefact {
  image?: SanityImage
  caption?: string
  title?: string
  description?: string
}

interface TextWithArtefactsProps {
  layout?: 'layout-1' | 'layout-2'
  body?: PortableTextBlock[]
  artefact1?: Artefact
  artefact2?: Artefact
  artefact3?: Artefact
  artefact4?: Artefact
}

export default function TextWithArtefacts({
  layout = 'layout-1',
  body,
  artefact1,
  artefact2,
  artefact3,
  artefact4
}: TextWithArtefactsProps) {
  const sectionRef = useRef<HTMLElement>(null)
  
  useEffect(() => {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger)
    
    // Only apply ScrollTrigger for carousel page
     if (document.body.classList.contains('page-carousel')) {
       const pageCarouselHeroElements = document.querySelectorAll('.page-carousel .hero-media-block .media-wrap, .page-carousel .hero-media-block .opacity-overlay, .page-carousel .hero-media-block .video-controls')
       const textBlock = sectionRef.current?.querySelector('.text-block')
       const artefactsGrid = sectionRef.current?.querySelector('.artefacts-grid')
       const footer = document.querySelector('.site-footer')
       
       if (pageCarouselHeroElements.length > 0 && textBlock && artefactsGrid && footer) {
        // 1. Pin hero / media block elements when they reach viewport top
        pageCarouselHeroElements.forEach((element: Element) => {
          ScrollTrigger.create({
            trigger: element,
            start: "top top",
            end: () => footer.getBoundingClientRect().top,
            pin: true,
            pinSpacing: false,
          })
        })
      
        // 2. Pin text block when it reaches viewport top
         ScrollTrigger.create({
           trigger: textBlock,
           start: "top top",
           endTrigger: artefactsGrid,
           end: "bottom+=100px bottom",  // Add 100px buffer to bottom of artefacts grid trigger
           pin: true,
           pinSpacing: false,
           invalidateOnRefresh: true,
           refreshPriority: -1
         })
         
         // Force multiple refreshes to ensure accurate dimensions
         setTimeout(() => {
           ScrollTrigger.refresh()
         }, 500)
         
         setTimeout(() => {
           ScrollTrigger.refresh()
         }, 1500)
         
         setTimeout(() => {
           ScrollTrigger.refresh()
         }, 3000)
      }
    }
    
    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

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

        // For lazy loaded images, we need to handle them differently
        if (img.classList.contains('lazy') && img.dataset.src) {
          // Create a temporary image to get dimensions
          const tempImg = new Image()
          tempImg.onload = () => {
            // Now we can determine orientation from the temp image
            const { naturalWidth: width, naturalHeight: height } = tempImg
            
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
          tempImg.src = img.dataset.src
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
    <section ref={sectionRef} className="text-with-artefacts">
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
                        />
                        <div className="loading-overlay" />
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
                        />
                        <div className="loading-overlay" />
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
                        />
                        <div className="loading-overlay" />
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
                        />
                        <div className="loading-overlay" />
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
                        />
                        <div className="loading-overlay" />
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
                        />
                        <div className="loading-overlay" />
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
                        />
                        <div className="loading-overlay" />
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
                        />
                        <div className="loading-overlay" />
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
                        />
                        <div className="loading-overlay" />
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
                        />
                        <div className="loading-overlay" />
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
                        />
                        <div className="loading-overlay" />
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
  )
}
