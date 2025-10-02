import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'fullWidthMedia',
  title: 'Full Width Media',
  type: 'object',
  fields: [
    defineField({ name: 'mediaType', type: 'string', initialValue: 'image',
      options: { list: ['image','video'] } }),
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
