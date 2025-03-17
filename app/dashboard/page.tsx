"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Bell, User, Settings, Play, Info, Plus, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ContentCard } from "@/components/content-card"
import { ContentCarousel } from "@/components/content-carousel"
import { BackgroundGradientAnimation } from "@/components/background-gradient-animation"
import { ContentDetailsModal } from "@/components/content-details-modal"

interface Content {
  id: string
  title: string
  image: string
  rating: number
  year: number
  category: string
  description: string
}

export default function DashboardPage() {
  const [selectedContent, setSelectedContent] = useState<Content | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  const [trendingContent] = useState<Content[]>([
    {
      id: "1",
      title: "Cosmos: Uma Odisseia no Espaço",
      image: "/placeholder.svg?height=600&width=400",
      rating: 4.8,
      year: 2023,
      category: "Documentário",
      description: "Uma jornada fascinante através do universo, explorando a vastidão do cosmos.",
    },
    {
      id: "2",
      title: "Horizonte Perdido",
      image: "/placeholder.svg?height=600&width=400",
      rating: 4.5,
      year: 2023,
      category: "Ficção Científica",
      description: "Uma aventura épica em um mundo futurista onde a humanidade luta pela sobrevivência.",
    },
    {
      id: "3",
      title: "Sombras do Passado",
      image: "/placeholder.svg?height=600&width=400",
      rating: 4.7,
      year: 2023,
      category: "Thriller",
      description: "Um detetive atormentado investiga um caso que o leva a confrontar seus próprios demônios.",
    },
    {
      id: "4",
      title: "Além do Horizonte",
      image: "/placeholder.svg?height=600&width=400",
      rating: 4.6,
      year: 2023,
      category: "Aventura",
      description: "Uma jornada épica através de terras desconhecidas em busca de um artefato lendário.",
    },
    {
      id: "5",
      title: "Conexão Perigosa",
      image: "/placeholder.svg?height=600&width=400",
      rating: 4.4,
      year: 2023,
      category: "Ação",
      description: "Um espião internacional se vê envolvido em uma conspiração global que ameaça a paz mundial.",
    },
  ])

  const [newContent] = useState<Content[]>([
    {
      id: "6",
      title: "Mundos Paralelos",
      image: "/placeholder.svg?height=600&width=400",
      rating: 4.3,
      year: 2023,
      category: "Ficção Científica",
      description: "Uma descoberta revolucionária permite que pessoas viajem entre dimensões paralelas.",
    },
    {
      id: "7",
      title: "Segredos do Oceano",
      image: "/placeholder.svg?height=600&width=400",
      rating: 4.5,
      year: 2023,
      category: "Documentário",
      description: "Uma exploração das profundezas oceânicas, revelando criaturas e fenômenos nunca antes vistos.",
    },
    {
      id: "8",
      title: "Código de Honra",
      image: "/placeholder.svg?height=600&width=400",
      rating: 4.6,
      year: 2023,
      category: "Drama",
      description: "Um advogado idealista luta contra um sistema corrupto para defender um cliente inocente.",
    },
    {
      id: "9",
      title: "Labirinto de Ilusões",
      image: "/placeholder.svg?height=600&width=400",
      rating: 4.7,
      year: 2023,
      category: "Suspense",
      description: "Um psicólogo renomado tenta ajudar um paciente que não consegue distinguir realidade de ilusão.",
    },
    {
      id: "10",
      title: "Império das Sombras",
      image: "/placeholder.svg?height=600&width=400",
      rating: 4.8,
      year: 2023,
      category: "Fantasia",
      description: "Em um reino místico, uma jovem heroína descobre seus poderes e enfrenta forças das trevas.",
    },
    {
      id: "11",
      title: "Velocidade Máxima",
      image: "/placeholder.svg?height=600&width=400",
      rating: 4.4,
      year: 2023,
      category: "Ação",
      description: "Um piloto de corridas clandestinas se vê envolvido em uma perigosa conspiração.",
    },
  ])

  const [recommendedContent] = useState<Content[]>([
    {
      id: "12",
      title: "Harmonia Celestial",
      image: "/placeholder.svg?height=600&width=400",
      rating: 4.9,
      year: 2023,
      category: "Musical",
      description: "Uma jornada musical que transcende o tempo e o espaço, unindo culturas através da música.",
    },
    {
      id: "13",
      title: "Legado de Sangue",
      image: "/placeholder.svg?height=600&width=400",
      rating: 4.7,
      year: 2023,
      category: "Drama",
      description: "Uma saga familiar que atravessa gerações, revelando segredos e traições.",
    },
    {
      id: "14",
      title: "Fronteira Final",
      image: "/placeholder.svg?height=600&width=400",
      rating: 4.6,
      year: 2023,
      category: "Ficção Científica",
      description: "Astronautas em missão para colonizar um novo planeta enfrentam desafios inesperados.",
    },
    {
      id: "15",
      title: "Enigma das Pirâmides",
      image: "/placeholder.svg?height=600&width=400",
      rating: 4.5,
      year: 2023,
      category: "Documentário",
      description: "Uma investigação arqueológica revela segredos milenares escondidos nas antigas pirâmides.",
    },
    {
      id: "16",
      title: "Coração de Guerreiro",
      image: "/placeholder.svg?height=600&width=400",
      rating: 4.8,
      year: 2023,
      category: "Ação",
      description: "Um lutador aposentado retorna ao ringue para uma última batalha que definirá seu legado.",
    },
  ])

  const featuredContent = trendingContent[0]

  const handleContentClick = (content: Content) => {
    setSelectedContent(content)
    setShowDetailsModal(true)
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      <BackgroundGradientAnimation intensity={0.3} />

      {/* Header/Navbar */}
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
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl"
              >
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
                    onClick={() => handleContentClick(featuredContent)}
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

      {/* Content Sections */}
      <section className="py-8">
        <div className="container px-4 md:px-6">
          <h3 className="text-2xl font-bold mb-6">Em Alta</h3>
          <ContentCarousel contents={trendingContent} onContentClick={handleContentClick} />
        </div>
      </section>

      <section className="py-8">
        <div className="container px-4 md:px-6">
          <h3 className="text-2xl font-bold mb-6">Novidades</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {newContent.map((content, index) => (
              <ContentCard key={content.id} content={content} index={index} onClick={handleContentClick} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container px-4 md:px-6">
          <h3 className="text-2xl font-bold mb-6">Perfeito para você</h3>
          <ContentCarousel contents={recommendedContent} onContentClick={handleContentClick} />
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

