"use client"
import { useState, useEffect, useRef } from "react"
import type React from "react"
import { motion, AnimatePresence, useScroll } from "framer-motion"
import { Star, ChevronRight, Filter, Search, X, Film, Loader2 } from "lucide-react"
import { BackgroundGradientAnimation } from "@/components/background-gradient-animation"
import { ContentDetailsModal } from "@/components/content-details-modal"
import { MovieCard } from "@/components/movie-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import type { Content } from "@/types/content"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Navbar } from "@/components/navbar"
import { cn } from "@/lib/utils"

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
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<Content[]>([])
  const [activeView, setActiveView] = useState("featured") // 'featured', 'category', 'search'
  const [showFilterSheet, setShowFilterSheet] = useState(false)
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
    rating: Number.parseFloat((Math.random() * 3 + 2).toFixed(1)),
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

  // Search movies function
  const searchMovies = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      setIsSearching(false)
      setActiveView("featured")
      return
    }

    setIsSearching(true)
    setActiveView("search")

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        console.warn("Token não encontrado!")
        return
      }

      // Simulating search by filtering existing movies
      // In a real app, you would make an API call to a search endpoint
      const allMovies: Content[] = []
      Object.values(categoryMovies).forEach((movies) => {
        allMovies.push(...movies)
      })
      allMovies.push(...featuredMovies)

      // Remove duplicates by id
      const uniqueMovies = Array.from(new Map(allMovies.map((movie) => [movie.id, movie])).values())

      // Filter movies by title
      const results = uniqueMovies.filter((movie) => movie.title.toLowerCase().includes(query.toLowerCase()))

      setSearchResults(results)
    } catch (error) {
      console.error("Erro ao buscar filmes:", error)
    } finally {
      setIsSearching(false)
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

  // Handle search input changes
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        searchMovies(searchQuery)
      }
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery])

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category === selectedCategory ? null : category)
    setPage(1)
    setActiveView(selectedCategory === category ? "featured" : "category")
    setSearchQuery("")
  }

  const handleContentClick = (content: Content) => {
    setSelectedContent(content)
    setShowDetailsModal(true)
  }

  const clearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
    setActiveView("featured")
  }

  // Verificar se há filmes para exibir
  const hasMovies = Object.values(categoryMovies).some((movies) => movies.length > 0) || featuredMovies.length > 0

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-black via-[#0a0a1a] to-black text-white">
      <BackgroundGradientAnimation intensity={0.2} />

      {/* Navbar */}
      <Navbar isScrolled={isScrolled} />

      {/* Search and Filter Bar */}
      <div className="sticky top-16 z-30 bg-gradient-to-b from-[#0a0a1a]/95 to-[#0a0a1a]/80 backdrop-blur-md py-3 px-4 border-b border-gray-800/30">
        <div className="container flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar filmes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-9 bg-gray-900/50 border-gray-700 focus-visible:ring-purple-500 text-sm h-10"
            />
            {searchQuery && (
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                onClick={clearSearch}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Mobile Filter Button */}
          <Sheet open={showFilterSheet} onOpenChange={setShowFilterSheet}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="md:hidden h-10 w-10 border-gray-700 bg-gray-900/50 hover:bg-gray-800"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-gray-900 border-gray-800 text-white">
              <SheetHeader>
                <SheetTitle className="text-white">Filtrar por Gênero</SheetTitle>
                <SheetDescription className="text-gray-400">
                  Selecione um gênero para filtrar os filmes
                </SheetDescription>
              </SheetHeader>
              <div className="grid grid-cols-1 gap-3 mt-6">
                {genreCategories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    className={cn(
                      "justify-start",
                      selectedCategory === category
                        ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white border-0"
                        : "border-gray-700 text-gray-300 hover:text-white",
                    )}
                    onClick={() => {
                      handleCategoryClick(category)
                      setShowFilterSheet(false)
                    }}
                  >
                    {category}
                  </Button>
                ))}
                {selectedCategory && (
                  <Button
                    variant="outline"
                    className="justify-start border-gray-700 text-gray-300 hover:text-white mt-2"
                    onClick={() => {
                      setSelectedCategory(null)
                      setActiveView("featured")
                      setShowFilterSheet(false)
                    }}
                  >
                    <X className="mr-2 h-4 w-4" /> Limpar filtro
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>

          {/* Desktop Category Tabs */}
          <div className="hidden md:block">
            <Tabs
              value={selectedCategory || "all"}
              className="w-full"
              onValueChange={(value) => {
                if (value === "all") {
                  setSelectedCategory(null)
                  setActiveView("featured")
                } else {
                  setSelectedCategory(value)
                  setActiveView("category")
                }
              }}
            >
              <TabsList className="h-10 bg-gray-900/50 border border-gray-700 p-1">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
                >
                  Todos
                </TabsTrigger>
                {genreCategories.slice(0, 5).map((category) => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Mobile Genre Categories - Horizontal Scrollable */}
      <section className="md:hidden overflow-x-auto hide-scrollbar py-4 px-4 -mt-1 border-b border-gray-800/30">
        <div className="flex gap-2 min-w-max">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            className={cn(
              "rounded-full px-4",
              selectedCategory === null
                ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white border-0"
                : "border-gray-700 bg-gray-900/50 text-gray-300",
            )}
            onClick={() => {
              setSelectedCategory(null)
              setActiveView("featured")
            }}
          >
            Todos
          </Button>
          {genreCategories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              className={cn(
                "rounded-full px-4",
                selectedCategory === category
                  ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white border-0"
                  : "border-gray-700 bg-gray-900/50 text-gray-300",
              )}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container px-4 md:px-6 py-6">
        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
              <p className="text-gray-400 text-sm">Carregando filmes...</p>
            </div>
          </div>
        )}

        {/* Search Results */}
        {activeView === "search" && (
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Resultados da busca</h2>
                <p className="text-gray-400 text-sm">
                  {isSearching ? "Buscando..." : `${searchResults.length} resultados encontrados para "${searchQuery}"`}
                </p>
              </div>

              {searchResults.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {searchResults.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} onClick={handleContentClick} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Film className="h-16 w-16 text-gray-700 mb-4" />
                  <h3 className="text-xl font-medium mb-2">Nenhum filme encontrado</h3>
                  <p className="text-gray-400 max-w-md">
                    Não encontramos nenhum filme com o termo "{searchQuery}". Tente buscar com outras palavras.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Featured Movies Section */}
        {activeView !== "search" && featuredMovies.length > 0 && (
          <AnimatePresence mode="wait">
            <motion.section
              className="mb-10"
              ref={featuredRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                  {selectedCategory ? `Destaques de ${selectedCategory}` : "Destaques"}
                </span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-100 group-hover:from-black/80 transition-all duration-300">
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-lg font-bold line-clamp-1 group-hover:text-purple-300 transition-colors">
                            {movie.title}
                          </h3>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="flex items-center gap-1 text-yellow-400">
                              <Star className="h-4 w-4 fill-yellow-400" />
                              {movie.rating}
                            </span>
                            <span className="text-gray-400">{movie.year}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          </AnimatePresence>
        )}

        {/* Movies List by Category */}
        {activeView !== "search" && (
          <AnimatePresence mode="wait">
            <motion.section
              className="pb-20"
              ref={moviesRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {selectedCategory ? (
                // Se uma categoria específica foi selecionada
                <>
                  <h2 className="text-2xl font-bold mb-4 flex items-center">
                    <span>Filmes de {selectedCategory}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-auto text-gray-400 hover:text-white"
                      onClick={() => {
                        setSelectedCategory(null)
                        setActiveView("featured")
                      }}
                    >
                      <X className="h-4 w-4 mr-1" /> Limpar filtro
                    </Button>
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {categoryMovies[selectedCategory]?.map((movie) => (
                      <MovieCard key={movie.id} movie={movie} onClick={handleContentClick} />
                    ))}
                  </div>

                  {/* Load More Button */}
                  {categoryMovies[selectedCategory]?.length > 0 && (
                    <div className="flex justify-center mt-8">
                      <Button
                        variant="outline"
                        className="border-gray-700 hover:bg-gray-800 hover:text-white"
                        onClick={() => fetchMovies(selectedCategory, page + 1)}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Carregando...
                          </>
                        ) : (
                          "Carregar mais filmes"
                        )}
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                // Se nenhuma categoria foi selecionada, mostrar todas as categorias
                Object.entries(categoryMovies).map(([category, movies]) => (
                  <motion.div
                    key={category}
                    className="mb-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl md:text-2xl font-bold">{category}</h2>
                      <Button
                        variant="ghost"
                        className="text-sm flex items-center text-gray-400 hover:text-white"
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
                  </motion.div>
                ))
              )}

              {!hasMovies && !isLoading && activeView !== "search" && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <Film className="h-16 w-16 text-gray-700 mb-4" />
                  <h3 className="text-xl font-medium mb-2">Nenhum filme encontrado</h3>
                  <p className="text-gray-400 max-w-md">
                    Não encontramos nenhum filme disponível no momento. Tente novamente mais tarde.
                  </p>
                </div>
              )}
            </motion.section>
          </AnimatePresence>
        )}
      </div>

      {/* Content Details Modal */}
      <ContentDetailsModal
        content={selectedContent}
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
      />
    </div>
  )
}

