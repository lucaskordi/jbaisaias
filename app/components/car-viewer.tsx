'use client'

import React, { Suspense, useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { useMotionValueEvent, type MotionValue } from 'framer-motion'
import { preloadGltfModel, useGltfModel } from '../hooks/use-gltf-model'

const MODEL_PATH = '/models/fordkajba.glb'

preloadGltfModel(MODEL_PATH)

const FLOOR_Y = -0.58
const BASE_ROTATION = Math.PI * 0.25

interface CarViewerProps {
  zoom: number
  rotationValue: MotionValue<number>
  enableControls?: boolean
}

export function CarViewer({ zoom, rotationValue, enableControls = true }: CarViewerProps) {
  const controlsRef = useRef<any>(null)

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.enabled = enableControls
    }
  }, [enableControls])

  return (
    <div className="relative h-full w-full" style={{ pointerEvents: enableControls ? 'auto' : 'none', touchAction: enableControls ? 'none' : 'pan-y' }}>
      <Canvas className="h-full w-full" camera={{ position: [4.2, 1.65, 4.2], fov: 40 }} dpr={[1, 1.8]} gl={{ preserveDrawingBuffer: true }} shadows>
        <CameraRig zoom={zoom} controls={controlsRef} />
        <SceneLights />
        <Suspense fallback={null}>
          <AnimatedCar rotationValue={rotationValue} />
        </Suspense>
        <OrbitControls ref={controlsRef} enablePan={false} enableZoom={false} enabled={enableControls} maxPolarAngle={Math.PI * 0.52} minPolarAngle={Math.PI * 0.2} />
        <Environment preset="city" />
        <ContactShadows position={[0, FLOOR_Y, 0]} opacity={0.7} scale={6} blur={1.8} far={5} />
      </Canvas>
    </div>
  )
}

function AnimatedCar({ rotationValue }: { rotationValue: MotionValue<number> }) {
  const carRef = useRef<THREE.Group | null>(null)

  useMotionValueEvent(rotationValue, 'change', (value) => {
    if (!carRef.current) return
    const clamped = THREE.MathUtils.clamp(value, 0, 1)
    if (clamped <= 0.001) {
      carRef.current.rotation.y = BASE_ROTATION
    }
  })

  useFrame(() => {
    if (!carRef.current) return
    carRef.current.rotation.y = THREE.MathUtils.lerp(carRef.current.rotation.y, BASE_ROTATION, 0.12)
  })

  useEffect(() => {
    if (carRef.current) {
      carRef.current.rotation.y = BASE_ROTATION
    }
  }, [])

  return (
    <group ref={carRef}>
      <CarModel />
    </group>
  )
}

function CarModel() {
  const scene = useGltfModel(MODEL_PATH)
  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
    scene.position.set(0, FLOOR_Y + 0.02, 0)
    scene.rotation.set(0, 0, 0)
  }, [scene])
  return <primitive object={scene} scale={1.15} />
}

function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3.5, 6, 2]} intensity={1.6} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-normalBias={0.02} />
      <spotLight position={[-6, 7, -3]} intensity={0.9} angle={0.45} penumbra={0.5} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
      <spotLight position={[0, 3, 6]} intensity={0.7} angle={0.4} penumbra={0.6} color="#38bdf8" />
    </>
  )
}

function CameraRig({ zoom, controls }: { zoom: number; controls: React.MutableRefObject<any> }) {
  const { camera } = useThree()
  const baseDistance = useRef<number | null>(null)

  useEffect(() => {
    if (baseDistance.current === null) {
      baseDistance.current = camera.position.length()
    }
  }, [camera])

  useEffect(() => {
    if (baseDistance.current === null) {
      baseDistance.current = camera.position.length()
    }
    const origin = new THREE.Vector3(0, 0, 0)
    const direction = camera.position.clone().sub(origin).normalize()
    const distance = (baseDistance.current ?? 1) / zoom
    camera.position.copy(direction.multiplyScalar(distance))
    camera.updateProjectionMatrix()
    controls.current?.update()
  }, [zoom, camera])

  return null
}

