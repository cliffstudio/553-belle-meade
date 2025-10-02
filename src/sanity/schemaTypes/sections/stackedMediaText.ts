// sections/stackedMediaText.ts
import { defineType, defineField } from 'sanity'
export default defineType({
  name: 'stackedMediaText',
  title: 'Text & Media',
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
        ]
      }
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string'
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'richPortableText'
    }),
    defineField({ 
      name: 'cta', 
      title: 'CTA',
      type: 'link'
    }),
    defineField({ 
      name: 'mediaType',
      title: 'Media Type',
      type: 'string',
      initialValue: 'image',
      options: { list: ['image','video'] }
    }),
    defineField({
      name: 'image',
      type: 'image',
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.mediaType !== 'image'
    }),
    defineField({ 
      name: 'video',
      type: 'file',
      options: {
        accept: 'video/*'
      },
      hidden: ({ parent }) => parent?.mediaType !== 'video'
    }),
    defineField({ 
      name: 'showControls',
      title: 'Show Video Controls',
      type: 'boolean',
      initialValue: false,
      hidden: ({ parent }) => parent?.mediaType !== 'video'
    }),
  ],
})
