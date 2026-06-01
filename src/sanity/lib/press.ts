import { cache } from 'react'
import { client } from '../../../sanity.client'
import { pressPostQuery, pressPostsQuery } from './queries'
import { SANITY_GLOBAL_REVALIDATE, pressPostCacheTag, sanityCacheTags } from './cache'

/**
 * Cached press post fetch for published content. Dedupes within the same request.
 */
export const getPressPost = cache(async (slug: string) => {
  try {
    return await client.fetch(pressPostQuery, { slug }, {
      next: {
        revalidate: SANITY_GLOBAL_REVALIDATE,
        tags: [sanityCacheTags.pressPosts, pressPostCacheTag(slug)],
      },
    })
  } catch (error) {
    console.error(`Error fetching press post "${slug}":`, error)
    return null
  }
})

/**
 * All press posts (navigation / listing). Cached and shared across press pages.
 */
export const getPressPosts = cache(async () => {
  try {
    return await client.fetch(pressPostsQuery, {}, {
      next: {
        revalidate: SANITY_GLOBAL_REVALIDATE,
        tags: [sanityCacheTags.pressPosts],
      },
    })
  } catch (error) {
    console.error('Error fetching press posts:', error)
    return []
  }
})
