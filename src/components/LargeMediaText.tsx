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

type LargeMediaTextProps = {
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

export default function LargeMediaText({ mediaType = 'image', image, video, heading, body, cta
 }: LargeMediaTextProps) {
  const { text, href } = getLinkInfo(cta)

  return (
    <section className="large-media-text-block h-pad">
      <div className="inner-wrap">
        <div className="row-lg">
          <div className="col-7-12_lg desktop">
            {mediaType === 'image' && image && (
              <div className="media-wrap out-of-view">
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
              <div className="media-wrap out-of-view">
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
    </section>
  )
}
