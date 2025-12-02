import { PortableText } from '@portabletext/react'
import { PortableTextBlock } from '../types/sanity'

type TextBlockProps = {
  heading?: string
  body?: PortableTextBlock[]
}

export default function TextBlock({ heading, body }: TextBlockProps) {
  return (
    <section className="text-block h-pad">
      <div className="row-lg">
        <div className="col-6-12_lg out-of-view">
          <div className="text-wrap">
            {heading && <div className="heading cta-font">{heading}</div>}
            
            {body && <h2><PortableText value={body} /></h2>}
          </div>
        </div>
      </div>
    </section>
  )
}
