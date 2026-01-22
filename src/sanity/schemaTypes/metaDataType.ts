import { defineType } from 'sanity'

/**
 * Legacy metadata type - kept for backwards compatibility with existing pages
 * that may have references to old metaData documents.
 * This type is hidden from the Studio structure and should not be used for new content.
 */
export const metaDataType = defineType({
  name: 'metaData',
  title: 'Meta Data (Legacy)',
  type: 'document',
  hidden: true, // Hide from Studio structure
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'string',
    },
    {
      name: 'keywords',
      title: 'Keywords',
      type: 'string',
    },
    {
      name: 'socialimage',
      title: 'Social Image',
      type: 'image',
    },
  ],
})
