/* eslint-disable @next/next/no-img-element */

import { PortableText } from '@portabletext/react'
import { urlFor } from '../sanity/utils/imageUrlBuilder'
import { SanityImage, SanityVideo, PortableTextBlock } from '../types/sanity'
import { videoUrlFor } from '@/sanity/utils/videoUrlBuilder'

type LayoutVariant = 'layout-1' | 'layout-2' | 'layout-3'

type StaggeredImagesProps = { 
  heading?: string
  body?: PortableTextBlock[]
  mediaType1?: 'image' | 'video'
  image1?: SanityImage
  video1?: SanityVideo
  caption1?: string
  mediaType2?: 'image' | 'video'
  image2?: SanityImage
  video2?: SanityVideo
  caption2?: string
  mediaType3?: 'image' | 'video'
  image3?: SanityImage
  video3?: SanityVideo
  caption3?: string
  layout?: LayoutVariant
}

export default function StaggeredImages({ 
  heading, 
  body, 
  mediaType1 = 'image',
  image1, 
  video1,
  caption1,
  mediaType2 = 'image',
  image2, 
  video2,
  caption2,
  mediaType3 = 'image',
  image3, 
  video3,
  caption3,
  layout = 'layout-1' 
}: StaggeredImagesProps) {
  // Define layout-specific CSS classes
  const layoutClasses = {
    'layout-1': {
      layout: 'layout-1',
      row1Section1: 'col-6-12_lg',
      row1Section2: 'col-6-12_lg',
      row1Section3: 'hidden',
      row1Section4: 'hidden',
      row2Section1: 'col-7-12_lg col-1-5_sm',
      row2Section2: 'col-5-12_lg col-4-5_sm',
      row3Section1: 'col-3-12_lg col-2-5_sm',
      row3Section2: 'col-9-12_lg col-3-5_sm',
      row4Section1: 'col-4-12_lg col-1-5_sm',
      row4Section2: 'col-4-12_lg col-3-5_sm',
      row4Section3: 'col-4-12_lg col-1-5_sm',
    },
    'layout-2': {
      layout: 'layout-2',
      row1Section1: 'col-6-12_lg',
      row1Section2: 'col-1-12_lg',
      row1Section3: 'col-3-12_lg desktop',
      row1Section4: 'col-2-12_lg',
      row2Section1: 'col-7-12_lg col-3-5_sm',
      row2Section2: 'col-5-12_lg col-2-5_sm',
      row3Section1: 'col-5-12_lg col-2-5_sm',
      row3Section2: 'col-7-12_lg col-3-5_sm',
      row4Section1: 'col-8-12_lg col-2-5_sm',
      row4Section2: 'col-4-12_lg col-3-5_sm',
      row4Section3: 'hidden',
    },
    'layout-3': {
      layout: 'layout-3',
      row1Section1: 'col-6-12_lg',
      row1Section2: 'col-6-12_lg',
      row1Section3: 'hidden',
      row1Section4: 'hidden',
      row2Section1: 'col-8-12_lg col-2-5_sm',
      row2Section2: 'col-4-12_lg col-3-5_sm',
      row3Section1: 'col-5-12_lg col-3-5_sm',
      row3Section2: 'col-7-12_lg col-2-5_sm',
      row4Section1: 'col-6-12_lg col-3-5_sm',
      row4Section2: 'col-3-12_lg col-2-5_sm',
      row4Section3: 'col-3-12_lg desktop',
    }
  }

  const classes = layoutClasses[layout]

  // Helper function to render media (image or video)
  const renderMedia = (mediaType: 'image' | 'video', image: SanityImage | undefined, video: SanityVideo | undefined, className: string) => {
    if (mediaType === 'image' && image) {
      return (
        <>
          <img 
            data-src={urlFor(image).url()} 
            alt="" 
            className={`lazy ${className} full-bleed-image`}
            style={{
              objectPosition: image?.hotspot
                ? `${image.hotspot.x * 100}% ${image.hotspot.y * 100}%`
                : "center",
            }}
          />
          <div className="loading-overlay" />
        </>
      )
    } else if (mediaType === 'video' && video) {
      return (
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
      )
    }
    return null
  }

  return (
    <section className={`staggered-images-block h-pad ${classes.layout}`}>
      <div className="row-1 row-lg">
        <div className={`${classes.row1Section1} out-of-view`}>
          <div className="text-wrap">
            {heading && <div className="heading cta-font">{heading}</div>}
            {body && <h2><PortableText value={body} /></h2>}
          </div>
        </div>

        <div className={classes.row1Section2}></div>

        <div className={`relative ${classes.row1Section3} out-of-opacity`}>
          {(image1 || video1) && (
            <div className="media-1 media-wrap">
              {renderMedia(mediaType1, image1, video1, 'full-bleed-image')}
            </div>
          )}

          {caption1 && <div className="media-caption caption-font">{caption1}</div>}
        </div>

        <div className={classes.row1Section4}></div>
      </div>

      <div className="row-2 row-lg row-sm">
        <div className={classes.row2Section1}></div>

        <div className={`relative ${classes.row2Section2} out-of-opacity`}>
          {(image1 || video1) && (
            <div className="media-1 media-wrap">
              {renderMedia(mediaType1, image1, video1, 'full-bleed-image')}
            </div>
          )}

          {caption1 && <div className="media-caption caption-font">{caption1}</div>}
        </div>
      </div>

      <div className="row-3 row-lg row-sm">
        <div className={`relative ${classes.row3Section1} out-of-opacity`}>
          {(image2 || video2) && (
            <div className="media-2 media-wrap">
              {renderMedia(mediaType2, image2, video2, 'full-bleed-image')}
            </div>
          )}

          {caption2 && <div className="media-caption caption-font">{caption2}</div>}
        </div>

        <div className={classes.row3Section2}></div>
      </div>

      <div className="row-4 row-lg row-sm">
        <div className={classes.row4Section1}></div>

        <div className={`relative ${classes.row4Section2} out-of-opacity`}>
          {(image3 || video3) && (
            <div className="media-3 media-wrap">
              {renderMedia(mediaType3, image3, video3, 'regular')}
            </div>
          )}

          {caption3 && <div className="media-caption caption-font">{caption3}</div>}
        </div>

        <div className={classes.row4Section3}></div>
      </div>
    </section>
  )
}
