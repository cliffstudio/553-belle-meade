// heroMedia.ts
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'heroMedia',
  title: 'Hero Media',
  type: 'object',
  fields: [
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      initialValue: 'layout-1',
      options: { 
        list: [
          { title: 'Layout 1', value: 'layout-1' },
          { title: 'Layout 2', value: 'layout-2' },
          { title: 'Layout 3', value: 'layout-3' }
        ]
      }
    }),
    defineField({ 
      name: 'desktopTitle', 
      title: 'Title (Desktop)',
      type: 'string',
      hidden: ({ parent }) => parent?.layout !== 'layout-1' && parent?.layout !== 'layout-3'
    }),
    defineField({ 
      name: 'mobileTitle',
      title: 'Title (Mobile)',
      type: 'string',
      hidden: ({ parent }) => parent?.layout !== 'layout-1' && parent?.layout !== 'layout-3'
    }),
    defineField({
      name: 'backgroundMediaType',
      title: 'Background Media Type',
      type: 'string',
      initialValue: 'image',
      options: { 
        list: ['image','video'] 
      },
      hidden: ({ parent }) => parent?.layout !== 'layout-1'
    }),
    defineField({ 
      name: 'desktopBackgroundImage', 
      title: 'Background Image (Desktop)',
      type: 'image',
      hidden: ({ parent }) => parent?.layout !== 'layout-1' || parent?.backgroundMediaType !== 'image'
    }),
    defineField({ 
      name: 'mobileBackgroundImage', 
      title: 'Background Image (Mobile)',
      type: 'image',
      hidden: ({ parent }) => parent?.layout !== 'layout-1' || parent?.backgroundMediaType !== 'image'
    }),
    defineField({ 
      name: 'desktopBackgroundVideo', 
      title: 'Background Video (Desktop)',
      type: 'file', 
      options: {
        accept: 'video/*'
      },
      hidden: ({ parent }) => parent?.layout !== 'layout-1' || parent?.backgroundMediaType !== 'video'
    }),
    defineField({ 
      name: 'desktopBackgroundVideoPlaceholder', 
      title: 'Background Video Placeholder (Desktop)',
      type: 'image',
      hidden: ({ parent }) => parent?.layout !== 'layout-1' || parent?.backgroundMediaType !== 'video'
    }),
    defineField({ 
      name: 'mobileBackgroundVideo', 
      title: 'Background Video (Mobile)',
      type: 'file', 
      options: {
        accept: 'video/*'
      },
      hidden: ({ parent }) => parent?.layout !== 'layout-1' || parent?.backgroundMediaType !== 'video'
    }),
    defineField({ 
      name: 'mobileBackgroundVideoPlaceholder', 
      title: 'Background Video Placeholder (Mobile)',
      type: 'image',
      hidden: ({ parent }) => parent?.layout !== 'layout-1' || parent?.backgroundMediaType !== 'video'
    }),
    defineField({ 
      name: 'showControls',
      title: 'Show Video Controls',
      type: 'boolean', 
      initialValue: false,
      hidden: ({ parent }) => parent?.layout !== 'layout-1' || parent?.backgroundMediaType !== 'video'
    }),
    defineField({ 
      name: 'overlayDarkness', 
      title: 'Overlay Darkness',
      type: 'number', 
      description: '0–1', 
      initialValue: 0.3,
      hidden: ({ parent }) => parent?.layout !== 'layout-1'
    }),
    defineField({ 
      name: 'body',
      title: 'Body',
      type: 'richPortableText',
      hidden: ({ parent }) => parent?.layout !== 'layout-2'
    }),
    defineField({ 
      name: 'cta', 
      title: 'CTA',
      type: 'link',
      hidden: ({ parent }) => parent?.layout !== 'layout-2'
    }),
  ],
})
