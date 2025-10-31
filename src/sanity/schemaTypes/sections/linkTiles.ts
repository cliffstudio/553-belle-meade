// linkTiles.ts
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'linkTiles',
  title: 'Link Tiles',
  type: 'object',
  fields: [
    defineField({
      name: 'numberOfTiles',
      title: 'Number of Tiles',
      type: 'number',
      validation: (Rule) => Rule.min(2).max(7),
      options: {
        list: [
          { title: '2 Tiles', value: 2 },
          { title: '3 Tiles', value: 3 },
          { title: '4 Tiles', value: 4 },
          { title: '5 Tiles', value: 5 },
          { title: '6 Tiles', value: 6 },
          { title: '7 Tiles', value: 7 },
        ]
      }
    }),
    defineField({
      name: 'linkTile1',
      title: 'Link Tile 1',
      type: 'object',
      hidden: ({ parent }) => !parent?.numberOfTiles || parent.numberOfTiles < 1,
      fields: [
        defineField({ 
          name: 'mediaType', 
          title: 'Media Type',
          type: 'string', 
          initialValue: 'image',
          options: { list: ['image','video'] } 
        }),
        defineField({ 
          name: 'image', 
          title: 'Image',
          type: 'image',
          description: 'Please upload image files under 500KB',
          options: { hotspot: true },
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
          hidden: ({ parent }) => parent?.mediaType !== 'image'
        }),
        defineField({ 
          name: 'video', 
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
          hidden: ({ parent }) => parent?.mediaType !== 'video'
        }),
        defineField({ 
          name: 'cta', 
          title: 'CTA',
          type: 'link' 
        }),
      ]
    }),
    defineField({
      name: 'linkTile2',
      title: 'Link Tile 2',
      type: 'object',
      hidden: ({ parent }) => !parent?.numberOfTiles || parent.numberOfTiles < 2,
      fields: [
        defineField({ 
          name: 'mediaType', 
          title: 'Media Type',
          type: 'string', 
          initialValue: 'image',
          options: { list: ['image','video'] } 
        }),
        defineField({ 
          name: 'image', 
          title: 'Image',
          type: 'image',
          description: 'Please upload image files under 500KB',
          options: { hotspot: true },
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
          hidden: ({ parent }) => parent?.mediaType !== 'image'
        }),
        defineField({ 
          name: 'video', 
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
          hidden: ({ parent }) => parent?.mediaType !== 'video'
        }),
        defineField({
          name: 'cta', 
          title: 'CTA',
          type: 'link' 
        }),
      ]
    }),
    defineField({
      name: 'linkTile3',
      title: 'Link Tile 3',
      type: 'object',
      hidden: ({ parent }) => !parent?.numberOfTiles || parent.numberOfTiles < 3,
      fields: [
        defineField({ 
          name: 'mediaType', 
          title: 'Media Type',
          type: 'string', 
          initialValue: 'image',
          options: { list: ['image','video'] } 
        }),
        defineField({ 
          name: 'image', 
          title: 'Image',
          type: 'image',
          description: 'Please upload image files under 500KB',
          options: { hotspot: true },
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
          hidden: ({ parent }) => parent?.mediaType !== 'image'
        }),
        defineField({ 
          name: 'video', 
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
          hidden: ({ parent }) => parent?.mediaType !== 'video'
        }),
        defineField({
          name: 'cta', 
          title: 'CTA',
          type: 'link' 
        }),
      ]
    }),
    defineField({
      name: 'linkTile4',
      title: 'Link Tile 4',
      type: 'object',
      hidden: ({ parent }) => !parent?.numberOfTiles || parent.numberOfTiles < 4,
      fields: [
        defineField({ 
          name: 'mediaType', 
          title: 'Media Type',
          type: 'string', 
          initialValue: 'image',
          options: { list: ['image','video'] } 
        }),
        defineField({ 
          name: 'image', 
          title: 'Image',
          type: 'image',
          description: 'Please upload image files under 500KB',
          options: { hotspot: true },
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
          hidden: ({ parent }) => parent?.mediaType !== 'image'
        }),
        defineField({ 
          name: 'video', 
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
          hidden: ({ parent }) => parent?.mediaType !== 'video'
        }),
        defineField({
          name: 'cta', 
          title: 'CTA',
          type: 'link' 
        }),
      ]
    }),
    defineField({
      name: 'linkTile5',
      title: 'Link Tile 5',
      type: 'object',
      hidden: ({ parent }) => !parent?.numberOfTiles || parent.numberOfTiles < 5,
      fields: [
        defineField({ 
          name: 'mediaType', 
          title: 'Media Type',
          type: 'string', 
          initialValue: 'image',
          options: { list: ['image','video'] } 
        }),
        defineField({ 
          name: 'image',  
          title: 'Image',
          type: 'image',
          options: { hotspot: true },
          hidden: ({ parent }) => parent?.mediaType !== 'image'
        }),
        defineField({ 
          name: 'video', 
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
          hidden: ({ parent }) => parent?.mediaType !== 'video'
        }),
        defineField({
          name: 'cta', 
          title: 'CTA',
          type: 'link' 
        }),
      ]
    }),
    defineField({
      name: 'linkTile6',
      title: 'Link Tile 6',
      type: 'object',
      hidden: ({ parent }) => !parent?.numberOfTiles || parent.numberOfTiles < 6,
      fields: [
        defineField({ 
          name: 'mediaType', 
          title: 'Media Type',
          type: 'string', 
          initialValue: 'image',
          options: { list: ['image','video'] } 
        }),
        defineField({ 
          name: 'image',   
          title: 'Image',
          type: 'image',
          options: { hotspot: true },
          hidden: ({ parent }) => parent?.mediaType !== 'image'
        }),
        defineField({ 
          name: 'video', 
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
          hidden: ({ parent }) => parent?.mediaType !== 'video'
        }),
        defineField({ 
          name: 'cta', 
          title: 'CTA',
          type: 'link' 
        }),
      ]
    }),
    defineField({
      name: 'linkTile7',
      title: 'Link Tile 7',
      type: 'object',
      hidden: ({ parent }) => !parent?.numberOfTiles || parent.numberOfTiles < 7,
      fields: [
        defineField({ 
          name: 'mediaType', 
          title: 'Media Type',
          type: 'string', 
          initialValue: 'image',
          options: { list: ['image','video'] } 
        }),
        defineField({ 
          name: 'image', 
          title: 'Image',
          type: 'image',
          description: 'Please upload image files under 500KB',
          options: { hotspot: true },
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
          hidden: ({ parent }) => parent?.mediaType !== 'image'
        }),
        defineField({ 
          name: 'video', 
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
          hidden: ({ parent }) => parent?.mediaType !== 'video'
        }),
        defineField({ 
          name: 'cta', 
          title: 'CTA',
          type: 'link' 
        }),
      ]
    }),
  ],
  preview: {
    select: {
      numberOfTiles: 'numberOfTiles'
    },
    prepare({ numberOfTiles }) {
      return {
        title: `Link Tiles (${numberOfTiles} tiles)`
      }
    }
  }
})
