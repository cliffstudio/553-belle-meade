// components/sections/CtaBanner.tsx

type PageReference = {
  _ref: string
  _type: 'reference'
  slug?: string
  title?: string
}

type CtaBannerProps = {
  pageLink?: PageReference
}

export default function CtaBanner({ pageLink }: CtaBannerProps) {
  if (!pageLink) return null

  const linkText = pageLink.title || ''
  const linkHref = pageLink.slug ? `/${pageLink.slug}` : ''

  return (
    <section className="cta-banner-block">
      {linkHref && (
        <div className="inner-wrap h-pad relative out-of-view">
          <h2>{linkText}</h2>

          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 27">
            <path d="M1 1L13.5 13.5L0.999999 26"/>
          </svg>

          <a href={linkHref}></a>
        </div>
      )}
    </section>
  )
}
