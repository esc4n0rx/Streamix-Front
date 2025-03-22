"use client"
import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import {
  Play,
  Info,
  Star,
  Plus,
  ChevronRight,
  ChevronLeft,
  Bookmark,
  TrendingUp,
  Sparkles,
  Heart,
  Film,
  Tv,
  Search,
  UserCircle,
  Home,
  Compass
} from "lucide-react"
import { ContentCarousel } from "@/components/content-carousel"
import { Button } from "@/components/ui/button"
import { BackgroundGradientAnimation } from "@/components/background-gradient-animation"
import { ContentDetailsModal } from "@/components/content-details-modal"
import type { Content } from "@/types/content"
import { Navbar } from "@/components/navbar"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"

const baseUrl = "https://api.streamhivex.icu"

// Adicionar interface para categorias
interface Category {
  id: string
  name: string
  icon: React.ReactNode
}

export default function DashboardPage() {
  // Estado principal
  const [selectedContent, setSelectedContent] = useState<Content | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [trendingContent, setTrendingContent] = useState<Content[]>([])
  const [novidades, setNovidades] = useState<Content[]>([])
  const [perfeitoParaVoce, setPerfeitoParaVoce] = useState<Content[]>([])
  const [recentlyWatched, setRecentlyWatched] = useState<Content[]>([])
  const [heroIndex, setHeroIndex] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  
  // Refs
  const heroRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  
  // Media queries
  const isMobile = useMediaQuery("(max-width: 768px)")
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 100], [1, 0.2])

  // Categorias para filtro rápido
  const categories: Category[] = [
    { id: "all", name: "Para Você", icon: <Sparkles className="h-4 w-4" /> },
    { id: "movies", name: "Filmes", icon: <Film className="h-4 w-4" /> },
    { id: "series", name: "Séries", icon: <Tv className="h-4 w-4" /> },
    { id: "trending", name: "Em Alta", icon: <TrendingUp className="h-4 w-4" /> },
  ]

  // Lidar com eventos de rolagem
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Lógica de busca de conteúdo melhorada
  const fetchContentByCategory = useCallback(async (categoria: string, subcategoria: string) => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${baseUrl}/api/content?categoria=${categoria}&subcategoria=${subcategoria}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await res.json()
    
      // Verificação refinada de dados
      if (Array.isArray(data.data)) {
        return data.data
      } else if (typeof data.data === "object" && data.data !== null) {
        return data.data[categoria]?.[subcategoria] || []
      }
      return []
    } catch (error) {
      console.error(`Erro ao buscar ${categoria}/${subcategoria}:`, error)
      return []
    }
  }, [])
  
  // Fetch all content with loading state
  useEffect(() => {
    async function fetchContent() {
      setIsLoading(true)
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          console.warn("Token não encontrado! Redirecionando para login...")
          // Aqui você pode implementar uma redireção para a página de login
          return
        }
  
        // Busca em paralelo para otimizar o carregamento
        const [lancamentos, emAlta, topRated] = await Promise.all([
          fetchContentByCategory("LANÇAMENTOS", "Filme"),
          fetchContentByCategory("AÇÃO", "Filme"),
          fetchContentByCategory("AVENTURA", "Filme")
        ])
        
        // Mapeamento refinado com validação de dados
        const mapContentItems = (items: any[], prefix: string): Content[] => 
          items.map((item: any, index: number) => ({
            id: `${prefix}-${item.id || index}`,
            originalId: item.id || `unknown-${index}`,
            title: item.nome || "Título não disponível",
            image: item.poster && item.poster.startsWith("http") 
              ? item.poster 
              : item.poster 
                ? `${baseUrl}/${item.poster}` 
                : "/placeholder.svg",
            rating: parseFloat((Math.random() * 3 + 2).toFixed(1)),
            year: item.ano || new Date().getFullYear(),
            category: item.categoria || "Filmes",
            description: item.sinopse || "Descrição não disponível",
            videoUrl: item.url && item.url.startsWith("http") ? item.url : "",
            duration: Math.floor(Math.random() * 61) + 60, // 60-120 min
            genres: ["Ação", "Aventura", "Drama"].slice(0, Math.floor(Math.random() * 3) + 1),
          }))
        
        const trendingMapped = mapContentItems(lancamentos, "trending")
        setTrendingContent(trendingMapped)
  
        const novidadesMapped = mapContentItems(emAlta, "novidades")
        setNovidades(novidadesMapped)
        
        // Conteúdo simulado para "Perfeito para Você"
        const topRatedMapped = mapContentItems(topRated, "toprated")
        setPerfeitoParaVoce(topRatedMapped.length > 0 ? topRatedMapped : [
          {
            id: "ppv-1",
            originalId: "ppv-1",
            title: "Conteúdo Personalizado",
            image: "/placeholder.svg",
            rating: 4.8,
            year: new Date().getFullYear(),
            category: "Recomendação",
            description: "Assista novos conteúdos que nosso algoritmo recomenda especialmente para você",
            videoUrl: "",
            duration: 110,
            genres: ["Personalizado"],
          },
        ])
        
        // Adicionar "Continuando Assistindo"
        setRecentlyWatched(
          trendingMapped.slice(0, 3).map(item => ({
            ...item,
            id: `recents-${item.id}`,
            progress: Math.floor(Math.random() * 80) + 10, // 10-90%
          }))
        )
      } catch (error) {
        console.error("Erro ao buscar conteúdos:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchContent()
  }, [fetchContentByCategory])

  // Hero carousel auto-advance com mecanismo anti-flickering
  useEffect(() => {
    if (trendingContent.length === 0) return
    
    const interval = setInterval(() => {
      setHeroIndex((prevIndex) => (prevIndex + 1) % trendingContent.length)
    }, 8000)
    
    return () => clearInterval(interval)
  }, [trendingContent])

  // Conteúdo em destaque com fallback
  const featuredContent = trendingContent[heroIndex] || {
    id: "0",
    originalId: "0",
    title: "Carregando títulos em destaque",
    image: "/placeholder.svg",
    rating: 4.5,
    year: new Date().getFullYear(),
    category: "Destaque",
    description: "Os melhores títulos estão sendo preparados para você.",
    videoUrl: "",
    duration: 110,
    genres: ["Ação"],
  }

  // Handlers
  const handleContentClick = (content: Content) => {
    setSelectedContent(content)
    setShowDetailsModal(true)
  }

  const handleHeroNavigation = (direction: "prev" | "next") => {
    if (trendingContent.length === 0) return
    
    if (direction === "prev") {
      setHeroIndex((prevIndex) => (prevIndex === 0 ? trendingContent.length - 1 : prevIndex - 1))
    } else {
      setHeroIndex((prevIndex) => (prevIndex + 1) % trendingContent.length)
    }
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    // Implementar lógica de filtro aqui
  }

  const handleQuickScroll = () => {
    contentRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Formatar duração para exibição
  const formatDuration = (minutes: number) => {
    const hrs = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hrs}h ${mins}m`
  }

  // Renderize o componente de loading
  if (isLoading) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-black text-white">
        <BackgroundGradientAnimation intensity={0.2} />
        <Navbar isScrolled={false} />
        
        <div className="pt-20 px-4 space-y-8">
          <Skeleton className="h-[50vh] w-full rounded-xl" />
          
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <div className="flex space-x-4 overflow-x-auto pb-4">
              {Array(5).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-40 w-28 rounded-lg flex-shrink-0" />
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <div className="flex space-x-4 overflow-x-auto pb-4">
              {Array(5).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-40 w-28 rounded-lg flex-shrink-0" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <BackgroundGradientAnimation intensity={0.2} />

      {/* Navbar melhorada */}
      <Navbar isScrolled={isScrolled} />

      {/* Hero Featured Content */}
      <section ref={heroRef} className="relative pt-14 md:pt-0 min-h-[85vh] md:min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={heroIndex}
            className="absolute inset-0 w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Gradient de sobreposição aprimorado com dupla camada para maior profundidade */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-10"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent z-10"></div>
            
            {/* Imagem hero com loading lazy e efeito de zoom suave */}
            <motion.img
              src={featuredContent.image || "/placeholder.svg"}
              alt={featuredContent.title}
              className="w-full h-full object-cover object-center"
              loading="lazy"
              initial={{ scale: 1.05 }}
              animate={{ scale: 1 }}
              transition={{ duration: 10, ease: "easeOut" }}
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Hero Navigation Buttons */}
        <div className="absolute top-1/2 left-0 right-0 z-20 flex justify-between px-4 md:px-10 -translate-y-1/2 pointer-events-none">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 pointer-events-auto transition-all duration-200 hover:scale-110"
            onClick={() => handleHeroNavigation("prev")}
          >
            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 pointer-events-auto transition-all duration-200 hover:scale-110"
            onClick={() => handleHeroNavigation("next")}
          >
            <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
          </Button>
        </div>
        
        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-4 md:p-16 pb-8 md:pb-16">
          <div className="container">
            <AnimatePresence mode="wait">
              <motion.div
                key={heroIndex}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="max-w-xl md:max-w-2xl"
              >
                {/* Content Badge */}
                <motion.div
                  className="inline-flex items-center mb-3 px-3 py-1 rounded-full bg-purple-600/40 backdrop-blur-sm border border-purple-500/30"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Sparkles className="h-3 w-3 mr-2 text-purple-400" />
                  <span className="text-xs font-medium text-purple-200">Em destaque</span>
                </motion.div>
                
                {/* Title */}
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 tracking-tight leading-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                    {featuredContent.title}
                  </span>
                </h2>
                
                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-3 mb-3 text-sm">
                  <span className="flex items-center text-yellow-500">
                    <Star className="h-4 w-4 fill-yellow-500 mr-1" />
                    {featuredContent.rating}
                  </span>
                  <span className="text-gray-300">{featuredContent.year}</span>
                  {featuredContent.duration && (
                    <span className="text-gray-300">{formatDuration(featuredContent.duration)}</span>
                  )}
                  <span className="px-2 py-1 bg-purple-600/30 backdrop-blur-sm rounded-md text-xs font-medium">
                    {featuredContent.category}
                  </span>
                  {featuredContent.genres && featuredContent.genres.map(genre => (
                    <span key={genre} className="text-gray-400 text-xs">
                      {genre}
                    </span>
                  ))}
                </div>
                
                {/* Description */}
                <p className="text-gray-300 mb-5 text-sm md:text-base line-clamp-2 md:line-clamp-3">
                  {featuredContent.description}
                </p>
                
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-full px-6 py-5 shadow-lg shadow-purple-900/20"
                      onClick={() => handleContentClick(featuredContent)}
                    >
                      <Play className="mr-2 h-5 w-5 fill-white" /> Assistir
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      className="border-gray-500 text-white hover:bg-white/10 rounded-full px-6 py-5 backdrop-blur-sm"
                      onClick={() => handleContentClick(featuredContent)}
                    >
                      <Info className="mr-2 h-5 w-5" /> Mais Info
                    </Button>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.1 }} 
                    whileTap={{ scale: 0.9 }}
                    className="hidden md:block"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-12 w-12 rounded-full bg-gray-800/50 hover:bg-gray-700/50 backdrop-blur-sm"
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
            
            {/* Scroll down indicator */}
            <motion.div 
              className="flex justify-center mt-8 md:mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: [0, 10, 0] }}
              transition={{ 
                opacity: { delay: 1, duration: 0.5 },
                y: { repeat: Infinity, duration: 1.5 }
              }}
            >
              <Button 
                variant="ghost" 
                size="sm" 
                className="rounded-full px-4 py-2 bg-black/20 backdrop-blur-sm hover:bg-black/40"
                onClick={handleQuickScroll}
              >
                <ChevronLeft className="h-4 w-4 rotate-90" />
                <span className="text-xs mx-2">Explorar</span>
              </Button>
            </motion.div>
            
            {/* Hero Pagination Indicators */}
            <div className="flex justify-center mt-4 gap-1">
              {trendingContent.slice(0, 5).map((_, i) => (
                <button
                  key={i}
                  className={cn(
                    "h-1 rounded-full transition-all duration-300",
                    i === heroIndex ? "w-6 bg-purple-500" : "w-2 bg-gray-600 hover:bg-gray-500",
                  )}
                  onClick={() => setHeroIndex(i)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Category Navigation */}
      <div className="sticky top-16 z-30 bg-black/80 backdrop-blur-md py-2 -mt-2 border-b border-gray-800/50">
        <div className="container px-4">
          <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="bg-black/30 p-1 rounded-lg">
              {categories.map(category => (
                <TabsTrigger 
                  key={category.id}
                  value={category.id}
                  className="data-[state=active]:bg-purple-600/60 data-[state=active]:text-white text-sm"
                >
                  <span className="flex items-center gap-2">
                    {category.icon}
                    <span className="hidden sm:inline">{category.name}</span>
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Content Sections */}
      <div 
        ref={contentRef}
        className="relative z-10 -mt-2 pb-20"
      >
        <div className="container px-4 md:px-6">
          {/* Continuando Assistindo */}
          {recentlyWatched.length > 0 && (
            <ContentSection
              title="Continue Assistindo"
              icon={<Play className="h-5 w-5 text-green-500" />}
              contents={recentlyWatched}
              onContentClick={handleContentClick}
              showProgress
            />
          )}
        
          {/* Em Alta Section */}
          <ContentSection
            title="Em Alta"
            icon={<TrendingUp className="h-5 w-5 text-pink-500" />}
            contents={trendingContent}
            onContentClick={handleContentClick}
          />
          
          {/* Novidades Section */}
          <ContentSection
            title="Novidades"
            icon={<Sparkles className="h-5 w-5 text-purple-500" />}
            contents={novidades}
            onContentClick={handleContentClick}
          />
          
          {/* Perfeito para Você Section */}
          <ContentSection
            title="Perfeito para você"
            icon={<Heart className="h-5 w-5 text-red-500" />}
            contents={perfeitoParaVoce}
            onContentClick={handleContentClick}
          />
        </div>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-lg border-t border-gray-800/50 z-40">
        <div className="flex justify-around py-3">
          <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 h-auto">
            <Home className="h-5 w-5 text-white" />
            <span className="text-xs">Início</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 h-auto">
            <Compass className="h-5 w-5 text-gray-400" />
            <span className="text-xs text-gray-400">Explorar</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 h-auto">
            <Search className="h-5 w-5 text-gray-400" />
            <span className="text-xs text-gray-400">Buscar</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 h-auto">
            <UserCircle className="h-5 w-5 text-gray-400" />
            <span className="text-xs text-gray-400">Perfil</span>
          </Button>
        </div>
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

// Content Section Component Aprimorado
interface ContentSectionProps {
  title: string
  icon?: React.ReactNode
  contents: Content[]
  onContentClick: (content: Content) => void
  showProgress?: boolean
}

function ContentSection({ title, icon, contents, onContentClick, showProgress }: ContentSectionProps) {
  const { scrollYProgress } = useScroll()
  const x = useTransform(scrollYProgress, [0, 1], [0, -50])
  
  return (
    <motion.section
      className="py-6 md:py-8"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <motion.div className="flex items-center gap-2 mb-4" style={{ x }}>
        {icon}
        <h3 className="text-xl md:text-2xl font-bold">{title}</h3>
      </motion.div>
      
      {contents.length > 0 ? (
        <ContentCarousel 
          contents={contents} 
          onContentClick={onContentClick} 
          showProgress={showProgress}
        />
      ) : (
        <div className="flex overflow-x-auto pb-4 gap-4">
          {Array(5).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-40 w-28 rounded-lg flex-shrink-0" />
          ))}
        </div>
      )}
    </motion.section>
  )
}