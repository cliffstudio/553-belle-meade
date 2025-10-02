// src/sanity/lib/queries.ts
import { groq } from 'next-sanity'

/**
 * Consolidated query system using smart conditionals
 * Only fetches data for the specific page type, improving performance
 */

// Reusable fragments for consistency and maintainability
const imageFragment = groq`{
  asset {
    _ref,
    _type
  },
  hotspot,
  crop
}`

const videoFragment = groq`{
  asset {
    _ref,
    _type
  }
}`

const linkFragment = groq`{
  linkType,
  label,
  href,
  pageLink {
    _ref,
    _type,
    "slug": *[_type == "page" && _id == ^._ref][0].slug.current,
    "title": *[_type == "page" && _id == ^._ref][0].title
  }
}`

const mediaFragment = groq`{
  mediaType,
  image ${imageFragment},
  video ${videoFragment},
  showControls
}`

// Main page query with conditional field fetching
export const pageQuery = groq`
  *[_type == "page" && slug.current == $slug][0] {
    _id,
    _type,
    title,
    slug,
    pageType,
    
    // Homepage fields
    pageType == "homepage" => {
      homepageHero {
        introText,
        backgroundMediaType,
        desktopBackgroundImage ${imageFragment},
        mobileBackgroundImage ${imageFragment},
        desktopBackgroundVideo ${videoFragment},
        mobileBackgroundVideo ${videoFragment},
        showControls,
        overlayDarkness
      },
      homepageLinkTiles {
        numberOfTiles,
        linkTile1 {
          ...${mediaFragment},
          cta ${linkFragment}
        },
        linkTile2 {
          ...${mediaFragment},
          cta ${linkFragment}
        },
        linkTile3 {
          ...${mediaFragment},
          cta ${linkFragment}
        },
        linkTile4 {
          ...${mediaFragment},
          cta ${linkFragment}
        },
        linkTile5 {
          ...${mediaFragment},
          cta ${linkFragment}
        },
        linkTile6 {
          ...${mediaFragment},
          cta ${linkFragment}
        },
        linkTile7 {
          ...${mediaFragment},
          cta ${linkFragment}
        }
      },
      homepageFullWidthMedia ${mediaFragment},
      homepageLargeMediaText {
        heading,
        body,
        cta ${linkFragment},
        ...${mediaFragment}
      },
      homepageImageMasonry {
        heading,
        body,
        cta ${linkFragment},
        layout,
        mediaType1,
        image1 ${imageFragment},
        video1 ${videoFragment},
        mediaType2,
        image2 ${imageFragment},
        video2 ${videoFragment}
      }
    },
    
    // Shopping fields
    pageType == "shopping" => {
      shoppingHero {
        layout,
        desktopTitle,
        mobileTitle,
        backgroundMediaType,
        desktopBackgroundImage ${imageFragment},
        mobileBackgroundImage ${imageFragment},
        desktopBackgroundVideo ${videoFragment},
        mobileBackgroundVideo ${videoFragment},
        showControls,
        overlayDarkness,
        body,
        cta ${linkFragment}
      },
      shoppingStaggered {
        heading,
        body,
        layout,
        mediaType1,
        image1 ${imageFragment},
        video1 ${videoFragment},
        caption1,
        mediaType2,
        image2 ${imageFragment},
        video2 ${videoFragment},
        caption2,
        mediaType3,
        image3 ${imageFragment},
        video3 ${videoFragment},
        caption3
      },
      shoppingFullWidthMedia ${mediaFragment},
      shoppingSmallMediaText {
        heading,
        body,
        cta ${linkFragment},
        ...${mediaFragment}
      },
      shoppingCta {
        pageLink {
          _ref,
          _type,
          "slug": *[_type == "page" && _id == ^._ref][0].slug.current,
          "title": *[_type == "page" && _id == ^._ref][0].title
        }
      }
    },
    
    // Walkthrough fields
    pageType == "walkthrough" => {
      walkthroughHero {
        layout,
        desktopTitle,
        mobileTitle,
        backgroundMediaType,
        desktopBackgroundImage ${imageFragment},
        mobileBackgroundImage ${imageFragment},
        desktopBackgroundVideo ${videoFragment},
        mobileBackgroundVideo ${videoFragment},
        showControls,
        overlayDarkness,
        body,
        cta ${linkFragment}
      },
      walkthroughCta {
        pageLink {
          _ref,
          _type,
          "slug": *[_type == "page" && _id == ^._ref][0].slug.current,
          "title": *[_type == "page" && _id == ^._ref][0].title
        }
      }
    },
    
    // Spaces fields
    pageType == "spaces" => {
      spacesHero {
        layout,
        desktopTitle,
        mobileTitle,
        backgroundMediaType,
        desktopBackgroundImage ${imageFragment},
        mobileBackgroundImage ${imageFragment},
        desktopBackgroundVideo ${videoFragment},
        mobileBackgroundVideo ${videoFragment},
        showControls,
        overlayDarkness,
        body,
        cta ${linkFragment}
      },
      spacesFullWidthMedia ${mediaFragment},
      spacesContactForm {
        body
      },
      spacesCta {
        pageLink {
          _ref,
          _type,
          "slug": *[_type == "page" && _id == ^._ref][0].slug.current,
          "title": *[_type == "page" && _id == ^._ref][0].title
        }
      }
    },

    // Heritage fields
    pageType == "heritage" => {
      heritageHero {
        layout,
        desktopTitle,
        mobileTitle,
        backgroundMediaType,
        desktopBackgroundImage ${imageFragment},
        mobileBackgroundImage ${imageFragment},
        desktopBackgroundVideo ${videoFragment},
        mobileBackgroundVideo ${videoFragment},
        showControls,
        overlayDarkness,
        body,
        cta ${linkFragment}
      },
      heritageTextWithArtefacts {
        layout,
        body,
        artefact1 {
          image ${imageFragment},
          caption,
          title,
          description
        },
        artefact2 {
          image ${imageFragment},
          caption,
          title,
          description
        },
        artefact3 {
          image ${imageFragment},
          caption,
          title,
          description
        },
        artefact4 {
          image ${imageFragment},
          caption,
          title,
          description
        }
      },
      heritageFullWidthMedia ${mediaFragment},
      heritageTextWithArtefacts2 {
        layout,
        body,
        artefact1 {
          image ${imageFragment},
          caption,
          title,
          description
        },
        artefact2 {
          image ${imageFragment},
          caption,
          title,
          description
        },
        artefact3 {
          image ${imageFragment},
          caption,
          title,
          description
        },
        artefact4 {
          image ${imageFragment},
          caption,
          title,
          description
        }
      },
      heritageImageCarousel {
        heading,
        body,
        images[] {
          image ${imageFragment},
          caption,
          imageSize
        }
      },
      heritageCta {
        pageLink {
          _ref,
          _type,
          "slug": *[_type == "page" && _id == ^._ref][0].slug.current,
          "title": *[_type == "page" && _id == ^._ref][0].title
        }
      }
    },

    // Creek fields
    pageType == "creek" => {
      creekHero {
        layout,
        desktopTitle,
        mobileTitle,
        backgroundMediaType,
        desktopBackgroundImage ${imageFragment},
        mobileBackgroundImage ${imageFragment},
        desktopBackgroundVideo ${videoFragment},
        mobileBackgroundVideo ${videoFragment},
        showControls,
        overlayDarkness,
        body,
        cta ${linkFragment}
      },
      creekStaggered {
        heading,
        body,
        layout,
        mediaType1,
        image1 ${imageFragment},
        video1 ${videoFragment},
        caption1,
        mediaType2,
        image2 ${imageFragment},
        video2 ${videoFragment},
        caption2,
        mediaType3,
        image3 ${imageFragment},
        video3 ${videoFragment},
        caption3
      },
      creekStackedMediaText {
        layout,
        heading,
        body,
        cta ${linkFragment},
        ...${mediaFragment},
        showControls
      },
      creekFullWidthMedia ${mediaFragment},
      creekCta {
        pageLink {
          _ref,
          _type,
          "slug": *[_type == "page" && _id == ^._ref][0].slug.current,
          "title": *[_type == "page" && _id == ^._ref][0].title
        }
      }
    },

    // Carousel fields
    pageType == "carousel" => {
      carouselHero {
        layout,
        desktopTitle,
        mobileTitle,
        backgroundMediaType,
        desktopBackgroundImage ${imageFragment},
        mobileBackgroundImage ${imageFragment},
        desktopBackgroundVideo ${videoFragment},
        mobileBackgroundVideo ${videoFragment},
        showControls,
        overlayDarkness,
        body,
        cta ${linkFragment}
      },
      carouselTextWithArtefacts {
        layout,
        body,
        artefact1 {
          image ${imageFragment},
          caption,
          title,
          description
        },
        artefact2 {
          image ${imageFragment},
          caption,
          title,
          description
        },
        artefact3 {
          image ${imageFragment},
          caption,
          title,
          description
        },
        artefact4 {
          image ${imageFragment},
          caption,
          title,
          description
        }
      },
      carouselFullWidthMedia ${mediaFragment},
      carouselImageMasonry {
        heading,
        body,
        cta ${linkFragment},
        layout,
        mediaType1,
        image1 ${imageFragment},
        video1 ${videoFragment},
        mediaType2,
        image2 ${imageFragment},
        video2 ${videoFragment}
      },
      carouselCta {
        pageLink {
          _ref,
          _type,
          "slug": *[_type == "page" && _id == ^._ref][0].slug.current,
          "title": *[_type == "page" && _id == ^._ref][0].title
        }
      }
    },

    // Architecture fields
    pageType == "architecture" => {
      architectureHero {
        layout,
        desktopTitle,
        mobileTitle,
        backgroundMediaType,
        desktopBackgroundImage ${imageFragment},
        mobileBackgroundImage ${imageFragment},
        desktopBackgroundVideo ${videoFragment},
        mobileBackgroundVideo ${videoFragment},
        showControls,
        overlayDarkness,
        body,
        cta ${linkFragment}
      },
      architectureImageMasonry {
        heading,
        body,
        cta ${linkFragment},
        layout,
        mediaType1,
        image1 ${imageFragment},
        video1 ${videoFragment},
        mediaType2,
        image2 ${imageFragment},
        video2 ${videoFragment}
      },
      architectureStackedMediaText {
        layout,
        heading,
        body,
        cta ${linkFragment},
        ...${mediaFragment},
        showControls
      },
      architectureFullWidthMedia ${mediaFragment},
      architectureLargeMediaText {
        heading,
        body,
        cta ${linkFragment},
        ...${mediaFragment}
      },
      architectureArchitects {
        heading,
        architects[] {
          name,
          bio,
          cta ${linkFragment}
        }
      },
      architectureCta {
        pageLink {
          _ref,
          _type,
          "slug": *[_type == "page" && _id == ^._ref][0].slug.current,
          "title": *[_type == "page" && _id == ^._ref][0].title
        }
      }
    },

    // Gallery fields
    pageType == "gallery" => {
      galleryImages {
        images[] {
          image ${imageFragment},
          caption,
          imageSize
        }
      }
    },

    // Press fields
    pageType == "press" => {
      pressHero {
        layout,
        desktopTitle,
        mobileTitle,
        backgroundMediaType,
        desktopBackgroundImage ${imageFragment},
        mobileBackgroundImage ${imageFragment},
        desktopBackgroundVideo ${videoFragment},
        mobileBackgroundVideo ${videoFragment},
        showControls,
        overlayDarkness,
        body,
        cta ${linkFragment}
      },
      pressSection {
        heading,
        subheading,
        layout,
        postsPerPage,
        showCategories,
        showSearch,
        featuredPosts[]-> {
          _id,
          title,
          slug,
          publishedAt,
          excerpt,
          featuredImage ${imageFragment},
          source,
          author,
          categories
        },
      },
      pressCta {
        pageLink {
          _ref,
          _type,
          "slug": *[_type == "page" && _id == ^._ref][0].slug.current,
          "title": *[_type == "page" && _id == ^._ref][0].title
        }
      }
    }
    
    // Add new page types here following the same pattern:
    // pageType == "newPageType" => {
    //   newPageTypeField1 { ... },
    //   newPageTypeField2 { ... }
    // }
  }
`

