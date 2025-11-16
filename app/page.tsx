'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import Lottie from 'lottie-react'
import mouseScrollAnimation from '@/public/MouseScroll.json'
import mouseInteractAnimation from '@/public/Mouse.json'
import { WavyBackground } from '@/components/ui/shadcn-io/wavy-background'
import { CarViewer } from './components/car-viewer'

export default function HomePage() {
  const [zoom, setZoom] = useState(DEFAULT_ZOOM)
  const [isMobile, setIsMobile] = useState(false)
  const [showMobileWarning, setShowMobileWarning] = useState(true)
  const [interactionMode, setInteractionMode] = useState(true)
  const scrollRef = useRef<HTMLElement | null>(null)
  const { scrollYProgress } = useScroll({
    container: scrollRef,
    offset: ['start start', 'end end']
  })

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (!mobile) {
        setShowMobileWarning(false)
        setInteractionMode(false)
      }
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (isMobile && scrollRef.current) {
      scrollRef.current.style.overflowX = 'hidden'
      if (interactionMode) {
        scrollRef.current.style.overflowY = 'hidden'
        scrollRef.current.style.touchAction = 'none'
      } else {
        scrollRef.current.style.overflowY = 'auto'
        scrollRef.current.style.touchAction = 'auto'
      }
    } else if (scrollRef.current) {
      scrollRef.current.style.overflow = 'auto'
      scrollRef.current.style.touchAction = 'auto'
    }
  }, [interactionMode, isMobile])
  const introOpacity = useTransform(scrollYProgress, [0, 0.2, 0.35], [1, 1, 0])
  const circleScale = useTransform(scrollYProgress, [0.05, 0.35, 0.6, 0.85], [0.1, 10, 4, 0.05])
  const messageOpacity = useTransform(scrollYProgress, [0.12, 0.28], [0, 1])
  const messageX = useTransform(scrollYProgress, [0.12, 0.28], [40, 0])
  const carinhoCombinedOpacity = useTransform(scrollYProgress, (progress) => {
    if (progress < 0.12) return 0
    if (progress <= 0.28) return (progress - 0.12) / (0.28 - 0.12)
    if (progress <= 0.6) return 1
    if (progress <= 0.75) return 1 - ((progress - 0.6) / (0.75 - 0.6)) * 0.5
    if (progress <= 0.85) return 0.5 - ((progress - 0.75) / (0.85 - 0.75)) * 0.5
    return 0
  })
  const curitibaOpacity = useTransform(scrollYProgress, [0.85, 0.95], [0, 1])
  const curitibaX = useTransform(scrollYProgress, [0.85, 0.95], [40, 0])
  const zoomIconColor = useTransform(scrollYProgress, [0.08, 0.2], ['#FFFFFF', '#212121'])
  const carRotationProgress = useTransform(scrollYProgress, [0.52, 0.7], [0, 1])
  const cityOpacity = useTransform(scrollYProgress, [0.45, 0.62, 0.8], [0, 0.6, 1])
  const adjustedZoom = useMemo(() => {
    return isMobile ? zoom * 0.55 : zoom
  }, [zoom, isMobile])
  const { increase, decrease } = useMemo(() => {
    return {
      increase: () => setZoom((current) => clamp(current + ZOOM_STEP, ZOOM_MIN, ZOOM_MAX)),
      decrease: () => setZoom((current) => clamp(current - ZOOM_STEP, ZOOM_MIN, ZOOM_MAX))
    }
  }, [])

  return (
    <main ref={scrollRef} className="relative h-screen overflow-y-auto overflow-x-hidden bg-white text-slate-900">
      {showMobileWarning && isMobile && <MobileWarning onDismiss={() => setShowMobileWarning(false)} />}
      {isMobile && (
        <div className="fixed top-0 right-0 z-[50] flex items-center gap-2 px-6 pt-8">
          <InteractionToggle interactionMode={interactionMode} onToggle={() => setInteractionMode(!interactionMode)} />
          <ZoomBarMobile onZoomIn={increase} onZoomOut={decrease} zoomColor={zoomIconColor} />
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient opacity-40" />
      <ScrollWave />
      <ZoomBar onZoomIn={increase} onZoomOut={decrease} zoomColor={zoomIconColor} />
      <CarShowcase zoom={adjustedZoom} introOpacity={introOpacity} circleScale={circleScale} messageOpacity={messageOpacity} messageX={messageX} carinhoCombinedOpacity={carinhoCombinedOpacity} curitibaOpacity={curitibaOpacity} curitibaX={curitibaX} cityOpacity={cityOpacity} rotationProgress={carRotationProgress} interactionMode={interactionMode} isMobile={isMobile} />
      <div className="h-[200vh]" />
      <FooterMarquee />
    </main>
  )
}

function ScrollWave() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 flex justify-center overflow-hidden">
      <div className="relative h-[140vh] w-[140vw] translate-y-[-26vh]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(42,112,95,0.05) 0%,rgba(0,216,72,0.32) 32%,rgba(42,112,95,0.6) 55%,rgba(9,19,15,0.82) 100%)]" />
        <div className="absolute inset-0 bg-[#2A705F1a]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0) 40%,rgba(2,6,23,0.55) 78%,rgba(2,6,23,0.85) 100%)] mix-blend-multiply" />
        <div className="absolute inset-0 bg-[linear-gradient(140deg,rgba(15,23,42,0.35) 0%,rgba(9,18,32,0) 50%,rgba(15,23,42,0.45) 100%)] mix-blend-multiply" />
        <div className="absolute inset-0 bg-[linear-gradient(320deg,rgba(0,0,0,0.3) 0%,rgba(255,255,255,0) 55%)] opacity-60 mix-blend-overlay" />
        <WavyBackground
          backgroundFill="#2A705F"
          colors={['#2A705F', '#8BAA2A', '#97DEA4']}
          waveWidth={40}
          blur={14}
          speed="slow"
          waveOpacity={0.35}
          containerClassName="pointer-events-none h-full w-full"
          className="pointer-events-none h-full w-full"
        />
      </div>
    </div>
  )
}

