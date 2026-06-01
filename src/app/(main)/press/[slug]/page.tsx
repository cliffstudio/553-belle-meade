import { notFound } from 'next/navigation'
import { client } from '../../../../../sanity.client'
import PressPost from '../../../../components/PressPost'
import BodyClassProvider from '../../../../components/BodyClassProvider'
import type { Metadata } from 'next'
import { buildMetadata } from '../../../../utils/metadata'
import { getPressPost, getPressPosts } from '../../../../sanity/lib/press'

interface PressPostPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const posts = await client.fetch(`
    *[_type == "press"] {
      "slug": slug.current
    }
  `)

  return posts.map((post: { slug: string }) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: PressPostPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const post = await getPressPost(resolvedParams.slug)

  if (!post) {
    return {}
  }

  return buildMetadata(post.seo, post.title)
}

export default async function PressPostPage({ params }: PressPostPageProps) {
  const resolvedParams = await params

  const [post, allPosts] = await Promise.all([
    getPressPost(resolvedParams.slug),
    getPressPosts(),
  ])

  if (!post) {
    notFound()
  }

  const currentIndex = allPosts.findIndex((p: { slug: { current: string } }) => p.slug.current === resolvedParams.slug)
  const nextPost = currentIndex !== -1 && currentIndex < allPosts.length - 1
    ? allPosts[currentIndex + 1]
    : allPosts[0]

  return (
    <>
      <BodyClassProvider
        pageType="press-post"
        slug={post.slug?.current}
      />
      <PressPost
        {...post}
        nextPostSlug={nextPost?.slug?.current}
        nextPostTitle={nextPost?.title}
      />
    </>
  )
}
