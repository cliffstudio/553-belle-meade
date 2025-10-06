// sections/textWithArtefacts.ts
import { defineType, defineField } from 'sanity'
export default defineType({
  name: 'textWithArtefacts',
  title: 'Text with Artefacts',
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
    defineField({ 
      name: 'desktopTitle', 
      title: 'Desktop Title',
      type: 'string',
    }),
    defineField({ 
      name: 'mobileTitle',
      title: 'Mobile Title',
      type: 'string',
    }),
    defineField({
      name: 'backgroundMediaType',
      title: 'Background Media Type',
      type: 'string',
      initialValue: 'image',
      options: { 
        list: ['image','video'] 
      },
    }),
    defineField({ 
      name: 'desktopBackgroundImage', 
      title: 'Desktop Background Image',
      type: 'image',
      hidden: ({ parent }) => parent?.backgroundMediaType !== 'image'
    }),
    defineField({ 
      name: 'mobileBackgroundImage', 
      title: 'Mobile Background Image',
      type: 'image',
      hidden: ({ parent }) => parent?.backgroundMediaType !== 'image'
    }),
    defineField({ 
      name: 'desktopBackgroundVideo', 
      title: 'Desktop Background Video',
      type: 'file', 
      options: {
        accept: 'video/*'
      },
      hidden: ({ parent }) => parent?.backgroundMediaType !== 'video'
    }),
    defineField({ 
      name: 'mobileBackgroundVideo', 
      title: 'Mobile Background Video',
      type: 'file', 
      options: {
        accept: 'video/*'
      },
      hidden: ({ parent }) => parent?.backgroundMediaType !== 'video'
    }),
    defineField({ 
      name: 'showControls',
      title: 'Show Video Controls',
      type: 'boolean', 
      initialValue: false,
      hidden: ({ parent }) => parent?.backgroundMediaType !== 'video'
    }),
    defineField({ 
      name: 'overlayDarkness', 
      title: 'Overlay Darkness',
      type: 'number', 
      description: '0–1', 
      initialValue: 0.3,
    }),
    defineField({
      name: 'body',
      type: 'richPortableText'
    }),
    defineField({
      name: 'artefact1',
      title: 'Artefact 1',
      type: 'object',
      fields: [
        defineField({
          name: 'image',
          title: 'Image',
          type: 'image',
          options: {
            hotspot: true
          }
        }),
        defineField({
          name: 'caption',
          title: 'Caption',
          type: 'string'
        }),
        defineField({
          name: 'title',
          title: 'Title',
          type: 'string',
        }),
        defineField({
          name: 'description',
          title: 'Description',
          type: 'text',
        })
      ]
    }),
    defineField({
      name: 'artefact2',
      title: 'Artefact 2',
      type: 'object',
      fields: [
        defineField({
          name: 'image',
          title: 'Image',
          type: 'image',
          options: {
            hotspot: true
          }
        }),
        defineField({
          name: 'caption',
          title: 'Caption',
          type: 'string'
        }),
        defineField({
          name: 'title',
          title: 'Title',
          type: 'string',
        }),
        defineField({
          name: 'description',
          title: 'Description',
          type: 'text',
        })
      ]
    }),
    defineField({
      name: 'artefact3',
      title: 'Artefact 3',
      type: 'object',
      fields: [
        defineField({
          name: 'image',
          title: 'Image',
          type: 'image',
          options: {
            hotspot: true
          }
        }),
        defineField({
          name: 'caption',
          title: 'Caption',
          type: 'string'
        }),
        defineField({
          name: 'title',
          title: 'Title',
          type: 'string',
        }),
        defineField({
          name: 'description',
          title: 'Description',
          type: 'text',
        })
      ]
    }),
    defineField({
      name: 'artefact4',
      title: 'Artefact 4',
      type: 'object',
      fields: [
        defineField({
          name: 'image',
          title: 'Image',
          type: 'image',
          options: {
            hotspot: true
          }
        }),
        defineField({
          name: 'caption',
          title: 'Caption',
          type: 'string'
        }),
        defineField({
          name: 'title',
          title: 'Title',
          type: 'string',
        }),
        defineField({
          name: 'description',
          title: 'Description',
          type: 'text',
        })
      ],
      hidden: ({ parent }) => parent?.layout !== 'layout-1' && parent?.layout !== 'layout-3'
    })
  ],
})
