"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"
import type { Content } from "@/types/content"

interface MovieCardProps {
  movie: Content
  onClick: (movie: Content) => void
}

export function MovieCard({ movie, onClick }: MovieCardProps) {
  return (
    <motion.div
      className="group relative cursor-pointer rounded-lg overflow-hidden"
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(movie)}
    >
      <div className="relative aspect-[2/3]">
        <img
          src={movie.image || "/placeholder.svg"}
          alt={movie.title}
          className="w-full h-full object-cover rounded-lg"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="text-sm font-bold line-clamp-1">{movie.title}</h3>
            <div className="flex items-center gap-1 text-yellow-500 text-xs">
              <Star className="h-3 w-3 fill-yellow-500" />
              {movie.rating}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

