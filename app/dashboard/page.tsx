"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Bell, User, Settings, Play, Info, Plus, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ContentCarousel } from "@/components/content-carousel"
import { BackgroundGradientAnimation } from "@/components/background-gradient-animation"
import { ContentDetailsModal } from "@/components/content-details-modal"
import { Content } from "@/types/content"

const baseUrl = "https://api.streamhivex.icu"

export default function DashboardPage() {
  const [selectedContent, setSelectedContent] = useState<Content | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [trendingContent, setTrendingContent] = useState<Content[]>([])
  const [novidades, setNovidades] = useState<Content[]>([])
  const [perfeitoParaVoce, setPerfeitoParaVoce] = useState<Content[]>([])
  const [heroIndex, setHeroIndex] = useState(0)

  useEffect(() => {
    async function fetchContent() {
      try {
        const token = localStorage.getItem("token")
        console.log("Token:", token)
        if (!token) {
          console.warn("Token não encontrado! Redirecione para login ou defina um token.")
          return
        }
        const res = await fetch(`${baseUrl}/api/content`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await res.json()
        console.log("Dados retornados da API /api/content:", data)

        // Processa LANÇAMENTOS (Hero e Em Alta)
        const lancamentos = data.data?.LANÇAMENTOS
        if (lancamentos) {
          let merged: any[] = []
          if (lancamentos.Filme) merged = merged.concat(lancamentos.Filme)
          if (lancamentos.Serie) merged = merged.concat(lancamentos.Serie)
          console.log("Conteúdos mesclados de LANÇAMENTOS:", merged)
          const trendingMapped: Content[] = merged.map((item, index) => ({
            id: `${item.id}-${index}`, // chave única para renderização
            originalId: item.id, // id original
            title: item.nome,
            image: item.poster.startsWith("http")
              ? item.poster
              : `${baseUrl}/${item.poster}`,
            rating: 0,
            year: new Date().getFullYear(),
            category: "Filmes",
            description: item.sinopse,
            videoUrl: item.url && item.url.startsWith("http") ? item.url : "",
          }))
          setTrendingContent(trendingMapped)
        } else {
          console.log("Chave 'LANÇAMENTOS' não encontrada na resposta:", data)
        }

        // Processa Novidades (Usando categorias AÇÃO, COMÉDIA, DRAMA)
        const acao = data.data?.["AÇÃO"]?.Filme || []
        const comedia = data.data?.["COMÉDIA"]?.Filme || []
        const drama = data.data?.["DRAMA"]?.Filme || []
        let mergedNovidades = [...acao, ...comedia, ...drama]
        mergedNovidades = mergedNovidades.sort(() => Math.random() - 0.5)
        const novidadesMapped: Content[] = mergedNovidades.slice(0, 6).map((item, index) => ({
          id: `${item.id}-${index}`,
          originalId: item.id,
          title: item.nome,
          image: item.poster.startsWith("http")
            ? item.poster
            : `${baseUrl}/${item.poster}`,
          rating: 0,
          year: new Date().getFullYear(),
          category: "Filmes",
          description: item.sinopse,
          videoUrl: item.url && item.url.startsWith("http") ? item.url : "",
        }))
        setNovidades(novidadesMapped)

        // Define Perfeito para Você com uma mensagem fixa
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
    }, 5000)
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

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      <BackgroundGradientAnimation intensity={0.3} />

      {/* Header / Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black to-transparent">
        <div className="container px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
                StreamFlix
              </h1>
              <nav className="hidden md:flex items-center space-x-6">
                <a href="#" className="text-white hover:text-purple-400 transition-colors">
                  Início
                </a>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Séries
                </a>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Filmes
                </a>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Minha Lista
                </a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative w-40 md:w-64">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Buscar..."
                  className="pl-9 bg-gray-900/50 border-gray-700 focus:border-purple-500 focus:ring-purple-500 rounded-full h-9"
                />
              </div>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <User className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Featured Content */}
      <section className="relative pt-20 pb-8 md:pt-32 md:pb-12">
        <div className="container px-4 md:px-6">
          <div className="relative rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-10"></div>
            <img
              src={featuredContent.image || "/placeholder.svg"}
              alt={featuredContent.title}
              className="w-full h-[50vh] md:h-[70vh] object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 z-20 p-6 md:p-12">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-2xl">
                <h2 className="text-3xl md:text-5xl font-bold mb-3">{featuredContent.title}</h2>
                <div className="flex items-center space-x-4 mb-4">
                  <span className="flex items-center text-yellow-500">
                    <Star className="h-4 w-4 fill-yellow-500 mr-1" />
                    {featuredContent.rating}
                  </span>
                  <span>{featuredContent.year}</span>
                  <span className="px-2 py-1 bg-purple-600/30 rounded-md text-sm">{featuredContent.category}</span>
                </div>
                <p className="text-gray-300 mb-6 text-lg">{featuredContent.description}</p>
                <div className="flex flex-wrap gap-4">
                  <Button
                    className="bg-white text-black hover:bg-gray-200 rounded-full px-8"
                    onClick={() => {
                      console.log("Clicou para assistir, videoUrl:", featuredContent.videoUrl)
                      handleContentClick(featuredContent)
                    }}
                  >
                    <Play className="mr-2 h-4 w-4 fill-black" /> Assistir
                  </Button>
                  <Button variant="outline" className="border-gray-500 text-white hover:bg-gray-800 rounded-full px-8">
                    <Info className="mr-2 h-4 w-4" /> Mais Informações
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full bg-gray-800/50 hover:bg-gray-700/50">
                    <Plus className="h-5 w-5" />
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Em Alta Section */}
      <section className="py-8">
        <div className="container px-4 md:px-6">
          <h3 className="text-2xl font-bold mb-6">Em Alta</h3>
          <ContentCarousel contents={trendingContent} onContentClick={handleContentClick} />
        </div>
      </section>

      {/* Novidades Section */}
      <section className="py-8">
        <div className="container px-4 md:px-6">
          <h3 className="text-2xl font-bold mb-6">Novidades</h3>
          <ContentCarousel contents={novidades} onContentClick={handleContentClick} />
        </div>
      </section>

      {/* Perfeito para Você Section */}
      <section className="py-8">
        <div className="container px-4 md:px-6">
          <h3 className="text-2xl font-bold mb-6">Perfeito para você</h3>
          <ContentCarousel contents={perfeitoParaVoce} onContentClick={handleContentClick} />
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
