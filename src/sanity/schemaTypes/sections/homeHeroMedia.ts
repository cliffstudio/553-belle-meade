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
      type: 'string',
      options: { 
        list: ['image','video'] 
      }
    }),
    defineField({ 
      name: 'desktopBackgroundImage', 
      type: 'image',
      hidden: ({ parent }) => parent?.backgroundMediaType !== 'image'
    }),
    defineField({ 
      name: 'mobileBackgroundImage', 
      type: 'image',
      hidden: ({ parent }) => parent?.backgroundMediaType !== 'image'
    }),
    defineField({ 
      name: 'desktopBackgroundVideo', 
      type: 'file', 
      options: {
        accept: 'video/*'
      },
      hidden: ({ parent }) => parent?.backgroundMediaType !== 'video'
    }),
    defineField({ 
      name: 'mobileBackgroundVideo', 
      type: 'file', 
      options: {
        accept: 'video/*'
      },
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
      type: 'number', 
      description: '0–1', 
      initialValue: 0.3,
    }),
  ],
})
