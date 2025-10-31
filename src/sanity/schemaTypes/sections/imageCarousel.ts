// sections/imageCarousel.ts
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'imageCarousel',
  title: 'Image Carousel',
  type: 'object',
  fields: [
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
              description: 'Please upload image files under 500MB',
              options: { hotspot: true },
              validation: (Rule) => Rule.custom(async (file, context) => {
                if (!file?.asset?._ref) {
                  return true;
                }
                
                const maxSize = 500 * 1024 * 1024; // 500MB
                
                try {
                  const client = context.getClient({ apiVersion: '2025-05-08' })
                  const asset = await client.fetch('*[_id == $id][0]', { id: file.asset._ref })
                  
                  if (asset && asset.size && asset.size > maxSize) {
                    return 'File size must be under 500MB';
                  }
                } catch {
                  // If we can't fetch the asset yet (e.g., during upload), skip validation
                }
                
                return true;
              })
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
