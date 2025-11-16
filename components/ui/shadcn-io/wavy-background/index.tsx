'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createNoise3D } from 'simplex-noise'

import { cn } from '@/lib/utils'

export interface WavyBackgroundProps {
  children?: React.ReactNode
  className?: string
  containerClassName?: string
  colors?: string[]
  waveWidth?: number
  backgroundFill?: string
  blur?: number
  speed?: 'slow' | 'fast'
  waveOpacity?: number
  [key: string]: unknown
}

export const WavyBackground = ({
  children,
  className,
  containerClassName,
  colors,
  waveWidth,
  backgroundFill = '#ffffff',
  blur = 10,
  speed = 'fast',
  waveOpacity = 0.5,
  ...props
}: WavyBackgroundProps) => {
  const [isSafari, setIsSafari] = useState(false)
  const [isClient, setIsClient] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)
  const dimensionsRef = useRef({ width: 0, height: 0 })
  const timeRef = useRef(0)
  const animationRef = useRef<number | null>(null)
  const noiseRef = useRef(createNoise3D())

  const waveColors = useMemo(() => {
    return colors ?? ['#38bdf8', '#818cf8', '#c084fc', '#e879f9', '#22d3ee']
  }, [colors])

  const speedValue = speed === 'slow' ? 0.001 : 0.002
  const resolvedWaveWidth = waveWidth ?? 50

  const prepareContext = useCallback(() => {
    if (!canvasRef.current) return
    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return
    contextRef.current = ctx
    dimensionsRef.current.width = canvasRef.current.offsetWidth
    dimensionsRef.current.height = canvasRef.current.offsetHeight
    ctx.canvas.width = dimensionsRef.current.width
    ctx.canvas.height = dimensionsRef.current.height
    ctx.filter = `blur(${blur}px)`
    timeRef.current = 0
  }, [blur])

  const drawWaves = useCallback(
    (count: number) => {
      const ctx = contextRef.current
      if (!ctx) return
      const noise = noiseRef.current
      const { width, height } = dimensionsRef.current
      timeRef.current += speedValue
      for (let index = 0; index < count; index += 1) {
        ctx.beginPath()
        ctx.lineWidth = resolvedWaveWidth
        ctx.strokeStyle = waveColors[index % waveColors.length] ?? '#2A705F'
        for (let position = 0; position < width; position += 5) {
          const amplitude = noise(position / 800, 0.3 * index, timeRef.current) * 100
          ctx.lineTo(position, amplitude + height * 0.5)
        }
        ctx.stroke()
        ctx.closePath()
      }
    },
    [resolvedWaveWidth, speedValue, waveColors]
  )

  const renderFrame = useCallback(() => {
    const ctx = contextRef.current
    if (!ctx) return
    const { width, height } = dimensionsRef.current
    ctx.fillStyle = backgroundFill
    ctx.globalAlpha = waveOpacity
    ctx.fillRect(0, 0, width, height)
    drawWaves(5)
    animationRef.current = requestAnimationFrame(renderFrame)
  }, [backgroundFill, drawWaves, waveOpacity])

  const handleResize = useCallback(() => {
    prepareContext()
  }, [prepareContext])

  useEffect(() => {
    setIsClient(true)
    const isSafariBrowser =
      typeof navigator !== 'undefined' &&
      navigator.userAgent.includes('Safari') &&
      !navigator.userAgent.includes('Chrome')
    setIsSafari(isSafariBrowser)
  }, [])

  useEffect(() => {
    if (!isClient) return
    prepareContext()
    renderFrame()
    window.addEventListener('resize', handleResize)
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener('resize', handleResize)
    }
  }, [handleResize, isClient, prepareContext, renderFrame])

  return (
    <div
      className={cn(
        'relative flex h-full w-full flex-col items-center justify-center',
        containerClassName
      )}
    >
      <canvas
        className="absolute inset-0 z-0 h-full w-full"
        ref={canvasRef}
        style={isClient && isSafari ? { filter: `blur(${blur}px)` } : undefined}
      />
      <div className={cn('relative z-10', className)} {...props}>
        {children}
      </div>
    </div>
  )
}
