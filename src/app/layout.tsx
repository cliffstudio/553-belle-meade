import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import OverflowController from "../components/OverflowController";
import BodyFadeIn from "../components/BodyFadeIn";
import { clientNoCdn } from "../../sanity.client";
import { metadataQuery } from "../sanity/lib/queries";
import { urlFor } from "../sanity/utils/imageUrlBuilder";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Generate metadata dynamically from Sanity CMS
export async function generateMetadata(): Promise<Metadata> {
  // Use non-CDN client to ensure fresh metadata bypasses Sanity CDN caching
  const metaData = await clientNoCdn.fetch(metadataQuery, {}, {
    next: { revalidate: 0 }
  });
  
  // Build social image URL if available
  let socialImageUrl: string | undefined;
  if (metaData?.socialimage?.asset?._ref) {
    socialImageUrl = urlFor(metaData.socialimage).width(1200).height(630).url();
  }
  
  return {
    title: metaData?.title,
    description: metaData?.description,
    keywords: metaData?.keywords,
    authors: [{ name: "Belle Meade Village" }],
    openGraph: {
      title: metaData?.title,
      description: metaData?.description,
      type: "website",
      locale: "en_US",
      ...(socialImageUrl && { images: [socialImageUrl] }),
    },
    twitter: {
      card: "summary_large_image",
      title: metaData?.title,
      description: metaData?.description,
      ...(socialImageUrl && { images: [socialImageUrl] }),
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Script
          id="scroll-reset"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              // Reset scroll position immediately before anything else runs
              window.scrollTo(0, 0);
              // Disable scroll restoration to prevent browser from restoring scroll position
              if ('scrollRestoration' in history) {
                history.scrollRestoration = 'manual';
              }
              
              // Enable scrolling by default (scrolling works immediately on non-homepage pages)
              // This runs before React hydrates, so we suppress hydration warning on html tag
              document.documentElement.classList.add('scroll-enabled');
              
              // Immediately disable scrolling on homepage before React hydrates
              (function() {
                const isHomepage = window.location.pathname === '/' || window.location.pathname === '';
                if (isHomepage) {
                  // Remove scroll-enabled class immediately to disable scrolling on homepage
                  document.documentElement.classList.remove('scroll-enabled');
                  
                  // Prevent all scroll methods immediately
                  const preventScroll = function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                  };
                  
                  // Prevent wheel, touch, and keyboard scrolling
                  const options = { passive: false, capture: true };
                  
                  // Store handlers for cleanup later
                  window.__homepageScrollPreventers = {
                    wheel: preventScroll,
                    touchmove: function(e) {
                      // Prevent all touch scrolling
                      e.preventDefault();
                      e.stopPropagation();
                      return false;
                    },
                    touchstart: function(e) {
                      // Allow touchstart (for taps) but scrolling is prevented by touchmove
                    },
                    keydown: function(e) {
                      const scrollKeys = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '];
                      if (scrollKeys.includes(e.key)) {
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                      }
                    }
                  };
                  
                  // Add listeners immediately
                  document.addEventListener('wheel', window.__homepageScrollPreventers.wheel, options);
                  document.addEventListener('touchmove', window.__homepageScrollPreventers.touchmove, options);
                  document.addEventListener('touchstart', window.__homepageScrollPreventers.touchstart, options);
                  document.addEventListener('keydown', window.__homepageScrollPreventers.keydown, options);
                }
              })();
            `
          }}
        />
        <Script
          src="https://code.jquery.com/jquery-3.7.1.min.js"
          strategy="beforeInteractive"
        />
        <Script
          id="viewport-detection"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              // Wait for jQuery to be ready
              if (typeof window.$ !== 'undefined') {
                // The inViewport plugin code by Moob
                (function ($) {
                  var vph=0;
                  function getViewportDimensions(){
                      vph = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
                  }
                  getViewportDimensions();    
                  $(window).on('resize orientationChanged', function(){
                      getViewportDimensions();
                  });            
                  
                  $.fn.inViewport = function (whenInView, whenNotInView) {                  
                      return this.each(function () {
                          var el = $(this),
                              inviewalreadycalled = false,
                              notinviewalreadycalled = false;                            
                          $(window).on('resize orientationChanged scroll', function(){
                              checkInView();
                          });               
                          function checkInView(){
                              var rect = el[0].getBoundingClientRect(),
                                  t = rect.top,
                                  b = rect.bottom;
                              if(t<vph && b>0){
                                  if(!inviewalreadycalled){
                                      whenInView.call(el);
                                      inviewalreadycalled = true;
                                      notinviewalreadycalled = false;
                                  }
                              } else {
                                  if(!notinviewalreadycalled){
                                      whenNotInView.call(el);
                                      notinviewalreadycalled = true;
                                      inviewalreadycalled = false;
                                  }
                              }
                          }
                          checkInView();                
                      });
                  }             
                }(jQuery));
                
                // Initialize the viewport detection
                function outOfView() {
                  $('.out-of-view').inViewport(
                    function(){
                      $(this).addClass("am-in-view in-view-detect");
                    },
                    function(){
                      $(this).removeClass("in-view-detect");
                    }
                  );
                }
                
                function outOfOpacity() {
                  $('.out-of-opacity').inViewport(
                    function(){
                      $(this).addClass("am-in-view in-view-detect");
                    },
                    function(){
                      $(this).removeClass("in-view-detect");
                    }
                  );
                }
                
                // Run when DOM is ready
                $(document).ready(function() {
                  outOfView();
                  outOfOpacity();
                });
                
                // Re-run on browser navigation (back/forward)
                window.addEventListener('popstate', function() {
                  setTimeout(function() {
                    outOfView();
                    outOfOpacity();
                  }, 100);
                });
                
                // Re-run on Next.js route changes
                // Use MutationObserver to detect DOM changes
                const observer = new MutationObserver(function(mutations) {
                  let shouldReRun = false;
                  mutations.forEach(function(mutation) {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                      // Check if any added nodes contain elements with our classes
                      mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) { // Element node
                          if (node.classList && (node.classList.contains('out-of-view') || node.classList.contains('out-of-opacity'))) {
                            shouldReRun = true;
                          }
                          // Also check child elements
                          if (node.querySelector && (node.querySelector('.out-of-view') || node.querySelector('.out-of-opacity'))) {
                            shouldReRun = true;
                          }
                        }
                      });
                    }
                  });
                  
                  if (shouldReRun) {
                    setTimeout(function() {
                      outOfView();
                      outOfOpacity();
                    }, 100);
                  }
                });
                
                // Start observing
                observer.observe(document.body, {
                  childList: true,
                  subtree: true
                });
                
                // Smooth scroll functionality for hash links with header offset
                function getHeaderHeight() {
                  var header = document.querySelector('.site-header');
                  return header ? header.offsetHeight : 0;
                }
                
                function smoothScrollToElementWithOffset(el) {
                  if (!el) return;
                  var rect = el.getBoundingClientRect();
                  var headerHeight = getHeaderHeight();
                  var targetY = window.scrollY + rect.top - headerHeight;
                  if (targetY < 0) targetY = 0;
                  window.scrollTo({ top: targetY, behavior: 'smooth' });
                }
                
                function initSmoothScroll() {
                  // Handle initial page load with hash
                  if (window.location.hash) {
                    setTimeout(function() {
                      var target = document.querySelector(window.location.hash);
                      if (target) {
                        smoothScrollToElementWithOffset(target);
                      }
                    }, 100);
                  }
                  
                  // Handle clicks on links with hash
                  $(document).on('click', 'a[href*="#"]', function(e) {
                    var href = $(this).attr('href');
                    if (href && href.includes('#')) {
                      var hash = href.split('#')[1];
                      if (!hash) return; // ignore links that are just '#'
                      var target = document.getElementById(hash) || document.querySelector('a[name="' + hash + '"]');
                      
                      if (target) {
                        e.preventDefault();
                        smoothScrollToElementWithOffset(target);
                        
                        // Update URL without triggering scroll
                        history.pushState(null, '', href);
                      }
                    }
                  });
                  
                  // Handle browser back/forward with hash
                  window.addEventListener('popstate', function() {
                    if (window.location.hash) {
                      setTimeout(function() {
                        var target = document.querySelector(window.location.hash);
                        if (target) {
                          smoothScrollToElementWithOffset(target);
                        }
                      }, 100);
                    }
                  });
                }
                
                // Initialize smooth scroll
                initSmoothScroll();
              }
            `
          }}
        />
        <BodyFadeIn />
        <OverflowController />
        {children}
      </body>
    </html>
  );
}
