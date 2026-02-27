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
          { title: 'Sign In', value: 'sign-in' },
          { title: 'Walkthrough', value: 'walkthrough' },
          { title: 'Spaces', value: 'spaces' },
          { title: 'Heritage', value: 'heritage' },
          { title: 'Carousel', value: 'carousel' },
          { title: 'Gallery', value: 'gallery' },
          { title: 'Press', value: 'press' },
          { title: 'Text', value: 'text' },
          { title: 'General', value: 'general' },
        ],
      },
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      description: 'Override title, description and image for search and social. Empty = use Site Settings.',
    }),
    defineField({
      name: 'contentBlocks',
      title: 'Content Blocks',
      type: 'flexibleContent',
      description: 'Add and arrange content blocks to build your page',
      hidden: ({ document }) => {
        // Only show for general pages or pages without a specific pageType
        const pageType = document?.pageType
        return !!(pageType && pageType !== 'general')
      },
    }),
    
    // Sign In specific fields
    defineField({
      name: 'signInPageEnabled',
      title: 'Enable Sign In page',
      type: 'boolean',
      initialValue: false,
      hidden: ({ document }) => document?.pageType !== 'sign-in',
    }),
    defineField({
      name: 'signInHero',
      title: 'Hero',
      type: 'signInHeroMedia',
      hidden: ({ document }) => document?.pageType !== 'sign-in',
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
      name: 'spacesIssuuEmbed',
      title: 'Issuu Embed',
      type: 'issuuEmbed',
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

    // Gallery specific fields
    defineField({
      name: 'galleryImages',
      title: 'Images',
      type: 'gallery',
      hidden: ({ document }) => document?.pageType !== 'gallery',
    }),
    defineField({
      name: 'galleryCta',
      title: 'CTA Banner',
      type: 'ctaBanner',
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
      name: 'pressContentBlocks',
      title: 'Press Content Blocks',
      type: 'pressContentBlocks',
      description: 'Add and arrange press posts and testimonials',
      hidden: ({ document }) => document?.pageType !== 'press',
    }),
    defineField({
      name: 'pressCta',
      title: 'CTA Banner',
      type: 'ctaBanner',
      hidden: () => true, // CTA banner removed from press pages
    }),

    // Text specific fields
    defineField({
      name: 'textHero',
      title: 'Hero',
      type: 'flexibleHeroSection',
      hidden: ({ document }) => document?.pageType !== 'text',
    }),
    defineField({
      name: 'textBlocks',
      title: 'Text Blocks',
      type: 'array',
      of: [{ type: 'simpleTextBlock' }],
      hidden: ({ document }) => document?.pageType !== 'text',
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
})
