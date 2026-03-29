import { useEffect, useRef, useState, type ComponentProps } from 'react'
import * as THREE from 'three'

import { cn } from '@/lib/utils'
import { isDarkThemeEnabled } from '@/lib/theme'

type DottedSurfaceProps = ComponentProps<'div'>

const GRID_X = 34
const GRID_Y = 52
const SEPARATION = 115

export function DottedSurface({
  className,
  children,
  ...props
}: DottedSurfaceProps) {
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<number>()
  const [isDark, setIsDark] = useState(() => isDarkThemeEnabled())

  useEffect(() => {
    const syncTheme = () => setIsDark(isDarkThemeEnabled())

    syncTheme()
    window.addEventListener('devhub-theme-change', syncTheme as EventListener)
    window.addEventListener('storage', syncTheme)

    return () => {
      window.removeEventListener('devhub-theme-change', syncTheme as EventListener)
      window.removeEventListener('storage', syncTheme)
    }
  }, [])

  useEffect(() => {
    const container = canvasContainerRef.current
    if (!container) {
      return
    }

    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog(
      isDark ? 0x080913 : 0xf6fbff,
      850,
      3600,
    )

    const camera = new THREE.PerspectiveCamera(52, 1, 1, 9000)
    camera.position.set(0, 280, 1080)

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.setClearColor(0x000000, 0)
    renderer.domElement.className = 'h-full w-full'
    container.appendChild(renderer.domElement)

    const positions = new Float32Array(GRID_X * GRID_Y * 3)
    const colors = new Float32Array(GRID_X * GRID_Y * 3)
    const geometry = new THREE.BufferGeometry()

    const startX = ((GRID_X - 1) * SEPARATION) / 2
    const startZ = ((GRID_Y - 1) * SEPARATION) / 2

    let pointIndex = 0
    for (let ix = 0; ix < GRID_X; ix += 1) {
      for (let iy = 0; iy < GRID_Y; iy += 1) {
        const index = pointIndex * 3
        positions[index] = ix * SEPARATION - startX
        positions[index + 1] = 0
        positions[index + 2] = iy * SEPARATION - startZ

        const blend = iy / Math.max(1, GRID_Y - 1)
        const pointColor = new THREE.Color(
          isDark
            ? `hsl(${204 + blend * 66}, 88%, ${68 - blend * 10}%)`
            : `hsl(${206 + blend * 18}, 78%, ${48 - blend * 8}%)`,
        )

        colors[index] = pointColor.r
        colors[index + 1] = pointColor.g
        colors[index + 2] = pointColor.b
        pointIndex += 1
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      size: isDark ? 6.2 : 5.6,
      vertexColors: true,
      transparent: true,
      opacity: isDark ? 0.7 : 0.45,
      sizeAttenuation: true,
      depthWrite: false,
    })

    const points = new THREE.Points(geometry, material)
    points.rotation.x = -0.52
    points.position.y = -170
    scene.add(points)

    const resizeRenderer = () => {
      const { width, height } = container.getBoundingClientRect()
      if (!width || !height) {
        return
      }

      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height, false)
    }

    resizeRenderer()

    let waveStep = 0

    const animate = () => {
      const positionAttribute = geometry.getAttribute('position') as THREE.BufferAttribute
      const positionArray = positionAttribute.array as Float32Array

      let i = 0
      for (let ix = 0; ix < GRID_X; ix += 1) {
        for (let iy = 0; iy < GRID_Y; iy += 1) {
          const index = i * 3
          positionArray[index + 1] =
            Math.sin((ix * 0.34) + waveStep) * 28 +
            Math.cos((iy * 0.28) + waveStep * 1.35) * 22
          i += 1
        }
      }

      positionAttribute.needsUpdate = true
      points.rotation.z = Math.sin(waveStep * 0.12) * 0.045

      renderer.render(scene, camera)
      waveStep += 0.024
      frameRef.current = window.requestAnimationFrame(animate)
    }

    const resizeObserver = new ResizeObserver(() => resizeRenderer())
    resizeObserver.observe(container)
    frameRef.current = window.requestAnimationFrame(animate)

    return () => {
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current)
      }

      resizeObserver.disconnect()
      geometry.dispose()
      material.dispose()
      renderer.dispose()

      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [isDark])

  return (
    <div className={cn('relative', className)} {...props}>
      <div
        ref={canvasContainerRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      />
      {children}
    </div>
  )
}
