// src/components/DynamicPage.tsx
import React from 'react'
import { client } from '../../sanity.client'
import { pageQuery } from '../sanity/lib/queries'
import { notFound } from 'next/navigation'
import { SanityImage, SanityVideo, PortableTextBlock } from '../types/sanity'
import BodyClassProvider from './BodyClassProvider'

// Import section components
import HomeHeroMedia from './HomeHeroMedia'
import HeroMedia from './HeroMedia'
import LinkTiles from './LinkTiles'
import FullWidthMedia from './FullWidthMedia'
import ImageMasonry from './ImageMasonry'
import StaggeredImages from './StaggeredImages'
import CtaBanner from './CtaBanner'
import SmallMediaText from './SmallMediaText'
import LargeMediaText from './LargeMediaText'
import StackedMediaText from './StackedMediaText'
import Gallery from './Gallery'
import Architects from './Architects'
import PressSection from './PressSection'
import TextWithArtefacts from './TextWithArtefacts'
import ImageCarousel from './ImageCarousel'
import ContactForm from './ContactForm'
import LeasingMap from './LeasingMap'
import IssuuEmbed from './IssuuEmbed'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

const sectionComponents = {
  homeHeroMedia: HomeHeroMedia,
  heroMedia: HeroMedia,
  linkTiles: LinkTiles,
  fullWidthMedia: FullWidthMedia,
  imageMasonry: ImageMasonry,
  staggeredImages: StaggeredImages,
  ctaBanner: CtaBanner,
  smallMediaText: SmallMediaText,
  largeMediaText: LargeMediaText,
  stackedMediaText: StackedMediaText,
  gallery: Gallery,
  architects: Architects,
  pressSection: PressSection,
  textWithArtefacts: TextWithArtefacts,
  imageCarousel: ImageCarousel,
  contactForm: ContactForm,
  leasingMap: LeasingMap,
  issuuEmbed: IssuuEmbed,
}


// Helper function to add a section if it exists
const addSection = (
  sections: Array<{ _type: string; _key: string; [key: string]: unknown }>,
  sectionData: unknown,
  sectionType: string,
  sectionKey: string
) => {
  if (sectionData) {
    sections.push({ ...sectionData, _type: sectionType, _key: sectionKey })
  }
}

