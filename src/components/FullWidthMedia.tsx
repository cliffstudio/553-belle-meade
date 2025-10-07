/* eslint-disable @next/next/no-img-element */
"use client"

import { videoUrlFor } from '@/sanity/utils/videoUrlBuilder'
import { urlFor } from '../sanity/utils/imageUrlBuilder'
import { SanityImage, SanityVideo } from '../types/sanity'
import { useState, useRef, useEffect } from 'react'

type FullWidthMediaProps = {
  mediaType?: 'image' | 'video'
  image?: SanityImage
  video?: SanityVideo
  showControls?: boolean
}

export default function FullWidthMedia({ mediaType, image, video, showControls = false }: FullWidthMediaProps) {
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const fullscreenVideoRef = useRef<HTMLVideoElement>(null)

  const togglePlayPause = () => {
    const video = videoRef.current
    
    if (isPlaying) {
      // Pause video
      if (video) video.pause()
      setIsPlaying(false)
    } else {
      // Play video
      if (video) video.play()
      setIsPlaying(true)
    }
  }

  const toggleMute = () => {
    const video = videoRef.current
    
    if (isMuted) {
      // Unmute video
      if (video) video.muted = false
      setIsMuted(false)
    } else {
      // Mute video
      if (video) video.muted = true
      setIsMuted(true)
    }
  }

  const toggleFullscreen = async () => {
    const video = videoRef.current
    
    if (!video) return

    try {
      if (!isFullscreen) {
        // Create a dedicated fullscreen video element
        const fullscreenVideoElement = document.createElement('video')
        fullscreenVideoElement.src = video.src
        fullscreenVideoElement.controls = true
        fullscreenVideoElement.muted = false
        fullscreenVideoElement.autoplay = true
        fullscreenVideoElement.loop = true
        fullscreenVideoElement.style.width = '100%'
        fullscreenVideoElement.style.height = '100%'
        fullscreenVideoElement.style.objectFit = 'cover'
        
        // Add to body temporarily
        document.body.appendChild(fullscreenVideoElement)
        
        // Enter fullscreen
        if (fullscreenVideoElement.requestFullscreen) {
          await fullscreenVideoElement.requestFullscreen()
        } else if ('webkitRequestFullscreen' in fullscreenVideoElement) {
          await (fullscreenVideoElement as HTMLVideoElement & { webkitRequestFullscreen: () => Promise<void> }).webkitRequestFullscreen()
        } else if ('msRequestFullscreen' in fullscreenVideoElement) {
          await (fullscreenVideoElement as HTMLVideoElement & { msRequestFullscreen: () => Promise<void> }).msRequestFullscreen()
        }
        
        // Store reference for cleanup
        fullscreenVideoRef.current = fullscreenVideoElement
        
        setIsFullscreen(true)
        setIsMuted(false)
      } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
          await document.exitFullscreen()
        } else if ('webkitExitFullscreen' in document) {
          await (document as Document & { webkitExitFullscreen: () => Promise<void> }).webkitExitFullscreen()
        } else if ('msExitFullscreen' in document) {
          await (document as Document & { msExitFullscreen: () => Promise<void> }).msExitFullscreen()
        }
        
        // Clean up the fullscreen video element
        const fullscreenVideo = fullscreenVideoRef.current
        if (fullscreenVideo) {
          document.body.removeChild(fullscreenVideo)
          fullscreenVideoRef.current = null
        }
        
        setIsFullscreen(false)
        setIsMuted(true)
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error)
    }
  }

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        ('webkitFullscreenElement' in document ? (document as Document & { webkitFullscreenElement: Element | null }).webkitFullscreenElement : null) ||
        ('msFullscreenElement' in document ? (document as Document & { msFullscreenElement: Element | null }).msFullscreenElement : null)
      )
      
      if (!isCurrentlyFullscreen && isFullscreen) {
        // User exited fullscreen via browser controls
        const fullscreenVideo = fullscreenVideoRef.current
        
        if (fullscreenVideo) {
          document.body.removeChild(fullscreenVideo)
          fullscreenVideoRef.current = null
        }
        
        setIsFullscreen(false)
        setIsMuted(true)
      }
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.addEventListener('msfullscreenchange', handleFullscreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
      document.removeEventListener('msfullscreenchange', handleFullscreenChange)
    }
  }, [isFullscreen])

  if (!mediaType) {
    return null
  }

  if (mediaType === 'image' && !image) {
    return null
  }

  if (mediaType === 'video' && !video) {
    return null
  }

  return (
    <section className="full-bleed-media-block relative out-of-view">
      {mediaType === 'video' && video && (
        <div className="fill-space-video-wrap">
          <video
            ref={videoRef}
            src={videoUrlFor(video)}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
        </div>
      )}

      {mediaType === 'image' && image && (
        <div className="fill-space-image-wrap">
          <img 
            data-src={urlFor(image).url()} 
            alt="" 
            className="lazy full-bleed-image"
          />
          <div className="loading-overlay" />
        </div>
      )}

      {showControls && mediaType === 'video' && (
        <div className="video-controls fade-in z-10">
          <div className="play-pause-button" onClick={togglePlayPause}>
            <svg className={`pause ${isPlaying ? 'active' : ''} button`} xmlns="http://www.w3.org/2000/svg" width="11" height="20" viewBox="0 0 11 20">
              <line x1="0.5" x2="0.5" y2="20"/>
              <line x1="10.5" x2="10.5" y2="20"/>
            </svg>

            <svg className={`play ${!isPlaying ? 'active' : ''} button`} xmlns="http://www.w3.org/2000/svg" width="11" height="20" viewBox="0 0 11 20">
              <path d="M0.5 1L10.5 10L0.5 19"/>
            </svg>
          </div>
          
          <div className="full-screen-button" onClick={toggleFullscreen}>
            <svg className="button active" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22">
              <path d="M1 9V1H9"/>
              <path d="M1 13V21H9"/>
              <path d="M21 9V1H13"/>
              <path d="M21 13V21H13"/>
            </svg>
          </div>

          <div className="volume-button" onClick={toggleMute}>
            <svg className={`mute button ${!isMuted ? 'active' : ''}`} xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 23 23">
              <path d="M2.02539 14.876L2.03068 8.44525H5.75376L12.5177 2.69141V20.4607L5.74846 14.876H2.02539Z"/>
              <line x1="0.353553" y1="0.646447" x2="22.3536" y2="22.6464"/>
              <path d="M15.0615 7.66797C16.204 8.69055 16.9231 10.1766 16.9231 11.8306C16.9231 13.4308 16.25 14.8739 15.1715 15.8921"/>
              <path d="M17.9004 18.5992C19.7904 16.9548 20.9852 14.5319 20.9852 11.8299C20.9852 9.06625 19.7352 6.59452 17.7698 4.94922"/>
            </svg>

            <svg className={`volume button ${isMuted ? 'active' : ''}`} xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 23 23">
              <path d="M2.02539 14.876L2.03068 8.44525H5.75376L12.5177 2.69141V20.4607L5.74846 14.876H2.02539Z"/>
              <path d="M15.0615 7.66797C16.204 8.69055 16.9231 10.1766 16.9231 11.8306C16.9231 13.4308 16.25 14.8739 15.1715 15.8921"/>
              <path d="M17.9004 18.5992C19.7904 16.9548 20.9852 14.5319 20.9852 11.8299C20.9852 9.06625 19.7352 6.59452 17.7698 4.94922"/>
            </svg>
          </div>
        </div>
      )}
    </section>
  )
}
