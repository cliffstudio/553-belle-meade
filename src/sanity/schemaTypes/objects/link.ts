// /schemas/objects/link.ts
import { defineType, defineField } from 'sanity'
export default defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({
      name: 'linkType',
      type: 'string',
      options: { 
        list: ['internal','external'] 
      }
    }),
    defineField({ 
      name: 'label', 
      type: 'string',
      hidden: ({ parent }) => parent?.linkType === 'internal'
    }),
    defineField({ 
      name: 'href',
      type: 'url',
      hidden: ({ parent }) => parent?.linkType === 'internal'
    }),
    defineField({
      name: 'pageLink',
      type: 'reference',
      to: [{ type: 'page' }],
      hidden: ({ parent }) => parent?.linkType === 'external'
    }),
  ]
})
