/* eslint-disable @typescript-eslint/no-unused-expressions */
'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import Symbol from './Symbol'
import { DisableBodyScroll, EnableBodyScroll } from '../utils/bodyScroll'

// Type for menu items from menuType schema
type MenuItem = {
  itemType: 'pageLink' | 'titleWithSubItems'
  pageLink?: {
    _id: string
    title?: string
    slug?: string
  }
  heading?: string
  subItems?: {
    pageLink: {
      _id: string
      title?: string
      slug?: string
    }
  }[]
}

// Type for menu from menuType schema
type Menu = {
  _id: string
  title: string
  items: MenuItem[]
}

interface HeaderProps {
  leftMenu?: Menu
  rightMenu?: Menu
}

export default function Header({ leftMenu, rightMenu }: HeaderProps) {
  const leftNavRef = useRef<HTMLElement>(null)
  const rightNavRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLElement>(null)
  const menuToggleRef = useRef<HTMLDivElement>(null)
  const menuOverlayRef = useRef<HTMLDivElement>(null)
  const menuOverlayInnerRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  
  // Menu state
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  // Check if we're on homepage for initial state
  const isHomepage = pathname === '/' || pathname === ''
  
  // Menu toggle functions
  const openMenu = () => {
    if (!isMenuOpen) {
      // Disable body scroll
      DisableBodyScroll()
      
      // Change menu toggle to active
      if (menuToggleRef.current) {
        menuToggleRef.current.classList.add('active')
      }
      
      // Fade in menu overlay
      if (menuOverlayRef.current) {
        menuOverlayRef.current.classList.add('visible')
      }

      // Fade in menu overlay inner
      setTimeout(() => {
        if (menuOverlayInnerRef.current) {
          menuOverlayInnerRef.current.classList.add('visible')
        }
      }, 400)
      
      setIsMenuOpen(true)
    }
  }
  
  const closeMenu = () => {
    if (isMenuOpen) {
      // Fade out menu overlay inner
      if (menuOverlayInnerRef.current) {
        menuOverlayInnerRef.current.classList.remove('visible')
      }

      // Change menu toggle to inactive
      if (menuToggleRef.current) {
        menuToggleRef.current.classList.remove('active')
      }

      // Fade out menu overlay
      if (menuOverlayRef.current) {
        menuOverlayRef.current.classList.remove('visible')
      }
      
      // Re-enable body scroll
      setTimeout(() => {
        EnableBodyScroll()
      }, 400)
      
      setIsMenuOpen(false)
    }
  }
  
  const toggleMenu = () => {
    if (isMenuOpen) {
      closeMenu()
    } else {
      openMenu()
    }
  }
  
  // Function to trigger final phase animation
  const triggerFinalPhaseAnimation = () => {
    // Animate header
    if (headerRef.current) {
      headerRef.current.classList.remove('header-hidden')
      headerRef.current.classList.add('header-fade-in')
    }
    
    // Animate text-wrap and down-arrow
    const textWrap = document.querySelector('.text-wrap')
    const downArrow = document.querySelector('.down-arrow')
    const videoControls = document.querySelector('.video-controls')
    
    if (textWrap) {
      textWrap.classList.add('fade-in')
    }
    if (downArrow) {
      downArrow.classList.add('fade-in')
    }
    if (videoControls) {
      videoControls.classList.add('fade-in')
    }
    
    // Re-enable scrolling after animation completes
    document.documentElement.classList.add('scroll-enabled')
  }

  // Helper function to check if a menu item is active
  const isActive = (href: string): boolean => {
    if (href === '#') return false
    // Remove leading slash for comparison
    const cleanHref = href.startsWith('/') ? href.slice(1) : href
    const cleanPathname = pathname.startsWith('/') ? pathname.slice(1) : pathname
    
    // Check for exact match or if pathname starts with the href
    return cleanPathname === cleanHref || cleanPathname.startsWith(cleanHref + '/')
  }

  // Convert menu items to Link format
  const convertMenuItemsToLinks = (items: MenuItem[]): { label: string; href: string; isExternal?: boolean; isActive?: boolean }[] => {
    return items.map(item => {
      if (item.itemType === 'pageLink' && item.pageLink) {
        const href = `/${item.pageLink.slug || ''}`
        return {
          label: item.pageLink.title || 'Untitled',
          href,
          isExternal: false,
          isActive: isActive(href)
        }
      } else if (item.itemType === 'titleWithSubItems' && item.heading) {
        // For title with sub-items, we'll use the heading as the label
        // and create a dropdown or expandable menu (for now, just use the heading)
        return {
          label: item.heading,
          href: '#', // Placeholder - could be expanded to show sub-items
          isExternal: false,
          isActive: false
        }
      }
      return {
        label: 'Untitled',
        href: '#',
        isExternal: false,
        isActive: false
      }
    })
  }

  useEffect(() => {
    const setNavItemWidths = () => {
      const navContainers = [leftNavRef.current, rightNavRef.current]
      
      navContainers.forEach(container => {
        if (!container) return
        
        const links = container.querySelectorAll('a')
        links.forEach(link => {
          // Clear any existing fixed widths to allow natural resizing
          link.style.width = ''
          link.style.minWidth = ''
          
          // Force a reflow to get the natural width with current font size
          link.offsetHeight
          
          // Set the width to the current font width (Millionaire-Roman)
          const currentWidth = link.offsetWidth
          link.style.width = `${currentWidth}px`
          link.style.minWidth = `${currentWidth}px`
        })
      })
    }

    // Set widths after component mounts
    setNavItemWidths()
    
    // Recalculate on window resize
    window.addEventListener('resize', setNavItemWidths)
    
    return () => {
      window.removeEventListener('resize', setNavItemWidths)
    }
  }, [leftMenu, rightMenu])

  // Handle scroll-based class addition
  useEffect(() => {
    const handleScroll = () => {
      if (!headerRef.current) return
      
      const headerHeight = headerRef.current.offsetHeight
      const scrollThreshold = window.innerHeight - headerHeight // 100vh - header height
      const scrollY = window.scrollY
      
      if (scrollY >= scrollThreshold) {
        headerRef.current.classList.add('header-scrolled')
      } else {
        headerRef.current.classList.remove('header-scrolled')
      }
    }

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll)
    
    // Check initial scroll position
    handleScroll()
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Handle homepage header animation
  useEffect(() => {
    if (!headerRef.current) return
    
    if (isHomepage) {
      // Hide header immediately on homepage
      headerRef.current.classList.add('header-hidden')
      
      // Show all final elements after 3.5 seconds (when symbol animation completes)
      const timer = setTimeout(() => {
        triggerFinalPhaseAnimation()
      }, 3500)
      
      return () => clearTimeout(timer)
    } else {
      // Show header immediately on other pages
      headerRef.current.classList.remove('header-hidden', 'header-fade-in')
      
      // Show text-wrap and down-arrow immediately on other pages
      const textWrap = document.querySelector('.text-wrap')
      const downArrow = document.querySelector('.down-arrow')
      const videoControls = document.querySelector('.video-controls')
      
      if (textWrap instanceof HTMLElement) {
        textWrap.classList.remove('fade-in')
        textWrap.style.opacity = '1'
      }
      if (downArrow instanceof HTMLElement) {
        downArrow.classList.remove('fade-in')
        downArrow.style.opacity = '1'
      }
      if (videoControls instanceof HTMLElement) {
        videoControls.classList.remove('fade-in')
        videoControls.style.opacity = '1'
      }
    }
  }, [pathname, isHomepage])

  // Convert menus to links
  const leftNav = leftMenu?.items ? convertMenuItemsToLinks(leftMenu.items) : []
  const rightNav = rightMenu?.items ? convertMenuItemsToLinks(rightMenu.items) : []

  // Handle case where both menus are undefined
  if (!leftMenu && !rightMenu) {
    return (
      <header ref={headerRef} className={`site-header z-500 h-pad ${isHomepage ? 'header-hidden' : ''}`}>
        <div className="inner-wrap row-lg">
          <nav className="left-nav col-5-12_lg">
            {/* Empty left nav */}
          </nav>

          <div className="col-2-12_lg">
            <div className="symbol">
              <Symbol />
              <Link href="/" />
            </div>
          </div>
          
          <nav className="right-nav col-5-12_lg">
            {/* Empty right nav */}
          </nav>
        </div>
      </header>
    )
  }

  return (
    <>
      <header ref={headerRef} className={`site-header z-500 h-pad ${isHomepage ? 'header-hidden' : ''}`}>
        <div className="inner-wrap row-lg row-sm">

          <div className="col-5-12_lg col-1-5_sm">
            <div className="desktop">
              <nav ref={leftNavRef} className="left-nav">
                {leftNav.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    target={link.isExternal ? '_blank' : undefined}
                    rel={link.isExternal ? 'noopener noreferrer' : undefined}
                    className={link.isActive ? 'active' : ''}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="mobile">
              <div className="menu-toggle" ref={menuToggleRef} onClick={toggleMenu}>
                <div className="menu-bar" data-position="top"></div>
                <div className="menu-bar" data-position="middle"></div>
                <div className="menu-bar" data-position="bottom"></div>
              </div>
            </div>
          </div>

          <div className="col-2-12_lg col-3-5_sm">
            <div className="symbol">
              <Symbol />
              <Link href="/" />
            </div>
          </div>

          <div className="col-5-12_lg col-1-5_sm">
            <div className="desktop">
              <nav ref={rightNavRef} className="right-nav">
                {rightNav.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    target={link.isExternal ? '_blank' : undefined}
                    rel={link.isExternal ? 'noopener noreferrer' : undefined}
                    className={link.isActive ? 'active' : ''}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

        </div>
      </header>

      <div className="menu-overlay z-400 h-pad" ref={menuOverlayRef}>
        <div className="inner-wrap" ref={menuOverlayInnerRef}>
          {leftNav.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              target={link.isExternal ? '_blank' : undefined}
              rel={link.isExternal ? 'noopener noreferrer' : undefined}
              className={`header-menu-item ${link.isActive ? 'active' : ''}`}
              onClick={closeMenu}
            >
              {link.label}
            </Link>
          ))}

          {rightNav.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              target={link.isExternal ? '_blank' : undefined}
              rel={link.isExternal ? 'noopener noreferrer' : undefined}
              className={`header-menu-item ${link.isActive ? 'active' : ''}`}
              onClick={closeMenu}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
