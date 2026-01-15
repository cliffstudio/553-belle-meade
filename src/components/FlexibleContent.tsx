import React from 'react'
import LinkTiles from './LinkTiles'
import StackedMediaText from './StackedMediaText'
import FlexibleHeroSection from './FlexibleHeroSection'
import TextBlock from './TextBlock'
import FullWidthMedia from './FullWidthMedia'
import LargeMediaText from './LargeMediaText'
import ImageMasonry from './ImageMasonry'
import StaggeredImages from './StaggeredImages'
import SmallMediaText from './SmallMediaText'
import CtaBanner from './CtaBanner'
import Architects from './Architects'
import PressPostsSection from './PressPostsSection'
import TestimonialSection from './TestimonialSection'

interface ContentBlock {
  _type: string
  _key?: string
  [key: string]: unknown
}

interface FlexibleContentProps {
  contentBlocks: ContentBlock[]
}

const FlexibleContent: React.FC<FlexibleContentProps> = ({ contentBlocks }) => {
  if (!contentBlocks || contentBlocks.length === 0) {
    return null
  }

  return (
    <div className="flexible-content">
      {contentBlocks.map((block, index) => {
        const key = block._key || `block-${index}`
        
        switch (block._type) {
          case 'flexibleHeroSection':
            return <FlexibleHeroSection key={key} {...(block as ContentBlock)} />
          case 'linkTiles':
            return <LinkTiles key={key} {...(block as ContentBlock)} />
          case 'stackedMediaText':
            return <StackedMediaText key={key} {...(block as ContentBlock)} />
          case 'textBlock':
            return <TextBlock key={key} {...(block as ContentBlock)} />
          case 'fullWidthMedia':
            return <FullWidthMedia key={key} {...(block as ContentBlock)} />
          case 'largeMediaText':
            return <LargeMediaText key={key} {...(block as ContentBlock)} />
          case 'imageMasonry':
            return <ImageMasonry key={key} {...(block as ContentBlock)} />
          case 'staggeredImages':
            return <StaggeredImages key={key} {...(block as ContentBlock)} />
          case 'smallMediaText':
            return <SmallMediaText key={key} {...(block as ContentBlock)} />
          case 'ctaBanner':
            return <CtaBanner key={key} {...(block as ContentBlock)} />
          case 'architects':
            return <Architects key={key} {...(block as ContentBlock)} />
          case 'pressPostsSection':
            return <PressPostsSection key={key} {...(block as ContentBlock)} />
          case 'testimonialSection':
            return <TestimonialSection key={key} {...(block as ContentBlock)} />
          default:
            console.warn(`Unknown content block type: ${block._type}`)
            return null
        }
      })}
    </div>
  )
}

export default FlexibleContent

