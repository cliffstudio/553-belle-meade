import { defineType, defineField } from 'sanity'

export default defineType({
  title: 'SEO / Share settings',
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
      description: 'Title used for search engines and browsers',
      validation: Rule => Rule.max(50).warning('Longer titles may be truncated by search engines')
    }),
    defineField({
      type: 'text',
      title: 'Description',
      name: 'metaDescription',
      rows: 3,
      description: 'Description for search engines',
      validation: Rule => Rule.max(150).warning('Longer descriptions may be truncated by search engines')
    }),
    defineField({
      name: 'socialImage',
      title: 'Social Image',
      type: 'image',
      description: 'Image used for social media sharing (Open Graph, Twitter). Recommended size: 1200x630px. Please upload image files under 1MB',
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