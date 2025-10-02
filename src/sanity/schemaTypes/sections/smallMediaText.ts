// sections/smallMediaText.ts
import { defineType, defineField } from 'sanity'
export default defineType({
  name: 'smallMediaText',
  title: 'Text & Media',
  type: 'object',
  fields: [
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