// Simplified queries for specific use cases

export const pageSlugsQuery = groq`
  *[_type == "page"] {
    slug
  }
`

// Homepage specific query
export const homepageQuery = groq`
  *[_type == "page" && pageType == "homepage"][0] {
    _id,
    _type,
    title,
    pageType,
    homepageHero {
      introText,
      backgroundMediaType,
      desktopBackgroundImage ${imageFragment},
      mobileBackgroundImage ${imageFragment},
      desktopBackgroundVideo ${videoFragment},
      mobileBackgroundVideo ${videoFragment},
      showControls,
      overlayDarkness
    },
    homepageLinkTiles {
      numberOfTiles,
      linkTile1 {
        ...${mediaFragment},
        cta ${linkFragment}
      },
      linkTile2 {
        ...${mediaFragment},
        cta ${linkFragment}
      },
      linkTile3 {
        ...${mediaFragment},
        cta ${linkFragment}
      },
      linkTile4 {
        ...${mediaFragment},
        cta ${linkFragment}
      },
      linkTile5 {
        ...${mediaFragment},
        cta ${linkFragment}
      },
      linkTile6 {
        ...${mediaFragment},
        cta ${linkFragment}
      },
      linkTile7 {
        ...${mediaFragment},
        cta ${linkFragment}
      }
    },
    homepageFullWidthMedia ${mediaFragment},
    homepageLargeMediaText {
      heading,
      body,
      cta ${linkFragment},
      ...${mediaFragment}
    },
    homepageImageMasonry {
      heading,
      body,
      cta ${linkFragment},
      layout,
      mediaType1,
      image1 ${imageFragment},
      video1 ${videoFragment},
      mediaType2,
      image2 ${imageFragment},
      video2 ${videoFragment}
    }
  }
`

