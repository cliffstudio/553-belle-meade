// sections/textWithArtefacts.ts
import { defineType, defineField } from 'sanity'
export default defineType({
  name: 'textWithArtefacts',
  title: 'Text with Artefacts',
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
    }),
    defineField({ 
      name: 'mobileTitle',
      title: 'Title (Mobile)',
      type: 'string',
    }),
    defineField({
      name: 'backgroundMediaType',
      title: 'Background Media Type',
      type: 'string',
      initialValue: 'image',
      options: { 
        list: ['image','video'] 
      },
    }),
    defineField({ 
      name: 'desktopBackgroundImage', 
      title: 'Background Image (Desktop)',
      type: 'image',
      description: 'Please upload image files under 500MB',
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
      hidden: ({ parent }) => parent?.backgroundMediaType !== 'image'
    }),
    defineField({ 
      name: 'mobileBackgroundImage', 
      title: 'Background Image (Mobile)',
      type: 'image',
      description: 'Please upload image files under 500MB',
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
      hidden: ({ parent }) => parent?.backgroundMediaType !== 'image'
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
      hidden: ({ parent }) => parent?.backgroundMediaType !== 'video'
    }),
    defineField({ 
      name: 'desktopBackgroundVideoPlaceholder', 
      title: 'Background Video Placeholder',
      type: 'image',
      description: 'Uploading the first frame of the video here will ensure users always see content if the video doesn\'t load immediately. Please upload image files under 500MB',
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
      hidden: ({ parent }) => parent?.backgroundMediaType !== 'video'
    }),
    defineField({ 
      name: 'showControls',
      title: 'Show Video Controls',
      type: 'boolean', 
      initialValue: false,
      hidden: ({ parent }) => parent?.backgroundMediaType !== 'video'
    }),
    defineField({ 
      name: 'overlayDarkness', 
      title: 'Overlay Darkness',
      type: 'number', 
      description: '0–1', 
      initialValue: 0.3,
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'richPortableText'
    }),
    defineField({
      name: 'artefact1',
      title: 'Artefact 1',
      type: 'object',
      fields: [
        defineField({
          name: 'image',
          title: 'Image',
          type: 'image',
          description: 'Please upload image files under 500MB',
          options: {
            hotspot: true
          },
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
          })
        }),
        defineField({
          name: 'caption',
          title: 'Caption',
          type: 'string'
        }),
        defineField({
          name: 'title',
          title: 'Title',
          type: 'string',
        }),
        defineField({
          name: 'description',
          title: 'Description',
          type: 'text',
        })
      ]
    }),
    defineField({
      name: 'artefact2',
      title: 'Artefact 2',
      type: 'object',
      fields: [
        defineField({
          name: 'image',
          title: 'Image',
          type: 'image',
          description: 'Please upload image files under 500MB',
          options: {
            hotspot: true
          },
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
          })
        }),
        defineField({
          name: 'caption',
          title: 'Caption',
          type: 'string'
        }),
        defineField({
          name: 'title',
          title: 'Title',
          type: 'string',
        }),
        defineField({
          name: 'description',
          title: 'Description',
          type: 'text',
        })
      ]
    }),
    defineField({
      name: 'artefact3',
      title: 'Artefact 3',
      type: 'object',
      fields: [
        defineField({
          name: 'image',
          title: 'Image',
          type: 'image',
          description: 'Please upload image files under 500MB',
          options: {
            hotspot: true
          },
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
          })
        }),
        defineField({
          name: 'caption',
          title: 'Caption',
          type: 'string'
        }),
        defineField({
          name: 'title',
          title: 'Title',
          type: 'string',
        }),
        defineField({
          name: 'description',
          title: 'Description',
          type: 'text',
        })
      ]
    }),
    defineField({
      name: 'artefact4',
      title: 'Artefact 4',
      type: 'object',
      fields: [
        defineField({
          name: 'image',
          title: 'Image',
          type: 'image',
          description: 'Please upload image files under 500MB',
          options: {
            hotspot: true
          },
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
          })
        }),
        defineField({
          name: 'caption',
          title: 'Caption',
          type: 'string'
        }),
        defineField({
          name: 'title',
          title: 'Title',
          type: 'string',
        }),
        defineField({
          name: 'description',
          title: 'Description',
          type: 'text',
        })
      ],
      hidden: ({ parent }) => parent?.layout !== 'layout-1' && parent?.layout !== 'layout-3'
    })
  ],
})
