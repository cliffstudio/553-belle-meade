import { defineType, defineField } from 'sanity'

export const metaDataType = defineType({
  name: 'metaData',
  title: 'Meta Data',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'string',
    }),
    defineField({
      name: 'keywords',
      title: 'Keywords',
      type: 'string',
    }),
    defineField({
      name: 'socialimage',
      title: 'Social Image',
      type: 'image',
      description: 'Please upload image files under 500KB',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.custom(async (file, context) => {
        if (!file?.asset?._ref) {
          return true;
        }
        
        const maxSize = 500 * 1024; // 500KB
        
        try {
          const client = context.getClient({ apiVersion: '2025-05-08' })
          const asset = await client.fetch('*[_id == $id][0]', { id: file.asset._ref })
          
          if (asset && asset.size && asset.size > maxSize) {
            return 'File size must be under 500KB';
          }
        } catch {
          // If we can't fetch the asset yet (e.g., during upload), skip validation
        }
        
        return true;
      }),
    }),
  ],
})