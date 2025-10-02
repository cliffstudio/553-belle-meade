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
      hidden: ({ parent }) => parent?.layout !== 'layout-1' && parent?.layout !== 'layout-2'
    })
  ],
})
