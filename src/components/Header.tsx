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
  const [headerExtraHeight, setHeaderExtraHeight] = useState(0)
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null)
  
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
    const textWrap = document.querySelector('.page-type-homepage .text-wrap')
    const downArrow = document.querySelector('.page-type-homepage .down-arrow')
    const videoControls = document.querySelector('.page-type-homepage .video-controls')
    
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

  // Helper function to check if any sub-item is active
  const hasActiveSubItem = (item: MenuItem): boolean => {
    if (item.itemType === 'titleWithSubItems' && item.subItems) {
      return item.subItems.some(subItem => {
        const href = `/${subItem.pageLink?.slug || ''}`
        return isActive(href)
      })
    }
    return false
  }

  // Check if we're on a smaller screen (950px and below)
  const isSmallScreen = () => {
    return window.innerWidth <= 950
  }

  // Handle dropdown interaction (hover on desktop, click on mobile/tablet)
  const handleDropdownEnter = (event: React.MouseEvent<HTMLDivElement>) => {
    // Only handle hover on larger screens
    if (isSmallScreen()) return
    
    const dropdownContent = event.currentTarget.querySelector('.dropdown-content') as HTMLElement
    if (dropdownContent) {
      // Get all dropdown contents to find the tallest one
      const allDropdowns = document.querySelectorAll('.dropdown-content')
      let maxHeight = 0
      
      allDropdowns.forEach(dropdown => {
        const height = (dropdown as HTMLElement).scrollHeight
        if (height > maxHeight) {
          maxHeight = height
        }
      })
      
      setHeaderExtraHeight(maxHeight)
    }
  }

  const handleDropdownLeave = () => {
    // Only handle hover on larger screens
    if (isSmallScreen()) return
    setHeaderExtraHeight(0)
  }

  const handleDropdownClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // Only handle click on smaller screens
    if (!isSmallScreen()) return
    
    event.preventDefault()
    const dropdownIndex = parseInt(event.currentTarget.dataset.dropdownIndex || '0')
    
    if (activeDropdown === dropdownIndex) {
      // Close the dropdown if it's already open
      setActiveDropdown(null)
      setHeaderExtraHeight(0)
    } else {
      // Open this dropdown and close others
      setActiveDropdown(dropdownIndex)
      
      // Get all dropdown contents to find the tallest one (same as desktop behavior)
      const allDropdowns = document.querySelectorAll('.dropdown-content')
      let maxHeight = 0
      
      allDropdowns.forEach(dropdown => {
        const height = (dropdown as HTMLElement).scrollHeight
        if (height > maxHeight) {
          maxHeight = height
        }
      })
      
      setHeaderExtraHeight(maxHeight)
    }
  }

  // Render a menu item (handles both regular links and dropdowns)
  const renderMenuItem = (item: MenuItem, index: number) => {
    if (item.itemType === 'pageLink' && item.pageLink) {
      const href = `/${item.pageLink.slug || ''}`
      return (
        <Link
          key={index}
          href={href}
          className={isActive(href) ? 'active' : ''}
        >
          {item.pageLink.title || 'Untitled'}
        </Link>
      )
    } else if (item.itemType === 'titleWithSubItems' && item.heading) {
      const hasActive = hasActiveSubItem(item)
      const isDropdownActive = activeDropdown === index
      return (
        <div 
          key={index} 
          className={`dropdown-menu ${hasActive ? 'has-active' : ''} ${isDropdownActive ? 'active' : ''}`}
          data-dropdown-index={index}
          onMouseEnter={handleDropdownEnter}
          onMouseLeave={handleDropdownLeave}
          onClick={handleDropdownClick}
        >
          <span className="dropdown-title">
            {item.heading}
          </span>
          <div className="dropdown-content">
            {item.subItems?.map((subItem, subIndex) => {
              const href = `/${subItem.pageLink?.slug || ''}`
              return (
                <Link
                  key={subIndex}
                  href={href}
                  className={isActive(href) ? 'active' : ''}
                >
                  {subItem.pageLink?.title || 'Untitled'}
                </Link>
              )
            })}
          </div>
        </div>
      )
    }
    return null
  }

  useEffect(() => {
    const setNavItemWidths = () => {
      const navContainers = [leftNavRef.current, rightNavRef.current]
      
      navContainers.forEach(container => {
        if (!container) return
        
        // Handle both direct links and dropdown titles
        const items = container.querySelectorAll('a, .dropdown-title')
        items.forEach(item => {
          // Clear any existing fixed widths to allow natural resizing
          if (item instanceof HTMLElement) {
            item.style.width = ''
            item.style.minWidth = ''
            
            // Force a reflow to get the natural width with current font size
            item.offsetHeight
            
            // Temporarily switch to Millionaire-Script to measure width
            const originalFont = item.style.fontFamily
            item.style.fontFamily = 'Millionaire-Script'
            const scriptWidth = item.offsetWidth
            
            // Restore original font
            item.style.fontFamily = originalFont
            
            // Use the wider width to prevent cutoff, plus some extra padding
            const currentWidth = item.offsetWidth
            const maxWidth = Math.max(currentWidth, scriptWidth)
            const paddedWidth = maxWidth + (0.4 * parseFloat(getComputedStyle(item).fontSize)) // 0.4em padding
            
            item.style.width = `${paddedWidth}px`
            item.style.minWidth = `${paddedWidth}px`
          }
        })
      })
    }

    const setDropdownItemHeights = () => {
      const dropdownContents = document.querySelectorAll('.dropdown-content')
      
      dropdownContents.forEach(dropdown => {
        const links = dropdown.querySelectorAll('a')
        links.forEach(link => {
          if (link instanceof HTMLElement) {
            // Clear any existing fixed heights to allow natural resizing
            link.style.height = ''
            link.style.minHeight = ''
            
            // Force a reflow to get the natural height with current font size
            link.offsetHeight
            
            // Set the height to accommodate both Millionaire-Roman and Millionaire-Script
            // We'll use the taller of the two fonts to prevent jumping
            const currentHeight = link.offsetHeight
            
            // Temporarily switch to Millionaire-Script to measure height
            const originalFont = link.style.fontFamily
            link.style.fontFamily = 'Millionaire-Script'
            const scriptHeight = link.offsetHeight
            
            // Restore original font
            link.style.fontFamily = originalFont
            
            // Use the taller height to prevent jumping, plus some extra padding
            const maxHeight = Math.max(currentHeight, scriptHeight)
            const paddedHeight = maxHeight + (0.1 * parseFloat(getComputedStyle(link).fontSize)) // Small extra padding
            
            link.style.height = `${paddedHeight}px`
            link.style.minHeight = `${paddedHeight}px`
          }
        })
      })
    }

    const handleResize = () => {
      setNavItemWidths()
      setDropdownItemHeights()
      
      // Close any open dropdowns when screen size changes
      setActiveDropdown(null)
      setHeaderExtraHeight(0)
    }

    // Set widths and heights after component mounts
    setNavItemWidths()
    setDropdownItemHeights()
    
    // Recalculate on window resize
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [leftMenu, rightMenu])

  // Apply extra height and background to header when dropdown is hovered
  useEffect(() => {
    if (headerRef.current) {
      headerRef.current.style.paddingBottom = headerExtraHeight > 0 
        ? `${headerExtraHeight}px` 
        : ''
      
      // Add background color when dropdown is hovered (if header doesn't already have one)
      if (headerExtraHeight > 0) {
        headerRef.current.classList.add('dropdown-hovered')
      } else {
        headerRef.current.classList.remove('dropdown-hovered')
      }
    }
  }, [headerExtraHeight])

  // Handle scroll-based class addition
  useEffect(() => {
    const handleScroll = () => {
      if (!headerRef.current) return
      
      const headerHeight = headerRef.current.offsetHeight
      let scrollThreshold = window.innerHeight - headerHeight // Default: 100vh - header height
      
      // Special handling for heritage and carousel pages - keep header transparent until past all text-with-artefacts blocks
      const isHeritagePage = document.body.classList.contains('page-heritage')
      const isCarouselPage = document.body.classList.contains('page-carousel')
      
      if (isHeritagePage || isCarouselPage) {
        const textWithArtefactsBlocks = document.querySelectorAll('.text-with-artefacts')
        if (textWithArtefactsBlocks.length > 0) {
          // Find the last text-with-artefacts block
          const lastTextWithArtefactsBlock = textWithArtefactsBlocks[textWithArtefactsBlocks.length - 1]
          const lastBlockRect = lastTextWithArtefactsBlock.getBoundingClientRect()
          const lastBlockBottom = window.scrollY + lastBlockRect.bottom
          
          // Set threshold to the bottom of the last text-with-artefacts block
          scrollThreshold = lastBlockBottom - headerHeight
        }
      } else {
        // Check for hero media block layout and adjust threshold accordingly
        const heroMediaBlock = document.querySelector('.hero-media-block')
        if (heroMediaBlock) {
          if (heroMediaBlock.classList.contains('layout-2') || heroMediaBlock.classList.contains('layout-3')) {
            scrollThreshold = 50 // 50px from top for layout-2 and layout-3
          }
          // layout-1 keeps the default threshold (window.innerHeight - headerHeight)
        }
      }
      
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
      
      // Show all final elements after 4.5 seconds (when symbol animation completes)
      const timer = setTimeout(() => {
        triggerFinalPhaseAnimation()
      }, 4500)
      
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

  // Render mobile menu items (accordion dropdowns for mobile overlay)
  const renderMobileMenuItem = (item: MenuItem, index: number) => {
    if (item.itemType === 'pageLink' && item.pageLink) {
      const href = `/${item.pageLink.slug || ''}`
      return (
        <Link
          key={index}
          href={href}
          className={`header-menu-item ${isActive(href) ? 'active' : ''}`}
          onClick={closeMenu}
        >
          {item.pageLink.title || 'Untitled'}
        </Link>
      )
    } else if (item.itemType === 'titleWithSubItems' && item.heading) {
      const isExpanded = activeDropdown === index
      return (
        <div key={index} className="mobile-dropdown-section">
          <div 
            className={`mobile-dropdown-title ${isExpanded ? 'expanded' : ''}`}
            onClick={() => {
              if (activeDropdown === index) {
                setActiveDropdown(null)
              } else {
                setActiveDropdown(index)
              }
            }}
          >
            <span className="dropdown-title-text">{item.heading}</span>

            <div className="dropdown-caret">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="7" viewBox="0 0 12 7" fill="none">
                <path d="M1 6L6.00013 1L11 6" stroke="#FFF9F2"/>
              </svg>
            </div>
          </div>

          <div className={`mobile-dropdown-content ${isExpanded ? 'expanded' : ''}`}>
            {item.subItems?.map((subItem, subIndex) => {
              const href = `/${subItem.pageLink?.slug || ''}`
              return (
                <Link
                  key={subIndex}
                  href={href}
                  className={`header-menu-item sub-item ${isActive(href) ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  {subItem.pageLink?.title || 'Untitled'}
                </Link>
              )
            })}
          </div>
        </div>
      )
    }
    return null
  }

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
                {leftMenu?.items?.map((item, index) => renderMenuItem(item, index))}
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
                {rightMenu?.items?.map((item, index) => renderMenuItem(item, index))}
              </nav>
            </div>
          </div>

        </div>
      </header>

      <div className="menu-overlay z-400 h-pad" ref={menuOverlayRef}>
        <div className="inner-wrap" ref={menuOverlayInnerRef}>
          {leftMenu?.items?.map((item, index) => renderMobileMenuItem(item, index))}
          {rightMenu?.items?.map((item, index) => renderMobileMenuItem(item, index))}
        </div>
      </div>
    </>
  )
}
