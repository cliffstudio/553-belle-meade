/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState, useEffect, useRef } from 'react'
import { PortableTextBlock, SanityImage } from '../types/sanity'
import { urlFor } from '../sanity/utils/imageUrlBuilder'
import { fileUrlFor, SanityFile } from '../sanity/utils/fileUrlBuilder'
import Link from 'next/link'

interface ClickableSpot {
  id: string
  title: string
  description?: string
  position: {
    top: string // percentage or pixel value
    left: string // percentage or pixel value
  }
  hoverImage?: string // optional image to show on hover
  mobileHoverImage?: string
  mobilePosition?: {
    top: string
    left: string
  }
  popupContent: {
    title: string
    description?: string
    image?: string
    mobileImage?: string
    details?: string[]
  }
}

interface Position {
  top: string
  left: string
}

interface CMSSpot {
  id: string
  title: string
  description?: string
  image?: SanityImage
  desktopMarkerImage?: SanityImage
  mobileMarkerImage?: SanityImage
  desktopPosition: Position
  mobilePosition?: Position
}

interface Floor {
  label: string
  mobileLabel: string
  desktopImage: SanityImage
  mobileImage?: SanityImage
  desktopSpacesOverlayImage?: SanityFile
  mobileSpacesOverlayImage?: SanityFile
  spots?: CMSSpot[]
}

interface LeasingMapProps {
  heading?: string
  body?: PortableTextBlock[]
  floors?: Floor[]
  cta?: {
    linkType?: 'internal' | 'external'
    label?: string
    href?: string
    pageLink?: { _ref: string; _type: 'reference'; slug?: string; title?: string }
  }
}

