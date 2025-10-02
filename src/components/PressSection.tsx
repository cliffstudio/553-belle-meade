import React from 'react'
import { client } from '../../sanity.client'
import { pressPostsQuery, randomTestimonialQuery } from '../sanity/lib/queries'
import PressLayout from './PressLayout'

interface PressSectionProps {
  // Props are passed from the CMS but not used in this component
  // The component fetches its own data instead
  [key: string]: unknown
}

const PressSection: React.FC<PressSectionProps> = async () => {
  // Fetch all press posts and a random testimonial
  const [allPosts, randomTestimonial] = await Promise.all([
    client.fetch(pressPostsQuery),
    client.fetch(randomTestimonialQuery)
  ])

  return (
    <PressLayout
      allPosts={allPosts}
      randomTestimonial={randomTestimonial}
    />
  )
}

export default PressSection