function ZoomBar({ onZoomIn, onZoomOut, zoomColor }: { onZoomIn: () => void; onZoomOut: () => void; zoomColor: MotionValue<string> }) {
  const handleZoomIn = useCallback(() => {
    onZoomIn()
  }, [onZoomIn])

  const handleZoomOut = useCallback(() => {
    onZoomOut()
  }, [onZoomOut])

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-30 hidden justify-center px-6 pt-8 md:flex">
      <motion.div className="pointer-events-auto flex items-center gap-4 rounded-full border border-white/20 bg-white/10 px-6 py-3 shadow-lg backdrop-blur" style={{ color: zoomColor }}>
        <button
          type="button"
          onClick={handleZoomOut}
          aria-label="Diminuir zoom"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-2xl font-semibold transition hover:bg-white/20"
        >
          -
        </button>
        <button
          type="button"
          onClick={handleZoomIn}
          aria-label="Aumentar zoom"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-2xl font-semibold transition hover:bg-white/20"
        >
          +
        </button>
      </motion.div>
    </div>
  )
}

function ZoomBarMobile({ onZoomIn, onZoomOut, zoomColor }: { onZoomIn: () => void; onZoomOut: () => void; zoomColor: MotionValue<string> }) {
  const handleZoomIn = useCallback(() => {
    onZoomIn()
  }, [onZoomIn])

  const handleZoomOut = useCallback(() => {
    onZoomOut()
  }, [onZoomOut])

  return (
    <motion.div className="pointer-events-auto flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 shadow-lg backdrop-blur" style={{ color: zoomColor }}>
      <button
        type="button"
        onClick={handleZoomOut}
        aria-label="Diminuir zoom"
        className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-lg font-semibold transition hover:bg-white/20"
      >
        -
      </button>
      <button
        type="button"
        onClick={handleZoomIn}
        aria-label="Aumentar zoom"
        className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-lg font-semibold transition hover:bg-white/20"
      >
        +
      </button>
    </motion.div>
  )
}

