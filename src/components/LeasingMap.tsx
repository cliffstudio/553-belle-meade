/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState } from 'react'
import { PortableTextBlock } from '../types/sanity'

interface LeasingMapProps {
  heading?: string
  body?: PortableTextBlock[]
  cta?: {
    linkType?: 'internal' | 'external'
    label?: string
    href?: string
    pageLink?: { _ref: string; _type: 'reference'; slug?: string; title?: string }
  }
}

export default function LeasingMap({ 
}: LeasingMapProps) {
  const [activeTab, setActiveTab] = useState<'floor-1' | 'floor-2' | 'floor-3'>('floor-1')
  const [zoomLevel, setZoomLevel] = useState(1)

  const floors = [
    { 
      id: 'floor-1' as const, 
      label: 'First Floor', 
      mobileLabel: 'Floor 1',
      image: '/images/map-floor-1.jpg' 
    },
    { 
      id: 'floor-2' as const, 
      label: 'Second Floor', 
      mobileLabel: 'Floor 2',
      image: '/images/map-floor-2.jpg' 
    },
    { 
      id: 'floor-3' as const, 
      label: 'Third Floor', 
      mobileLabel: 'Floor 3',
      image: '/images/map-floor-3.jpg' 
    }
  ]

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 2))
  }

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 1))
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
        
        <div className="leasing-map__content-inner">
          {floors.map((floor) => (
            <div
              key={floor.id}
              className={`leasing-map__panel ${activeTab === floor.id ? 'active' : ''}`}
            >
              <div className="fill-space-image-wrap">
                <img
                  data-src={floor.image}
                  alt=""
                  className="lazy full-bleed-image"
                  style={{ transform: `scale(${zoomLevel})` }}
                />
                <div className="loading-overlay" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
