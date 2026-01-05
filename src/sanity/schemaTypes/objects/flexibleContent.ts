import { defineType } from 'sanity'

export default defineType({
  name: 'flexibleContent',
  title: 'Content Blocks',
  type: 'array',
  of: [
    {
      type: 'flexibleHeroSection',
      title: 'Hero Section'
    },
    {
      type: 'textBlock',
      title: 'Text Section'
    },
    {
      type: 'linkTiles',
      title: 'Link Tiles Section'
    },
    {
      type: 'stackedMediaText',
      title: 'Stacked Text & Media Section'
    },
    {
      type: 'fullWidthMedia',
      title: 'Full Width Media Section'
    },
    {
      type: 'smallMediaText',
      title: 'Small Text & Media Section'
    },
    {
      type: 'largeMediaText',
      title: 'Large Text & Media Section'
    },
    {
      type: 'imageMasonry',
      title: 'Image Masonry Section'
    },
    {
      type: 'staggeredImages',
      title: 'Staggered Images Section'
    },
    {
      type: 'ctaBanner',
      title: 'CTA Banner Section'
    },
    // Add more block types here as you create them
  ],
  options: {
    sortable: true,
  }
})

