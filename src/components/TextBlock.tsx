import { PortableText } from '@portabletext/react'
import { PortableTextBlock } from '../types/sanity'
import { portableTextComponents } from '../utils/portableTextComponents'

type TextBlockProps = {
  heading?: string
  body?: PortableTextBlock[]
}

export default function TextBlock({ heading, body }: TextBlockProps) {
  return (
    <section className="text-block h-pad">
      <div className="text-wrap out-of-view">
        {heading && <div className="heading cta-font">{heading}</div>}
        
        {body && <h2><PortableText value={body} components={portableTextComponents} /></h2>}
      </div>
    </section>
  )
}
