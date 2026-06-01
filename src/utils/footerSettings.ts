import { cache } from 'react'
import { client } from '../../sanity.client'
import { globalLayoutQuery } from '../sanity/lib/queries'
import { SANITY_GLOBAL_REVALIDATE, sanityCacheTags } from '../sanity/lib/cache'
import { FooterSettings } from '../types/footerSettings'

export type Menu = {
  _id: string
  title: string
  items: {
    itemType: 'pageLink' | 'titleWithSubItems'
    pageLink?: {
      _id: string
      title?: string
      slug?: string
    }
    heading?: string
    subItems?: {
      pageLink: {
        _id: string
        title?: string
        slug?: string
      }
    }[]
  }[]
}

type GlobalLayoutData = {
  footer: FooterSettings | null
  leftMenu: Menu | null
  rightMenu: Menu | null
}

/**
 * Footer + both menus in one CDN-cached request. Dedupes within the same request.
 */
export const getGlobalLayout = cache(async (): Promise<GlobalLayoutData> => {
  try {
    return await client.fetch<GlobalLayoutData>(
      globalLayoutQuery,
      {},
      {
        next: {
          revalidate: SANITY_GLOBAL_REVALIDATE,
          tags: [sanityCacheTags.globalLayout],
        },
      },
    )
  } catch (error) {
    console.error('Error fetching global layout:', error)
    return { footer: null, leftMenu: null, rightMenu: null }
  }
})
