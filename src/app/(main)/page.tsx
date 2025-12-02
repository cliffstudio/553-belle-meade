import { clientNoCdn } from '../../../sanity.client'
import { homepageQuery } from '../../sanity/lib/queries'
import HomeHeroMedia from '../../components/HomeHeroMedia'
import TextBlock from '../../components/TextBlock'
import LinkTiles from '../../components/LinkTiles'
import FullWidthMedia from '../../components/FullWidthMedia'
import StackedMediaText from '../../components/StackedMediaText'
import LargeMediaText from '../../components/LargeMediaText'
import ImageMasonry from '../../components/ImageMasonry'
import BodyClassProvider from '../../components/BodyClassProvider'

// Disable static generation for this page to ensure fresh content from Sanity
export const revalidate = 0

export default async function Home() {
  // Use non-CDN client to bypass Sanity CDN caching and ensure fresh content
  // This ensures the latest video and content updates appear immediately on live site
  const homepage = await clientNoCdn.fetch(homepageQuery, {}, {
    next: { revalidate: 0 }
  })
  
  if (!homepage) {
    return (
      <div>
        <h1>Home Page</h1>
        <p>No homepage content found. Please create a page with pageType &quot;homepage&quot; in Sanity.</p>
      </div>
    )
  }

  return (
    <>
      <BodyClassProvider 
        pageType={homepage.pageType} 
        slug={homepage.slug?.current} 
      />
      {homepage.homepageHero && <HomeHeroMedia {...homepage.homepageHero} />}
      {homepage.homepageTextBlock && <TextBlock {...homepage.homepageTextBlock} />}
      {homepage.homepageLinkTiles && <LinkTiles {...homepage.homepageLinkTiles} />}
      {homepage.homepageFullWidthMedia && <FullWidthMedia {...homepage.homepageFullWidthMedia} />}
      {homepage.homepageStackedMediaText && <StackedMediaText {...homepage.homepageStackedMediaText} />}
      {homepage.homepageLargeMediaText && <LargeMediaText {...homepage.homepageLargeMediaText} pageType="homepage" />}
      {homepage.homepageImageMasonry && <ImageMasonry {...homepage.homepageImageMasonry} />}
    </>
  )
}
