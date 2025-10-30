import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import OverflowController from "../components/OverflowController";
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
    <html lang="en">
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
                  var vph = 0;
                  var resizeRafId = null;
                  var scrollRafId = null;

                  function getViewportDimensions(){
                      // Prefer visualViewport on iOS Safari to avoid URL bar jank
                      if (window.visualViewport && typeof window.visualViewport.height === 'number') {
                        vph = Math.round(window.visualViewport.height);
                      } else {
                        vph = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
                      }
                  }
                  getViewportDimensions();    

                  // Throttled resize/orientation handler
                  function onResizeThrottled(){
                    if (resizeRafId !== null) return;
                    resizeRafId = requestAnimationFrame(function(){
                      resizeRafId = null;
                      getViewportDimensions();
                    });
                  }

                  // Keep legacy jQuery binding for compatibility but fix event name and throttle
                  $(window).on('resize orientationchange', onResizeThrottled);
                  if (window.visualViewport) {
                    // Also listen to visualViewport changes (not passive supported here)
                    window.visualViewport.addEventListener('resize', onResizeThrottled);
                  }
                  
                  $.fn.inViewport = function (whenInView, whenNotInView) {                  
                      return this.each(function () {
                          var el = $(this),
                              inviewalreadycalled = false,
                              notinviewalreadycalled = false;      

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
                          // Throttle scroll/resize-driven checks via rAF
                          function onScrollThrottled(){
                            if (scrollRafId !== null) return;
                            scrollRafId = requestAnimationFrame(function(){
                              scrollRafId = null;
                              checkInView();
                            });
                          }

                          // Use native passive listeners for performance where possible
                          window.addEventListener('scroll', onScrollThrottled, { passive: true });
                          window.addEventListener('resize', onScrollThrottled);
                          window.addEventListener('orientationchange', function(){
                            // Allow orientation to settle before recalculating
                            setTimeout(function(){
                              getViewportDimensions();
                              checkInView();
                            }, 250);
                          });
                          if (window.visualViewport) {
                            window.visualViewport.addEventListener('scroll', onScrollThrottled);
                            window.visualViewport.addEventListener('resize', onScrollThrottled);
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
                
                // Run when DOM is ready
                $(document).ready(function() {
                  outOfView();
                });
                
                // Re-run on browser navigation (back/forward)
                window.addEventListener('popstate', function() {
                  setTimeout(outOfView, 100);
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
                    setTimeout(outOfView, 100);
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
        <OverflowController />
        {children}
      </body>
    </html>
  );
}
