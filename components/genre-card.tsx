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
      className={cn(
        "relative cursor-pointer rounded-lg overflow-hidden",
        "transition-all duration-300"
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div 
        className={cn(
          "flex items-center justify-center h-24 w-full bg-gray-900/80 border border-gray-800",
          "transition-all duration-300",
          isSelected 
            ? "border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]" 
            : "hover:border-yellow-500/50 hover:shadow-[0_0_15px_rgba(234,179,8,0.2)]"
        )}
      >
        <span className="text-lg font-bold">{name}</span>
      </div>
    </motion.div>
  )
}
