"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

interface BackgroundGradientAnimationProps {
  intensity?: number
}

export function BackgroundGradientAnimation({ intensity = 0.5 }: BackgroundGradientAnimationProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })

      const handleResize = () => {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        })
      }

      const handleMouseMove = (e: MouseEvent) => {
        setMousePosition({
          x: e.clientX,
          y: e.clientY,
        })
      }

      window.addEventListener("resize", handleResize)
      window.addEventListener("mousemove", handleMouseMove)

      return () => {
        window.removeEventListener("resize", handleResize)
        window.removeEventListener("mousemove", handleMouseMove)
      }
    }
  }, [])

  const normalizedMouseX = mousePosition.x / dimensions.width
  const normalizedMouseY = mousePosition.y / dimensions.height

  return (
    <div ref={containerRef} className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: -1 }}>
      <div className="absolute inset-0 bg-black opacity-90"></div>

      <motion.div
        className="absolute -inset-[100%] opacity-30"
        style={{
          background: `radial-gradient(circle at ${normalizedMouseX * 100}% ${
            normalizedMouseY * 100
          }%, rgba(120, 41, 190, ${intensity}), rgba(53, 42, 140, ${intensity * 0.5}), transparent 100%)`,
        }}
        animate={{
          x: normalizedMouseX * 10,
          y: normalizedMouseY * 10,
        }}
        transition={{ type: "spring", damping: 15, stiffness: 20 }}
      />

      <motion.div
        className="absolute -inset-[100%] opacity-20"
        style={{
          background: `radial-gradient(circle at ${100 - normalizedMouseX * 100}% ${
            100 - normalizedMouseY * 100
          }%, rgba(230, 92, 156, ${intensity}), rgba(107, 33, 168, ${intensity * 0.5}), transparent 100%)`,
        }}
        animate={{
          x: -normalizedMouseX * 10,
          y: -normalizedMouseY * 10,
        }}
        transition={{ type: "spring", damping: 15, stiffness: 20 }}
      />
    </div>
  )
}

