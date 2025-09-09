import { client } from '../../../sanity.client'
import { homepageQuery } from '../../sanity/lib/queries'
import HomeHeroMedia from '../../components/HomeHeroMedia'
import LinkTiles from '../../components/LinkTiles'
import FullWidthMedia from '../../components/FullWidthMedia'
import TextWithMedia from '../../components/TextWithMedia'
import ImageMasonry from '../../components/ImageMasonry'

export default async function Home() {
  const homepage = await client.fetch(homepageQuery)
  
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
      {homepage.homepageHero && <HomeHeroMedia {...homepage.homepageHero} />}
      {homepage.homepageLinkTiles && <LinkTiles {...homepage.homepageLinkTiles} />}
      {homepage.homepageFullWidthMedia && <FullWidthMedia {...homepage.homepageFullWidthMedia} />}
      {homepage.homepageTextWithMedia && <TextWithMedia {...homepage.homepageTextWithMedia} pageType="homepage" />}
      {homepage.homepageImageMasonry && <ImageMasonry {...homepage.homepageImageMasonry} />}
    </>
  )
}
