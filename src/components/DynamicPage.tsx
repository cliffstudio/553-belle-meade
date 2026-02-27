// src/components/DynamicPage.tsx
import React from 'react'
import { clientNoCdn } from '../../sanity.client'
import { pageQuery } from '../sanity/lib/queries'
import { notFound } from 'next/navigation'
import { SanityImage, SanityVideo, PortableTextBlock } from '../types/sanity'
import BodyClassProvider from './BodyClassProvider'
import { auth } from '../app/sign-in/actions'

// Import section components
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
import TextWithArtefacts from './TextWithArtefacts'
import ImageCarousel from './ImageCarousel'
// import ContactForm from './ContactForm'
import Form from './Form'
import LeasingMap from './LeasingMap'
import IssuuEmbed from './IssuuEmbed'
import VirtualTourEmbed from './VirtualTourEmbed'
import TextBlock from './TextBlock'
import FlexibleContent from './FlexibleContent'
import SimpleTextBlock from './SimpleTextBlock'
import FlexibleHeroSection from './FlexibleHeroSection'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

import SignInHeroMedia from './SignInHeroMedia'

const sectionComponents = {
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
  textWithArtefacts: TextWithArtefacts,
  imageCarousel: ImageCarousel,
  // contactForm: ContactForm,
  form: Form,
  leasingMap: LeasingMap,
  issuuEmbed: IssuuEmbed,
  virtualTourEmbed: VirtualTourEmbed,
  textBlock: TextBlock,
  signInHeroMedia: SignInHeroMedia,
  flexibleHeroSection: FlexibleHeroSection,
  simpleTextBlock: SimpleTextBlock,
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
        // addSection(sections, page.spacesContactForm, 'contactForm', 'spaces-contact-form')
        addSection(sections, page.spacesForm, 'form', 'spaces-form')
        addSection(sections, page.spacesCta, 'ctaBanner', 'spaces-cta')
        break

      case 'heritage':
        addSection(sections, page.heritageTextWithArtefacts, 'textWithArtefacts', 'heritage-text-with-artefacts')
        addSection(sections, page.heritageTextWithArtefacts2, 'textWithArtefacts', 'heritage-text-with-artefacts-2')
        addSection(sections, page.heritageImageCarousel, 'imageCarousel', 'heritage-image-carousel')
        addSection(sections, page.heritageCta, 'ctaBanner', 'heritage-cta')
        break

      case 'carousel':
        addSection(sections, page.carouselTextWithArtefacts, 'textWithArtefacts', 'carousel-text-with-artefacts')
        addSection(sections, page.carouselFullWidthMedia, 'fullWidthMedia', 'carousel-full-width-media')
        addSection(sections, page.carouselImageMasonry, 'imageMasonry', 'carousel-image-masonry')
        addSection(sections, page.carouselCta, 'ctaBanner', 'carousel-cta')
        break

      case 'gallery':
        addSection(sections, page.galleryImages, 'gallery', 'gallery-images')
        addSection(sections, page.galleryCta, 'ctaBanner', 'gallery-cta')
        break

      case 'press':
        addSection(sections, page.pressHero, 'heroMedia', 'press-hero')
        // pressContentBlocks will be rendered separately using FlexibleContent
        break

      case 'text':
        addSection(sections, page.textHero, 'flexibleHeroSection', 'text-hero')
        if (page.textBlocks && Array.isArray(page.textBlocks)) {
          page.textBlocks.forEach((block: unknown, index: number) => {
            if (block) {
              sections.push({ ...(block as Record<string, unknown>), _type: 'simpleTextBlock', _key: `text-block-${index}` })
            }
          })
        }
        break
        
      case 'general':
        // General pages use flexible content blocks
        // No sections to add here, flexible content will be rendered separately
        break
        
      case 'architecture':
        // Architecture page type has been removed
        // Return empty sections array to prevent errors
        break
        
      default:
        // Unknown page types return empty sections
        break
    }
    
    return sections
  }

  const sections = getSections()
  
  // Handle removed architecture page type - show not found
  if (page.pageType === 'architecture') {
    notFound()
  }
  
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

  // Handle press pages with press content blocks
  const pressContentBlocks = page.pageType === 'press' ? page.pressContentBlocks : null

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
              backgroundColour={backgroundColour as 'None' | 'Lilac' | 'Green' | 'Tan' | undefined}
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

        // Special handling for FlexibleHeroSection component
        if (section._type === 'flexibleHeroSection') {
          // Extract the individual props from the section data
          const {
            layout,
            desktopTitle,
            mobileTitle,
            backgroundMediaType,
            desktopBackgroundImage,
            mobileBackgroundImage,
            desktopBackgroundVideo,
            videoSource,
            desktopBackgroundVideoUrl,
            desktopBackgroundVideoPlaceholder,
            showControls,
            overlayDarkness,
            cta
          } = section
          
          const FlexibleHeroSectionComponent = Component as typeof FlexibleHeroSection
          return (
            <FlexibleHeroSectionComponent 
              key={section._key} 
              layout={layout as 'layout-1' | 'layout-2' | 'layout-3' | 'homepage' | undefined}
              desktopTitle={desktopTitle as string | undefined}
              mobileTitle={mobileTitle as string | undefined}
              backgroundMediaType={backgroundMediaType as 'image' | 'video' | undefined}
              desktopBackgroundImage={desktopBackgroundImage as SanityImage | undefined}
              mobileBackgroundImage={mobileBackgroundImage as SanityImage | undefined}
              desktopBackgroundVideo={desktopBackgroundVideo as SanityVideo | undefined}
              videoSource={videoSource as 'file' | 'url' | undefined}
              desktopBackgroundVideoUrl={desktopBackgroundVideoUrl as string | undefined}
              desktopBackgroundVideoPlaceholder={desktopBackgroundVideoPlaceholder as SanityImage | undefined}
              showControls={showControls as boolean | undefined}
              overlayDarkness={overlayDarkness as number | undefined}
              cta={cta as { linkType?: 'internal' | 'external'; label?: string; href?: string; pageLink?: { _ref: string; _type: 'reference'; slug?: string; title?: string } } | undefined}
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
      {pressContentBlocks && (
        <FlexibleContent contentBlocks={pressContentBlocks || []} />
      )}
    </>
  )
}
