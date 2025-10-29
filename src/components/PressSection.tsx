import React from 'react'
import { clientNoCdn } from '../../sanity.client'
import { pressPostsQuery, randomTestimonialQuery } from '../sanity/lib/queries'
import PressLayout from './PressLayout'

interface PressSectionProps {
  // Props are passed from the CMS but not used in this component
  // The component fetches its own data instead
  [key: string]: unknown
}

const PressSection: React.FC<PressSectionProps> = async () => {
  // Use non-CDN client to ensure fresh content bypasses Sanity CDN caching
  const [allPosts, randomTestimonial] = await Promise.all([
    clientNoCdn.fetch(pressPostsQuery, {}, {
      next: { revalidate: 0 }
    }),
    clientNoCdn.fetch(randomTestimonialQuery, {}, {
      next: { revalidate: 0 }
    })
  ])

  return (
    <PressLayout
      allPosts={allPosts}
      randomTestimonial={randomTestimonial}
    />
  )
}

export default PressSection
