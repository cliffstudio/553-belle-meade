/* eslint-disable @next/next/no-img-element */
'use client'

import React from 'react'
import { PortableTextBlock, SanityImage } from '../types/sanity'
import { urlFor } from '../sanity/utils/imageUrlBuilder'

interface PressPost {
  _id: string
  title: string
  slug: { current: string }
  publishedAt: string
  thumbnailImage?: SanityImage
  thumbnailLogo?: SanityImage
  thumbnailBackgroundColour?: string
  excerpt?: string
  featuredImage?: SanityImage
  content?: PortableTextBlock[]
  source?: string
  sourceUrl?: string
  layout?: string
}

interface Testimonial {
  _id: string
  name: string
  source?: string
  backgroundColour?: string
}

interface PressLayoutProps {
  allPosts?: PressPost[]
  randomTestimonial?: Testimonial
}

const PressLayout: React.FC<PressLayoutProps> = ({
  allPosts = [],
  randomTestimonial
}) => {


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '.')
  }

  const renderTestimonialCard = (testimonial: Testimonial) => (
    <>
      <div className="source cta-font">{testimonial.source}</div>
      <h2 className="quote">&ldquo;{testimonial.name}&rdquo;</h2>
    </>
  )

  const renderPostCard = (post: PressPost) => (
    <>
      {post.thumbnailImage && (
        <div className="media-wrap relative out-of-opacity">
          <img 
          data-src={urlFor(post.thumbnailImage).url()} 
          alt="" 
          className="lazy full-bleed-image"
          />
          <div className="loading-overlay" />
        </div>
      )}

      {post.thumbnailLogo && (
        <div className="media-wrap logo-wrap" style={{ backgroundColor: post.thumbnailBackgroundColour }}>
          <img src={urlFor(post.thumbnailLogo).url()} alt={post.title} />
        </div>
      )}

      <div className="text-wrap">
        <div className="date cta-font">{formatDate(post.publishedAt)}</div>

        <h3 className="title">{post.title}</h3>

        {post.excerpt && <div>{post.excerpt}</div>}

        <div className="cta-font underline-link link">
          <a href={`/press/${post.slug.current}`} className="press-card__link">Learn More</a>

          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 27">
            <path d="M1 1L13.5 13.5L0.999999 26"/>
          </svg>
        </div>
      </div>
    </>
  )

  // Use the passed random testimonial
  const getRandomTestimonial = () => {
    return randomTestimonial
  }

  // Create the custom layout rows
  const createLayoutRows = () => {
    const rows = []
    const posts = [...allPosts]
    let postIndex = 0
    let postRowNumber = 1

    while (postIndex < posts.length) {
      // Calculate the row class number for posts (cycles 1-4)
      const rowClassNumber = ((postRowNumber - 1) % 4) + 1
      
      const firstPost = posts[postIndex]
      const secondPost = postIndex + 1 < posts.length ? posts[postIndex + 1] : null
      
      // Row patterns based on your specification
      let firstCols, spacerCols, secondCols
      
      if (rowClassNumber === 1) {
        // Row 1: 4 cols + 2 spacer + 6 cols
        firstCols = 4
        spacerCols = 2
        secondCols = 6
      } else if (rowClassNumber === 2) {
        // Row 2: 5 cols + 2 spacer + 5 cols
        firstCols = 5
        spacerCols = 2
        secondCols = 5
      } else if (rowClassNumber === 3) {
        // Row 3: 5 cols + 1 spacer + 6 cols
        firstCols = 5
        spacerCols = 1
        secondCols = 6
      } else if (rowClassNumber === 4) {
        // Row 4: 4 cols + 3 spacer + 5 cols
        firstCols = 4
        spacerCols = 3
        secondCols = 5
      }

      rows.push(
        <div key={`row-${postRowNumber}`} className={`press-row row-${rowClassNumber} row-lg h-pad`}>
          <div className={`col-${firstCols}-12_lg`}>
            <div className="press-card card-1 out-of-opacity">
              {renderPostCard(firstPost)}
            </div>
          </div>

          <div className={`col-${spacerCols}-12_lg desktop`}></div>

          {secondPost && (
            <div className={`col-${secondCols}-12_lg`}>
              <div className="press-card card-2 out-of-opacity">
                {renderPostCard(secondPost)}
              </div>
            </div>
          )}
        </div>
      )
      
      postIndex += 2
      postRowNumber++
    }
    
    // Add testimonial row after the first two post rows (at position 3)
    if (getRandomTestimonial() && posts.length >= 2) {
      rows.splice(2, 0, 
        <div key="testimonial-row" className="testimonial-row" style={{ backgroundColor: getRandomTestimonial()?.backgroundColour }}>
          <div className="row-lg h-pad">
            <div className="col-3-12_lg desktop"></div>

            <div className="col-6-12_lg out-of-opacity">
              {renderTestimonialCard(getRandomTestimonial()!)}
            </div>

            <div className="col-3-12_lg desktop"></div>
          </div>
        </div>
      )
    }
    
    return rows
  }

  return (
    <section className="press-layout">
      {createLayoutRows()}
    </section>
  )
}

export default PressLayout
