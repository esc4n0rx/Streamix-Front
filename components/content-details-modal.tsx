"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Play, Star, Calendar, Clock, Tag, Plus, ThumbsUp, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { VideoPlayer } from "./video-player"

interface Content {
  id: string
  title: string
  image: string
  rating: number
  year: number
  category: string
  description: string
}

interface ContentDetailsModalProps {
  content: Content | null
  isOpen: boolean
  onClose: () => void
}

export function ContentDetailsModal({ content, isOpen, onClose }: ContentDetailsModalProps) {
  const [showPlayer, setShowPlayer] = useState(false)

  if (!content) return null

  // Dados adicionais fictícios para o modal
  const duration = "2h 15min"
  const director = "Christopher Nolan"
  const cast = ["Leonardo DiCaprio", "Ellen Page", "Joseph Gordon-Levitt"]
  const genres = ["Ação", "Ficção Científica", "Thriller"]

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-4xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            <div className="absolute top-4 right-4 z-20">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-full"
                onClick={onClose}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {showPlayer ? (
              <VideoPlayer onClose={() => setShowPlayer(false)} />
            ) : (
              <>
                <div className="relative w-full h-[40vh] md:h-[50vh]">
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent z-10"></div>
                  <img
                    src={content.image || "/placeholder.svg"}
                    alt={content.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-20">
                    <h2 className="text-3xl md:text-4xl font-bold mb-2">{content.title}</h2>
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      <span className="flex items-center text-yellow-500">
                        <Star className="h-4 w-4 fill-yellow-500 mr-1" />
                        {content.rating}
                      </span>
                      <span className="flex items-center text-gray-300">
                        <Calendar className="h-4 w-4 mr-1" />
                        {content.year}
                      </span>
                      <span className="flex items-center text-gray-300">
                        <Clock className="h-4 w-4 mr-1" />
                        {duration}
                      </span>
                      <span className="flex items-center text-gray-300">
                        <Tag className="h-4 w-4 mr-1" />
                        {content.category}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Button
                        className="bg-white text-black hover:bg-gray-200 rounded-full px-8"
                        onClick={() => setShowPlayer(true)}
                      >
                        <Play className="mr-2 h-4 w-4 fill-black" /> Assistir
                      </Button>

                      <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800 rounded-full">
                        <Plus className="mr-2 h-4 w-4" /> Minha Lista
                      </Button>

                      <Button variant="ghost" size="icon" className="rounded-full bg-gray-800/50 hover:bg-gray-700/50">
                        <ThumbsUp className="h-5 w-5" />
                      </Button>

                      <Button variant="ghost" size="icon" className="rounded-full bg-gray-800/50 hover:bg-gray-700/50">
                        <Share2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-6 md:p-8 grid md:grid-cols-3 gap-8">
                  <div className="md:col-span-2 space-y-6">
                    <div>
                      <h3 className="text-xl font-bold mb-3">Sinopse</h3>
                      <p className="text-gray-300 leading-relaxed">
                        {content.description}
                        {/* Texto adicional para demonstração */} Lorem ipsum dolor sit amet, consectetur adipiscing
                        elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl
                        sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam
                        nisl nisl sit amet nisl.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold mb-3">Elenco</h3>
                      <div className="flex flex-wrap gap-2">
                        {cast.map((actor, index) => (
                          <span key={index} className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300">
                            {actor}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold mb-2">Diretor</h3>
                      <p className="text-gray-300">{director}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold mb-2">Gêneros</h3>
                      <div className="flex flex-wrap gap-2">
                        {genres.map((genre, index) => (
                          <span key={index} className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300">
                            {genre}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold mb-2">Disponível em</h3>
                      <div className="flex gap-2">
                        <span className="px-3 py-1 bg-purple-900/50 rounded-md text-sm text-purple-300 font-medium">
                          4K Ultra HD
                        </span>
                        <span className="px-3 py-1 bg-blue-900/50 rounded-md text-sm text-blue-300 font-medium">
                          HDR
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

