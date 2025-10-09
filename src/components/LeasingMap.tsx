/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState } from 'react'
import { PortableTextBlock, SanityImage } from '../types/sanity'
import { urlFor } from '../sanity/utils/imageUrlBuilder'
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
  tabletHoverImage?: string
  mobileHoverImage?: string
  tabletPosition?: {
    top: string
    left: string
  }
  mobilePosition?: {
    top: string
    left: string
  }
  popupContent: {
    title: string
    description?: string
    image?: string
    tabletImage?: string
    mobileImage?: string
    details?: string[]
  }
}

interface Position {
  top: string
  left: string
}

interface CMSSpot {
  title: string
  description?: string
  desktopMarkerImage?: SanityImage
  tabletMarkerImage?: SanityImage
  mobileMarkerImage?: SanityImage
  desktopPosition: Position
  tabletPosition?: Position
  mobilePosition?: Position
}

interface Floor {
  label: string
  mobileLabel: string
  desktopImage: SanityImage
  tabletImage?: SanityImage
  mobileImage?: SanityImage
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
  const [hoveredSpot, setHoveredSpot] = useState<string | null>(null)
  const [selectedSpot, setSelectedSpot] = useState<ClickableSpot | null>(null)
  const [currentBreakpoint, setCurrentBreakpoint] = useState<'mobile' | 'tablet' | 'desktop'>('desktop')

  // Detect current breakpoint
  React.useEffect(() => {
    const updateBreakpoint = () => {
      if (window.innerWidth <= 767) {
        setCurrentBreakpoint('mobile')
      } else if (window.innerWidth <= 1366) {
        setCurrentBreakpoint('tablet')
      } else {
        setCurrentBreakpoint('desktop')
      }
    }

    updateBreakpoint()
    window.addEventListener('resize', updateBreakpoint)
    return () => window.removeEventListener('resize', updateBreakpoint)
  }, [])

  // Default floors if no CMS data is provided
  const defaultFloors: Array<{
    id: string
    label: string
    mobileLabel: string
    image: string
    tabletImage: string
    mobileImage: string
    spots?: ClickableSpot[]
  }> = [
    { 
      id: 'floor-1', 
      label: 'First Floor', 
      mobileLabel: 'Floor 1',
      image: '/images/map-floor-1.jpg',
      tabletImage: '/images/map-floor-1.jpg',
      mobileImage: '/images/map-floor-1.jpg',
      spots: []
    },
    { 
      id: 'floor-2', 
      label: 'Second Floor', 
      mobileLabel: 'Floor 2',
      image: '/images/map-floor-2.jpg',
      tabletImage: '/images/map-floor-2.jpg',
      mobileImage: '/images/map-floor-2.jpg',
      spots: []
    },
    { 
      id: 'floor-3', 
      label: 'Third Floor', 
      mobileLabel: 'Floor 3',
      image: '/images/map-floor-3.jpg',
      tabletImage: '/images/map-floor-3.jpg',
      mobileImage: '/images/map-floor-3.jpg',
      spots: []
    }
  ]

  // Transform CMS floors to component format
  const floors = cmsFloors && cmsFloors.length > 0
    ? cmsFloors.map((floor, index) => {
        // Generate image URLs with fallbacks
        if (!floor.desktopImage) {
          // If no desktop image, return default floor if available
          return defaultFloors[index] || defaultFloors[0]
        }

        const desktopImageUrl = urlFor(floor.desktopImage).width(2000).url() || ''
        const tabletImageUrl = floor.tabletImage 
          ? urlFor(floor.tabletImage).width(1200).url() || desktopImageUrl
          : desktopImageUrl
        const mobileImageUrl = floor.mobileImage 
          ? urlFor(floor.mobileImage).width(800).url() || tabletImageUrl
          : tabletImageUrl

        // Transform CMS spots into component format
        const transformedSpots = floor.spots?.map((spot, spotIndex) => {
          const desktopMarkerUrl = spot.desktopMarkerImage 
            ? urlFor(spot.desktopMarkerImage).width(2000).url() || ''
            : ''
          const tabletMarkerUrl = spot.tabletMarkerImage 
            ? urlFor(spot.tabletMarkerImage).width(1200).url() || desktopMarkerUrl
            : desktopMarkerUrl
          const mobileMarkerUrl = spot.mobileMarkerImage 
            ? urlFor(spot.mobileMarkerImage).width(800).url() || tabletMarkerUrl
            : tabletMarkerUrl

          return {
            id: `floor-${index + 1}-spot-${spotIndex + 1}`,
            title: spot.title,
            description: spot.description,
            position: spot.desktopPosition,
            tabletPosition: spot.tabletPosition || spot.desktopPosition,
            mobilePosition: spot.mobilePosition || spot.tabletPosition || spot.desktopPosition,
            hoverImage: desktopMarkerUrl,
            tabletHoverImage: tabletMarkerUrl,
            mobileHoverImage: mobileMarkerUrl,
            popupContent: {
              title: spot.title,
              description: spot.description,
              image: desktopMarkerUrl,
              tabletImage: tabletMarkerUrl,
              mobileImage: mobileMarkerUrl,
            }
          }
        }) || []

        return {
          id: `floor-${index + 1}`,
          label: floor.label,
          mobileLabel: floor.mobileLabel,
          image: desktopImageUrl,
          tabletImage: tabletImageUrl,
          mobileImage: mobileImageUrl,
          spots: transformedSpots
        }
      })
    : defaultFloors

