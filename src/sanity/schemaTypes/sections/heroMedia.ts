// heroMedia.ts
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'heroMedia',
  title: 'Hero Media',
  type: 'object',
  fields: [
    defineField({
      name: 'layout',
      title: 'Layout',
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
      name: 'desktopTitle', 
      title: 'Title (Desktop)',
      type: 'string',
      hidden: ({ parent }) => parent?.layout !== 'layout-1' && parent?.layout !== 'layout-3'
    }),
    defineField({ 
      name: 'mobileTitle',
      title: 'Title (Mobile)',
      type: 'string',
      hidden: ({ parent }) => parent?.layout !== 'layout-1' && parent?.layout !== 'layout-3'
    }),
    defineField({
      name: 'backgroundMediaType',
      title: 'Background Media Type',
      type: 'string',
      initialValue: 'image',
      options: { 
        list: ['image','video'] 
      },
      hidden: ({ parent }) => parent?.layout !== 'layout-1'
    }),
    defineField({ 
      name: 'desktopBackgroundImage', 
      title: 'Background Image (Desktop)',
      type: 'image',
      hidden: ({ parent }) => parent?.layout !== 'layout-1' || parent?.backgroundMediaType !== 'image'
    }),
    defineField({ 
      name: 'mobileBackgroundImage', 
      title: 'Background Image (Mobile)',
      type: 'image',
      hidden: ({ parent }) => parent?.layout !== 'layout-1' || parent?.backgroundMediaType !== 'image'
    }),
    defineField({ 
      name: 'desktopBackgroundVideo', 
      title: 'Background Video',
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
      hidden: ({ parent }) => parent?.layout !== 'layout-1' || parent?.backgroundMediaType !== 'video'
    }),
    defineField({ 
      name: 'desktopBackgroundVideoPlaceholder', 
      title: 'Background Video Placeholder',
      type: 'image',
      hidden: ({ parent }) => parent?.layout !== 'layout-1' || parent?.backgroundMediaType !== 'video'
    }),
    // Commented out - using desktop video for mobile
    // defineField({ 
    //   name: 'mobileBackgroundVideo', 
    //   title: 'Background Video (Mobile)',
    //   type: 'file', 
    //   description: 'Please upload .mp4 files under 10MB',
    //   options: {
    //     accept: 'video/mp4'
    //   },
    //   validation: (Rule) => Rule.custom(async (file, context) => {
    //     if (!file?.asset?._ref) {
    //       return true;
    //     }
    //     
    //     const maxSize = 10 * 1024 * 1024; // 10MB
    //     
    //     try {
    //       const client = context.getClient({ apiVersion: '2025-05-08' })
    //       const asset = await client.fetch('*[_id == $id][0]', { id: file.asset._ref })
    //       
    //       if (asset && asset.size && asset.size > maxSize) {
    //         return 'File size must be under 10MB';
    //       }
    //       
    //       const filename = asset?.originalFilename || file.asset?.originalFilename || '';
    //       if (filename && !filename.toLowerCase().endsWith('.mp4')) {
    //         return 'Only .mp4 files are allowed';
    //       }
    //     } catch (error) {
    //       const filename = file.asset?.originalFilename || '';
    //       if (filename && !filename.toLowerCase().endsWith('.mp4')) {
    //         return 'Only .mp4 files are allowed';
    //       }
    //     }
    //     
    //     return true;
    //   }),
    //   hidden: ({ parent }) => parent?.layout !== 'layout-1' || parent?.backgroundMediaType !== 'video'
    // }),
    // defineField({ 
    //   name: 'mobileBackgroundVideoPlaceholder', 
    //   title: 'Background Video Placeholder (Mobile)',
    //   type: 'image',
    //   hidden: ({ parent }) => parent?.layout !== 'layout-1' || parent?.backgroundMediaType !== 'video'
    // }),
    defineField({ 
      name: 'showControls',
      title: 'Show Video Controls',
      type: 'boolean', 
      initialValue: false,
      hidden: ({ parent }) => parent?.layout !== 'layout-1' || parent?.backgroundMediaType !== 'video'
    }),
    defineField({ 
      name: 'overlayDarkness', 
      title: 'Overlay Darkness',
      type: 'number', 
      description: '0–1', 
      initialValue: 0.3,
      hidden: ({ parent }) => parent?.layout !== 'layout-1'
    }),
    defineField({ 
      name: 'body',
      title: 'Body',
      type: 'richPortableText',
      hidden: ({ parent }) => parent?.layout !== 'layout-2'
    }),
    defineField({ 
      name: 'cta', 
      title: 'CTA',
      type: 'link',
      hidden: ({ parent }) => parent?.layout !== 'layout-2'
    }),
  ],
})
