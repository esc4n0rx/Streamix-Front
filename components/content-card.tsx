"use client"

import { motion } from "framer-motion"
import { Play, Star, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Content } from "@/types/content"

interface ContentCardProps {
  content: Content
  index: number
  onClick: (content: Content) => void
}

export function ContentCard({ content, index, onClick }: ContentCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      className="relative group cursor-pointer"
      onClick={() => onClick(content)}
    >
      <div className="relative overflow-hidden rounded-lg">
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-300 z-10"></div>
        <img
          src={content.image || "/placeholder.svg"}
          alt={content.title}
          className="w-full h-auto aspect-[2/3] object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
          <h3 className="text-sm font-bold mb-1 line-clamp-1">{content.title}</h3>
          <div className="flex items-center space-x-2 mb-2">
            <span className="flex items-center text-yellow-500 text-xs">
              <Star className="h-3 w-3 fill-yellow-500 mr-0.5" />
              {content.rating}
            </span>
            <span className="text-xs">{content.year}</span>
          </div>
          <p className="text-xs text-gray-300 mb-3 line-clamp-2">{content.description}</p>
          <div className="flex space-x-2">
            <Button
              size="sm"
              className="w-full bg-white text-black hover:bg-gray-200 rounded-full px-3 py-1 h-8"
              onClick={(e) => {
                e.stopPropagation()
                onClick(content)
              }}
            >
              <Play className="mr-1 h-3 w-3 fill-black" /> Assistir
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-full bg-gray-800/80 hover:bg-gray-700/80"
              onClick={(e) => e.stopPropagation()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-2">
        <h3 className="text-sm font-medium line-clamp-1 group-hover:text-purple-400 transition-colors">
          {content.title}
        </h3>
      </div>
    </motion.div>
  )
}
