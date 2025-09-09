// /schemas/objects/imageWithCaption.ts
import { defineType, defineField } from 'sanity'
export default defineType({
  name: 'imageWithCaption',
  title: 'Image with Caption',
  type: 'object',
  fields: [
    defineField({ name: 'image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'alt', type: 'string', validation: r => r.required() }),
    defineField({ name: 'credit', type: 'string' }),
    defineField({
      name: 'size',
      type: 'string',
      initialValue: 'auto',
      options: { list: ['sm', 'md', 'lg', 'xl', 'auto'] },
    }),
  ],
})
