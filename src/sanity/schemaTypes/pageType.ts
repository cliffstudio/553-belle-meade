import { defineType, defineField } from 'sanity'
import { DocumentTextIcon } from '@sanity/icons'

export const pageType = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'title',
      },
    }),
    defineField({
      name: 'pageType',
      type: 'string',
      options: {
        list: [
          { title: 'Homepage', value: 'homepage' },
          { title: 'Shopping', value: 'shopping' },
        ],
      },
    }),
    
    // Homepage specific fields
    defineField({
      name: 'homepageHero',
      title: 'Hero',
      type: 'homeHeroMedia',
      hidden: ({ document }) => document?.pageType !== 'homepage',
    }),
    defineField({
      name: 'homepageLinkTiles',
      title: 'Link Tiles',
      type: 'linkTiles',
      hidden: ({ document }) => document?.pageType !== 'homepage',
    }),
    defineField({
      name: 'homepageFullWidthMedia',
      title: 'Full Width Media',
      type: 'fullWidthMedia',
      hidden: ({ document }) => document?.pageType !== 'homepage',
    }),
    defineField({
      name: 'homepageTextWithMedia',
      title: 'Text With Media',
      type: 'textWithMedia',
      hidden: ({ document }) => document?.pageType !== 'homepage',
    }),
    defineField({
      name: 'homepageImageMasonry',
      title: 'Image Masonry',
      type: 'imageMasonry',
      hidden: ({ document }) => document?.pageType !== 'homepage',
    }),
    
    // Shopping specific fields
    defineField({
      name: 'shoppingHero',
      title: 'Hero',
      type: 'heroMedia',
      hidden: ({ document }) => document?.pageType !== 'shopping',
    }),
    defineField({
      name: 'shoppingStaggered',
      title: 'Staggered Images',
      type: 'staggeredImages',
      hidden: ({ document }) => document?.pageType !== 'shopping',
    }),
    defineField({
      name: 'shoppingFullWidthMedia',
      title: 'Full Width Media',
      type: 'fullWidthMedia',
      hidden: ({ document }) => document?.pageType !== 'shopping',
    }),
    defineField({
      name: 'shoppingTextWithMedia',
      title: 'Text With Media',
      type: 'textWithMedia',
      hidden: ({ document }) => document?.pageType !== 'shopping',
    }),
    defineField({
      name: 'shoppingCta',
      title: 'CTA Banner',
      type: 'ctaBanner',
      hidden: ({ document }) => document?.pageType !== 'shopping',
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
})
