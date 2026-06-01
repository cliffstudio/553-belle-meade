/** Shared Next.js fetch cache options for rarely-changing Sanity content. */
export const SANITY_GLOBAL_REVALIDATE = 300

export const sanityCacheTags = {
  siteSettings: 'site-settings',
  globalLayout: 'global-layout',
  pages: 'pages',
  pressPosts: 'press-posts',
  signInConfig: 'sign-in-config',
} as const

export function pageCacheTag(slug: string) {
  return `page-${slug}` as const
}

export function pressPostCacheTag(slug: string) {
  return `press-${slug}` as const
}

export function isAllowedRevalidateTag(tag: string): boolean {
  if ((Object.values(sanityCacheTags) as string[]).includes(tag)) {
    return true
  }
  return tag.startsWith('page-') || tag.startsWith('press-')
}
