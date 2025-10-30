/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState, useMemo } from 'react'
import { SanityImage } from '../types/sanity'
import { urlFor } from '../sanity/utils/imageUrlBuilder'

interface Testimonial {
  _id: string
  name: string
  title?: string
  company?: string
  content: string
  image?: SanityImage
  rating?: number
  featured?: boolean
  date?: string
  order?: number
}

interface TestimonialsListProps {
  heading?: string
  subheading?: string
  layout?: 'grid' | 'carousel' | 'list'
  testimonialsPerPage?: number
  showRatings?: boolean
  showPhotos?: boolean
  featuredTestimonials?: Testimonial[]
  allTestimonials: Testimonial[]
}

const TestimonialsList: React.FC<TestimonialsListProps> = ({
  heading = 'Testimonials',
  subheading,
  layout = 'grid',
  testimonialsPerPage = 12,
  showRatings = true,
  showPhotos = true,
  featuredTestimonials = [],
  allTestimonials
}) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [currentSlide, setCurrentSlide] = useState(0)

  // Filter out featured testimonials from the main list
  const featuredIds = featuredTestimonials.map(t => t._id)
  const regularTestimonials = allTestimonials.filter(t => !featuredIds.includes(t._id))

  // Paginate testimonials
  const paginatedTestimonials = useMemo(() => {
    const startIndex = (currentPage - 1) * testimonialsPerPage
    return regularTestimonials.slice(startIndex, startIndex + testimonialsPerPage)
  }, [regularTestimonials, currentPage, testimonialsPerPage])

  const totalPages = Math.ceil(regularTestimonials.length / testimonialsPerPage)

  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    })
  }

  const renderStars = (rating?: number) => {
    if (!rating || !showRatings) return null
    return (
      <div className="testimonial-card__rating">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`testimonial-card__star ${i < rating ? 'testimonial-card__star--filled' : ''}`}
          >
            ★
          </span>
        ))}
      </div>
    )
  }

  const renderTestimonialCard = (testimonial: Testimonial, isFeatured = false) => (
    <article 
      key={testimonial._id} 
      className={`testimonial-card ${isFeatured ? 'testimonial-card--featured' : ''}`}
    >
      <div className="testimonial-card__content">
        {renderStars(testimonial.rating)}
        <blockquote className="testimonial-card__quote">
          &ldquo;{testimonial.content}&rdquo;
        </blockquote>
      </div>
      
      <div className="testimonial-card__author">
        {showPhotos && testimonial.image && (
          <div className="testimonial-card__photo">
            <img
              src={urlFor(testimonial.image).width(80).height(80).fit('crop').url()}
              alt={testimonial.name}
              loading="lazy"
            />
          </div>
        )}
        <div className="testimonial-card__author-info">
          <div className="testimonial-card__name">{testimonial.name}</div>
          {testimonial.title && (
            <div className="testimonial-card__title">{testimonial.title}</div>
          )}
          {testimonial.company && (
            <div className="testimonial-card__company">{testimonial.company}</div>
          )}
          {testimonial.date && (
            <div className="testimonial-card__date">{formatDate(testimonial.date)}</div>
          )}
        </div>
      </div>
    </article>
  )

  const renderCarousel = () => {
    const allItems = [...featuredTestimonials, ...paginatedTestimonials]
    const itemsPerSlide = 3
    const totalSlides = Math.ceil(allItems.length / itemsPerSlide)

    return (
      <div className="testimonials-carousel">
        <div className="testimonials-carousel__container">
          <div 
            className="testimonials-carousel__track"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {Array.from({ length: totalSlides }).map((_, slideIndex) => (
              <div key={slideIndex} className="testimonials-carousel__slide">
                {allItems
                  .slice(slideIndex * itemsPerSlide, (slideIndex + 1) * itemsPerSlide)
                  .map(testimonial => renderTestimonialCard(testimonial))}
              </div>
            ))}
          </div>
        </div>
        
        {totalSlides > 1 && (
          <div className="testimonials-carousel__controls">
            <button
              onClick={() => setCurrentSlide(prev => Math.max(prev - 1, 0))}
              disabled={currentSlide === 0}
              className="testimonials-carousel__btn"
            >
              ←
            </button>
            <span className="testimonials-carousel__indicator">
              {currentSlide + 1} of {totalSlides}
            </span>
            <button
              onClick={() => setCurrentSlide(prev => Math.min(prev + 1, totalSlides - 1))}
              disabled={currentSlide === totalSlides - 1}
              className="testimonials-carousel__btn"
            >
              →
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <section className="testimonials-list">
      <div className="testimonials-list__container">
        {heading && <h2 className="testimonials-list__heading">{heading}</h2>}
        {subheading && <p className="testimonials-list__subheading">{subheading}</p>}

        {/* Featured Testimonials */}
        {featuredTestimonials.length > 0 && layout !== 'carousel' && (
          <div className="testimonials-list__featured">
            <h3 className="testimonials-list__featured-heading">Featured Testimonials</h3>
            <div className="testimonials-list__featured-grid">
              {featuredTestimonials.map(testimonial => renderTestimonialCard(testimonial, true))}
            </div>
          </div>
        )}

        {/* Testimonials Display */}
        {layout === 'carousel' ? (
          renderCarousel()
        ) : (
          <>
            {/* Results count */}
            <div className="testimonials-list__results">
              <p>
                Showing {paginatedTestimonials.length} of {regularTestimonials.length} testimonials
              </p>
            </div>

            {/* Testimonials Grid/List */}
            <div className={`testimonials-list__testimonials testimonials-list__testimonials--${layout}`}>
              {paginatedTestimonials.map(testimonial => renderTestimonialCard(testimonial))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="testimonials-list__pagination">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="testimonials-list__pagination-btn"
                >
                  Previous
                </button>
                <span className="testimonials-list__pagination-info">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="testimonials-list__pagination-btn"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}

export default TestimonialsList
