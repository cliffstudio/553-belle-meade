// src/app/studio/[[...index]]/page.tsx
'use client'
import { NextStudio } from 'next-sanity/studio'
import config from '../../../../sanity.config'

export default function StudioPage() {
  return (
    <NextStudio 
      config={config}
      // Disable strict mode to avoid React 19 compatibility issues
      unstable_disableStrictMode={true}
      // Add additional compatibility options
      unstable_noAuthBoundary={false}
    />
  )
}
