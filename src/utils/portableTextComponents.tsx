import { PortableTextComponents } from '@portabletext/react'

export const portableTextComponents: PortableTextComponents = {
  marks: {
    link: ({ value, children }) => {
      const href = value?.href || ''
      const blank = value?.blank

      if (blank) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {children}
          </a>
        )
      }

      return <a href={href}>{children}</a>
    },
  },
}

