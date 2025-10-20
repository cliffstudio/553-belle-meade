// linkTiles.ts
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'linkTiles',
  title: 'Link Tiles',
  type: 'object',
  fields: [
    defineField({
      name: 'numberOfTiles',
      title: 'Number of Tiles',
      type: 'number',
      validation: (Rule) => Rule.min(2).max(7),
      options: {
        list: [
          { title: '2 Tiles', value: 2 },
          { title: '3 Tiles', value: 3 },
          { title: '4 Tiles', value: 4 },
          { title: '5 Tiles', value: 5 },
          { title: '6 Tiles', value: 6 },
          { title: '7 Tiles', value: 7 },
        ]
      }
    }),
    defineField({
      name: 'linkTile1',
      title: 'Link Tile 1',
      type: 'object',
      hidden: ({ parent }) => !parent?.numberOfTiles || parent.numberOfTiles < 1,
      fields: [
        defineField({ 
          name: 'mediaType', 
          title: 'Media Type',
          type: 'string', 
          initialValue: 'image',
          options: { list: ['image','video'] } 
        }),
        defineField({ 
          name: 'image', 
          title: 'Image',
          type: 'image',
          options: { hotspot: true },
          hidden: ({ parent }) => parent?.mediaType !== 'image'
        }),
        defineField({ 
          name: 'video', 
          title: 'Video',
          type: 'file', 
          options: { 
            accept: 'video/*' 
          },
          hidden: ({ parent }) => parent?.mediaType !== 'video'
        }),
        defineField({ 
          name: 'cta', 
          title: 'CTA',
          type: 'link' 
        }),
      ]
    }),
    defineField({
      name: 'linkTile2',
      title: 'Link Tile 2',
      type: 'object',
      hidden: ({ parent }) => !parent?.numberOfTiles || parent.numberOfTiles < 2,
      fields: [
        defineField({ 
          name: 'mediaType', 
          title: 'Media Type',
          type: 'string', 
          initialValue: 'image',
          options: { list: ['image','video'] } 
        }),
        defineField({ 
          name: 'image', 
          title: 'Image',
          type: 'image',
          options: { hotspot: true },
          hidden: ({ parent }) => parent?.mediaType !== 'image'
        }),
        defineField({ 
          name: 'video', 
          title: 'Video',
          type: 'file', 
          options: { 
            accept: 'video/*' 
          },
          hidden: ({ parent }) => parent?.mediaType !== 'video'
        }),
        defineField({
          name: 'cta', 
          title: 'CTA',
          type: 'link' 
        }),
      ]
    }),
    defineField({
      name: 'linkTile3',
      title: 'Link Tile 3',
      type: 'object',
      hidden: ({ parent }) => !parent?.numberOfTiles || parent.numberOfTiles < 3,
      fields: [
        defineField({ 
          name: 'mediaType', 
          title: 'Media Type',
          type: 'string', 
          initialValue: 'image',
          options: { list: ['image','video'] } 
        }),
        defineField({ 
          name: 'image', 
          title: 'Image',
          type: 'image',
          options: { hotspot: true },
          hidden: ({ parent }) => parent?.mediaType !== 'image'
        }),
        defineField({ 
          name: 'video', 
          title: 'Video',
          type: 'file', 
          options: { 
            accept: 'video/*' 
          },
          hidden: ({ parent }) => parent?.mediaType !== 'video'
        }),
        defineField({
          name: 'cta', 
          title: 'CTA',
          type: 'link' 
        }),
      ]
    }),
    defineField({
      name: 'linkTile4',
      title: 'Link Tile 4',
      type: 'object',
      hidden: ({ parent }) => !parent?.numberOfTiles || parent.numberOfTiles < 4,
      fields: [
        defineField({ 
          name: 'mediaType', 
          title: 'Media Type',
          type: 'string', 
          initialValue: 'image',
          options: { list: ['image','video'] } 
        }),
        defineField({ 
          name: 'image', 
          title: 'Image',
          type: 'image',
          options: { hotspot: true },
          hidden: ({ parent }) => parent?.mediaType !== 'image'
        }),
        defineField({ 
          name: 'video', 
          title: 'Video',
          type: 'file', 
          options: { 
            accept: 'video/*' 
          },
          hidden: ({ parent }) => parent?.mediaType !== 'video'
        }),
        defineField({
          name: 'cta', 
          title: 'CTA',
          type: 'link' 
        }),
      ]
    }),
    defineField({
      name: 'linkTile5',
      title: 'Link Tile 5',
      type: 'object',
      hidden: ({ parent }) => !parent?.numberOfTiles || parent.numberOfTiles < 5,
      fields: [
        defineField({ 
          name: 'mediaType', 
          title: 'Media Type',
          type: 'string', 
          initialValue: 'image',
          options: { list: ['image','video'] } 
        }),
        defineField({ 
          name: 'image',  
          title: 'Image',
          type: 'image',
          options: { hotspot: true },
          hidden: ({ parent }) => parent?.mediaType !== 'image'
        }),
        defineField({ 
          name: 'video', 
          title: 'Video',
          type: 'file', 
          options: { 
            accept: 'video/*' 
          },
          hidden: ({ parent }) => parent?.mediaType !== 'video'
        }),
        defineField({
          name: 'cta', 
          title: 'CTA',
          type: 'link' 
        }),
      ]
    }),
    defineField({
      name: 'linkTile6',
      title: 'Link Tile 6',
      type: 'object',
      hidden: ({ parent }) => !parent?.numberOfTiles || parent.numberOfTiles < 6,
      fields: [
        defineField({ 
          name: 'mediaType', 
          title: 'Media Type',
          type: 'string', 
          initialValue: 'image',
          options: { list: ['image','video'] } 
        }),
        defineField({ 
          name: 'image',   
          title: 'Image',
          type: 'image',
          options: { hotspot: true },
          hidden: ({ parent }) => parent?.mediaType !== 'image'
        }),
        defineField({ 
          name: 'video', 
          title: 'Video',
          type: 'file', 
          options: { 
            accept: 'video/*' 
          },
          hidden: ({ parent }) => parent?.mediaType !== 'video'
        }),
        defineField({ 
          name: 'cta', 
          title: 'CTA',
          type: 'link' 
        }),
      ]
    }),
    defineField({
      name: 'linkTile7',
      title: 'Link Tile 7',
      type: 'object',
      hidden: ({ parent }) => !parent?.numberOfTiles || parent.numberOfTiles < 7,
      fields: [
        defineField({ 
          name: 'mediaType', 
          title: 'Media Type',
          type: 'string', 
          initialValue: 'image',
          options: { list: ['image','video'] } 
        }),
        defineField({ 
          name: 'image', 
          title: 'Image',
          type: 'image',
          options: { hotspot: true },
          hidden: ({ parent }) => parent?.mediaType !== 'image'
        }),
        defineField({ 
          name: 'video', 
          title: 'Video',
          type: 'file', 
          options: { 
            accept: 'video/*' 
          },
          hidden: ({ parent }) => parent?.mediaType !== 'video'
        }),
        defineField({ 
          name: 'cta', 
          title: 'CTA',
          type: 'link' 
        }),
      ]
    }),
  ],
  preview: {
    select: {
      numberOfTiles: 'numberOfTiles'
    },
    prepare({ numberOfTiles }) {
      return {
        title: `Link Tiles (${numberOfTiles} tiles)`
      }
    }
  }
})
