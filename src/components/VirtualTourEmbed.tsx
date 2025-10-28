import React from 'react'

interface VirtualTourEmbedProps {
  className?: string
}

export default function VirtualTourEmbed({ className }: VirtualTourEmbedProps) {
  return (
    <div id="virtual-tour" 
      className={`${className} out-of-view`}
    >
      <iframe src="//storage.net-fs.com/hosting/7298008/14/" 
        width="100%"
        height="700"
        frameBorder="0"
        allow="fullscreen; accelerometer; gyroscope; vr; camera; microphone" allowFullScreen={true}
        style={{
          width: '100%',
          height: '600px',
          border: 'none',
          overflow: 'hidden',
        }}
      />
    </div>
  )
}