'use client'

import { useEffect, useLayoutEffect } from 'react'

function syncMainTemplateClass(pageType: string) {
  const main = document.querySelector('main')
  if (!main) return

  for (const cls of [...main.classList]) {
    if (cls.startsWith('page-template-')) {
      main.classList.remove(cls)
    }
  }
  main.classList.add(`page-template-${pageType}`)
}

interface BodyClassProviderProps {
  pageType?: string
  slug?: string
  className?: string
}

export default function BodyClassProvider({ 
  pageType, 
  slug, 
  className 
}: BodyClassProviderProps) {
  useLayoutEffect(() => {
    if (pageType) {
      syncMainTemplateClass(pageType)
    }
  }, [pageType])

  useEffect(() => {
    // Remove any existing page-specific classes
    const existingClasses = document.body.className
      .split(' ')
      .filter(cls => 
        cls.startsWith('page-type-') || 
        cls.startsWith('page-slug-') ||
        cls.startsWith('page-')
      )
    
    existingClasses.forEach(cls => {
      document.body.classList.remove(cls)
    })

    // Add new page-specific classes
    if (pageType) {
      document.body.classList.add(`page-type-${pageType}`)
      // Add specific class for carousel page to enable ScrollTrigger functionality
      if (pageType === 'carousel') {
        document.body.classList.add('page-carousel')
      }

      if (pageType === 'heritage') {
        document.body.classList.add('page-heritage')
      }
    }
    
    if (slug) {
      // Convert slug to class-safe format (replace slashes and special chars with hyphens)
      const slugClass = slug.replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
      if (slugClass) {
        document.body.classList.add(`page-slug-${slugClass}`)
      }
    }

    // Add any additional custom classes
    if (className) {
      className.split(' ').forEach(cls => {
        if (cls.trim()) {
          document.body.classList.add(cls.trim())
        }
      })
    }

    // Cleanup function to remove classes when component unmounts
    return () => {
      if (pageType) {
        document.body.classList.remove(`page-type-${pageType}`)
        if (pageType === 'carousel') {
          document.body.classList.remove('page-carousel')
        }
      }
      if (slug) {
        const slugClass = slug.replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
        if (slugClass) {
          document.body.classList.remove(`page-slug-${slugClass}`)
        }
      }
      if (className) {
        className.split(' ').forEach(cls => {
          if (cls.trim()) {
            document.body.classList.remove(cls.trim())
          }
        })
      }
    }
  }, [pageType, slug, className])

  return null
}
