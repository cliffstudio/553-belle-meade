import type { Metadata } from 'next'
import { clientNoCdn } from '../../sanity.client'
import { metadataQuery } from '../sanity/lib/queries'
import { urlFor } from '../sanity/utils/imageUrlBuilder'

interface PageMetadata {
  title?: string
  description?: string
  keywords?: string
  socialimage?: {
    asset?: {
      _ref: string
      _type: string
    }
    hotspot?: unknown
    crop?: unknown
  }
}

interface GlobalMetadata {
  title?: string
  description?: string
  keywords?: string
  socialimage?: {
    asset?: {
      _ref: string
      _type: string
    }
    hotspot?: unknown
    crop?: unknown
  }
}

/**
 * Builds metadata for a page, falling back to global metadata if page-specific metadata is not available
 */
export async function buildMetadata(pageMetadata?: PageMetadata | null): Promise<Metadata> {
  // Fetch global metadata as fallback
  const globalMetadata: GlobalMetadata | null = await clientNoCdn.fetch(metadataQuery, {}, {
    next: { revalidate: 0 }
  })

  // Use page-specific metadata if available, otherwise fall back to global
  const title = pageMetadata?.title || globalMetadata?.title
  const description = pageMetadata?.description || globalMetadata?.description
  const keywords = pageMetadata?.keywords || globalMetadata?.keywords
  const socialimage = pageMetadata?.socialimage || globalMetadata?.socialimage

  // Build social image URL if available
  let socialImageUrl: string | undefined
  if (socialimage?.asset?._ref) {
    socialImageUrl = urlFor(socialimage).width(1200).height(630).url()
  }

  return {
    title,
    description,
    keywords,
    authors: [{ name: 'Belle Meade Village' }],
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'en_US',
      ...(socialImageUrl && { images: [socialImageUrl] }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(socialImageUrl && { images: [socialImageUrl] }),
    },
  }
}
