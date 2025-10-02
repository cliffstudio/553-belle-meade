import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'pressSection',
  title: 'Press Section',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'Press',
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      initialValue: 'grid',
      options: {
        list: [
          { title: 'Grid', value: 'grid' },
          { title: 'List', value: 'list' },
          { title: 'Masonry', value: 'masonry' },
        ],
      },
    }),
    defineField({
      name: 'postsPerPage',
      title: 'Posts Per Page',
      type: 'number',
      initialValue: 12,
      validation: (Rule) => Rule.min(1).max(50),
    }),
    defineField({
      name: 'showCategories',
      title: 'Show Category Filter',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'showSearch',
      title: 'Show Search',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'featuredPosts',
      title: 'Featured Posts',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'press' }],
        },
      ],
      validation: (Rule) => Rule.max(3),
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      subtitle: 'subheading',
    },
    prepare(selection) {
      const { title, subtitle } = selection
      return {
        title: title || 'Press Section',
        subtitle: subtitle || 'Press articles and news',
      }
    },
  },
})
