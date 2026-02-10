import { PortableTextBlock } from './sanity'

export type Link = {
  linkType: 'internal' | 'external' | 'jump'
  label?: string
  href?: string
  isExternal?: boolean
  pageLink?: {
    title?: string
    slug?: string
  }
  jumpLink?: string
}

export type Header = {
  leftNav: Link[]
  rightNav: Link[]
}

export type FooterItem = {
  heading?: string
  text?: PortableTextBlock[]
}

export type Footer = {
  title?: string
  column1FooterItems?: FooterItem[]
  column2FooterItems?: FooterItem[]
  footerNav?: Link[]
  newsletterText?: PortableTextBlock[]
}

export type FooterSettings = Footer
