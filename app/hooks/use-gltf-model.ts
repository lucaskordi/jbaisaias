'use client'

import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'

export function useGltfModel(src: string) {
  const gltf = useGLTF(src)
  return useMemo(() => gltf.scene.clone(true), [gltf.scene])
}

export function preloadGltfModel(src: string) {
  useGLTF.preload(src)
}

