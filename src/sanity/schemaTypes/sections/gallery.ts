// sections/gallery.ts
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'gallery',
  title: 'Gallery',
  type: 'object',
  fields: [
    defineField({ 
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'imageWithCaption',
          title: 'Image',
          fields: [
            {
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true }
            },
            {
              name: 'caption',
              title: 'Caption',
              type: 'string'
            },
            {
              name: 'imageSize',
              title: 'Image Size',
              type: 'string',
              options: {
                list: [
                  { title: '16:9', value: '16:9' },
                  { title: '1:1', value: '1:1' },
                  { title: '4:3', value: '4:3' },
                  { title: '2:3', value: '2:3' },
                ]
              },
            },
          ],
          preview: {
            select: {
              title: 'image.asset.title',
              subtitle: 'image.asset.originalFilename',
              media: 'image'
            },
            prepare(selection) {
              const { title, subtitle, media } = selection
              return {
                title: title || subtitle || 'Untitled Image',
                subtitle: title && subtitle ? subtitle : null,
                media: media
              }
            }
          }
        }
      ]
    }),
  ],
})
