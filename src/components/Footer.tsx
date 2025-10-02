'use client'

import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import Logo from './Logo'
import type { Footer } from '../types/footerSettings'
import StackedLogo from './StackedLogo'

interface FooterProps {
  footer: Footer
}

export default function Footer({ footer }: FooterProps) {
  return (
    <footer className="site-footer h-pad">
      <div className="top-row row-lg">
        <div className="column-1 col-3-12_lg">
          {footer.footerItems && footer.footerItems.map((item, index) => (
            <div key={index}>
              {item.heading && (
                <div className="cta-font heading">{item.heading}</div>
              )}
              {item.text && (
                <div>
                  <PortableText value={item.text} />
                </div>
              )}
            </div>
          ))}

          {footer.socialLinks && (
            <div>
              {footer.socialLinks.heading && (
                <div className="cta-font heading">{footer.socialLinks.heading}</div>
              )}
              <div className="social-links">
                {footer.socialLinks.links?.map((link, index) => {
                  const href = link.isExternal ? link.href : `/${link.pageLink?.slug}`
                  const label = link.label || link.pageLink?.title
                  
                  // Skip rendering if href is undefined
                  if (!href) return null
                  
                  return (
                    <Link
                      key={index}
                      href={href}
                      target={link.isExternal ? '_blank' : undefined}
                      rel={link.isExternal ? 'noopener noreferrer' : undefined}
                      className=""
                    >
                      {label}
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {footer.footerNav && footer.footerNav.length > 0 && (
          <div className="column-2 col-6-12_lg uppercase">
            <div className="text-wrap">
              {footer.footerNav.map((link, index) => {
                const href = link.isExternal ? link.href : `/${link.pageLink?.slug}`
                const label = link.label || link.pageLink?.title
                
                // Skip rendering if href is undefined
                if (!href) return null
                
                return (
                  <Link
                    key={index}
                    href={href}
                    target={link.isExternal ? '_blank' : undefined}
                    rel={link.isExternal ? 'noopener noreferrer' : undefined}
                    className=""
                  >
                    {label}
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* todo: mailing list form */}
        {/* <div className="col-3-12_lg"></div> */}
      </div>

      <div className="desktop">
        <Logo />
      </div>

      <div className="mobile">
        <StackedLogo />
      </div>
    </footer>
  )
}
