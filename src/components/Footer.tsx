'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { PortableText } from '@portabletext/react'
import Logo from './Logo'
import type { Footer } from '../types/footerSettings'
import StackedLogo from './StackedLogo'
import { portableTextComponents } from '../utils/portableTextComponents'

interface FooterProps {
  footer: Footer
}

export default function Footer({ footer }: FooterProps) {
  useEffect(() => {
    // Add Mailchimp CSS if not already added
    if (!document.querySelector('link[href*="mailchimp.com/embedcode"]')) {
      const link = document.createElement('link')
      link.href = '//cdn-images.mailchimp.com/embedcode/classic-061523.css'
      link.rel = 'stylesheet'
      link.type = 'text/css'
      document.head.appendChild(link)
    }
  }, [])

  return (
    <footer className="site-footer h-pad">
      <div className="top-row row-lg">
        <div className="column-1 col-3-12_lg">
          {footer.column1FooterItems && footer.column1FooterItems.map((item, index) => (
            <div key={index}>
              {item.heading && (
                <div className="cta-font heading">{item.heading}</div>
              )}
              {item.text && (
                <div>
                  <PortableText value={item.text} components={portableTextComponents} />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="column-2 col-6-12_lg">
          {footer.column2FooterItems && footer.column2FooterItems.map((item, index) => (
            <div key={index}>
              {item.heading && (
                <div className="cta-font heading">{item.heading}</div>
              )}
              {item.text && (
                <div>
                  <PortableText value={item.text} components={portableTextComponents} />
                </div>
              )}
            </div>
          ))}

          {footer.footerNav?.map((link, index) => {
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
              <div key={index} className="underline-link cream uppercase cta-font">
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
        
        <div className="column-3 col-3-12_lg">
          <div id="mc_embed_shell_desktop">
            <div id="mc_embed_signup_desktop">
              {footer.newsletterText && (
                <div className="newsletter-text cta-font">
                  <PortableText value={footer.newsletterText} components={portableTextComponents} />
                </div>
              )}
              
              <form action="https://bmvillage.us4.list-manage.com/subscribe/post?u=b09c67fbb5b3ce6ee63196093&amp;id=4824c65abe&amp;f_id=00de6ceaf0" method="post" id="mc-embedded-subscribe-form-desktop" name="mc-embedded-subscribe-form-desktop" className="validate" target="_blank" noValidate>
                <div id="mc_embed_signup_scroll_desktop">
                  <div className="mc-field-group">
                    <div className="input-wrap">
                      <input type="email" name="EMAIL" className="required email" id="mce-EMAIL-desktop" placeholder="Email Address" required defaultValue="" />
                      <button type="submit" name="subscribe" id="mc-embedded-subscribe-desktop" className="button" aria-label="Subscribe">
                        <svg xmlns="http://www.w3.org/2000/svg" width="7" height="12" viewBox="0 0 7 12">
                          <path d="M0.353516 0.353516L5.85352 5.85352L0.353516 11.3535"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div id="mce-responses-desktop" className="clear foot">
                    <div className="response" id="mce-error-response-desktop" style={{ display: 'none' }}></div>
                    <div className="response" id="mce-success-response-desktop" style={{ display: 'none' }}></div>
                  </div>
                  <div aria-hidden="true" style={{ position: 'absolute', left: '-5000px' }}>
                    <input type="text" name="b_b09c67fbb5b3ce6ee63196093_4824c65abe" tabIndex={-1} readOnly />
                  </div>
                </div>
              </form>

              <p>By signing up, you are agreeing to our <Link href="/privacy-policy">privacy policy</Link></p>
            </div>
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
