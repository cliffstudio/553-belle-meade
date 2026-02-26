// components/sections/CtaBanner.tsx

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

type CtaBannerProps = {
  cta?: Link
}

// Helper function to get link text and href from cta
const getLinkInfo = (cta?: Link) => {
  if (!cta) return { text: '', href: '' }
  
  if (cta.linkType === 'external') {
    return { text: cta.label || '', href: cta.href || '' }
  } else if (cta.linkType === 'jump') {
    return { text: cta.label || '', href: cta.jumpLink || '' }
  } else {
    return { text: cta.label || cta.pageLink?.title || '', href: cta.pageLink?.slug ? `/${cta.pageLink.slug}` : '' }
  }
}

export default function CtaBanner({ cta }: CtaBannerProps) {
  const { text, href } = getLinkInfo(cta)
  
  if (!href) return null

  return (
    <section className="cta-banner-block">
      <div className="inner-wrap h-pad relative out-of-view">
        <div className="h2 link-text">{text}</div>

        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 27">
          <path d="M1 1L13.5 13.5L0.999999 26"/>
        </svg>

        <a 
          href={href} 
          target={cta?.linkType === 'external' ? '_blank' : undefined} 
          rel={cta?.linkType === 'external' ? 'noopener noreferrer' : undefined}
        ></a>
      </div>
    </section>
  )
}
