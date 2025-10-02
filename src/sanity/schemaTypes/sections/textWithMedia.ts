// sections/textWithMedia.ts
import { defineType, defineField } from 'sanity'
export default defineType({
  name: 'textWithMedia',
  title: 'Text with Media',
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
    defineField({ name: 'heading', type: 'string' }),
    defineField({ name: 'body', type: 'richPortableText' }),
    defineField({ 
      name: 'cta', 
      title: 'CTA',
      type: 'link' 
    }),
    defineField({ 
      name: 'mediaType', 
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
  ],
})
