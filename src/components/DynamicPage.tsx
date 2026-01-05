// src/components/DynamicPage.tsx
import React from 'react'
import { clientNoCdn } from '../../sanity.client'
import { pageQuery } from '../sanity/lib/queries'
import { notFound } from 'next/navigation'
import { SanityImage, SanityVideo, PortableTextBlock } from '../types/sanity'
import BodyClassProvider from './BodyClassProvider'
import { auth } from '../app/sign-in/actions'

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
import VirtualTourEmbed from './VirtualTourEmbed'
import TextBlock from './TextBlock'
import FlexibleContent from './FlexibleContent'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

import SignInHeroMedia from './SignInHeroMedia'

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
  virtualTourEmbed: VirtualTourEmbed,
  textBlock: TextBlock,
  signInHeroMedia: SignInHeroMedia,
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
  // Use non-CDN client to ensure fresh content bypasses Sanity CDN caching
  const page = await clientNoCdn.fetch(pageQuery, { slug: resolvedParams.slug }, {
    next: { revalidate: 0 }
  })

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
      case 'sign-in':
        // Note: Sign-in pages require special handling with auth function
        // This case is for CMS-managed sign-in pages that may not need authentication
        addSection(sections, page.signInHero, 'signInHeroMedia', 'sign-in-hero')
        break
        
      case 'walkthrough':
        addSection(sections, page.walkthroughHero, 'heroMedia', 'walkthrough-hero')
        sections.push({ 
          _type: 'virtualTourEmbed', 
          _key: 'spaces-virtual-tour-embed'
        })
        addSection(sections, page.walkthroughCta, 'ctaBanner', 'walkthrough-cta')
        break

      case 'spaces':
        addSection(sections, page.spacesHero, 'heroMedia', 'spaces-hero')
        addSection(sections, page.spacesLeasingMap, 'leasingMap', 'spaces-leasing-map')
        addSection(sections, page.spacesFullWidthMedia, 'fullWidthMedia', 'spaces-full-width-media')
        addSection(sections, page.spacesIssuuEmbed, 'issuuEmbed', 'spaces-issuu-embed')
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
        
      case 'general':
        // General pages use flexible content blocks
        // No sections to add here, flexible content will be rendered separately
        break
    }
    
    return sections
  }

  const sections = getSections()
  
  // Handle general pages with flexible content blocks
  if (page.pageType === 'general' && page.contentBlocks) {
    return (
      <>
        <BodyClassProvider 
          pageType={page.pageType} 
          slug={page.slug?.current} 
        />
        <FlexibleContent contentBlocks={page.contentBlocks || []} />
      </>
    )
  }

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
            desktopBackgroundVideoPlaceholder,
            showControls,
            overlayDarkness,
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
              videoSource={section.videoSource as 'file' | 'url' | undefined}
              desktopBackgroundVideoUrl={section.desktopBackgroundVideoUrl as string | undefined}
              desktopBackgroundVideoPlaceholder={desktopBackgroundVideoPlaceholder as SanityImage | undefined}
              showControls={showControls as boolean | undefined}
              overlayDarkness={overlayDarkness as number | undefined}
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
            videoSource,
            videoUrl,
            heading,
            body,
            cta,
            showControls,
            backgroundColour
          } = section
          
          const StackedMediaTextComponent = Component as typeof StackedMediaText
          return (
            <StackedMediaTextComponent 
              key={section._key} 
              layout={layout as 'layout-1' | 'layout-2' | undefined}
              mediaType={mediaType as 'image' | 'video' | undefined}
              image={image as SanityImage | undefined}
              video={video as SanityVideo | undefined}
              videoSource={videoSource as 'file' | 'url' | undefined}
              videoUrl={videoUrl as string | undefined}
              heading={heading as string | undefined}
              body={body as PortableTextBlock[] | undefined}
              cta={cta as { linkType?: 'internal' | 'external'; label?: string; href?: string; pageLink?: { _ref: string; _type: 'reference'; slug?: string; title?: string } } | undefined}
              showControls={showControls as boolean | undefined}
              backgroundColour={backgroundColour as 'Lilac' | 'Green' | 'Tan' | undefined}
            />
          )
        }

        // Special handling for Architects component
        if (section._type === 'architects') {
          // Extract the individual props from the section data
          const {
            heading,
            body,
            architects
          } = section
          
          const ArchitectsComponent = Component as typeof Architects
          return (
            <ArchitectsComponent 
              key={section._key} 
              heading={heading as string | undefined}
              body={body as PortableTextBlock[] | undefined}
              architects={architects as Array<{ 
                name: string; 
                bio: PortableTextBlock[]; 
                cta: { linkType?: 'internal' | 'external'; label?: string; href?: string; pageLink?: { _ref: string; _type: 'reference'; slug?: string; title?: string } } 
              }> | []}
            />
          )
        }

        // Special handling for SignInHeroMedia component
        if (section._type === 'signInHeroMedia') {
          // Extract the individual props from the section data
          const {
            backgroundMediaType,
            desktopBackgroundImage,
            mobileBackgroundImage,
            desktopBackgroundVideo,
            videoSource,
            desktopBackgroundVideoUrl,
            desktopBackgroundVideoPlaceholder,
            overlayDarkness
          } = section
          
          const SignInHeroMediaComponent = Component as typeof SignInHeroMedia
          return (
            <SignInHeroMediaComponent 
              key={section._key} 
              backgroundMediaType={backgroundMediaType as 'image' | 'video' | undefined}
              desktopBackgroundImage={desktopBackgroundImage as SanityImage | undefined}
              mobileBackgroundImage={mobileBackgroundImage as SanityImage | undefined}
              desktopBackgroundVideo={desktopBackgroundVideo as SanityVideo | undefined}
              videoSource={videoSource as 'file' | 'url' | undefined}
              desktopBackgroundVideoUrl={desktopBackgroundVideoUrl as string | undefined}
              desktopBackgroundVideoPlaceholder={desktopBackgroundVideoPlaceholder as SanityImage | undefined}
              overlayDarkness={overlayDarkness as number | undefined}
              auth={auth}
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
