/* eslint-disable @next/next/no-img-element */

import { urlFor } from '../sanity/utils/imageUrlBuilder'
import { PortableText } from '@portabletext/react'
import { PortableTextBlock, SanityImage, SanityVideo } from '../types/sanity'
import { videoUrlFor } from '@/sanity/utils/videoUrlBuilder'

type ImageMasonryProps = { 
  heading?: string
  body?: PortableTextBlock[]
  cta?: { label?: string; href?: string }
  mediaType1?: 'image' | 'video'
  image1?: SanityImage
  video1?: SanityVideo
  mediaType2?: 'image' | 'video'
  image2?: SanityImage
  video2?: SanityVideo
}

export default function ImageMasonry({ 
  heading, 
  body, 
  cta, 
  mediaType1 = 'image',
  image1, 
  video1,
  mediaType2 = 'image',
  image2, 
  video2 
}: ImageMasonryProps) {
  return (
    <>
      {/* Desktop */}
      <section className="image-masonry-block h-pad desktop">
        <div className="row-lg">
          <div className="col-4-12_lg">
            <div className="text-wrap out-of-view">
              {heading && <h2 className="heading">{heading}</h2>}
              
              {body && <div><PortableText value={body} /></div>}

              {cta?.href && <div className="cta-font underline-link link">
                <a href={cta.href}>{cta.label || ''}</a>

                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 27">
                  <path d="M1 1L13.5 13.5L0.999999 26"/>
                </svg>
              </div>}
            </div>
          </div>

          <div className="col-8-12_lg desktop"></div>
        </div>

        <div className="row-lg">
          <div className="col-3-12_lg">
            {mediaType1 === 'image' && image1 && (
              <div className="media-1 media-wrap out-of-view">
                <img 
                data-src={urlFor(image1).url()} 
                alt="" 
                className="lazy full-bleed-image"
                />
                <div className="loading-overlay" />
              </div>
            )}

            {mediaType1 === 'video' && video1 && (
              <div className="media-1 media-wrap out-of-view">
                <div className="fill-space-video-wrap">
                  <video
                    src={videoUrlFor(video1)}
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

          <div className="col-2-12_lg desktop"></div>

          <div className="col-7-12_lg">
            {mediaType2 === 'image' && image2 && (
              <div className="media-2 media-wrap out-of-view">
                <img 
                data-src={urlFor(image2).url()} 
                alt="" 
                className="lazy full-bleed-image"
                />
                <div className="loading-overlay" />
              </div>
            )}

            {mediaType2 === 'video' && video2 && (
              <div className="media-2 media-wrap out-of-view">
                <div className="fill-space-video-wrap">
                  <video
                    src={videoUrlFor(video2)}
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
        </div>
      </section>

      {/* Mobile */}
      <section className="image-masonry-block h-pad mobile">
        <div>
          <div className="text-wrap out-of-view">
            {heading && <h2 className="heading">{heading}</h2>}
            
            {body && <div><PortableText value={body} /></div>}

            {cta?.href && <div className="cta-font underline-link link">
              <a href={cta.href}>{cta.label || ''}</a>

              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 27">
                <path d="M1 1L13.5 13.5L0.999999 26"/>
              </svg>
            </div>}
          </div>
        </div>

        <div className="row-sm">
          <div className="col-1-5_sm"></div>

          <div className="col-4-5_sm">
            {mediaType2 === 'image' && image2 && (
              <div className="media-2 media-wrap out-of-view">
                <img 
                data-src={urlFor(image2).url()} 
                alt="" 
                className="lazy full-bleed-image"
                />
                <div className="loading-overlay" />
              </div>
            )}

            {mediaType2 === 'video' && video2 && (
              <div className="media-2 media-wrap out-of-view">
                <div className="fill-space-video-wrap">
                  <video
                    src={videoUrlFor(video2)}
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
        </div>

        <div className="row-sm">
          <div className="col-3-5_sm">
            {mediaType1 === 'image' && image1 && (
              <div className="media-1 media-wrap out-of-view">
                <img 
                data-src={urlFor(image1).url()} 
                alt="" 
                className="lazy full-bleed-image"
                />
                <div className="loading-overlay" />
              </div>
            )}

            {mediaType1 === 'video' && video1 && (
              <div className="media-1 media-wrap out-of-view">
                <div className="fill-space-video-wrap">
                  <video
                    src={videoUrlFor(video1)}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  />
                </div>
              </div>
            )}

            <div className="col-2-5_sm"></div>
          </div>
        </div>
      </section>
    </>
  )
}
