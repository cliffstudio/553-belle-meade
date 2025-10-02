// sections/contactForm.ts
import { defineType, defineField } from 'sanity'
export default defineType({
  name: 'contactForm',
  title: 'Contact Form',
  type: 'object',
  fields: [
    defineField({
      name: 'body',
      title: 'Body',
      type: 'richPortableText'
    }),
  ],
})
