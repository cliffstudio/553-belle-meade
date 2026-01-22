import type { Metadata } from 'next'
import { urlFor } from '../sanity/utils/imageUrlBuilder'

interface PageSEO {
  metaTitle?: string
  metaDescription?: string
  socialImage?: {
    asset?: {
      _ref: string
      _type: string
    }
    hotspot?: unknown
    crop?: unknown
  }
}

/**
 * Builds metadata for a page using page-specific SEO fields
 */
export async function buildMetadata(pageSEO?: PageSEO | null): Promise<Metadata> {
  const title = pageSEO?.metaTitle
  const description = pageSEO?.metaDescription

  // Build social image URL if available
  let socialImageUrl: string | undefined
  if (pageSEO?.socialImage?.asset?._ref) {
    socialImageUrl = urlFor(pageSEO.socialImage).width(1200).height(630).url()
  }

  return {
    ...(title && { title }),
    ...(description && { description }),
    authors: [{ name: 'Belle Meade Village' }],
    openGraph: {
      ...(title && { title }),
      ...(description && { description }),
      type: 'website',
      locale: 'en_US',
      ...(socialImageUrl && { images: [socialImageUrl] }),
    },
    twitter: {
      card: 'summary_large_image',
      ...(title && { title }),
      ...(description && { description }),
      ...(socialImageUrl && { images: [socialImageUrl] }),
    },
  }
}
