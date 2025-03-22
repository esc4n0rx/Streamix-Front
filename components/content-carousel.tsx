"use client"
import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Play, Plus, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Content } from "@/types/content"
import { useMediaQuery } from "@/hooks/use-media-query"

interface ContentCarouselProps {
  contents: Content[]
  onContentClick: (content: Content) => void
  showProgress?: boolean
}

export function ContentCarousel({ contents, onContentClick }: ContentCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const itemsPerPage = isMobile ? 2.5 : 5

  const handleNext = () => {
    if (contents.length <= itemsPerPage) return
    setCurrentIndex((prev) => Math.min(prev + 1, contents.length - itemsPerPage))
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
  }

  // Touch scroll handling for mobile
  useEffect(() => {
    const carousel = carouselRef.current
    if (!carousel || !isMobile) return

    let startX: number
    let scrollLeft: number

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].pageX - carousel.offsetLeft
      scrollLeft = carousel.scrollLeft
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!startX) return
      const x = e.touches[0].pageX - carousel.offsetLeft
      const walk = (x - startX) * 2 // Scroll speed multiplier
      carousel.scrollLeft = scrollLeft - walk
    }

    carousel.addEventListener("touchstart", handleTouchStart)
    carousel.addEventListener("touchmove", handleTouchMove)

    return () => {
      carousel.removeEventListener("touchstart", handleTouchStart)
      carousel.removeEventListener("touchmove", handleTouchMove)
    }
  }, [isMobile])

  if (!contents.length) {
    return <div className="text-center py-10 text-gray-500">Nenhum conteúdo disponível</div>
  }

  return (
    <div className="relative group">
      {/* Navigation Buttons - Hidden on mobile */}
      {!isMobile && contents.length > itemsPerPage && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity -translate-x-5"
            onClick={handlePrev}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity translate-x-5"
            onClick={handleNext}
            disabled={currentIndex >= contents.length - itemsPerPage}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}

      {/* Carousel Container */}
      <div ref={carouselRef} className="overflow-x-auto hide-scrollbar snap-x snap-mandatory flex gap-3 md:gap-4 pb-4">
        {contents.map((content, index) => (
          <motion.div
            key={content.id}
            className="relative flex-shrink-0 snap-start"
            style={{
              width: isMobile ? "40%" : "19%",
              minWidth: isMobile ? "140px" : "200px",
              transform: `translateX(-${currentIndex * 100}%)`,
              transition: "transform 0.5s ease-out",
            }}
            onHoverStart={() => setHoveredIndex(index)}
            onHoverEnd={() => setHoveredIndex(null)}
            whileHover={{ scale: 1.05, zIndex: 10 }}
            onClick={() => onContentClick(content)}
          >
            <div className="relative overflow-hidden rounded-lg aspect-[2/3] bg-gray-900 shadow-lg group">
              <img
                src={content.image || "/placeholder.svg"}
                alt={content.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Hover overlay with info - Desktop only */}
              {!isMobile && hoveredIndex === index && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent p-3 flex flex-col justify-end"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <h4 className="text-sm font-bold line-clamp-1 mb-1">{content.title}</h4>
                  <div className="flex items-center gap-2 text-xs mb-2">
                    {content.rating && (
                      <span className="flex items-center text-yellow-400">
                        <Star className="h-3 w-3 fill-yellow-400 mr-0.5" />
                        {content.rating}
                      </span>
                    )}
                    {content.year && <span>{content.year}</span>}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="w-8 h-8 rounded-full bg-white text-black hover:bg-white/90 p-0">
                      <Play className="h-4 w-4 fill-black" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-8 h-8 rounded-full border-white/30 hover:bg-white/20 p-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Mobile title overlay - always visible */}
              {isMobile && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                  <h4 className="text-xs font-medium line-clamp-1">{content.title}</h4>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

