// src/sanity/lib/queries.ts
import { groq } from 'next-sanity'

// Footer Query
export const footerQuery = groq`
  *[_type == "footer"][0] {
    title,
    footerItems[] {
      heading,
      text
    },
    socialLinks {
      heading,
      links[] {
        label,
        href,
        isExternal
      }
    },
    footerNav[] {
      label,
      href,
      isExternal
    }
  }
`

// Menu Query - fetch by title to get specific menus
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

// Homepage Query
export const homepageQuery = groq`
  *[_type == "page" && pageType == "homepage"][0] {
    _id,
    _type,
    title,
    slug,
    pageType,
    homepageHero {
      backgroundMediaType,
      desktopBackgroundImage {
        _type,
        asset {
          _ref,
          _type
        },
        hotspot,
        crop
      },
      mobileBackgroundImage {
        _type,
        asset {
          _ref,
          _type
        },
        hotspot,
        crop
      },
      desktopBackgroundVideo {
        _type,
        asset {
          _ref,
          _type
        }
      },
      mobileBackgroundVideo {
        _type,
        asset {
          _ref,
          _type
        }
      },
      showControls,
      overlayDarkness,
      introText
    },
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
  }
`
