import React from 'react'

interface VirtualTourEmbedProps {
  className?: string
}

export default function VirtualTourEmbed({ className }: VirtualTourEmbedProps) {
  return (
    <div id="virtual-tour" 
      className={`${className} out-of-view`}
    >
      <iframe src="//storage.net-fs.com/hosting/7298008/15/" 
        width="100%"
        height="100%"
        allow="fullscreen; accelerometer; gyroscope; magnetometer; vr; xr; xr-spatial-tracking; autoplay; camera; microphone" allowFullScreen={true}
      />
    </div>
  )
}