function CarShowcase({ zoom, introOpacity, circleScale, messageOpacity, messageX, carinhoCombinedOpacity, curitibaOpacity, curitibaX, cityOpacity, rotationProgress, interactionMode, isMobile }: { zoom: number; introOpacity: MotionValue<number>; circleScale: MotionValue<number>; messageOpacity: MotionValue<number>; messageX: MotionValue<number>; carinhoCombinedOpacity: MotionValue<number>; curitibaOpacity: MotionValue<number>; curitibaX: MotionValue<number>; cityOpacity: MotionValue<number>; rotationProgress: MotionValue<number>; interactionMode: boolean; isMobile: boolean }) {
  const prompts = [
    {
      animation: mouseInteractAnimation,
      lines: ['Utilize o mouse', 'para interagir com o modelo 3D']
    },
    {
      animation: mouseScrollAnimation,
      lines: ['Utilize o scroll do mouse', 'para navegar pelo conteúdo', 'do site']
    }
  ]
  const mobilePrompts = [
    {
      animation: mouseInteractAnimation,
      lines: ['Utilize o modo interação para girar o modelo 3D']
    },
    {
      animation: mouseScrollAnimation,
      lines: ['Clique no botão verde de interação e mude para o', 'modo scroll para navegar']
    }
  ]

  return (
    <div className="pointer-events-none sticky top-0 z-10 flex h-screen w-full flex-col md:items-center md:justify-center">
      <motion.div className="pointer-events-none absolute inset-0 z-[2] hidden items-center justify-between px-16 md:flex" style={{ opacity: introOpacity }}>
        <div className="max-w-xl text-left font-black tracking-[-0.08em] text-white flex flex-col gap-2">
          <span className="text-7xl leading-[0.9]">Isaias,</span>
          <span className="text-7xl leading-[0.9]">
            seu <span className="text-[#00D848] font-black">Ford Ka</span>
          </span>
          <span className="text-7xl leading-[0.9]">
            está <span className="swash-underline">pronto.</span>
          </span>
        </div>
        <div className="flex flex-col items-end gap-5 text-right text-xs font-semibold uppercase tracking-[0.32em] text-white/80">
          {prompts.map((prompt) => (
            <div key={prompt.lines.join('-')} className="flex items-center gap-5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center">
                <Lottie animationData={prompt.animation} className="h-11 w-11" autoplay loop />
              </span>
              <div className="flex w-[23rem] flex-col items-start text-left text-[13px] leading-[1.4] tracking-[0.32em] text-white">
                {prompt.lines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
      <motion.div className="pointer-events-none absolute inset-0 z-[2] flex flex-col items-start justify-start px-6 pt-20 md:hidden" style={{ opacity: introOpacity }}>
        <div className="max-w-xl text-left font-black tracking-[-0.08em] text-white flex flex-col gap-2">
          <span className="text-4xl leading-[0.9]">Isaias,</span>
          <span className="text-4xl leading-[0.9]">
            seu <span className="text-[#00D848] font-black">Ford Ka</span>
          </span>
          <span className="text-4xl leading-[0.9]">
            está <span className="swash-underline">pronto.</span>
          </span>
        </div>
      </motion.div>
      <motion.div className="pointer-events-none absolute inset-0 z-[2] flex flex-col items-center justify-end px-6 md:hidden" style={{ opacity: introOpacity, paddingBottom: 'calc(11rem + env(safe-area-inset-bottom))' }}>
        <div className="flex flex-col items-center gap-3 text-xs font-semibold uppercase tracking-[0.32em] text-white/80">
          {mobilePrompts.map((prompt) => (
            <div key={prompt.lines.join('-')} className="flex items-center justify-center gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center flex-shrink-0">
                <Lottie animationData={prompt.animation} className="h-10 w-10" autoplay loop />
              </span>
              <div className="flex flex-col items-center justify-center text-[11px] leading-[1.4] tracking-[0.32em] text-white" style={{ textAlign: 'center' }}>
                {prompt.lines.map((line) => (
                  <span key={line} style={{ textAlign: 'center', display: 'block' }}>{line}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
      <motion.div className="pointer-events-none absolute inset-0 z-[5] hidden items-center justify-start px-16 md:flex" style={{ opacity: carinhoCombinedOpacity, x: messageX }}>
        <div className="max-w-xl text-left font-black tracking-[-0.05em] text-[#212121] flex flex-col gap-2">
          <span className="text-7xl leading-[0.9] text-[#212121]">Criado com</span>
          <span className="text-7xl leading-[0.9] text-[#00D848]">Carinho<span className="text-[#212121]">.</span></span>
        </div>
      </motion.div>
      <motion.div className="pointer-events-none absolute inset-0 z-[5] flex items-start justify-start px-6 pt-32 md:hidden" style={{ opacity: carinhoCombinedOpacity, x: messageX }}>
        <div className="max-w-xl text-left font-black tracking-[-0.05em] text-[#212121] flex flex-col gap-2">
          <span className="text-3xl leading-[0.9] text-[#212121]">Criado com</span>
          <span className="text-3xl leading-[0.9] text-[#00D848]">Carinho<span className="text-[#212121]">.</span></span>
        </div>
      </motion.div>
      <motion.div className="pointer-events-none absolute inset-0 z-[5] hidden items-center justify-start px-16 md:flex" style={{ opacity: curitibaOpacity, x: curitibaX }}>
        <div className="max-w-xl text-left font-black tracking-[-0.05em] text-white flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-7xl leading-[0.9] text-white">Para as Ruas</span>
            <span className="text-7xl leading-[0.9] text-white">de <span className="text-[#00D848]">Curitiba<span className="text-white">.</span></span></span>
          </div>
          <motion.a
            href="https://drive.google.com/drive/folders/1Tl4Lbfdcuej_oZV4E4QQjQ1GHjlGyK6e?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto inline-flex items-center justify-center rounded-full border-2 border-white bg-white/10 px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white backdrop-blur transition hover:bg-white/20"
          >
            Download dos Arquivos
          </motion.a>
        </div>
      </motion.div>
      <motion.div className="pointer-events-none absolute inset-0 z-[5] flex items-start justify-start px-6 pt-32 md:hidden" style={{ opacity: curitibaOpacity, x: curitibaX }}>
        <div className="max-w-xl text-left font-black tracking-[-0.05em] text-[#212121] flex flex-col gap-2">
          <span className="text-3xl leading-[0.9] text-[#212121]">Para as Ruas</span>
          <span className="text-3xl leading-[0.9] text-[#212121]">de <span className="text-[#00D848]">Curitiba<span className="text-[#212121]">.</span></span></span>
        </div>
      </motion.div>
      <motion.div className="pointer-events-none absolute inset-0 z-[5] flex items-end justify-center pb-20 px-6 md:hidden" style={{ opacity: curitibaOpacity }}>
        <motion.a
          href="https://drive.google.com/drive/folders/1Tl4Lbfdcuej_oZV4E4QQjQ1GHjlGyK6e?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto inline-flex items-center gap-2 rounded-full border-2 border-[#212121] bg-white/80 px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-[#212121] transition hover:bg-white"
        >
          <motion.svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </motion.svg>
          Download dos Arquivos
        </motion.a>
      </motion.div>
      <motion.div className="pointer-events-none absolute inset-0 z-[3]" style={{ opacity: cityOpacity }}>
        <div className="h-full w-full bg-[url('/city.webp')] bg-cover bg-[center_calc(100%)] scale-[2] translate-y-[-35%] md:scale-100 md:translate-y-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40" />
      </motion.div>
      <div className="pointer-events-none absolute inset-0 z-[4] flex items-center justify-center">
        <motion.div style={{ scale: circleScale }} className="relative h-[24rem] w-[24rem] origin-center overflow-hidden rounded-full bg-white shadow-[0_0_120px_rgba(255,255,255,0.3)]">
          <div className="absolute inset-0 bg-white" />
          <WavyBackground
            backgroundFill="#ffffff"
            colors={['#ffffff', '#e8f6ee', '#bfffd9', '#00D848']}
            waveWidth={32}
            blur={12}
            speed="slow"
            waveOpacity={0.3}
            containerClassName="pointer-events-none h-full w-full"
            className="pointer-events-none h-full w-full"
          />
        </motion.div>
      </div>
      <div className={`relative z-[6] flex h-full w-full items-center justify-center md:items-center md:justify-center ${interactionMode ? 'pointer-events-auto' : 'pointer-events-none md:pointer-events-auto'}`} style={{ touchAction: interactionMode ? 'none' : 'pan-y' }}>
        <div className="flex h-full w-full items-end justify-center pb-8 md:items-center md:pb-0">
          <CarViewer zoom={zoom} rotationValue={rotationProgress} enableControls={isMobile ? interactionMode : true} />
        </div>
      </div>
    </div>
  )
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

const ZOOM_MIN = 0.7
const ZOOM_MAX = 1.4
const ZOOM_STEP = 0.08
const DEFAULT_ZOOM = 1

function InteractionToggle({ interactionMode, onToggle }: { interactionMode: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`rounded-full border-2 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.1em] transition ${
        interactionMode
          ? 'border-[#00D848] bg-[#00D848] text-white'
          : 'border-white/80 bg-white/20 text-white backdrop-blur'
      }`}
    >
      {interactionMode ? 'Interação' : 'Scroll'}
    </button>
  )
}

function MobileWarning({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center md:hidden">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
      <div className="relative z-10 flex flex-col items-center justify-center gap-8 px-6 text-center">
        <p className="text-xl font-semibold text-white">
          Esse site é melhor visualizado em um computador!
        </p>
        <button
          type="button"
          onClick={onDismiss}
          className="rounded-full border-2 border-white bg-white/20 px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white backdrop-blur transition hover:bg-white/30"
        >
          Entrar Mesmo Assim
        </button>
      </div>
    </div>
  )
}

function FooterMarquee() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[5] h-8 overflow-hidden md:h-12">
      <div className="absolute inset-0 z-0 bg-white shadow-[0_-10px_30px_rgba(0,0,0,0.15)]" />
      <div className="relative z-10 flex h-full items-center text-[#212121]">
        <motion.div
          className="flex whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.6em] md:text-xs"
          animate={{ x: ['-50%', '0%'] }}
          transition={{ duration: 22, ease: 'linear', repeat: Infinity }}
        >
          <span className="mr-16">Lucas Kordi + JBA + Isaias</span>
          <span className="mr-16">Lucas Kordi + JBA + Isaias</span>
          <span className="mr-16">Lucas Kordi + JBA + Isaias</span>
          <span className="mr-16">Lucas Kordi + JBA + Isaias</span>
          <span className="mr-16">Lucas Kordi + JBA + Isaias</span>
          <span className="mr-16">Lucas Kordi + JBA + Isaias</span>
        </motion.div>
      </div>
    </div>
  )
}

