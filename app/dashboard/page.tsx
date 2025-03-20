"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import {
  Search,
  Bell,
  User,
  Settings,
  Play,
  Info,
  Star,
  ChevronRight,
  ChevronLeft,
  Bookmark,
  TrendingUp,
  Sparkles,
  Heart,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ContentCarousel } from "@/components/content-carousel"
import { BackgroundGradientAnimation } from "@/components/background-gradient-animation"
import { ContentDetailsModal } from "@/components/content-details-modal"
import type { Content } from "@/types/content"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"

const baseUrl = "https://api.streamhivex.icu"

export default function DashboardPage() {
  const [selectedContent, setSelectedContent] = useState<Content | null>(null)
  const MotionButton = motion(Button)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [trendingContent, setTrendingContent] = useState<Content[]>([])
  const [novidades, setNovidades] = useState<Content[]>([])
  const [perfeitoParaVoce, setPerfeitoParaVoce] = useState<Content[]>([])
  const [heroIndex, setHeroIndex] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)
  const isMobile = useMediaQuery("(max-width: 768px)")

  const { scrollY } = useScroll()
  const headerOpacity = useTransform(scrollY, [0, 100], [0.2, 1])
  const headerBlur = useTransform(scrollY, [0, 100], [0, 8])

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    async function fetchContent() {
      try {
        const token = localStorage.getItem("token")
        console.log("Token:", token)
        if (!token) {
          console.warn("Token não encontrado! Redirecione para login ou defina um token.")
          return
        }

        // Hero e Novidades - Filtros de categoria e subcategoria
        const fetchContentByCategory = async (categoria: string, subcategoria: string) => {
          const res = await fetch(`${baseUrl}/api/content?categoria=${categoria}&subcategoria=${subcategoria}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
          const data = await res.json()
          console.log(`Dados retornados da API para ${categoria} - ${subcategoria}:`, data)

          // Se a resposta estiver agrupada, extraia o array correto:
          if (data.data && typeof data.data === "object" && !Array.isArray(data.data)) {
            // Verifica se a chave da categoria e subcategoria existem
            if (data.data[categoria] && data.data[categoria][subcategoria]) {
              return data.data[categoria][subcategoria]
            }
            return []
          }
          return data.data ? data.data : []
        }

        // Hero e Novidades: LANÇAMENTOS e Filmes
        const lancamentos = await fetchContentByCategory("LANÇAMENTOS", "Filme")
        const trendingMapped: Content[] = lancamentos.map((item: any, index: number) => ({
          id: `${item.id}-${index}`,
          originalId: item.id, // ID original
          title: item.nome,
          image: item.poster.startsWith("http") ? item.poster : `${baseUrl}/${item.poster}`,
          rating: (Math.random() * 3 + 2).toFixed(1), // Gera uma classificação aleatória entre 2 e 5
          year: new Date().getFullYear(),
          category: "Filmes",
          description: item.sinopse,
          videoUrl: item.url && item.url.startsWith("http") ? item.url : "",
        }))
        setTrendingContent(trendingMapped)

        // Em Alta: AÇÃO e Filmes
        const emAlta = await fetchContentByCategory("AÇÃO", "Filme")
        console.log("Dados retornados da API para AÇÃO - Filmes:", emAlta)
        const trendingEmAltaMapped: Content[] = emAlta.map((item: any, index: number) => ({
          id: `${item.id}-${index}`,
          originalId: item.id, // ID original
          title: item.nome,
          image: item.poster.startsWith("http") ? item.poster : `${baseUrl}/${item.poster}`,
          rating: (Math.random() * 3 + 2).toFixed(1), // Gera uma classificação aleatória entre 2 e 5
          year: new Date().getFullYear(),
          category: "Filmes",
          description: item.sinopse,
          videoUrl: item.url && item.url.startsWith("http") ? item.url : "",
        }))
        setNovidades(trendingEmAltaMapped)

        // Perfeito para Você com uma mensagem fixa
        setPerfeitoParaVoce([
          {
            id: "ppv-1",
            title: "Perfeito para Você",
            image: "/placeholder.svg",
            rating: 0,
            year: new Date().getFullYear(),
            category: "",
            description: "Assista novos conteúdos que nosso algoritmo vai gerar algo para você",
            videoUrl: "",
          },
        ])
      } catch (error) {
        console.error("Erro ao buscar conteúdos:", error)
      }
    }

    fetchContent()
  }, [])

  // Auto-avança o hero carousel a cada 5 segundos
  useEffect(() => {
    if (trendingContent.length === 0) return
    const interval = setInterval(() => {
      setHeroIndex((prevIndex) => (prevIndex + 1) % trendingContent.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [trendingContent])

  const featuredContent = trendingContent[heroIndex] || {
    id: "0",
    title: "",
    image: "/placeholder.svg",
    rating: 0,
    year: 0,
    category: "",
    description: "",
    videoUrl: "",
  }

  const handleContentClick = (content: Content) => {
    console.log("Selecionando conteúdo:", content)
    setSelectedContent(content)
    localStorage.setItem("selectedContent", JSON.stringify(content))
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

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <BackgroundGradientAnimation intensity={0.3} />

      {/* Header / Navbar */}
      <motion.header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled ? "bg-black/90 backdrop-blur-md shadow-lg" : "bg-gradient-to-b from-black/80 to-transparent",
        )}
        style={{
          opacity: headerOpacity,
          backdropFilter: `blur(${headerBlur}px)`,
        }}
      >
        <div className="container px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <motion.h1
                className="text-2xl font-bold"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-500">
                  StreamFlix
                </span>
              </motion.h1>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-6">
                {["Início", "Séries", "Filmes", "Minha Lista"].map((item, index) => (
                  <motion.a
                    key={item}
                    href="#"
                    className={cn(
                      "relative font-medium transition-colors",
                      index === 0 ? "text-white" : "text-gray-400 hover:text-white",
                    )}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {item}
                    {index === 0 && (
                      <motion.span
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-600"
                        layoutId="navIndicator"
                      />
                    )}
                  </motion.a>
                ))}
              </nav>

              {/* Mobile Menu Button */}
              <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search Bar - Desktop */}
              <div
                className={cn(
                  "relative hidden md:block transition-all duration-300 ease-in-out",
                  isSearchOpen ? "w-64" : "w-40",
                )}
              >
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Buscar..."
                  className="pl-9 bg-gray-900/50 border-gray-700 focus:border-purple-500 focus:ring-purple-500 rounded-full h-9"
                  onFocus={() => setIsSearchOpen(true)}
                  onBlur={() => setIsSearchOpen(false)}
                />
              </div>

              {/* Search Icon - Mobile */}
              <Button variant="ghost" size="icon" className="md:hidden text-gray-400 hover:text-white">
                <Search className="h-5 w-5" />
              </Button>

              {/* Action Buttons */}
              {["bell", "user", "settings"].map((icon, index) => (
                <motion.div
                  key={icon}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
                >
                  <MotionButton
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-white transition-all duration-300"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {icon === "bell" && <Bell className="h-5 w-5" />}
                      {icon === "user" && <User className="h-5 w-5" />}
                      {icon === "settings" && <Settings className="h-5 w-5" />}
                    </MotionButton>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden bg-black/95 backdrop-blur-lg"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <nav className="flex flex-col space-y-4 p-6">
                {["Início", "Séries", "Filmes", "Minha Lista"].map((item, index) => (
                  <motion.a
                    key={item}
                    href="#"
                    className={cn(
                      "text-lg font-medium py-2 border-b border-gray-800",
                      index === 0 ? "text-white" : "text-gray-400",
                    )}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {item}
                  </motion.a>
                ))}

                <div className="relative mt-4">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Buscar..."
                    className="pl-9 w-full bg-gray-900/50 border-gray-700 focus:border-purple-500 focus:ring-purple-500 rounded-full h-9"
                  />
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Hero Featured Content */}
      <section ref={heroRef} className="relative pt-16 md:pt-0 min-h-[80vh] md:min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={heroIndex}
            className="absolute inset-0 w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-10"></div>
            <motion.img
              src={featuredContent.image || "/placeholder.svg"}
              alt={featuredContent.title}
              className="w-full h-full object-cover"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 8 }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Hero Navigation Buttons */}
        <div className="absolute top-1/2 left-0 right-0 z-20 flex justify-between px-4 md:px-10 -translate-y-1/2 pointer-events-none">
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 pointer-events-auto"
            onClick={() => handleHeroNavigation("prev")}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 pointer-events-auto"
            onClick={() => handleHeroNavigation("next")}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-6 md:p-16">
          <div className="container">
            <AnimatePresence mode="wait">
              <motion.div
                key={heroIndex}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl"
              >
                {/* Content Badge */}
                <motion.div
                  className="inline-flex items-center mb-4 px-3 py-1 rounded-full bg-purple-600/30 backdrop-blur-sm border border-purple-500/20"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Sparkles className="h-3 w-3 mr-2 text-purple-400" />
                  <span className="text-xs font-medium text-purple-200">Em destaque</span>
                </motion.div>

                {/* Title */}
                <h2 className="text-4xl md:text-6xl font-bold mb-3 tracking-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                    {featuredContent.title}
                  </span>
                </h2>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <span className="flex items-center text-yellow-500">
                    <Star className="h-4 w-4 fill-yellow-500 mr-1" />
                    {featuredContent.rating || "4.5"}
                  </span>
                  <span className="text-gray-300">{featuredContent.year}</span>
                  <span className="px-2 py-1 bg-purple-600/30 backdrop-blur-sm rounded-md text-sm font-medium">
                    {featuredContent.category}
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-300 mb-6 text-base md:text-lg line-clamp-3 md:line-clamp-none">
                  {featuredContent.description}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-full px-8 py-6"
                      onClick={() => {
                        console.log("Clicou para assistir, videoUrl:", featuredContent.videoUrl)
                        handleContentClick(featuredContent)
                      }}
                    >
                      <Play className="mr-2 h-5 w-5 fill-white" /> Assistir
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      className="border-gray-500 text-white hover:bg-white/10 rounded-full px-8 py-6 backdrop-blur-sm"
                    >
                      <Info className="mr-2 h-5 w-5" /> Mais Informações
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-12 w-12 rounded-full bg-gray-800/50 hover:bg-gray-700/50 backdrop-blur-sm"
                    >
                      <Bookmark className="h-5 w-5" />
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Hero Pagination Indicators */}
            <div className="flex justify-center mt-8 md:mt-12 gap-2">
              {trendingContent.slice(0, 5).map((_, i) => (
                <button
                  key={i}
                  className={cn(
                    "h-1 rounded-full transition-all duration-300",
                    i === heroIndex ? "w-8 bg-purple-500" : "w-2 bg-gray-600 hover:bg-gray-500",
                  )}
                  onClick={() => setHeroIndex(i)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="relative z-10 -mt-16 md:-mt-32 pb-20">
        <div className="container px-4 md:px-6">
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

      {/* Content Details Modal */}
      <ContentDetailsModal
        content={selectedContent}
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
      />
    </div>
  )
}

// Content Section Component
interface ContentSectionProps {
  title: string
  icon?: React.ReactNode
  contents: Content[]
  onContentClick: (content: Content) => void
}

function ContentSection({ title, icon, contents, onContentClick }: ContentSectionProps) {
  const { scrollYProgress } = useScroll()
  const x = useTransform(scrollYProgress, [0, 1], [0, -50])

  return (
    <motion.section
      className="py-8 md:py-12"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <motion.div className="flex items-center gap-2 mb-6" style={{ x }}>
        {icon}
        <h3 className="text-2xl md:text-3xl font-bold">{title}</h3>
      </motion.div>
      <ContentCarousel contents={contents} onContentClick={onContentClick} />
    </motion.section>
  )
}

