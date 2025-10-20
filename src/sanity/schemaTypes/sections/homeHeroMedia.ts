// heroMedia.ts
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'homeHeroMedia',
  title: 'Home Hero Media',
  type: 'object',
  fields: [
    defineField({ name: 'introText', type: 'richPortableText' }),
    defineField({
      name: 'backgroundMediaType',
      title: 'Background Media Type',
      type: 'string',
      options: { 
        list: ['image','video'] 
      }
    }),
    defineField({ 
      name: 'desktopBackgroundImage',
      title: 'Background Image (Desktop)',
      type: 'image',
      hidden: ({ parent }) => parent?.backgroundMediaType !== 'image'
    }),
    defineField({ 
      name: 'mobileBackgroundImage',
      title: 'Background Image (Mobile)',
      type: 'image',
      hidden: ({ parent }) => parent?.backgroundMediaType !== 'image'
    }),
    defineField({ 
      name: 'desktopBackgroundVideo', 
      title: 'Background Video (Desktop)',
      type: 'file', 
      options: {
        accept: 'video/*'
      },
      hidden: ({ parent }) => parent?.backgroundMediaType !== 'video'
    }),
    defineField({ 
      name: 'desktopBackgroundVideoPlaceholder', 
      title: 'Background Video Placeholder (Desktop)',
      type: 'image',
      hidden: ({ parent }) => parent?.backgroundMediaType !== 'video'
    }),
    defineField({ 
      name: 'mobileBackgroundVideo', 
      title: 'Background Video (Mobile)',
      type: 'file', 
      options: {
        accept: 'video/*'
      },
      hidden: ({ parent }) => parent?.backgroundMediaType !== 'video'
    }),
    defineField({ 
      name: 'mobileBackgroundVideoPlaceholder', 
      title: 'Background Video Placeholder (Mobile)',
      type: 'image',
      hidden: ({ parent }) => parent?.backgroundMediaType !== 'video'
    }),
    defineField({ 
      name: 'showControls', 
      title: 'Show Video Controls',
      type: 'boolean', 
      initialValue: false,
      hidden: ({ parent }) => parent?.backgroundMediaType !== 'video'
    }),
    defineField({ 
      name: 'overlayDarkness', 
      title: 'Overlay Darkness',
      type: 'number', 
      description: '0–1', 
      initialValue: 0.3,
    }),
  ],
})
