/* eslint-disable @next/next/no-img-element */

import { urlFor } from '../sanity/utils/imageUrlBuilder'
import { PortableText } from '@portabletext/react'
import { SanityImage, PortableTextBlock, SanityVideo } from '../types/sanity'
import { videoUrlFor } from '@/sanity/utils/videoUrlBuilder'

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

type TextWithMediaProps = {
  layout?: 'layout-1' | 'layout-2' | 'layout-3'
  mediaType?: 'image' | 'video'
  image?: SanityImage
  video?: SanityVideo
  heading?: string
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

export default function TextWithMedia({ layout = 'layout-1', mediaType = 'image', image, video, heading, body, cta }: TextWithMediaProps) {
  const { text, href } = getLinkInfo(cta)

  if (layout === 'layout-1') {
    // Layout 1: large media and text (used on homepage)
    return (
      <section className="text-with-media-block layout-1 h-pad">
        <div className="row-lg">
          <div className="col-7-12_lg desktop">
            {mediaType === 'image' && image && (
              <div className="media-wrap out-of-opacity">
                <img 
                data-src={urlFor(image).url()} 
                alt="" 
                className="lazy full-bleed-image"
                style={{
                  objectPosition: image?.hotspot
                    ? `${image.hotspot.x * 100}% ${image.hotspot.y * 100}%`
                    : "center",
                }}
                />
                <div className="loading-overlay" />
              </div>
            )}
            
            {mediaType === 'video' && video && (
              <div className="media-wrap out-of-opacity">
                <div className="fill-space-video-wrap">
                  <video
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

          <div className="col-1-12_lg desktop"></div>

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
        </div>

        <div className="mobile">
          <div className="row-sm">
            <div className="col-2-5_sm"></div>

            <div className="col-3-5_sm">
              {mediaType === 'image' && image && (
                <div className="media-wrap out-of-opacity">
                  <img 
                  data-src={urlFor(image).url()} 
                  alt="" 
                  className="lazy full-bleed-image"
                  />
                  <div className="loading-overlay" />
                </div>
              )}
              
              {mediaType === 'video' && video && (
                <div className="media-wrap out-of-opacity">
                  <div className="fill-space-video-wrap">
                    <video
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
          </div>
        </div>
      </section>
    )
  }

  if (layout === 'layout-2') {
    // Layout 2: small media and text (used on shopping)
    return (
      <section className="text-with-media-block layout-2 h-pad">
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

          <div className="col-5-12_lg desktop"></div>

          <div className="col-3-12_lg desktop">
            {mediaType === 'image' && image && (
              <div className="media-wrap out-of-opacity">
                <img 
                data-src={urlFor(image).url()} 
                alt="" 
                className="lazy full-bleed-image"
                style={{
                  objectPosition: image?.hotspot
                    ? `${image.hotspot.x * 100}% ${image.hotspot.y * 100}%`
                    : "center",
                }}
                />
                <div className="loading-overlay" />
              </div>
            )}
            
            {mediaType === 'video' && video && (
              <div className="media-wrap out-of-opacity">
                <div className="fill-space-video-wrap">
                  <video
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
        </div>

        <div className="mobile">
          <div className="row-sm">
            <div className="col-2-5_sm"></div>

            <div className="col-3-5_sm">
              {mediaType === 'image' && image && (
                <div className="media-wrap out-of-opacity">
                  <img 
                  data-src={urlFor(image).url()} 
                  alt="" 
                  className="lazy full-bleed-image"
                  />
                  <div className="loading-overlay" />
                </div>
              )}
              
              {mediaType === 'video' && video && (
                <div className="media-wrap out-of-opacity">
                  <div className="fill-space-video-wrap">
                    <video
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
          </div>
        </div>
      </section>
    )
  }

  if (layout === 'layout-3') {
    // Layout 3: Full-width text above, media below (used on creek)
    return (
      <section className="text-with-media-block layout-3 h-pad">
        <div className="inner-wrap">
          <div className="row-lg">
            <div className="col-8-12_lg">
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
          </div>

          <div className="row-lg">
            <div className="col-10-12_lg">
              {mediaType === 'image' && image && (
                <div className="media-wrap out-of-opacity">
                  <img 
                  data-src={urlFor(image).url()} 
                  alt="" 
                  className="lazy full-bleed-image"
                  />
                  <div className="loading-overlay" />
                </div>
              )}
              
              {mediaType === 'video' && video && (
                <div className="media-wrap out-of-opacity">
                  <div className="fill-space-video-wrap">
                    <video
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
          </div>
        </div>
      </section>
    )
  }

  // Default layout (layout-1) - media on left, text on right
  return (
    <section className="text-with-media-block layout-1 h-pad">
      <div className="inner-wrap row-lg">
        <div className="col-6-12_lg">
          {mediaType === 'image' && image && (
            <div className="media-wrap out-of-opacity">
              <img 
              data-src={urlFor(image).url()} 
              alt="" 
              className="lazy full-bleed-image"
              />
              <div className="loading-overlay" />
            </div>
          )}
          
          {mediaType === 'video' && video && (
            <div className="media-wrap out-of-opacity">
              <div className="fill-space-video-wrap">
                <video
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

        <div className="col-1-12_lg desktop"></div>

        <div className="col-4-12_lg">
          <div className="text-wrap out-of-view">
            {heading && <h2 className="heading">{heading}</h2>}
            
            {body && <div><PortableText value={body} /></div>}

            {href && <div className="cta-font underline-link link">
              <a href={href}>{text}</a>

              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 27">
                <path d="M1 1L13.5 13.5L0.999999 26"/>
              </svg>
            </div>}
          </div>
        </div>

        <div className="col-1-12_lg desktop"></div>
      </div>
    </section>
  )
}
