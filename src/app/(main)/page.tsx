import DynamicPage from '../../components/DynamicPage'
import { getSession } from '@/sanity/utils/auth'
import { redirect } from 'next/navigation'

// Disable static generation for this page to ensure fresh content from Sanity
export const revalidate = 0

export default async function Home() {
  const session = await getSession()

  if (!session.isAuthenticated) {
    redirect("/sign-in?redirect=/")
  }
  
  // Render the page with slug "/home" using the general page template
  return <DynamicPage params={Promise.resolve({ slug: 'home' })} />
}
