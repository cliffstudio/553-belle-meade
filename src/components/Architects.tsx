import { PortableText } from '@portabletext/react'
import { PortableTextBlock } from '../types/sanity'

type PageReference = {
  _ref: string
  _type: 'reference'
  slug?: string
  title?: string
}

type Link = {
  linkType?: 'internal' | 'external' | 'jump'
  label?: string
  href?: string
  pageLink?: PageReference
  jumpLink?: string
}

type Architect = {
  name: string
  bio: PortableTextBlock[]
  cta: Link
}

type ArchitectsProps = {
  heading?: string
  architects: Architect[]
}

// Helper function to get link text and href from cta
const getLinkInfo = (cta?: Link) => {
  if (!cta) return { text: '', href: '' }
  
  if (cta.linkType === 'external') {
    return { text: cta.label || '', href: cta.href || '' }
  } else if (cta.linkType === 'jump') {
    return { text: cta.label || '', href: cta.jumpLink || '' }
  } else {
    return { text: cta.pageLink?.title || '', href: cta.pageLink?.slug ? `/${cta.pageLink.slug}` : '' }
  }
}

export default function Architects({ heading, architects }: ArchitectsProps) {
  if (!architects || architects.length === 0) {
    return null
  }

  return (
    <section className="architects-block h-pad">
      <div className="inner-wrap row-lg">
        {heading && (
          <div className="col-4-12_lg">
            <h2 className="heading out-of-view">{heading}</h2>
          </div>
        )}

        <div className="architects-grid col-8-12_lg">
          {architects.map((architect, index) => {
            const { text, href } = getLinkInfo(architect.cta)
            
            return (
              <div key={index} className="architect-item out-of-view">
                <div className="architect-content">
                  {architect.name && (
                    <h3 className="architect-name">{architect.name}</h3>
                  )}
                  {architect.bio && (
                    <div className="architect-bio">
                      <PortableText value={architect.bio} />
                    </div>
                  )}
                  {href && <div className="cta-font underline-link link">
                    <a href={href}>{text}</a>

                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 27">
                      <path d="M1 1L13.5 13.5L0.999999 26"/>
                    </svg>
                  </div>}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
