import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import OverflowController from "../components/OverflowController";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Belle Meade Village - Where Luxury Meets Community",
  description: "Discover a premier destination where luxury shopping, exceptional dining, and vibrant lifestyle experiences come together in perfect harmony.",
  keywords: "Belle Meade Village, luxury shopping, fine dining, lifestyle, Nashville, boutique shops, restaurants, wellness",
  authors: [{ name: "Belle Meade Village" }],
  openGraph: {
    title: "Belle Meade Village - Where Luxury Meets Community",
    description: "Discover a premier destination where luxury shopping, exceptional dining, and vibrant lifestyle experiences come together in perfect harmony.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Belle Meade Village - Where Luxury Meets Community",
    description: "Discover a premier destination where luxury shopping, exceptional dining, and vibrant lifestyle experiences come together in perfect harmony.",
  },
};

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
