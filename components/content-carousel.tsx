"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ContentCard } from "@/components/content-card"
import { Content } from "@/types/content"

interface ContentCarouselProps {
  contents: Content[]
  onContentClick: (content: Content) => void
}

export function ContentCarousel({ contents, onContentClick }: ContentCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null)

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: -carouselRef.current.offsetWidth / 2,
        behavior: "smooth",
      })
    }
  }

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: carouselRef.current.offsetWidth / 2,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className="relative group">
      <div ref={carouselRef} className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide snap-x">
        {contents.map((content, index) => (
          <div key={content.id} className="flex-none w-[180px] md:w-[200px] snap-start">
            <ContentCard content={content} index={index} onClick={onContentClick} />
          </div>
        ))}
      </div>

      <div className="absolute top-1/2 left-0 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full bg-black/50 hover:bg-black/70"
          onClick={scrollLeft}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>

      <div className="absolute top-1/2 right-0 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full bg-black/50 hover:bg-black/70"
          onClick={scrollRight}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}

