// sections/architects.ts
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'architects',
  title: 'Architects',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string'
    }),
    defineField({ 
      name: 'architects',
      title: 'Architects',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'architect',
          title: 'Architect',
          fields: [
            {
              name: 'name',
              title: 'Name',
              type: 'string',
            },
            {
              name: 'bio',
              title: 'Bio',
              type: 'richPortableText'
            },
            { 
              name: 'cta',
              title: 'CTA',
              type: 'link'
            },
          ],
          preview: {
            select: {
              title: 'name'
            },
          }
        }
      ]
    }),
  ],
})
