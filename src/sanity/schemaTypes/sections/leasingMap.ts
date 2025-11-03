// sections/leasingMap.ts
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'leasingMap',
  title: 'Leasing Map',
  type: 'object',
  fields: [
    defineField({
      name: 'floors',
      title: 'Floors',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'floor',
          title: 'Floor',
          fields: [
            {
              name: 'label',
              title: 'Label (Desktop)',
              type: 'string',
              description: 'Full label shown on desktop (e.g., "First Floor")',
              validation: Rule => Rule.required()
            },
            {
              name: 'mobileLabel',
              title: 'Label (Mobile)',
              type: 'string',
              description: 'Shorter label shown on mobile (e.g., "Floor 1")',
              validation: Rule => Rule.required()
            },
            {
              name: 'desktopImage',
              title: 'Floor Plan Image (Desktop)',
              type: 'image',
              description: 'Please upload image files under 1MB',
              options: { hotspot: true },
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              validation: (Rule) => Rule.required().custom(async (file: any, context) => {
                if (!file?.asset?._ref) {
                  return true;
                }
                
                const maxSize = 1024 * 1024; // 1MB
                
                try {
                  const client = context.getClient({ apiVersion: '2025-05-08' })
                  const asset = await client.fetch('*[_id == $id][0]', { id: file.asset._ref })
                  
                  if (asset && asset.size && asset.size > maxSize) {
                    return 'File size must be under 1MB';
                  }
                } catch {
                  // If we can't fetch the asset yet (e.g., during upload), skip validation
                }
                
                return true;
              })
            },
            {
              name: 'tabletImage',
              title: 'Floor Plan Image (Tablet)',
              type: 'image',
              description: 'Please upload image files under 1MB',
              options: { hotspot: true },
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              validation: (Rule) => Rule.custom(async (file: any, context) => {
                if (!file?.asset?._ref) {
                  return true;
                }
                
                const maxSize = 1024 * 1024; // 1MB
                
                try {
                  const client = context.getClient({ apiVersion: '2025-05-08' })
                  const asset = await client.fetch('*[_id == $id][0]', { id: file.asset._ref })
                  
                  if (asset && asset.size && asset.size > maxSize) {
                    return 'File size must be under 1MB';
                  }
                } catch {
                  // If we can't fetch the asset yet (e.g., during upload), skip validation
                }
                
                return true;
              })
            },
            {
              name: 'mobileImage',
              title: 'Floor Plan Image (Mobile)',
              type: 'image',
              description: 'Please upload image files under 1MB',
              options: { hotspot: true },
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              validation: (Rule) => Rule.custom(async (file: any, context) => {
                if (!file?.asset?._ref) {
                  return true;
                }
                
                const maxSize = 1024 * 1024; // 1MB
                
                try {
                  const client = context.getClient({ apiVersion: '2025-05-08' })
                  const asset = await client.fetch('*[_id == $id][0]', { id: file.asset._ref })
                  
                  if (asset && asset.size && asset.size > maxSize) {
                    return 'File size must be under 1MB';
                  }
                } catch {
                  // If we can't fetch the asset yet (e.g., during upload), skip validation
                }
                
                return true;
              })
            },
            {
              name: 'spots',
              title: 'Clickable Spots',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'spot',
                  title: 'Spot',
                  fields: [
                    {
                      name: 'title',
                      title: 'Title',
                      type: 'string',
                      validation: Rule => Rule.required()
                    },
                    {
                      name: 'description',
                      title: 'Description',
                      type: 'text',
                      rows: 2
                    },
                    {
                      name: 'desktopMarkerImage',
                      title: 'Marker/Hover Image (Desktop)',
                      type: 'image',
                      description: 'Image shown on hover and in popup - Desktop. Please upload image files under 1MB',
                      options: { hotspot: true },
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      validation: (Rule) => Rule.custom(async (file: any, context) => {
                        if (!file?.asset?._ref) {
                          return true;
                        }
                        
                        const maxSize = 1024 * 1024; // 1MB
                        
                        try {
                          const client = context.getClient({ apiVersion: '2025-05-08' })
                          const asset = await client.fetch('*[_id == $id][0]', { id: file.asset._ref })
                          
                          if (asset && asset.size && asset.size > maxSize) {
                            return 'File size must be under 1MB';
                          }
                        } catch {
                          // If we can't fetch the asset yet (e.g., during upload), skip validation
                        }
                        
                        return true;
                      })
                    },
                    {
                      name: 'tabletMarkerImage',
                      title: 'Marker/Hover Image (Tablet)',
                      type: 'image',
                      description: 'Optional - falls back to desktop. Please upload image files under 1MB',
                      options: { hotspot: true },
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      validation: (Rule) => Rule.custom(async (file: any, context) => {
                        if (!file?.asset?._ref) {
                          return true;
                        }
                        
                        const maxSize = 1024 * 1024; // 1MB
                        
                        try {
                          const client = context.getClient({ apiVersion: '2025-05-08' })
                          const asset = await client.fetch('*[_id == $id][0]', { id: file.asset._ref })
                          
                          if (asset && asset.size && asset.size > maxSize) {
                            return 'File size must be under 1MB';
                          }
                        } catch {
                          // If we can't fetch the asset yet (e.g., during upload), skip validation
                        }
                        
                        return true;
                      })
                    },
                    {
                      name: 'mobileMarkerImage',
                      title: 'Marker/Hover Image (Mobile)',
                      type: 'image',
                      description: 'Optional - falls back to tablet/desktop. Please upload image files under 1MB',
                      options: { hotspot: true },
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      validation: (Rule) => Rule.custom(async (file: any, context) => {
                        if (!file?.asset?._ref) {
                          return true;
                        }
                        
                        const maxSize = 1024 * 1024; // 1MB
                        
                        try {
                          const client = context.getClient({ apiVersion: '2025-05-08' })
                          const asset = await client.fetch('*[_id == $id][0]', { id: file.asset._ref })
                          
                          if (asset && asset.size && asset.size > maxSize) {
                            return 'File size must be under 1MB';
                          }
                        } catch {
                          // If we can't fetch the asset yet (e.g., during upload), skip validation
                        }
                        
                        return true;
                      })
                    },
                    {
                      name: 'desktopPosition',
                      title: 'Position (Desktop)',
                      type: 'object',
                      fields: [
                        {
                          name: 'top',
                          title: 'Top (%)',
                          type: 'string',
                          description: 'e.g., "57%"',
                          validation: Rule => Rule.required()
                        },
                        {
                          name: 'left',
                          title: 'Left (%)',
                          type: 'string',
                          description: 'e.g., "74%"',
                          validation: Rule => Rule.required()
                        }
                      ]
                    },
                    {
                      name: 'tabletPosition',
                      title: 'Position (Tablet)',
                      type: 'object',
                      description: 'Optional - falls back to desktop position',
                      fields: [
                        {
                          name: 'top',
                          title: 'Top (%)',
                          type: 'string',
                          description: 'e.g., "57%"'
                        },
                        {
                          name: 'left',
                          title: 'Left (%)',
                          type: 'string',
                          description: 'e.g., "74%"'
                        }
                      ]
                    },
                    {
                      name: 'mobilePosition',
                      title: 'Position (Mobile)',
                      type: 'object',
                      description: 'Optional - falls back to tablet/desktop position',
                      fields: [
                        {
                          name: 'top',
                          title: 'Top (%)',
                          type: 'string',
                          description: 'e.g., "57%"'
                        },
                        {
                          name: 'left',
                          title: 'Left (%)',
                          type: 'string',
                          description: 'e.g., "74%"'
                        }
                      ]
                    }
                  ],
                  preview: {
                    select: {
                      title: 'title',
                      subtitle: 'description',
                      media: 'desktopMarkerImage'
                    },
                    prepare(selection) {
                      const { title, subtitle, media } = selection
                      return {
                        title: title || 'Untitled Spot',
                        subtitle: subtitle,
                        media: media
                      }
                    }
                  }
                }
              ]
            },
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'mobileLabel',
              media: 'desktopImage'
            },
            prepare(selection) {
              const { title, subtitle, media } = selection
              return {
                title: title || 'Untitled Floor',
                subtitle: subtitle,
                media: media
              }
            }
          }
        }
      ],
      validation: Rule => Rule.min(1).max(10)
    }),
  ],
})

