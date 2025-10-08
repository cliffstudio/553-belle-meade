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
              options: { hotspot: true },
              validation: Rule => Rule.required()
            },
            {
              name: 'tabletImage',
              title: 'Floor Plan Image (Tablet)',
              type: 'image',
              options: { hotspot: true },
            },
            {
              name: 'mobileImage',
              title: 'Floor Plan Image (Mobile)',
              type: 'image',
              options: { hotspot: true },
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
                      description: 'Image shown on hover and in popup - Desktop',
                      options: { hotspot: true }
                    },
                    {
                      name: 'tabletMarkerImage',
                      title: 'Marker/Hover Image (Tablet)',
                      type: 'image',
                      description: 'Optional - falls back to desktop',
                      options: { hotspot: true }
                    },
                    {
                      name: 'mobileMarkerImage',
                      title: 'Marker/Hover Image (Mobile)',
                      type: 'image',
                      description: 'Optional - falls back to tablet/desktop',
                      options: { hotspot: true }
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

