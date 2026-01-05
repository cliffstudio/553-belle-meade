import { defineType, defineField } from 'sanity'
import { DocumentIcon } from '@sanity/icons'

export const footerType = defineType({
  name: 'footer',
  title: 'Footer',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Footer Title',
      type: 'string',
    }),
    defineField({
      name: 'column1FooterItems',
      title: 'Footer Items',
      type: 'array',
      fieldset: 'column1',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ 
              name: 'heading',
              type: 'string' 
            }),
            defineField({ 
              name: 'text', 
              type: 'richPortableText' 
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'column2FooterItems',
      title: 'Footer Items',
      type: 'array',
      fieldset: 'column2',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ 
              name: 'heading',
              type: 'string' 
            }),
            defineField({ 
              name: 'text', 
              type: 'richPortableText' 
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'footerNav',
      title: 'Footer Navigation',
      type: 'array',
      fieldset: 'column2',
      of: [{ type: 'link' }],
    }),
  ],
  fieldsets: [
    {
      name: 'column1',
      title: 'Column 1',
      options: { collapsible: true, collapsed: false }
    },
    {
      name: 'column2',
      title: 'Column 2',
      options: { collapsible: true, collapsed: false }
    }
  ]
})
