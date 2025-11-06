import React from 'react'

interface IssuuEmbedProps {
  className?: string
}

export default function IssuuEmbed({ className }: IssuuEmbedProps) {
  return (
    <div id="leasing-brochure" 
      className={`${className}`}
      style={{
        position: 'relative',
        paddingTop: 'max(60%, 326px)',
        height: 0,
        width: '100%'
      }}
    >
      <iframe
        allow="clipboard-write"
        sandbox="allow-top-navigation allow-top-navigation-by-user-activation allow-downloads allow-scripts allow-same-origin allow-popups allow-modals allow-popups-to-escape-sandbox allow-forms"
        allowFullScreen={true}
        style={{
          position: 'absolute',
          border: 'none',
          width: '100%',
          height: '100%',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0
        }}
        src="https://e.issuu.com/embed.html?backgroundColor=%23581B25&d=belle_meade_village_september_update&hideIssuuLogo=true&hideShareButton=true&themeMainColor=%23FFF9F2&themeSecondaryColor=%23581B25&u=ajcpt"
        title="Belle Meade Village September Update"
      />
    </div>
  )
}