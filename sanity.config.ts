/**
 * Sanity Studio config. Studio is mounted at the /studio URL route (see src/app/studio/[[...index]]/page.tsx).
 * basePaths must have the same number of segments: /studio/production and /studio/staging.
 * Redirect /studio → /studio/production in vercel.json so the short URL still works.
 */

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

import {apiVersion, projectId} from './src/sanity/env'
import {schemaTypes} from './src/sanity/schemaTypes'
import {structure} from './src/sanity/structure'

const sharedConfig = {
  schema: {
    types: schemaTypes,
  },
  plugins: [
    structureTool({structure}),
    visionTool({defaultApiVersion: apiVersion}),
  ],
}

export default defineConfig([
  {
    name: 'production',
    title: 'Production',
    projectId,
    dataset: 'production',
    basePath: '/studio/production',
    ...sharedConfig,
  },
  {
    name: 'staging',
    title: 'Staging',
    projectId,
    dataset: 'staging',
    basePath: '/studio/staging',
    ...sharedConfig,
  },
])
