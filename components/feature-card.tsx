"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
  index: number
}

export function FeatureCard({ icon, title, description, index }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05 }}
      className="relative group"
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
      <div className="relative bg-gray-900 p-6 rounded-xl border border-gray-800 h-full flex flex-col">
        <div className="p-3 rounded-full bg-gray-800 w-fit mb-4 group-hover:bg-gray-700 transition-colors">{icon}</div>
        <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors">{title}</h3>
        <p className="text-gray-400 group-hover:text-gray-300 transition-colors">{description}</p>
      </div>
    </motion.div>
  )
}