export default async function DynamicPage({ params }: PageProps) {
  const resolvedParams = await params
  const page = await client.fetch(pageQuery, { slug: resolvedParams.slug })

  if (!page) {
    notFound()
  }


  // Get the appropriate sections based on page type
  const getSections = () => {
    const sections: Array<{
      _type: string
      _key: string
      [key: string]: unknown
    }> = []
    
    switch (page.pageType) {
      case 'homepage':
        addSection(sections, page.homepageHero, 'homeHeroMedia', 'homepage-hero')
        addSection(sections, page.homepageLinkTiles, 'linkTiles', 'homepage-link-tiles')
        addSection(sections, page.homepageFullWidthMedia, 'fullWidthMedia', 'homepage-full-width-media')
        addSection(sections, page.homepageLargeMediaText, 'largeMediaText', 'homepage-large-media-text')
        addSection(sections, page.homepageImageMasonry, 'imageMasonry', 'homepage-image-masonry')
        break
        
      case 'shopping':
        addSection(sections, page.shoppingHero, 'heroMedia', 'shopping-hero')
        addSection(sections, page.shoppingStaggered, 'staggeredImages', 'shopping-staggered')
        addSection(sections, page.shoppingFullWidthMedia, 'fullWidthMedia', 'shopping-full-width-media')
        addSection(sections, page.shoppingSmallMediaText, 'smallMediaText', 'shopping-small-media-text')
        addSection(sections, page.shoppingCta, 'ctaBanner', 'shopping-cta')
        break
        
      case 'walkthrough':
        addSection(sections, page.walkthroughHero, 'heroMedia', 'walkthrough-hero')
        addSection(sections, page.walkthroughCta, 'ctaBanner', 'walkthrough-cta')
        break

      case 'spaces':
        addSection(sections, page.spacesHero, 'heroMedia', 'spaces-hero')
        // Add LeasingMap component directly (not from CMS)
        sections.push({ 
          _type: 'leasingMap', 
          _key: 'spaces-leasing-map',
          // You can customize these props as needed
          heading: 'Available Spaces'
        })
        // Add IssuuEmbed component directly (not from CMS)
        sections.push({ 
          _type: 'issuuEmbed', 
          _key: 'spaces-issuu-embed'
        })
        addSection(sections, page.spacesFullWidthMedia, 'fullWidthMedia', 'spaces-full-width-media')
        addSection(sections, page.spacesContactForm, 'contactForm', 'spaces-contact-form')
        addSection(sections, page.spacesCta, 'ctaBanner', 'spaces-cta')
        break

      case 'heritage':
        addSection(sections, page.heritageTextWithArtefacts, 'textWithArtefacts', 'heritage-text-with-artefacts')
        addSection(sections, page.heritageTextWithArtefacts2, 'textWithArtefacts', 'heritage-text-with-artefacts-2')
        addSection(sections, page.heritageImageCarousel, 'imageCarousel', 'heritage-image-carousel')
        addSection(sections, page.heritageCta, 'ctaBanner', 'heritage-cta')
        break

      case 'creek':
        addSection(sections, page.creekHero, 'heroMedia', 'creek-hero')
        addSection(sections, page.creekStaggered, 'staggeredImages', 'creek-staggered')
        addSection(sections, page.creekStackedMediaText, 'stackedMediaText', 'creek-stacked-media-text')
        addSection(sections, page.creekFullWidthMedia, 'fullWidthMedia', 'creek-full-width-media')
        addSection(sections, page.creekCta, 'ctaBanner', 'creek-cta')
        break

      case 'carousel':
        addSection(sections, page.carouselTextWithArtefacts, 'textWithArtefacts', 'carousel-text-with-artefacts')
        addSection(sections, page.carouselFullWidthMedia, 'fullWidthMedia', 'carousel-full-width-media')
        addSection(sections, page.carouselImageMasonry, 'imageMasonry', 'carousel-image-masonry')
        addSection(sections, page.carouselCta, 'ctaBanner', 'carousel-cta')
        break

      case 'architecture':
        addSection(sections, page.architectureHero, 'heroMedia', 'architecture-hero')
        addSection(sections, page.architectureImageMasonry, 'imageMasonry', 'architecture-image-masonry')
        addSection(sections, page.architectureStackedMediaText, 'stackedMediaText', 'architecture-stacked-media-text')
        addSection(sections, page.architectureFullWidthMedia, 'fullWidthMedia', 'architecture-full-width-media')
        addSection(sections, page.architectureLargeMediaText, 'largeMediaText', 'architecture-large-media-text')
        addSection(sections, page.architectureArchitects, 'architects', 'architecture-architects')
        addSection(sections, page.architectureCta, 'ctaBanner', 'architecture-cta')
        break

      case 'gallery':
        addSection(sections, page.galleryImages, 'gallery', 'gallery-images')
        break

      case 'press':
        addSection(sections, page.pressHero, 'heroMedia', 'press-hero')
        addSection(sections, page.pressSection, 'pressSection', 'press-section')
        addSection(sections, page.pressCta, 'ctaBanner', 'press-cta')
        break
    }
    
    return sections
  }

  const sections = getSections()

  return (
    <>
      <BodyClassProvider 
        pageType={page.pageType} 
        slug={page.slug?.current} 
      />
      {sections.map((section: {
        _type: string
        _key: string
        [key: string]: unknown
      }) => {
        const Component = sectionComponents[section._type as keyof typeof sectionComponents]
        
        if (!Component) {
          return null
        }

        // Special handling for HeroMedia component
        if (section._type === 'heroMedia') {
          // Extract the individual props from the section data
          const {
            layout,
            desktopTitle,
            mobileTitle,
            backgroundMediaType,
            desktopBackgroundImage,
            mobileBackgroundImage,
            desktopBackgroundVideo,
            mobileBackgroundVideo,
            showControls,
            overlayDarkness,
            body,
            cta
          } = section
          
          const HeroMediaComponent = Component as typeof HeroMedia
          return (
            <HeroMediaComponent 
              key={section._key} 
              layout={layout as 'layout-1' | 'layout-2' | undefined}
              desktopTitle={desktopTitle as string | undefined}
              mobileTitle={mobileTitle as string | undefined}
              backgroundMediaType={backgroundMediaType as 'image' | 'video' | undefined}
              desktopBackgroundImage={desktopBackgroundImage as SanityImage | undefined}
              mobileBackgroundImage={mobileBackgroundImage as SanityImage | undefined}
              desktopBackgroundVideo={desktopBackgroundVideo as SanityVideo | undefined}
              mobileBackgroundVideo={mobileBackgroundVideo as SanityVideo | undefined}
              showControls={showControls as boolean | undefined}
              overlayDarkness={overlayDarkness as number | undefined}
              body={body as PortableTextBlock[] | undefined}
              cta={cta as { linkType?: 'internal' | 'external'; label?: string; href?: string; pageLink?: { _ref: string; _type: 'reference'; slug?: string; title?: string } } | undefined}
            />
          )
        }

        // Special handling for StackedMediaText component
        if (section._type === 'stackedMediaText') {
          // Extract the individual props from the section data
          const {
            layout,
            mediaType,
            image,
            video,
            heading,
            body,
            cta,
            showControls
          } = section
          
          const StackedMediaTextComponent = Component as typeof StackedMediaText
          return (
            <StackedMediaTextComponent 
              key={section._key} 
              layout={layout as 'layout-1' | 'layout-2' | undefined}
              mediaType={mediaType as 'image' | 'video' | undefined}
              image={image as SanityImage | undefined}
              video={video as SanityVideo | undefined}
              heading={heading as string | undefined}
              body={body as PortableTextBlock[] | undefined}
              cta={cta as { linkType?: 'internal' | 'external'; label?: string; href?: string; pageLink?: { _ref: string; _type: 'reference'; slug?: string; title?: string } } | undefined}
              showControls={showControls as boolean | undefined}
            />
          )
        }

        // Special handling for Architects component
        if (section._type === 'architects') {
          // Extract the individual props from the section data
          const {
            heading,
            architects
          } = section
          
          const ArchitectsComponent = Component as typeof Architects
          return (
            <ArchitectsComponent 
              key={section._key} 
              heading={heading as string | undefined}
              architects={architects as Array<{ 
                name: string; 
                bio: PortableTextBlock[]; 
                cta: { linkType?: 'internal' | 'external'; label?: string; href?: string; pageLink?: { _ref: string; _type: 'reference'; slug?: string; title?: string } } 
              }> | []}
            />
          )
        }

        // Default handling for all other components
        // TypeScript assertion to ensure proper typing for generic components
        const GenericComponent = Component as React.ComponentType<Record<string, unknown>>
        return <GenericComponent key={section._key} {...(section as Record<string, unknown>)} />
      })}
    </>
  )
}
