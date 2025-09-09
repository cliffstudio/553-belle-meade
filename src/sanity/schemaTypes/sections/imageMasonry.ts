// imageMasonry.ts
import { defineType, defineField } from 'sanity'
export default defineType({
  name: 'imageMasonry',
  title: 'Image Masonry',
  type: 'object',
  fields: [
    defineField({ name: 'heading', type: 'string' }),
    defineField({ name: 'body', type: 'richPortableText' }),
    defineField({ name: 'cta', title: 'CTA', type: 'link' }),
    defineField({ 
      name: 'mediaType1', 
      title: 'Media Type',
      type: 'string', 
      initialValue: 'image',
      options: { list: ['image','video'] },
      fieldset: 'media1'
    }),
    defineField({ 
      name: 'image1', 
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.mediaType1 !== 'image',
      fieldset: 'media1'
    }),
    defineField({ 
      name: 'video1', 
      title: 'Video',
      type: 'file', 
      options: { 
        accept: 'video/*' 
      },
      hidden: ({ parent }) => parent?.mediaType1 !== 'video',
      fieldset: 'media1'
    }),
    defineField({ 
      name: 'mediaType2',
      title: 'Media Type',
      type: 'string', 
      initialValue: 'image',
      options: { list: ['image','video'] },
      fieldset: 'media2'
    }),
    defineField({ 
      name: 'image2', 
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.mediaType2 !== 'image',
      fieldset: 'media2'
    }),
    defineField({ 
      name: 'video2', 
      title: 'Video',
      type: 'file', 
      options: { 
        accept: 'video/*' 
      },
      hidden: ({ parent }) => parent?.mediaType2 !== 'video',
      fieldset: 'media2'
    }),
  ],
  fieldsets: [
    {
      name: 'media1',
      title: 'Media 1',
      options: { collapsible: true, collapsed: false }
    },
    {
      name: 'media2',
      title: 'Media 2',
      options: { collapsible: true, collapsed: false }
    }
  ]
})
