import { cache } from 'react'
import { client } from '../../../sanity.client'
import { pageQuery, signInPageEnabledQuery } from './queries'
import { SANITY_GLOBAL_REVALIDATE, pageCacheTag, sanityCacheTags } from './cache'

const pageFetchOptions = (slug: string) => ({
  next: {
    revalidate: SANITY_GLOBAL_REVALIDATE,
    tags: [sanityCacheTags.pages, pageCacheTag(slug)],
  },
})

/**
 * Cached page fetch for published content. Dedupes within the same request.
 */
export const getPage = cache(async (slug: string) => {
  try {
    return await client.fetch(pageQuery, { slug }, pageFetchOptions(slug))
  } catch (error) {
    console.error(`Error fetching page "${slug}":`, error)
    return null
  }
})

/**
 * Whether the CMS sign-in page is enabled (used for auth redirects).
 */
export const getSignInPageEnabled = cache(async (): Promise<boolean> => {
  try {
    const enabled = await client.fetch<boolean | null>(
      signInPageEnabledQuery,
      {},
      {
        next: {
          revalidate: SANITY_GLOBAL_REVALIDATE,
          tags: [sanityCacheTags.signInConfig, pageCacheTag('sign-in')],
        },
      },
    )
    return Boolean(enabled)
  } catch (error) {
    console.error('Error fetching sign-in page enabled flag:', error)
    return false
  }
})
