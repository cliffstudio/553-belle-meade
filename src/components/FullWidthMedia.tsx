/* eslint-disable @next/next/no-img-element */

import { videoUrlFor } from '@/sanity/utils/videoUrlBuilder'
import { urlFor } from '../sanity/utils/imageUrlBuilder'
import { SanityImage, SanityVideo } from '../types/sanity'

type FullWidthMediaProps = {
  mediaType?: 'image' | 'video'
  image?: SanityImage
  video?: SanityVideo
}

export default function FullWidthMedia({ mediaType, image, video }: FullWidthMediaProps) {
  if (!mediaType) {
    return null
  }

  if (mediaType === 'image' && !image) {
    return null
  }

  if (mediaType === 'video' && !video) {
    return null
  }

  return (
    <section className="full-bleed-media-block relative">
      {mediaType === 'video' && video && (
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
      )}

      {mediaType === 'image' && image && (
        <div className="fill-space-image-wrap">
          <img 
            data-src={urlFor(image).url()} 
            alt="" 
            className="lazy full-bleed-image"
          />
          <div className="loading-overlay" />
        </div>
      )}
    </section>
  )
}
