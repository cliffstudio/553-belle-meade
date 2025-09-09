// src/app/(main)/[...slug]/page.tsx
import DynamicPage from '../../../components/DynamicPage'
import { client } from '../../../../sanity.client'
import { pageSlugsQuery } from '../../../sanity/utils/pageQueries'

interface PageProps {
  params: Promise<{
    slug: string[]
  }>
}

export async function generateStaticParams() {
  const pages = await client.fetch(pageSlugsQuery)
  
  return pages.map((page: { slug: { current: string } }) => ({
    slug: page.slug.current.split('/'),
  }))
}

export default async function Page({ params }: PageProps) {
  // Convert array to string for the slug
  const resolvedParams = await params
  const slug = resolvedParams.slug.join('/')
  
  return <DynamicPage params={Promise.resolve({ slug })} />
}
