"use client"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface GenreCardProps {
  name: string
  isSelected: boolean
  onClick: () => void
}

export function GenreCard({ name, isSelected, onClick }: GenreCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "relative cursor-pointer rounded-lg overflow-hidden aspect-video",
        isSelected ? "ring-2 ring-purple-500 ring-offset-2 ring-offset-[#0a0a1a]" : ""
      )}
      onClick={onClick}
    >
      <div 
        className={cn(
          "absolute inset-0 flex items-center justify-center p-2 text-center font-medium",
          isSelected 
            ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white" 
            : "bg-gray-900/80 text-gray-300 hover:bg-gray-800/90 hover:text-white"
        )}
      >
        {name}
      </div>
    </motion.div>
  )
}