  // Build spots object from CMS data
  const buildSpotsFromFloors = () => {
    const spotsObj: {
      [key: string]: ClickableSpot[]
    } = {}
    
    floors.forEach((floor) => {
      if (floor.spots && floor.spots.length > 0) {
        spotsObj[floor.id] = floor.spots
      }
    })
    
    return spotsObj
  }

  const activeSpots = buildSpotsFromFloors()

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 2))
  }

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 1))
  }

  const handleSpotHover = (spot: ClickableSpot) => {
    setHoveredSpot(spot.id)
  }

  const handleSpotLeave = () => {
    setHoveredSpot(null)
  }

  const handleSpotClick = (spot: ClickableSpot) => {
    setSelectedSpot(spot)
  }

  const closePopup = () => {
    setSelectedSpot(null)
  }


  return (
    <section className="leasing-map out-of-view">
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
                    data-src={floor.image} 
                    alt="" 
                    className="lazy regular desktop leasing-map__base-image"
                  />
                )}

                {/* Tablet Image */}
                {floor.tabletImage && (
                  <img 
                    data-src={floor.tabletImage} 
                    alt="" 
                    className="lazy regular tablet leasing-map__base-image"
                  />
                )}

                {/* Mobile Image */}
                {floor.mobileImage && (
                  <img 
                    data-src={floor.mobileImage} 
                    alt="" 
                    className="lazy regular mobile leasing-map__base-image"
                  />
                )}

                <div className="loading-overlay" />
                
                {/* Hover overlay images - preload all images for this floor */}
                {activeSpots[floor.id as keyof typeof activeSpots]?.map((spot: ClickableSpot) => {
                  // Get the appropriate hover image based on breakpoint
                  let imageToUse = spot.hoverImage || ''
                  if (currentBreakpoint === 'mobile' && spot.mobileHoverImage) {
                    imageToUse = spot.mobileHoverImage
                  } else if (currentBreakpoint === 'tablet' && spot.tabletHoverImage) {
                    imageToUse = spot.tabletHoverImage
                  }

                  return imageToUse ? (
                    <img
                      key={spot.id}
                      src={imageToUse}
                      alt=""
                      className={`regular leasing-map__hover-image ${(hoveredSpot === spot.id || selectedSpot?.id === spot.id) && activeTab === floor.id ? 'visible' : ''}`}
                    />
                  ) : null
                })}
                
                {/* Clickable Spots */}
                {activeSpots[floor.id as keyof typeof activeSpots] && activeSpots[floor.id as keyof typeof activeSpots]!.map((spot: ClickableSpot) => {
                  // Determine which position to use based on breakpoint
                  let position = spot.position
                  if (currentBreakpoint === 'mobile' && spot.mobilePosition) {
                    position = spot.mobilePosition
                  } else if (currentBreakpoint === 'tablet' && spot.tabletPosition) {
                    position = spot.tabletPosition
                  }

                  return (
                    <button
                      key={spot.id}
                      className={`leasing-map__spot${hoveredSpot === spot.id ? ' hovered' : ''}`}
                      style={{
                        top: position.top,
                        left: position.left,
                      }}
                      onMouseEnter={() => handleSpotHover(spot)}
                      onMouseLeave={handleSpotLeave}
                      onClick={() => handleSpotClick(spot)}
                      title={spot.title}
                    >
                    <svg className="leasing-map__spot-indicator" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 27 27">
                      <circle className="st1" cx="13.5" cy="13.5" r="13.5"/>
                      <g>
                        <line className="st0" x1="7.5741997" y1="19.1464014" x2="18.8683014" y2="7.8523016"/>
                        <path className="st0" d="M7.5,12.4413996v7.0587997h7.0587997"/>
                        <path className="st0" d="M19.5,14.5586023v-7.0588017h-7.0587997"/>
                      </g>
                    </svg>
                  </button>
                  )
                })}
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
              <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 50 50">
                <rect className="st0" x=".5" y=".5" width="49" height="49"/>
                <line className="st1" x1="25" y1="12.5" x2="25" y2="37.5"/>
                <line className="st1" x1="37.5" y1="25" x2="12.5" y2="25"/>
              </svg>
            </button>

            <button 
              className="leasing-map__zoom-btn" 
              onClick={handleZoomOut}
              disabled={zoomLevel <= 1}
              title="Zoom Out"
            >
              <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 50 50">
                <rect className="st0" x=".5" y=".5" width="49" height="49"/>
                <line className="st1" x1="37.5" y1="25" x2="12.5" y2="25"/>
              </svg>
            </button>
          </div>
        </div>
        
        {/* Popup */}
        <div className={`leasing-map__popup ${selectedSpot ? 'visible' : ''}`}>
          <div className="leasing-map__popup-content">
            <div className="leasing-map__popup-inner">
              <div className="leasing-map__popup-text">
                <div className="leasing-map__popup-title-wrap">
                  <h2 className="leasing-map__popup-title">{selectedSpot?.popupContent.title}</h2>

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
                
                {selectedSpot?.popupContent.description && (
                  <h3 className="leasing-map__popup-description">{selectedSpot.popupContent.description}</h3>
                )}
                <div className="cta-font underline-link link cream">
                  <Link href="#contact-form">Inquire</Link>

                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 27">
                    <path d="M1 1L13.5 13.5L0.999999 26"/>
                  </svg>
                </div>
              </div>

              <div className="leasing-map__popup-media relative">
                {selectedSpot?.popupContent.image && (
                  <>
                    <img 
                      src={selectedSpot.popupContent.image} 
                      alt={selectedSpot.popupContent.title}
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
