'use client'

/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useRef, useState } from 'react'
import { urlFor } from '../sanity/utils/imageUrlBuilder'
import { SanityImage } from '../types/sanity'
import { DisableBodyScroll, EnableBodyScroll } from '../utils/bodyScroll'
import 'flickity/css/flickity.css'

type GalleryProps = {
  images?: {
    image?: SanityImage
    caption?: string
    imageSize?: '16:9' | '1:1' | '4:3' | '2:3'
  }[]
}

export default function Gallery({ images }: GalleryProps) {
  const gridRef = useRef<HTMLDivElement>(null)
  const masonryRef = useRef<{ destroy?: () => void; layout?: () => void } | null>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const flickityRef = useRef<{ destroy: () => void; select: (index: number) => void; previous: () => void; next: () => void } | null>(null)
  const carouselCloseWrapRef = useRef<HTMLDivElement>(null)
  const [isCarouselOpen, setIsCarouselOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)

  const getAspectRatioClass = (imageSize?: string) => {
    switch (imageSize) {
      case '16:9':
        return 'aspect-16-9'
      case '1:1':
        return 'aspect-1-1'
      case '4:3':
        return 'aspect-4-3'
      case '2:3':
        return 'aspect-2-3'
      default:
        return 'aspect-16-9'
    }
  }

  const openCarousel = (index: number) => {
    setSelectedIndex(index)
    setCurrentSlideIndex(index)
    setIsCarouselOpen(true)
    DisableBodyScroll()
  }

  const closeCarousel = () => {
    setIsCarouselOpen(false)
    EnableBodyScroll()
    if (flickityRef.current) {
      flickityRef.current.destroy()
      flickityRef.current = null
    }
  }

  const handlePrevious = () => {
    if (flickityRef.current) {
      flickityRef.current.previous()
    }
  }

  const handleNext = () => {
    if (flickityRef.current) {
      flickityRef.current.next()
    }
  }

  const initCarousel = useCallback(async () => {
    if (!carouselRef.current || flickityRef.current) return

    // Dynamically import Flickity to avoid SSR issues
    const Flickity = (await import('flickity')).default

    flickityRef.current = new Flickity(carouselRef.current, {
      initialIndex: selectedIndex,
      wrapAround: true,
      pageDots: false,
      prevNextButtons: false,
      autoPlay: false,
      cellAlign: 'center',
      contain: true,
      adaptiveHeight: true,
      on: {
        change: (index: number) => {
          setCurrentSlideIndex(index)
        }
      }
    })

    // Handle escape key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeCarousel()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedIndex])

  useEffect(() => {
    if (!images || images.length === 0) return

    // Only run on client side
    if (typeof window === 'undefined') return

    // Dynamically import masonry to avoid SSR issues
    const initMasonry = async () => {
      const Masonry = (await import('masonry-layout')).default
      
      if (gridRef.current && !masonryRef.current) {
        // Get responsive gutter size
        const getGutterSize = () => {
          if (window.innerWidth > 1366) return 150
          if (window.innerWidth > 768) return 100
          // For mobile devices, check if it's landscape orientation
          // Landscape mobile devices should use tablet layout (100px gutter)
          if (window.innerWidth <= 768 && window.innerHeight < window.innerWidth) {
            return 100
          }
          return 75
        }

        // Initialize masonry
        masonryRef.current = new Masonry(gridRef.current, {
          itemSelector: '.gallery-item',
          columnWidth: '.gallery-item',
          percentPosition: true,
          gutter: getGutterSize()
        })

        // Handle window resize
        const handleResize = () => {
          if (masonryRef.current) {
            // Recreate masonry with new gutter size
            masonryRef.current.destroy?.()
            masonryRef.current = null
            masonryRef.current = new Masonry(gridRef.current!, {
              itemSelector: '.gallery-item',
              columnWidth: '.gallery-item',
              percentPosition: true,
              gutter: getGutterSize()
            })
          }
        }

        window.addEventListener('resize', handleResize)

        // Cleanup function
        return () => {
          window.removeEventListener('resize', handleResize)
          if (masonryRef.current) {
            masonryRef.current.destroy?.()
            masonryRef.current = null
          }
        }
      }
    }

    initMasonry()
  }, [images])

  // Re-layout masonry when images load
  useEffect(() => {
    if (!images || images.length === 0) return
    if (typeof window === 'undefined') return

    const handleImageLoad = () => {
      if (masonryRef.current) {
        masonryRef.current.layout?.()
      }
    }

    // Listen for image load events
    const imageElements = gridRef.current?.querySelectorAll('img')
    imageElements?.forEach(img => {
      img.addEventListener('load', handleImageLoad)
    })

    return () => {
      imageElements?.forEach(img => {
        img.removeEventListener('load', handleImageLoad)
      })
    }
  }, [images])

  // Set carousel-close-wrap height to match site-header
  useEffect(() => {
    if (!isCarouselOpen || typeof window === 'undefined') return

    const updateCarouselCloseWrapHeight = () => {
      const siteHeader = document.querySelector('.site-header') as HTMLElement
      const carouselCloseWrap = carouselCloseWrapRef.current

      if (siteHeader && carouselCloseWrap) {
        const headerHeight = siteHeader.offsetHeight
        carouselCloseWrap.style.height = `${headerHeight}px`
      }
    }

    // Set initial height
    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      updateCarouselCloseWrapHeight()
    })

    // Update on resize
    window.addEventListener('resize', updateCarouselCloseWrapHeight)

    return () => {
      window.removeEventListener('resize', updateCarouselCloseWrapHeight)
    }
  }, [isCarouselOpen])

  // Initialize carousel when opened
  useEffect(() => {
    if (isCarouselOpen) {
      initCarousel()
    }
  }, [isCarouselOpen, initCarousel])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (flickityRef.current) {
        flickityRef.current.destroy()
      }
      EnableBodyScroll()
    }
  }, [])

  if (!images || images.length === 0) {
    return null
  }

  return (
    <>
      <section className="gallery-block">
        <div ref={gridRef} className="gallery-grid out-of-view">
          {images.map((item, index) => {
            if (!item.image?.asset) return null

            return (
              <div key={index} className="gallery-item">
                <div 
                  className={`gallery-image ${getAspectRatioClass(item.imageSize)}`}
                  onClick={() => openCarousel(index)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="fill-space-image-wrap">
                    <img
                      data-src={urlFor(item.image).url()}
                      alt=""
                      className="lazy full-bleed-image"
                      style={{
                        objectPosition: item.image?.hotspot
                          ? `${item.image.hotspot.x * 100}% ${item.image.hotspot.y * 100}%`
                          : "center",
                      }}
                    />
                    <div className="loading-overlay" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Carousel overlay */}
      {isCarouselOpen && (
        <div className="carousel-overlay" onClick={closeCarousel}>
          <div className="inner-wrap">
            <div className="carousel-container" onClick={(e) => e.stopPropagation()}>
              <div ref={carouselCloseWrapRef} className="carousel-close-wrap">
                <button 
                  className="carousel-close desktop" 
                  onClick={closeCarousel}
                  aria-label="Close carousel"
                >
                  Close
                </button>

                <button 
                  className="carousel-close mobile" 
                  onClick={closeCarousel}
                  aria-label="Close carousel"
                >
                  <div className="menu-bar" data-position="top"></div>
                  <div className="menu-bar" data-position="bottom"></div>
                </button>
              </div>

              <div ref={carouselRef} className="carousel">
                {images.map((item, index) => {
                  if (!item.image?.asset) return null

                  return (
                    <div key={index} className="carousel-cell">
                      <div className="carousel-image">
                        <img
                          src={urlFor(item.image).width(1200).url()}
                          alt={item.caption || ''}
                          className="carousel-img"
                          style={{
                            objectPosition: item.image?.hotspot
                              ? `${item.image.hotspot.x * 100}% ${item.image.hotspot.y * 100}%`
                              : "center",
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
              
              {/* Custom navigation arrows */}
              {images.length > 1 && (
                <div className="carousel-arrows">
                  <button className="left-arrow" onClick={handlePrevious} type="button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="27" height="52" viewBox="0 0 27 52" fill="none">
                      <path d="M26 51L1 26L26 0.999998" stroke="#581B25"/>
                    </svg>
                  </button>

                  <button className="right-arrow" onClick={handleNext} type="button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="27" height="52" viewBox="0 0 27 52" fill="none">
                      <path d="M1 1L26 26L1 51" stroke="#581B25"/>
                    </svg>
                  </button>
                </div>
              )}
            </div>
            
            {/* Dynamic caption outside carousel container */}
            {images[currentSlideIndex]?.caption && (
              <div className="carousel-caption">
                {images[currentSlideIndex].caption}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
