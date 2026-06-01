'use client'

import { usePathname } from 'next/navigation'
import { useLayoutEffect } from 'react'

function getPageClass(pathname: string) {
  const cleanPath = pathname.replace(/^\/|\/$/g, '').replace(/\//g, '-')
  if (cleanPath === '') return 'page-home'
  return `page-${cleanPath}`
}

/** Pathname-based template class for SSR; BodyClassProvider syncs the accurate value on the client. */
function getPageTypeFromPathname(pathname: string) {
  if (pathname === '/' || pathname === '') return 'home'
  if (pathname.startsWith('/press/')) return 'press-post'
  const segment = pathname.replace(/^\//, '').split('/')[0]
  return segment || 'home'
}

export default function MainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  const pageTypeClass = `page-template-${getPageTypeFromPathname(pathname)}`

  return (
    <main className={`${getPageClass(pathname)} ${pageTypeClass}`}>
      {children}
    </main>
  )
}
