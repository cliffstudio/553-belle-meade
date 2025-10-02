// staggeredImages.ts
import { defineType, defineField } from 'sanity'
export default defineType({
  name: 'staggeredImages',
  title: 'Staggered Images',
  type: 'object',
  fields: [
    defineField({ name: 'heading', type: 'string' }),
    defineField({ name: 'body', type: 'richPortableText' }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Layout 1', value: 'layout-1' },
          { title: 'Layout 2', value: 'layout-2' },
          { title: 'Layout 3', value: 'layout-3' }
        ]
      },
      initialValue: 'layout-1'
    }),
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
      name: 'caption1', 
      title: 'Caption',
      type: 'string',
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
    defineField({ 
      name: 'caption2', 
      title: 'Caption',
      type: 'string',
      fieldset: 'media2'
    }),
    defineField({ 
      name: 'mediaType3',
      title: 'Media Type',
      type: 'string', 
      initialValue: 'image',
      options: { list: ['image','video'] },
      fieldset: 'media3'
    }),
    defineField({ 
      name: 'image3', 
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.mediaType3 !== 'image',
      fieldset: 'media3'
    }),
    defineField({ 
      name: 'video3', 
      title: 'Video',
      type: 'file', 
      options: { 
        accept: 'video/*' 
      },
      hidden: ({ parent }) => parent?.mediaType3 !== 'video',
      fieldset: 'media3'
    }),
    defineField({ 
      name: 'caption3', 
      title: 'Caption',
      type: 'string',
      fieldset: 'media3'
    }),
  ],
  fieldsets: [
    {
      name: 'media1',
      title: 'Media Tile 1',
      options: { collapsible: true, collapsed: false }
    },
    {
      name: 'media2',
      title: 'Media Tile 2',
      options: { collapsible: true, collapsed: false }
    },
    {
      name: 'media3',
      title: 'Media Tile 3',
      options: { collapsible: true, collapsed: false }
    }
  ],
})
