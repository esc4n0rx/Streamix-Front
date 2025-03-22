"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { Play, Plus, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Content } from "@/types/content"
import { useMediaQuery } from "@/hooks/use-media-query"

interface MovieCardProps {
  movie: Content
  onClick: (movie: Content) => void
}

export function MovieCard({ movie, onClick }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")

  return (
    <motion.div
      className="group relative cursor-pointer rounded-lg overflow-hidden"
      whileHover={{ scale: 1.05, zIndex: 10 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onClick(movie)}
    >
      <div className="relative aspect-[2/3] bg-gray-900 rounded-lg shadow-lg">
        <img
          src={movie.image || "/placeholder.svg"}
          alt={movie.title}
          className="w-full h-full object-cover rounded-lg transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />

        {/* Gradient overlay - always visible on mobile, only on hover for desktop */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent transition-opacity duration-300 ${
            isMobile || isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Content info */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="text-sm font-medium line-clamp-1 mb-1 group-hover:text-purple-300 transition-colors">
              {movie.title}
            </h3>

            {/* Only show on hover for desktop, always for mobile */}
            {(isMobile || isHovered) && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                  <span className="text-xs text-yellow-400">{movie.rating}</span>
                </div>

                {/* Action buttons - only on hover for desktop */}
                {isHovered && !isMobile && (
                  <div className="flex gap-1">
                    <Button size="icon" className="h-7 w-7 rounded-full bg-white text-black hover:bg-white/90 p-0">
                      <Play className="h-3 w-3 fill-black" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-7 w-7 rounded-full border-white/30 hover:bg-white/20 p-0"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

