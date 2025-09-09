import { PortableTextBlock } from './sanity'

export type Link = {
  label: string
  href: string
  isExternal?: boolean
}

export type Header = {
  leftNav: Link[]
  rightNav: Link[]
}

export type FooterItem = {
  heading?: string
  text?: PortableTextBlock[]
}

export type SocialLinks = {
  heading?: string
  links?: Link[]
}

export type Footer = {
  title?: string
  footerItems?: FooterItem[]
  socialLinks?: SocialLinks
  footerNav?: Link[]
}

export type FooterSettings = Footer
