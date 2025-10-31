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
        {/* todo: hook up to Mailchimp */}
        <div className="column-3 col-3-12_lg mobile">
          <div className="mailing-list-form">
            <div className="input-wrap">
              <input type="text" placeholder="Email Address" />

              <svg xmlns="http://www.w3.org/2000/svg" width="7" height="12" viewBox="0 0 7 12">
                <path d="M0.353516 0.353516L5.85352 5.85352L0.353516 11.3535"/>
              </svg>
            </div>

            <p>By signing up, you agree to our <Link href="/privacy-policy">privacy policy</Link></p>
          </div>
        </div>
        
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
                  let href = ''
                  if (link.linkType === 'external') {
                    href = link.href || ''
                  } else if (link.linkType === 'jump') {
                    href = link.jumpLink || ''
                  } else {
                    href = link.pageLink?.slug ? `/${link.pageLink.slug}` : ''
                  }
                  
                  const label = link.label || link.pageLink?.title
                  
                  // Skip rendering if href is undefined
                  if (!href) return null
                  
                  return (
                    <Link
                      key={index}
                      href={href}
                      target={link.linkType === 'external' ? '_blank' : undefined}
                      rel={link.linkType === 'external' ? 'noopener noreferrer' : undefined}
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
                let href = ''
                if (link.linkType === 'external') {
                  href = link.href || ''
                } else if (link.linkType === 'jump') {
                  href = link.jumpLink || ''
                } else {
                  href = link.pageLink?.slug ? `/${link.pageLink.slug}` : ''
                }
                
                const label = link.label || link.pageLink?.title
                
                // Skip rendering if href is undefined
                if (!href) return null
                
                return (
                  <div key={index} className="underline-link cream">
                    <Link
                      href={href}
                      target={link.linkType === 'external' ? '_blank' : undefined}
                      rel={link.linkType === 'external' ? 'noopener noreferrer' : undefined}
                    >
                      {label}
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* todo: hook up to Mailchimp */}
        <div className="column-3 col-3-12_lg desktop">
          <div className="mailing-list-form">
            <div className="input-wrap">
              <input type="text" placeholder="Email Address" />

              <svg xmlns="http://www.w3.org/2000/svg" width="7" height="12" viewBox="0 0 7 12">
                <path d="M0.353516 0.353516L5.85352 5.85352L0.353516 11.3535"/>
              </svg>
            </div>

            <p>By signing up, you agree to our <Link href="/privacy-policy">privacy policy</Link></p>
          </div>
        </div>
      </div>

      <div className="logo desktop">
        <Logo />
      </div>

      <div className="logo mobile">
        <StackedLogo />
      </div>
    </footer>
  )
}
