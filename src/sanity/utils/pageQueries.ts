// src/sanity/utils/pageQueries.ts
import { groq } from 'next-sanity'

export const pageQuery = groq`
  *[_type == "page" && slug.current == $slug][0] {
    _id,
    _type,
    title,
    slug,
    pageType,
    text,
    backgroundMediaType,
    backgroundVideo,
    backgroundImage,
    
    // Homepage specific fields
    homepageHero,
    homepageLinkTiles {
      numberOfTiles,
      linkTile1 {
        mediaType,
        image {
          asset {
            _ref,
            _type
          },
          hotspot,
          crop
        },
        video {
          asset {
            _ref,
            _type
          }
        },
        cta {
          linkType,
          label,
          href,
          pageLink {
            _ref,
            _type,
            "slug": *[_type == "page" && _id == ^._ref][0].slug.current,
            "title": *[_type == "page" && _id == ^._ref][0].title
          }
        }
      },
      linkTile2 {
        mediaType,
        image {
          asset {
            _ref,
            _type
          },
          hotspot,
          crop
        },
        video {
          asset {
            _ref,
            _type
          }
        },
        cta {
          linkType,
          label,
          href,
          pageLink {
            _ref,
            _type,
            "slug": *[_type == "page" && _id == ^._ref][0].slug.current,
            "title": *[_type == "page" && _id == ^._ref][0].title
          }
        }
      },
      linkTile3 {
        mediaType,
        image {
          asset {
            _ref,
            _type
          },
          hotspot,
          crop
        },
        video {
          asset {
            _ref,
            _type
          }
        },
        cta {
          linkType,
          label,
          href,
          pageLink {
            _ref,
            _type,
            "slug": *[_type == "page" && _id == ^._ref][0].slug.current,
            "title": *[_type == "page" && _id == ^._ref][0].title
          }
        }
      },
      linkTile4 {
        mediaType,
        image {
          asset {
            _ref,
            _type
          },
          hotspot,
          crop
        },
        video {
          asset {
            _ref,
            _type
          }
        },
        cta {
          linkType,
          label,
          href,
          pageLink {
            _ref,
            _type,
            "slug": *[_type == "page" && _id == ^._ref][0].slug.current,
            "title": *[_type == "page" && _id == ^._ref][0].title
          }
        }
      },
      linkTile5 {
        mediaType,
        image {
          asset {
            _ref,
            _type
          },
          hotspot,
          crop
        },
        video {
          asset {
            _ref,
            _type
          }
        },
        cta {
          linkType,
          label,
          href,
          pageLink {
            _ref,
            _type,
            "slug": *[_type == "page" && _id == ^._ref][0].slug.current,
            "title": *[_type == "page" && _id == ^._ref][0].title
          }
        }
      },
      linkTile6 {
        mediaType,
        image {
          asset {
            _ref,
            _type
          },
          hotspot,
          crop
        },
        video {
          asset {
            _ref,
            _type
          }
        },
        cta {
          linkType,
          label,
          href,
          pageLink {
            _ref,
            _type,
            "slug": *[_type == "page" && _id == ^._ref][0].slug.current,
            "title": *[_type == "page" && _id == ^._ref][0].title
          }
        }
      },
      linkTile7 {
        mediaType,
        image {
          asset {
            _ref,
            _type
          },
          hotspot,
          crop
        },
        video {
          asset {
            _ref,
            _type
          }
        },
        cta {
          linkType,
          label,
          href,
          pageLink {
            _ref,
            _type,
            "slug": *[_type == "page" && _id == ^._ref][0].slug.current,
            "title": *[_type == "page" && _id == ^._ref][0].title
          }
        }
      }
    },
    homepageFullWidthMedia,
    homepageTextWithMedia,
    homepageImageMasonry,
    
    // Shopping specific fields
    shoppingHero {
      desktopTitle,
      mobileTitle,
      backgroundMediaType,
      desktopBackgroundImage {
        asset {
          _ref,
          _type
        },
        hotspot,
        crop
      },
      mobileBackgroundImage {
        asset {
          _ref,
          _type
        },
        hotspot,
        crop
      },
      desktopBackgroundVideo {
        asset {
          _ref,
          _type
        }
      },
      mobileBackgroundVideo {
        asset {
          _ref,
          _type
        }
      },
      showControls,
      overlayDarkness,
      title
    },
    shoppingStaggered,
    shoppingFullWidthMedia,
    shoppingTextWithMedia,
    shoppingCta {
      pageLink {
        _ref,
        _type,
        "slug": *[_type == "page" && _id == ^._ref][0].slug.current,
        "title": *[_type == "page" && _id == ^._ref][0].title
      }
    },
  }
`

export const pagesQuery = groq`
  *[_type == "page"] {
    _id,
    _type,
    title,
    slug,
    pageType,
    text,
  } | order(title asc)
`

export const pagesByTypeQuery = groq`
  *[_type == "page" && pageType == $pageType] {
    _id,
    _type,
    title,
    slug,
    pageType,
    text,
  } | order(title asc)
`

export const pageSlugsQuery = groq`
  *[_type == "page"] {
    slug
  }
`
