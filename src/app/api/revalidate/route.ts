import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { isAllowedRevalidateTag } from '@/sanity/lib/cache'

/**
 * On-demand revalidation for cached Sanity globals.
 * POST /api/revalidate?secret=...&tag=global-layout
 */
export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')
  const tag = request.nextUrl.searchParams.get('tag')

  if (!process.env.SANITY_REVALIDATE_SECRET || secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  if (!tag || !isAllowedRevalidateTag(tag)) {
    return NextResponse.json({ message: 'Invalid tag' }, { status: 400 })
  }

  revalidateTag(tag)

  return NextResponse.json({ revalidated: true, tag })
}
