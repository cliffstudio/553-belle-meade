// src/app/(main)/[...slug]/page.tsx
import DynamicPage from '../../../components/DynamicPage'
import { client } from '../../../../sanity.client'
import { pageSlugsQuery } from '../../../sanity/lib/queries'
import { getPage } from '../../../sanity/lib/pages'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { buildMetadata } from '../../../utils/metadata'

interface PageProps {
  params: Promise<{
    slug: string[]
  }>
}

export async function generateStaticParams() {
  const pages = await client.fetch(pageSlugsQuery)

  return pages
    .filter((page: { slug: { current: string } }) => {
      return !page.slug.current.startsWith('press/') || page.slug.current === 'press'
    })
    .map((page: { slug: { current: string } }) => ({
      slug: page.slug.current.split('/'),
    }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const slug = resolvedParams.slug.join('/')

  if (slug.startsWith('press/') && slug !== 'press') {
    return {}
  }

  const page = await getPage(slug)

  if (!page) {
    return {}
  }

  return buildMetadata(page.seo, page.title)
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params
  const slug = resolvedParams.slug.join('/')

  if (slug.startsWith('press/') && slug !== 'press') {
    return notFound()
  }

  return <DynamicPage params={Promise.resolve({ slug })} />
}
