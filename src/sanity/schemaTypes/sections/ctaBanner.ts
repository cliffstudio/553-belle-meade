// /schemas/sections/ctaBanner.ts
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'ctaBanner',
  title: 'CTA Banner',
  type: 'object',
  fields: [
    defineField({
      name: 'cta',
      title: 'CTA',
      type: 'link'
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'CTA Banner Section',
      }
    }
  }
})
