import DynamicPage from '../../components/DynamicPage'
import { getSession } from '@/sanity/utils/auth'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { getPage, getSignInPageEnabled } from '../../sanity/lib/pages'
import { buildMetadata } from '../../utils/metadata'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('home')
  return buildMetadata(page?.seo, page?.title)
}

export default async function Home() {
  const session = await getSession()

  if (!session.isAuthenticated) {
    const signInEnabled = await getSignInPageEnabled()
    if (signInEnabled) {
      redirect("/sign-in?redirect=/")
    }
  }

  return <DynamicPage params={Promise.resolve({ slug: 'home' })} />
}
