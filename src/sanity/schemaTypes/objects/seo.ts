import { defineType, defineField } from 'sanity'

export default defineType({
  title: 'SEO',
  name: 'seo',
  type: 'object',
  options: {
    collapsible: true,
    collapsed: true
  },
  fields: [
    defineField({
      type: 'string',
      title: 'Title',
      name: 'metaTitle',
      description: 'Full title for this page (replaces "Document title | Site name"). Leave empty to use document title.',
      validation: Rule => Rule.max(50).warning('Longer titles may be truncated by search engines')
    }),
    defineField({
      type: 'text',
      title: 'Description',
      name: 'metaDescription',
      rows: 3,
      description: 'Summary for search results and social shares. Leave empty for site default.',
      validation: Rule => Rule.max(150).warning('Longer descriptions may be truncated by search engines')
    }),
    defineField({
      name: 'socialImage',
      title: 'Social Image',
      type: 'image',
      description: 'Image for social previews. Overrides site default. 1200×630px, under 1MB.',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.custom(async (file, context) => {
        if (!file?.asset?._ref) {
          return true;
        }
        
        const maxSize = 1024 * 1024; // 1MB
        
        try {
          const client = context.getClient({ apiVersion: '2025-05-08' })
          const asset = await client.fetch('*[_id == $id][0]', { id: file.asset._ref })
          
          if (asset && asset.size && asset.size > maxSize) {
            return 'File size must be under 1MB';
          }
        } catch {
        }
        
        return true;
      }),
    }),
  ]
})