// Footer and menu queries
export const footerQuery = groq`
  *[_type == "footer"][0] {
    _id,
    title,
    footerItems[] {
      heading,
      text
    },
    socialLinks {
      heading,
      links[] {
        linkType,
        label,
        href,
        "isExternal": linkType == "external",
        pageLink-> {
          title,
          "slug": slug.current
        }
      }
    },
    footerNav[] {
      linkType,
      label,
      href,
      "isExternal": linkType == "external",
      pageLink-> {
        title,
        "slug": slug.current
      }
    }
  }
`

export const leftMenuQuery = groq`
  *[_type == "menu" && title == "Left Menu"][0] {
    _id,
    title,
    items[] {
      itemType,
      pageLink-> {
        _id,
        title,
        "slug": slug.current
      },
      heading,
      subItems[] {
        pageLink-> {
          _id,
          title,
          "slug": slug.current
        }
      }
    }
  }
`

export const rightMenuQuery = groq`
  *[_type == "menu" && title == "Right Menu"][0] {
    _id,
    title,
    items[] {
      itemType,
      pageLink-> {
        _id,
        title,
        "slug": slug.current
      },
      heading,
      subItems[] {
        pageLink-> {
          _id,
          title,
          "slug": slug.current
        }
      }
    }
  }
`

// Press queries
export const pressPostsQuery = groq`
  *[_type == "press"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    thumbnailType,
    thumbnailImage ${imageFragment},
    thumbnailLogo ${imageFragment},
    thumbnailBackgroundColour,
    excerpt,
    featuredImage ${imageFragment},
    content,
    source,
    sourceUrl,
    layout
  }
`

export const pressPostQuery = groq`
  *[_type == "press" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    publishedAt,
    thumbnailType,
    thumbnailImage ${imageFragment},
    thumbnailLogo ${imageFragment},
    thumbnailBackgroundColour,
    excerpt,
    featuredImage ${imageFragment},
    content,
    source,
    sourceUrl,
    layout
  }
`

// Testimonials queries
export const testimonialsQuery = groq`
  *[_type == "testimonials"] | order(_createdAt desc) {
    _id,
    name,
    source,
    backgroundColour
  }
`

export const randomTestimonialQuery = groq`
  *[_type == "testimonials"] | order(_createdAt desc) [0] {
    _id,
    name,
    source,
    backgroundColour
  }
`

// Export fragments for reuse in other queries if needed
export const fragments = {
  imageFragment,
  videoFragment,
  linkFragment,
  mediaFragment
}