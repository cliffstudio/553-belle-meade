/* eslint-disable @next/next/no-img-element */
"use client"

import { urlFor } from '../sanity/utils/imageUrlBuilder'
import { SanityImage } from '../types/sanity'
import { PortableText } from '@portabletext/react'
import { PortableTextBlock } from '@portabletext/react'
import { useEffect, useRef } from 'react'
import mediaLazyloading from '../utils/lazyLoad'
import 'flickity/css/flickity.css'

type ImageWithCaption = {
  image: SanityImage
  caption?: string
  imageSize?: '16:9' | '1:1' | '4:3' | '2:3'
}

type ImageCarouselProps = {
  heading?: string
  body?: PortableTextBlock[]
  images?: ImageWithCaption[]
}

export default function ImageCarousel({ heading, body, images }: ImageCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null)
  const flickityRef = useRef<unknown>(null)

  useEffect(() => {
    if (!carouselRef.current || !images || images.length === 0) return

    // Dynamically import Flickity only on client side
    const initializeFlickity = async () => {
      try {
        // Import Flickity dynamically
        const Flickity = (await import('flickity')).default

        // Initialize Flickity
        if (carouselRef.current) {
          flickityRef.current = new Flickity(carouselRef.current, {
          cellAlign: 'left',
          prevNextButtons: false,
          pageDots: false,
          imagesLoaded: true,
          lazyLoad: true,
          on: {
            ready: () => {
              mediaLazyloading()
            }
          }
        })
        }
      } catch (error) {
        console.error('Failed to load Flickity:', error)
      }
    }

    initializeFlickity()

    // Cleanup function
    return () => {
      if (flickityRef.current && typeof flickityRef.current === 'object' && 'destroy' in flickityRef.current) {
        const flickityInstance = flickityRef.current as { destroy: () => void }
        flickityInstance.destroy()
        flickityRef.current = null
      }
    }
  }, [images])

  if (!images || images.length === 0) {
    return null
  }

  const handlePrevious = () => {
    if (flickityRef.current && typeof flickityRef.current === 'object' && 'previous' in flickityRef.current) {
      const flickityInstance = flickityRef.current as { previous: () => void }
      flickityInstance.previous()
    }
  }

  const handleNext = () => {
    if (flickityRef.current && typeof flickityRef.current === 'object' && 'next' in flickityRef.current) {
      const flickityInstance = flickityRef.current as { next: () => void }
      flickityInstance.next()
    }
  }

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

  return (
    <section className="image-carousel-block">
      <div className="h-pad">
        {(heading || body) && (
          <div className="carousel-header row-lg">
            <div className="col-11-12_lg">
              <div className="text-wrap out-of-view">
                {heading && <h2 className="heading">{heading}</h2>}

                {body && (
                  <div className="carousel-body">
                    <PortableText value={body} />
                  </div>
                )}
              </div>
            </div>

            {images.length > 1 && (
              <div className="col-1-12_lg">
                <div className="carousel-arrows">
                  <button className="left-arrow" onClick={handlePrevious} type="button">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 27">
                      <path d="M1 1L13.5 13.5L0.999999 26"/>
                    </svg>
                  </button>

                  <button className="right-arrow" onClick={handleNext} type="button">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 27">
                      <path d="M1 1L13.5 13.5L0.999999 26"/>
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="carousel-container">
          <div 
            ref={carouselRef}
            className="carousel flickity-enabled"
            data-flickity='{"cellAlign": "center", "contain": true, "wrapAround": true}'
          >
            {images.map((item, index) => (
              <div key={index} className="carousel-cell">
                <div className={`media-wrap ${getAspectRatioClass(item.imageSize)}`}>
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

                {item.caption && (
                  <div className="caption caption-font">{item.caption}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}