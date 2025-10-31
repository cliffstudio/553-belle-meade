// imageMasonry.ts
import { defineType, defineField } from 'sanity'
export default defineType({
  name: 'imageMasonry',
  title: 'Image Masonry',
  type: 'object',
  fields: [
    defineField({ 
      name: 'heading',
      title: 'Heading',
      type: 'string'
    }),
    defineField({ 
      name: 'body',
      title: 'Body',
      type: 'richPortableText'
    }),
    defineField({ 
      name: 'cta',
      title: 'CTA',
      type: 'link'
    }),
    defineField({
      name: 'layout',
      title: 'Image Layout',
      type: 'string',
      initialValue: 'layout-1',
      options: {
        list: [
          { title: 'Layout 1', value: 'layout-1' },
          { title: 'Layout 2', value: 'layout-2' },
          { title: 'Layout 3', value: 'layout-3' }
        ]
      }
    }),
    defineField({ 
      name: 'mediaType1', 
      title: 'Media Type',
      type: 'string', 
      initialValue: 'image',
      options: { list: ['image','video'] },
      fieldset: 'media1'
    }),
    defineField({ 
      name: 'image1', 
      title: 'Image',
      type: 'image',
      description: 'Please upload image files under 500MB',
      options: { hotspot: true },
      validation: (Rule) => Rule.custom(async (file, context) => {
        if (!file?.asset?._ref) {
          return true;
        }
        
        const maxSize = 500 * 1024 * 1024; // 500MB
        
        try {
          const client = context.getClient({ apiVersion: '2025-05-08' })
          const asset = await client.fetch('*[_id == $id][0]', { id: file.asset._ref })
          
          if (asset && asset.size && asset.size > maxSize) {
            return 'File size must be under 500MB';
          }
        } catch {
          // If we can't fetch the asset yet (e.g., during upload), skip validation
        }
        
        return true;
      }),
      hidden: ({ parent }) => parent?.mediaType1 !== 'image',
      fieldset: 'media1'
    }),
    defineField({ 
      name: 'video1', 
      title: 'Video',
      type: 'file', 
      description: 'Please upload .mp4 files under 10MB',
      options: { 
        accept: 'video/mp4' 
      },
      validation: (Rule) => Rule.custom(async (file, context) => {
        if (!file?.asset?._ref) {
          return true;
        }
        
        const maxSize = 10 * 1024 * 1024; // 10MB
        
        try {
          const client = context.getClient({ apiVersion: '2025-05-08' })
          const asset = await client.fetch('*[_id == $id][0]', { id: file.asset._ref })
          
          if (asset && asset.size && asset.size > maxSize) {
            return 'File size must be under 10MB';
          }
          
          const filename = asset?.originalFilename || '';
          if (filename && !filename.toLowerCase().endsWith('.mp4')) {
            return 'Only .mp4 files are allowed';
          }
        } catch {
          // If we can't fetch the asset yet (e.g., during upload), skip validation
        }
        
        return true;
      }),
      hidden: ({ parent }) => parent?.mediaType1 !== 'video',
      fieldset: 'media1'
    }),
    defineField({ 
      name: 'mediaType2',
      title: 'Media Type',
      type: 'string', 
      initialValue: 'image',
      options: { list: ['image','video'] },
      fieldset: 'media2'
    }),
    defineField({ 
      name: 'image2', 
      title: 'Image',
      type: 'image',
      description: 'Please upload image files under 500MB',
      options: { hotspot: true },
      validation: (Rule) => Rule.custom(async (file, context) => {
        if (!file?.asset?._ref) {
          return true;
        }
        
        const maxSize = 500 * 1024 * 1024; // 500MB
        
        try {
          const client = context.getClient({ apiVersion: '2025-05-08' })
          const asset = await client.fetch('*[_id == $id][0]', { id: file.asset._ref })
          
          if (asset && asset.size && asset.size > maxSize) {
            return 'File size must be under 500MB';
          }
        } catch {
          // If we can't fetch the asset yet (e.g., during upload), skip validation
        }
        
        return true;
      }),
      hidden: ({ parent }) => parent?.mediaType2 !== 'image',
      fieldset: 'media2'
    }),
    defineField({ 
      name: 'video2', 
      title: 'Video',
      type: 'file', 
      description: 'Please upload .mp4 files under 10MB',
      options: { 
        accept: 'video/mp4' 
      },
      validation: (Rule) => Rule.custom(async (file, context) => {
        if (!file?.asset?._ref) {
          return true;
        }
        
        const maxSize = 10 * 1024 * 1024; // 10MB
        
        try {
          const client = context.getClient({ apiVersion: '2025-05-08' })
          const asset = await client.fetch('*[_id == $id][0]', { id: file.asset._ref })
          
          if (asset && asset.size && asset.size > maxSize) {
            return 'File size must be under 10MB';
          }
          
          const filename = asset?.originalFilename || '';
          if (filename && !filename.toLowerCase().endsWith('.mp4')) {
            return 'Only .mp4 files are allowed';
          }
        } catch {
          // If we can't fetch the asset yet (e.g., during upload), skip validation
        }
        
        return true;
      }),
      hidden: ({ parent }) => parent?.mediaType2 !== 'video',
      fieldset: 'media2'
    }),
    defineField({
      name: 'backgroundColour',
      title: 'Background Colour',
      type: 'string',
      initialValue: 'Lilac',
      options: {
        list: ['Lilac', 'Green', 'Tan']
      },
      hidden: ({ document }) => document?.pageType !== 'homepage'
    }),
  ],
  fieldsets: [
    {
      name: 'media1',
      title: 'Media',
      options: { collapsible: true, collapsed: false }
    },
    {
      name: 'media2',
      title: 'Media',
      options: { collapsible: true, collapsed: false }
    }
  ]
})
