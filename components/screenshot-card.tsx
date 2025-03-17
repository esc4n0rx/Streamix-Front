"use client"

import { motion } from "framer-motion"

interface ScreenshotCardProps {
  title: string
  image: string
  index: number
}

export function ScreenshotCard({ title, image, index }: ScreenshotCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      viewport={{ once: true }}
      className="relative group overflow-hidden rounded-xl"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70 z-10"></div>
      <img
        src={image || "/placeholder.svg"}
        alt={title}
        className="w-full h-auto aspect-video object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
        <h3 className="text-xl font-bold text-white">{title}</h3>
      </div>
    </motion.div>
  )
}

