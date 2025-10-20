// /schemas/sections/ctaBanner.ts
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'ctaBanner',
  title: 'CTA Banner',
  type: 'object',
  fields: [
    defineField({
      name: 'pageLink',
      title: 'Page Link',
      type: 'reference',
      to: [{ type: 'page' }],
      hidden: ({ parent }) => parent?.linkType === 'external'
    }),
  ],
})
