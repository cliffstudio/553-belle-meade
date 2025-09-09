// src/components/DynamicPage.tsx
import { client } from '../../sanity.client'
import { pageQuery } from '../sanity/utils/pageQueries'
import { notFound } from 'next/navigation'
import { SanityImage, SanityVideo } from '../types/sanity'

// Import section components
import HomeHeroMedia from './HomeHeroMedia'
import HeroMedia from './HeroMedia'
import LinkTiles from './LinkTiles'
import FullWidthMedia from './FullWidthMedia'
import TextWithMedia from './TextWithMedia'
import ImageMasonry from './ImageMasonry'
import StaggeredImages from './StaggeredImages'
import CtaBanner from './CtaBanner'

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
  textWithMedia: TextWithMedia,
  imageMasonry: ImageMasonry,
  staggeredImages: StaggeredImages,
  ctaBanner: CtaBanner,
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
      case 'shopping':
        addSection(sections, page.shoppingHero, 'heroMedia', 'shopping-hero')
        addSection(sections, page.shoppingStaggered, 'staggeredImages', 'shopping-staggered')
        addSection(sections, page.shoppingFullWidthMedia, 'fullWidthMedia', 'shopping-full-width-media')
        addSection(sections, page.shoppingTextWithMedia, 'textWithMedia', 'shopping-text-with-media')
        addSection(sections, page.shoppingCta, 'ctaBanner', 'shopping-cta')
        break
        
      // case 'general':
      //   addSection(sections, page.generalHero, 'heroMedia', 'general-hero')
      //   addSection(sections, page.generalFullWidthMedia, 'fullWidthMedia', 'general-full-width-media')
      //   addSection(sections, page.generalTextWithMedia, 'textWithMedia', 'general-text-with-media')
      //   addSection(sections, page.generalImageMasonry, 'imageMasonry', 'general-image-masonry')
      //   addSection(sections, page.generalStaggeredImages, 'staggeredImages', 'general-staggered-images')
      //   addSection(sections, page.generalCtaBanner, 'ctaBanner', 'general-cta-banner')
      //   break
    }
    
    return sections
  }

  const sections = getSections()

  return (
    <>
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
            desktopTitle,
            mobileTitle,
            backgroundMediaType,
            desktopBackgroundImage,
            mobileBackgroundImage,
            desktopBackgroundVideo,
            mobileBackgroundVideo,
            showControls,
            overlayDarkness
          } = section
          
          return (
            <Component 
              key={section._key} 
              desktopTitle={desktopTitle as string | undefined}
              mobileTitle={mobileTitle as string | undefined}
              backgroundMediaType={backgroundMediaType as 'image' | 'video' | undefined}
              desktopBackgroundImage={desktopBackgroundImage as SanityImage | undefined}
              mobileBackgroundImage={mobileBackgroundImage as SanityImage | undefined}
              desktopBackgroundVideo={desktopBackgroundVideo as SanityVideo | undefined}
              mobileBackgroundVideo={mobileBackgroundVideo as SanityVideo | undefined}
              showControls={showControls as boolean | undefined}
              overlayDarkness={overlayDarkness as number | undefined}
            />
          )
        }

        // Pass pageType to TextWithMedia component for different layouts
        if (section._type === 'textWithMedia') {
          return <Component key={section._key} {...section} pageType={page.pageType} />
        }

        return <Component key={section._key} {...section} />
      })}
    </>
  )
}
