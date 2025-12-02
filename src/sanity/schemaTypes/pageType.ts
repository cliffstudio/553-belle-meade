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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'pageType',
      type: 'string',
      options: {
        list: [
          { title: 'Homepage', value: 'homepage' },
          { title: 'Shopping', value: 'shopping' },
          { title: 'Walkthrough', value: 'walkthrough' },
          { title: 'Spaces', value: 'spaces' },
          { title: 'Heritage', value: 'heritage' },
          { title: 'Creek', value: 'creek' },
          { title: 'Carousel', value: 'carousel' },
          { title: 'Gallery', value: 'gallery' },
          { title: 'Architecture', value: 'architecture' },
          { title: 'Press', value: 'press' },
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
      name: 'homepageTextBlock',
      title: 'Text Block',
      type: 'textBlock',
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
      name: 'homepageStackedMediaText',
      title: 'Stacked Text & Media',
      type: 'stackedMediaText',
      hidden: ({ document }) => document?.pageType !== 'homepage',
    }),
    defineField({
      name: 'homepageLargeMediaText',
      title: 'Text & Media',
      type: 'largeMediaText',
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
      name: 'shoppingSmallMediaText',
      title: 'Text & Media',
      type: 'smallMediaText',
      hidden: ({ document }) => document?.pageType !== 'shopping',
    }),
    defineField({
      name: 'shoppingCta',
      title: 'CTA Banner',
      type: 'ctaBanner',
      hidden: ({ document }) => document?.pageType !== 'shopping',
    }),

    // Walkthrough specific fields
    defineField({
      name: 'walkthroughHero',
      title: 'Hero',
      type: 'heroMedia',
      hidden: ({ document }) => document?.pageType !== 'walkthrough',
    }),
    defineField({
      name: 'walkthroughCta',
      title: 'CTA Banner',
      type: 'ctaBanner',
      hidden: ({ document }) => document?.pageType !== 'walkthrough',
    }),

    // Spaces specific fields
    defineField({
      name: 'spacesHero',
      title: 'Hero',
      type: 'heroMedia',
      hidden: ({ document }) => document?.pageType !== 'spaces',
    }),
    defineField({
      name: 'spacesLeasingMap',
      title: 'Leasing Map',
      type: 'leasingMap',
      hidden: ({ document }) => document?.pageType !== 'spaces',
    }),
    defineField({
      name: 'spacesFullWidthMedia',
      title: 'Full Width Media',
      type: 'fullWidthMedia',
      hidden: ({ document }) => document?.pageType !== 'spaces',
    }),
    defineField({
      name: 'spacesContactForm',
      title: 'Contact',
      type: 'contactForm',
      hidden: ({ document }) => document?.pageType !== 'spaces',
    }),
    defineField({
      name: 'spacesCta',
      title: 'CTA Banner',
      type: 'ctaBanner',
      hidden: ({ document }) => document?.pageType !== 'spaces',
    }),

    // Heritage specific fields
    defineField({
      name: 'heritageTextWithArtefacts',
      title: 'Text with Artefacts',
      type: 'textWithArtefacts',
      hidden: ({ document }) => document?.pageType !== 'heritage',
    }),
    defineField({
      name: 'heritageFullWidthMedia',
      title: 'Full Width Media',
      type: 'fullWidthMedia',
      hidden: ({ document }) => document?.pageType !== 'heritage',
    }),
    defineField({
      name: 'heritageTextWithArtefacts2',
      title: 'Text with Artefacts 2',
      type: 'textWithArtefacts',
      hidden: ({ document }) => document?.pageType !== 'heritage',
    }),
    defineField({
      name: 'heritageImageCarousel',
      title: 'Image Carousel',
      type: 'imageCarousel',
      hidden: ({ document }) => document?.pageType !== 'heritage',
    }),
    defineField({
      name: 'heritageCta',
      title: 'CTA Banner',
      type: 'ctaBanner',
      hidden: ({ document }) => document?.pageType !== 'heritage',
    }),

    // Creek specific fields
    defineField({
      name: 'creekHero',
      title: 'Hero',
      type: 'heroMedia',
      hidden: ({ document }) => document?.pageType !== 'creek',
    }),
    defineField({
      name: 'creekStaggered',
      title: 'Staggered Images',
      type: 'staggeredImages',
      hidden: ({ document }) => document?.pageType !== 'creek',
    }),
    defineField({
      name: 'creekStackedMediaText',
      title: 'Text & Media',
      type: 'stackedMediaText',
      hidden: ({ document }) => document?.pageType !== 'creek',
    }),
    defineField({
      name: 'creekFullWidthMedia',
      title: 'Full Width Media',
      type: 'fullWidthMedia',
      hidden: ({ document }) => document?.pageType !== 'creek',
    }),
    defineField({
      name: 'creekCta',
      title: 'CTA Banner',
      type: 'ctaBanner',
      hidden: ({ document }) => document?.pageType !== 'creek',
    }),

    // Carousel specific fields
    defineField({
      name: 'carouselTextWithArtefacts',
      title: 'Text with Artefacts',
      type: 'textWithArtefacts',
      hidden: ({ document }) => document?.pageType !== 'carousel',
    }),
    defineField({
      name: 'carouselFullWidthMedia',
      title: 'Full Width Media',
      type: 'fullWidthMedia',
      hidden: ({ document }) => document?.pageType !== 'carousel',
    }),
    defineField({
      name: 'carouselImageMasonry',
      title: 'Image Masonry',
      type: 'imageMasonry',
      hidden: ({ document }) => document?.pageType !== 'carousel',
    }),
    defineField({
      name: 'carouselCta',
      title: 'CTA Banner',
      type: 'ctaBanner',
      hidden: ({ document }) => document?.pageType !== 'carousel',
    }),

    // Architecture specific fields
    defineField({
      name: 'architectureHero',
      title: 'Hero',
      type: 'heroMedia',
      hidden: ({ document }) => document?.pageType !== 'architecture',
    }),
    defineField({
      name: 'architectureImageMasonry',
      title: 'Image Masonry',
      type: 'imageMasonry',
      hidden: ({ document }) => document?.pageType !== 'architecture',
    }),
    defineField({
      name: 'architectureStackedMediaText',
      title: 'Text & Media',
      type: 'stackedMediaText',
      hidden: ({ document }) => document?.pageType !== 'architecture',
    }),
    defineField({
      name: 'architectureFullWidthMedia',
      title: 'Full Width Media',
      type: 'fullWidthMedia',
      hidden: ({ document }) => document?.pageType !== 'architecture',
    }),
    defineField({
      name: 'architectureLargeMediaText',
      title: 'Text & Media',
      type: 'largeMediaText',
      hidden: ({ document }) => document?.pageType !== 'architecture',
    }),
    defineField({
      name: 'architectureArchitects',
      title: 'Architects',
      type: 'architects',
      hidden: ({ document }) => document?.pageType !== 'architecture',
    }),
    defineField({
      name: 'architectureCta',
      title: 'CTA Banner',
      type: 'ctaBanner',
      hidden: ({ document }) => document?.pageType !== 'architecture',
    }),

    // Gallery specific fields
    defineField({
      name: 'galleryImages',
      title: 'Images',
      type: 'gallery',
      hidden: ({ document }) => document?.pageType !== 'gallery',
    }),

    // Press specific fields
    defineField({
      name: 'pressHero',
      title: 'Hero',
      type: 'heroMedia',
      hidden: ({ document }) => document?.pageType !== 'press',
    }),
    defineField({
      name: 'pressSection',
      title: 'Press Section',
      type: 'pressSection',
      hidden: ({ document }) => document?.pageType !== 'press',
    }),
    defineField({
      name: 'pressCta',
      title: 'CTA Banner',
      type: 'ctaBanner',
      hidden: ({ document }) => document?.pageType !== 'press',
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
})
