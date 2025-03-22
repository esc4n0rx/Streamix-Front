"use client"
import { useState, useEffect, useRef } from "react"
import type React from "react"

import { motion, useScroll } from "framer-motion"
import { Star, ChevronRight } from "lucide-react"
import { BackgroundGradientAnimation } from "@/components/background-gradient-animation"
import { ContentDetailsModal } from "@/components/content-details-modal"
import { GenreCard } from "@/components/genre-card"
import { MovieCard } from "@/components/movie-card"
import { Button } from "@/components/ui/button"
import type { Content } from "@/types/content"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Navbar } from "@/components/navbar"

const baseUrl = "https://api.streamhivex.icu"

// Categorias de gênero para os cards
const genreCategories = ["AÇÃO", "TERROR", "COMÉDIA", "DRAMA", "AVENTURA", "ANIMAÇÃO", "FICÇÃO"]

export default function FilmesPage() {
  const [selectedContent, setSelectedContent] = useState<Content | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [categoryMovies, setCategoryMovies] = useState<Record<string, Content[]>>({})
  const [featuredMovies, setFeaturedMovies] = useState<Content[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const { scrollY } = useScroll()
  const [isScrolled, setIsScrolled] = useState(false)
  const [categories, setCategories] = useState<string[]>([])

  // Refs para rolagem suave
  const featuredRef = useRef<HTMLDivElement>(null)
  const moviesRef = useRef<HTMLDivElement>(null)

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Função para rolagem suave
  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Função para mapear um item de filme da API para nosso formato Content
  const mapMovieItem = (item: any, index: number, category: string): Content => ({
    id: `${item.id}-${index}`,
    originalId: item.id,
    title: item.nome,
    image: item.poster.startsWith("http") ? item.poster : `${baseUrl}/${item.poster}`,
    rating: parseFloat((Math.random() * 3 + 2).toFixed(1)),
    year: new Date().getFullYear(),
    category: category,
    description: item.sinopse,
    videoUrl: item.url && item.url.startsWith("http") ? item.url : "",
  })

  // Fetch movies based on category and subcategory
  const fetchMovies = async (category?: string, nextPage = 1) => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        console.warn("Token não encontrado! Redirecione para login ou defina um token.")
        return
      }

      const queryParams = new URLSearchParams()
      if (category) queryParams.append("categoria", category)
      queryParams.append("subcategoria", "Filme")
      queryParams.append("page", nextPage.toString())

      const res = await fetch(`${baseUrl}/api/content?${queryParams.toString()}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json()
      console.log("Resposta da API:", data)

      // Resetar os dados se for a primeira página
      if (nextPage === 1) {
        setCategoryMovies({})
        setFeaturedMovies([])
      }

      // Processar os dados com base na estrutura da resposta
      if (category) {
        // Se uma categoria específica foi selecionada
        if (Array.isArray(data.data)) {
          const mappedMovies = data.data.map((item: any, index: number) => mapMovieItem(item, index, category))

          // Separar filmes em destaque e regulares
          if (nextPage === 1) {
            const featured = mappedMovies.slice(0, 4)
            const regular = mappedMovies.slice(4)
            setFeaturedMovies(featured)
            setCategoryMovies({ [category]: regular })
          } else {
            setCategoryMovies((prev) => ({
              ...prev,
              [category]: [...(prev[category] || []), ...mappedMovies],
            }))
          }
        }
      } else {
        // Se nenhuma categoria foi selecionada, processar todas as categorias
        if (typeof data.data === "object" && data.data !== null) {
          const newCategoryMovies: Record<string, Content[]> = {}
          const allCategories: string[] = []
          let allMovies: Content[] = []

          // Iterar sobre cada categoria na resposta
          Object.entries(data.data).forEach(([categoryName, categoryData]: [string, any]) => {
            allCategories.push(categoryName)

            if (categoryData && categoryData.Filme && Array.isArray(categoryData.Filme)) {
              const mappedMovies = categoryData.Filme.map((item: any, index: number) =>
                mapMovieItem(item, index, categoryName),
              )

              newCategoryMovies[categoryName] = mappedMovies
              allMovies = [...allMovies, ...mappedMovies]
            }
          })

          // Atualizar as categorias disponíveis
          setCategories(allCategories)

          // Selecionar filmes em destaque de todas as categorias
          if (nextPage === 1) {
            setFeaturedMovies(allMovies.slice(0, 4))
          }

          // Atualizar os filmes por categoria
          if (nextPage === 1) {
            setCategoryMovies(newCategoryMovies)
          } else {
            // Para paginação, precisaríamos de uma lógica mais complexa
            // que não está implementada neste exemplo
            setCategoryMovies((prev) => ({
              ...prev,
              ...newCategoryMovies,
            }))
          }
        }
      }

      setPage(nextPage)
    } catch (error) {
      console.error("Erro ao buscar filmes:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Initial load of movies
  useEffect(() => {
    fetchMovies(selectedCategory || undefined)

    // Rolar para a seção de destaques quando mudar de categoria
    if (featuredRef.current) {
      setTimeout(() => {
        scrollToSection(featuredRef)
      }, 500)
    }
  }, [selectedCategory])

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category === selectedCategory ? null : category)
    setPage(1)
  }

  const handleContentClick = (content: Content) => {
    setSelectedContent(content)
    setShowDetailsModal(true)
  }

  // Verificar se há filmes para exibir
  const hasMovies = Object.values(categoryMovies).some((movies) => movies.length > 0) || featuredMovies.length > 0

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <BackgroundGradientAnimation intensity={0.3} />

      {/* Navbar */}
      <Navbar isScrolled={isScrolled} />

      {/* Genre Categories Section */}
      <section className="pt-20 pb-8">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {genreCategories.map((category) => (
              <GenreCard
                key={category}
                name={category}
                isSelected={selectedCategory === category}
                onClick={() => handleCategoryClick(category)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Movies Section */}
      {featuredMovies.length > 0 && (
        <section className="pb-8" ref={featuredRef}>
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl font-bold mb-4">Destaques</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredMovies.map((movie) => (
                <motion.div
                  key={movie.id}
                  className="group relative cursor-pointer rounded-lg overflow-hidden"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleContentClick(movie)}
                >
                  <div className="relative aspect-video">
                    <img
                      src={movie.image || "/placeholder.svg"}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-100">
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-lg font-bold line-clamp-1">{movie.title}</h3>
                        <div className="flex items-center gap-1 text-yellow-500 text-sm">
                          <Star className="h-4 w-4 fill-yellow-500" />
                          {movie.rating}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Movies List by Category */}
      <section className="pb-20" ref={moviesRef}>
        <div className="container px-4 md:px-6">
          {selectedCategory ? (
            // Se uma categoria específica foi selecionada
            <>
              <h2 className="text-2xl font-bold mb-4">Filmes de {selectedCategory}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {categoryMovies[selectedCategory]?.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} onClick={handleContentClick} />
                ))}
              </div>
            </>
          ) : (
            // Se nenhuma categoria foi selecionada, mostrar todas as categorias
            Object.entries(categoryMovies).map(([category, movies]) => (
              <div key={category} className="mb-10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">{category}</h2>
                  <Button
                    variant="ghost"
                    className="text-sm flex items-center hover:text-yellow-500"
                    onClick={() => handleCategoryClick(category)}
                  >
                    Ver Mais <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {movies.slice(0, 6).map((movie) => (
                    <MovieCard key={movie.id} movie={movie} onClick={handleContentClick} />
                  ))}
                </div>
              </div>
            ))
          )}

          {!hasMovies && !isLoading && (
            <div className="flex justify-center items-center py-20">
              <p className="text-gray-400">Nenhum filme encontrado</p>
            </div>
          )}

          {isLoading && (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          )}
        </div>
      </section>

      {/* Content Details Modal */}
      <ContentDetailsModal
        content={selectedContent}
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
      />
    </div>
  )
}