export default function LeasingMap({ 
  floors: cmsFloors
}: LeasingMapProps) {
  const [activeTab, setActiveTab] = useState<string>('floor-1')
  const [zoomLevel, setZoomLevel] = useState(1)
  const [selectedSpot, setSelectedSpot] = useState<ClickableSpot | null>(null)
  const [displaySpot, setDisplaySpot] = useState<ClickableSpot | null>(null)
  const [currentBreakpoint, setCurrentBreakpoint] = useState<'mobile' | 'tablet' | 'desktop'>('desktop')
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())

  // Detect current breakpoint
  React.useEffect(() => {
    const updateBreakpoint = () => {
      const isLandscape = window.innerWidth > window.innerHeight
      
      if (window.innerWidth <= 767) {
        setCurrentBreakpoint('mobile')
      } else if (window.innerWidth <= 1366 || isLandscape) {
        setCurrentBreakpoint('tablet')
      } else {
        setCurrentBreakpoint('desktop')
      }
    }

    updateBreakpoint()
    window.addEventListener('resize', updateBreakpoint)
    window.addEventListener('orientationchange', updateBreakpoint)
    return () => {
      window.removeEventListener('resize', updateBreakpoint)
      window.removeEventListener('orientationchange', updateBreakpoint)
    }
  }, [])

  // Update displaySpot with delay to keep content visible during fade-out
  React.useEffect(() => {
    if (selectedSpot) {
      // Immediately show new content
      setDisplaySpot(selectedSpot)
    } else {
      // Delay clearing content to allow fade-out animation (400ms in CSS)
      const timeout = setTimeout(() => {
        setDisplaySpot(null)
      }, 400)
      return () => clearTimeout(timeout)
    }
  }, [selectedSpot])

  // Default floors if no CMS data is provided
  const defaultFloors: Array<{
    id: string
    label: string
    mobileLabel: string
    image: string
    mobileImage: string
    desktopSpacesOverlayImage?: SanityFile
    mobileSpacesOverlayImage?: SanityFile
    spots?: ClickableSpot[]
  }> = [
    { 
      id: 'floor-1', 
      label: 'First Floor', 
      mobileLabel: 'Floor 1',
      image: '/images/map-floor-1.jpg',
      mobileImage: '/images/map-floor-1.jpg',
      spots: []
    },
    { 
      id: 'floor-2', 
      label: 'Second Floor', 
      mobileLabel: 'Floor 2',
      image: '/images/map-floor-2.jpg',
      mobileImage: '/images/map-floor-2.jpg',
      spots: []
    },
    { 
      id: 'floor-3', 
      label: 'Third Floor', 
      mobileLabel: 'Floor 3',
      image: '/images/map-floor-3.jpg',
      mobileImage: '/images/map-floor-3.jpg',
      spots: []
    }
  ]

  // Helper function to normalize IDs (convert spaces to underscores, handle special chars)
  const normalizeId = (id: string): string => {
    return id
      .trim()
      .replace(/\s+/g, '_') // Replace spaces with underscores
      .replace(/[^a-zA-Z0-9_]/g, '') // Remove special characters except underscores
  }

  // Transform CMS floors to component format
  const floors = cmsFloors && cmsFloors.length > 0
    ? cmsFloors.map((floor, index) => {
        // Generate image URLs with fallbacks
        if (!floor.desktopImage) {
          // If no desktop image, return default floor if available
          return defaultFloors[index] || defaultFloors[0]
        }

        const desktopImageUrl = urlFor(floor.desktopImage).width(2000).url() || ''
        const mobileImageUrl = floor.mobileImage 
          ? urlFor(floor.mobileImage).width(800).url() || desktopImageUrl
          : desktopImageUrl

        // Transform CMS spots into component format
        const transformedSpots = floor.spots?.map((spot, spotIndex) => {
          const desktopMarkerUrl = spot.desktopMarkerImage 
            ? urlFor(spot.desktopMarkerImage).width(2000).url() || ''
            : ''
          const mobileMarkerUrl = spot.mobileMarkerImage 
            ? urlFor(spot.mobileMarkerImage).width(800).url() || desktopMarkerUrl
            : desktopMarkerUrl

          // Use the spot image field for popup, with fallback to marker images
          const popupImageUrl = spot.image
            ? urlFor(spot.image).width(2000).url() || ''
            : desktopMarkerUrl
          const popupMobileImageUrl = spot.image
            ? urlFor(spot.image).width(800).url() || popupImageUrl
            : mobileMarkerUrl

          const normalizedId = spot.id ? normalizeId(spot.id) : `floor-${index + 1}-spot-${spotIndex + 1}`
          
          return {
            id: normalizedId,
            title: spot.title,
            description: spot.description,
            position: spot.desktopPosition,
            mobilePosition: spot.mobilePosition || spot.desktopPosition,
            hoverImage: desktopMarkerUrl,
            mobileHoverImage: mobileMarkerUrl,
            popupContent: {
              title: spot.title,
              description: spot.description,
              image: popupImageUrl,
              mobileImage: popupMobileImageUrl,
            }
          }
        }) || []

        return {
          id: `floor-${index + 1}`,
          label: floor.label,
          mobileLabel: floor.mobileLabel,
          image: desktopImageUrl,
          mobileImage: mobileImageUrl,
          desktopSpacesOverlayImage: floor.desktopSpacesOverlayImage,
          mobileSpacesOverlayImage: floor.mobileSpacesOverlayImage,
          spots: transformedSpots
        }
      })
    : defaultFloors

  // Create a lookup map for spots by ID
  const spotsById = React.useMemo(() => {
    const lookup: { [key: string]: ClickableSpot } = {}
    floors.forEach((floor) => {
      if (floor.spots) {
        floor.spots.forEach((spot) => {
          lookup[spot.id] = spot
        })
      }
    })
    return lookup
  }, [floors])

  // Preload all floor images to prevent flashing when switching tabs
  React.useEffect(() => {
    const imagesToPreload: string[] = []
    
    floors.forEach((floor) => {
      if (floor.image) imagesToPreload.push(floor.image)
      if (floor.mobileImage) imagesToPreload.push(floor.mobileImage)
    })

    imagesToPreload.forEach((src) => {
      const img = new Image()
      img.src = src
    })
  }, [floors])

  const handleImageLoad = (floorId: string) => {
      setLoadedImages(prev => {
        const newSet = new Set(prev)
        newSet.add(floorId)
        return newSet
      })
  }

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 2))
  }

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 1))
  }

  const handleSpotClick = React.useCallback((spot: ClickableSpot) => {
    setSelectedSpot(spot)
  }, [])

  const closePopup = () => {
    setSelectedSpot(null)
  }

  // Component to render inline SVG overlay
  const SvgOverlay = ({ svgFile, className }: { svgFile?: SanityFile; className?: string }) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [svgContent, setSvgContent] = useState<string | null>(null)

    // Fetch SVG when component mounts and svgFile is available
    useEffect(() => {
      if (!svgFile) {
        return
      }

      const svgUrl = fileUrlFor(svgFile)
      
      if (!svgUrl) {
        console.warn('No SVG URL generated for overlay file', svgFile)
        return
      }


      // Fetch the SVG file and inject it inline
      fetch(svgUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to fetch SVG: ${response.statusText}`)
          }
          return response.text()
        })
        .then((text) => {
          setSvgContent(text)
        })
        .catch((err) => {
          console.error('Error loading SVG overlay:', err)
        })
    }, [svgFile])

    // Inject SVG into DOM when content is loaded and add click handlers
    useEffect(() => {
      if (!svgContent || !containerRef.current) {
        return
      }

      // Parse and inject the SVG inline
      const parser = new DOMParser()
      const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml')
      const svgElement = svgDoc.documentElement

      // Check for parsing errors
      const parserError = svgDoc.querySelector('parsererror')
      if (parserError) {
        console.error('SVG parsing error:', parserError.textContent)
        return
      }

      // Clear container and inject the SVG
      containerRef.current.innerHTML = ''
      containerRef.current.appendChild(svgElement)

      // Helper function to find a matching spot ID by traversing up the DOM tree
      const findSpotId = (element: Element | null): string | null => {
        let current: Element | null = element
        while (current && current !== svgElement) {
          const id = current.getAttribute('id')
          if (id && spotsById[id]) {
            return id
          }
          current = current.parentElement
        }
        return null
      }

      // Add a single click handler to the SVG root (event delegation)
      const svgClickHandler = (e: Event) => {
        const target = e.target as Element
        if (!target) return
        
        const spotId = findSpotId(target)
        
        if (spotId) {
          e.stopPropagation()
          const spot = spotsById[spotId]
          if (spot) {
            handleSpotClick(spot)
          }
        }
      }
      
      svgElement.addEventListener('click', svgClickHandler)
      
      // Make all elements with matching IDs show pointer cursor and ensure they're clickable
      const makeClickable = (element: Element) => {
        const elementId = element.getAttribute('id')
        if (elementId && spotsById[elementId]) {
          const currentStyle = element.getAttribute('style') || ''
          let newStyle = currentStyle
          if (!currentStyle.includes('cursor')) {
            newStyle = `${newStyle} cursor: pointer;`.trim()
          }
          if (!currentStyle.includes('pointer-events')) {
            newStyle = `${newStyle} pointer-events: auto;`.trim()
          }
          element.setAttribute('style', newStyle)
        }
        
        // Recursively process children
        Array.from(element.children).forEach((child) => {
          makeClickable(child)
        })
      }
      
      makeClickable(svgElement)
      
      // Also ensure child elements (like paths) inherit pointer-events from parent groups
      const ensureChildrenClickable = (element: Element) => {
        const elementId = element.getAttribute('id')
        if (elementId && spotsById[elementId]) {
          // Make all children clickable too
          Array.from(element.children).forEach((child) => {
            const currentStyle = child.getAttribute('style') || ''
            let newStyle = currentStyle
            if (!currentStyle.includes('pointer-events')) {
              newStyle = `${newStyle} pointer-events: auto;`.trim()
            }
            if (!currentStyle.includes('cursor')) {
              newStyle = `${newStyle} cursor: pointer;`.trim()
            }
            child.setAttribute('style', newStyle)
            ensureChildrenClickable(child)
          })
        }
      }
      
      ensureChildrenClickable(svgElement)

      // Cleanup function to remove event listeners
      return () => {
        svgElement.removeEventListener('click', svgClickHandler)
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [svgContent, spotsById, handleSpotClick])

    if (!svgFile) {
      return null
    }

    return <div ref={containerRef} className={className} />
  }

  return (
    <section className="leasing-map">
      {/* Tab Navigation */}
      <div className="leasing-map__tabs">
        {floors.map((floor) => (
          <button
            key={floor.id}
            className={`leasing-map__tab ${activeTab === floor.id ? 'active' : ''}`}
            onClick={() => setActiveTab(floor.id)}
          >
            <span className="leasing-map__tab-label-desktop">{floor.label}</span>
            <span className="leasing-map__tab-label-mobile">{floor.mobileLabel}</span>
          </button>
        ))}
      </div>
      
      {/* Tab Content */}
      <div className="leasing-map__content">
        <div className="leasing-map__content-inner relative">
          {floors.map((floor) => (
            <div
              key={floor.id}
              className={`leasing-map__panel ${activeTab === floor.id ? 'active' : ''}`}
            >
              <div 
                className="media-wrap"
                style={{ transform: `scale(${zoomLevel})` }}
              >
                {/* Base floor plan images */}
                {/* Desktop Image */}
                {floor.image && (
                  <img 
                    src={floor.image} 
                    alt="" 
                    className="regular desktop leasing-map__base-image"
                    onLoad={() => handleImageLoad(floor.id)}
                    ref={(img) => {
                      // Handle images that are already cached - only update if not already loaded
                      if (img?.complete && !loadedImages.has(floor.id)) {
                        handleImageLoad(floor.id)
                      }
                    }}
                  />
                )}

                {/* Mobile Image */}
                {floor.mobileImage && (
                  <img 
                    src={floor.mobileImage} 
                    alt="" 
                    className="regular mobile leasing-map__base-image"
                    onLoad={() => handleImageLoad(floor.id)}
                    ref={(img) => {
                      // Handle images that are already cached - only update if not already loaded
                      if (img?.complete && !loadedImages.has(floor.id)) {
                        handleImageLoad(floor.id)
                      }
                    }}
                  />
                )}

                {/* Only show loading overlay on the first floor */}
                {floor.id === 'floor-1' && (
                  <div className={`loading-overlay ${loadedImages.has(floor.id) ? 'hidden' : ''}`} />
                )}

                {/* SVG Overlay Images - Inline SVG based on breakpoint */}
                {(() => {
                  // Render appropriate overlay based on breakpoint
                  if (currentBreakpoint === 'desktop' && floor.desktopSpacesOverlayImage) {
                    return (
                      <SvgOverlay 
                        svgFile={floor.desktopSpacesOverlayImage} 
                        className="regular desktop leasing-map__svg-overlay"
                        key={`${floor.id}-desktop-overlay`}
                      />
                    )
                  }
                  if (currentBreakpoint === 'tablet' && floor.desktopSpacesOverlayImage) {
                    return (
                      <SvgOverlay 
                        svgFile={floor.desktopSpacesOverlayImage} 
                        className="regular tablet leasing-map__svg-overlay"
                        key={`${floor.id}-tablet-overlay`}
                      />
                    )
                  }
                  if (currentBreakpoint === 'mobile' && (floor.mobileSpacesOverlayImage || floor.desktopSpacesOverlayImage)) {
                    return (
                      <SvgOverlay 
                        svgFile={floor.mobileSpacesOverlayImage || floor.desktopSpacesOverlayImage} 
                        className="regular mobile leasing-map__svg-overlay"
                        key={`${floor.id}-mobile-overlay`}
                      />
                    )
                  }
                  return null
                })()}
              </div>
            </div>
          ))}

          {/* Zoom Controls */}
          <div className="leasing-map__zoom-controls">
            <button 
              className="leasing-map__zoom-btn" 
              onClick={handleZoomIn}
              disabled={zoomLevel >= 2}
              title="Zoom In"
            >
              <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 25 25">
                <line className="st0" x1="12.5" x2="12.5" y2="25"/>
                <line className="st0" x1="25" y1="12.5" y2="12.5"/>
              </svg>
            </button>

            <button 
              className="leasing-map__zoom-btn" 
              onClick={handleZoomOut}
              disabled={zoomLevel <= 1}
              title="Zoom Out"
            >
              <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 25 25">
                <line className="st0" x1="25" y1="12.5" y2="12.5"/>
              </svg>
            </button>
          </div>
        </div>
        
        {/* Popup */}
        <div className={`leasing-map__popup ${selectedSpot ? 'visible' : ''}`} data-space-id={selectedSpot?.id}>
          <div className="leasing-map__popup-content">
            <div className="leasing-map__popup-inner">
              <div className="leasing-map__popup-text">
                <div className="leasing-map__popup-title-wrap">
                  <h2 className="leasing-map__popup-title">{displaySpot?.popupContent.title}</h2>

                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="32" 
                    height="32" 
                    viewBox="0 0 32 32" 
                    fill="none"
                    onClick={closePopup}
                    style={{ cursor: 'pointer' }}
                  >
                    <line y1="-0.6" x2="42.23" y2="-0.6" transform="matrix(0.703601 -0.710596 0.703601 0.710596 1.29761 31.0078)" stroke="#FFF9F2" strokeWidth="1.2"/>
                    <line y1="-0.6" x2="42.23" y2="-0.6" transform="matrix(-0.703601 -0.710596 -0.703601 0.710596 30.7131 31.0059)" stroke="#FFF9F2" strokeWidth="1.2"/>
                  </svg>
                </div>
                
                {displaySpot?.popupContent.description && (
                  <h3 className="leasing-map__popup-description">{displaySpot.popupContent.description}</h3>
                )}
                <div className="cta-font underline-link link cream">
                  <Link href="#contact-form">Inquire</Link>

                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 27">
                    <path d="M1 1L13.5 13.5L0.999999 26"/>
                  </svg>
                </div>
              </div>

              <div className="leasing-map__popup-media relative">
                {displaySpot?.popupContent.image && (
                  <>
                    <img 
                      src={displaySpot.popupContent.image} 
                      alt={displaySpot.popupContent.title}
                      className="full-bleed-image"
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
