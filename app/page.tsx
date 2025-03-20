"use client"

import { useState, useRef, useEffect } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { Play, Star, Zap, Users, Brain, Film, ChevronRight, ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import LoginModal from "@/components/login-modal"
import { TypewriterEffect } from "@/components/typewriter-effect"
import { BackgroundGradientAnimation } from "@/components/background-gradient-animation"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

export default function Home() {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [activeTab, setActiveTab] = useState<"login" | "register">("login")
  const [isLoaded, setIsLoaded] = useState(false)
  const heroRef = useRef(null)
  const featuresRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8])

  useEffect(() => {
    // Simulate loading state
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const features = [
    {
      icon: <Zap className="h-6 w-6 text-pink-500" />,
      title: "Streaming fluido e rápido",
      description: "Assista a conteúdos em alta definição sem interrupções",
      gradient: "from-pink-500/20 to-pink-500/5",
      borderColor: "border-pink-500/20",
      hoverGradient: "hover:from-pink-500/30 hover:to-pink-500/10",
    },
    {
      icon: <Film className="h-6 w-6 text-blue-500" />,
      title: "Interface intuitiva",
      description: "Navegue facilmente por todo o nosso catálogo",
      gradient: "from-blue-500/20 to-blue-500/5",
      borderColor: "border-blue-500/20",
      hoverGradient: "hover:from-blue-500/30 hover:to-blue-500/10",
    },
    {
      icon: <Star className="h-6 w-6 text-yellow-500" />,
      title: "Catálogo atualizado",
      description: "Novos filmes e séries adicionados semanalmente",
      gradient: "from-yellow-500/20 to-yellow-500/5",
      borderColor: "border-yellow-500/20",
      hoverGradient: "hover:from-yellow-500/30 hover:to-yellow-500/10",
    },
    {
      icon: <Users className="h-6 w-6 text-green-500" />,
      title: "Multiperfis",
      description: "Crie até 5 perfis diferentes para sua família",
      gradient: "from-green-500/20 to-green-500/5",
      borderColor: "border-green-500/20",
      hoverGradient: "hover:from-green-500/30 hover:to-green-500/10",
    },
    {
      icon: <Brain className="h-6 w-6 text-purple-500" />,
      title: "Recomendação inteligente",
      description: "Sugestões personalizadas baseadas nos seus gostos",
      gradient: "from-purple-500/20 to-purple-500/5",
      borderColor: "border-purple-500/20",
      hoverGradient: "hover:from-purple-500/30 hover:to-purple-500/10",
    },
  ]

  const trendingContent = [
    {
      title: "Capitão América: Admirável Mundo Novo",
      category: "Ação, Thriller, Ficção científica",
      rating: 4.8,
      image: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/viUricKwbToOJIRrKOUr0Bg9rOY.jpg?height=600&width=400",
      new: true,
    },
    {
      title: "Demolidor: Renascido",
      category: "Documentário",
      rating: 8.7,
      image: "https://m.media-amazon.com/images/M/MV5BN2Y4OGEyMjktMzA0MS00NjUxLTk0NzQtZmI4OWE3OThjNDQyXkEyXkFqcGc@._V1_.jpg?height=600&width=400",
      new: true,
    },
    {
      title: "Mickey 17",
      category: "Ação",
      rating: 4.7,
      image: "https://m.media-amazon.com/images/M/MV5BMGFkZWE1MjgtYTdiZC00ZTkwLWE5MTgtZDMyNzU0ZmRkMzZiXkEyXkFqcGc@._V1_.jpg?height=600&width=400",
      new: true,
    },
    {
      title: "Ruptura",
      category: "Thriller",
      rating: 4.6,
      image: "https://m.media-amazon.com/images/M/MV5BODRhZmU0OTctMzY4NS00NDIxLThhNTQtMmRjMzNhZjcwNDhmXkEyXkFqcGc@._V1_.jpg?height=600&width=400",
      new: false,
    },
    {
      title: "Reacher",
      category: "Romance",
      rating: 4.4,
      image: "https://m.media-amazon.com/images/M/MV5BMzdjYWZlMDQtYzdhNi00NmRlLTg2NzUtMTI3MWFhZDliNjBiXkEyXkFqcGc@._V1_.jpg?height=600&width=400",
      new: false,
    },
  ]

  const screenshots = [
    {
      title: "Catálogo extenso",
      image: "/logo1.jpeg?height=600&width=800",
      description: "Milhares de títulos organizados por gênero, popularidade e relevância",
    },
    {
      title: "Detalhes do conteúdo",
      image: "/logo2.jpeg?height=600&width=800",
      description: "Informações completas sobre elenco, direção, sinopse e avaliações",
    },
    {
      title: "Experiência mobile",
      image: "/logo3.jpeg?height=600&width=800",
      description: "Interface otimizada para todos os dispositivos, com suporte a download",
    },
  ]

  const testimonials = [
    {
      name: "Carlos Silva",
      role: "Assinante Premium",
      content:
        "O Streamify revolucionou minha forma de assistir conteúdo. A interface é incrível e as recomendações são sempre certeiras!",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      name: "Ana Oliveira",
      role: "Cinéfila",
      content:
        "Nunca vi uma plataforma tão completa e com tantas opções. A qualidade do streaming é impecável mesmo com internet instável.",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      name: "Marcos Santos",
      role: "Crítico de Cinema",
      content:
        "Como profissional da área, posso afirmar que o catálogo do Streamify é um dos mais completos e bem curados do mercado.",
      avatar: "/placeholder.svg?height=100&width=100",
    },
  ]

  const ContentSkeleton = () => (
    <div className="space-y-3">
      <Skeleton className="h-[250px] w-full rounded-xl" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  )

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      <BackgroundGradientAnimation />

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-20 pb-16 md:pt-0 md:pb-0">
        <motion.div style={{ opacity, scale }} className="container px-4 md:px-6 z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="space-y-8 max-w-2xl"
            >
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
                <Sparkles className="h-4 w-4 text-purple-500 mr-2" />
                <span className="text-sm font-medium text-purple-500">Nova experiência de streaming</span>
              </div>

              <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 leading-tight text-white">
                <TypewriterEffect
                  words={[
                    { text: "Streaming" },
                    { text: "como" },
                    { text: "você" },
                    { text: "nunca" },
                    { text: "viu" },
                  ]}
                />
              </h1>
              <p className="text-xl text-gray-300 md:text-2xl max-w-2xl leading-relaxed">
                Filmes, séries e documentários em uma plataforma revolucionária,
                <span className="text-purple-400"> projetada para uma experiência imersiva</span> que vai transformar
                sua forma de consumir conteúdo.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium px-8 py-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
                  onClick={() => {
                    setActiveTab("register")
                    setShowLoginModal(true)
                  }}
                >
                  Criar Conta Gratuita
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gray-700 text-white hover:bg-gray-800/50 rounded-full px-8 py-6 transition-all duration-300"
                  onClick={() => {
                    setActiveTab("login")
                    setShowLoginModal(true)
                  }}
                >
                  Entrar na Plataforma
                </Button>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-400 pt-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-black overflow-hidden">
                      <img
                        src={`/placeholder.svg?height=50&width=50&text=${i}`}
                        alt="User avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <span>+10.000 usuários se juntaram este mês</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
              className="relative w-full max-w-md lg:max-w-lg xl:max-w-xl"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-purple-500/20 shadow-2xl shadow-purple-500/10">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-purple-500/20 backdrop-blur-sm z-10"></div>
                <img
                  src="/fundo.jpeg?height=600&width=800&text=Streamify"
                  alt="Streamify Platform Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 z-20">
                  <h3 className="text-xl font-bold text-white mb-2">Descubra novos mundos</h3>
                  <p className="text-gray-300 text-sm">Explore nosso catálogo exclusivo com milhares de títulos</p>
                </div>

                <motion.div
                  className="absolute top-4 right-4 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full z-20"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                >
                  NOVO
                </motion.div>
              </div>

              <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl p-4 shadow-lg transform rotate-6 z-0">
                <Play className="h-8 w-8 text-white" />
              </div>
            </motion.div>
          </div>
        </motion.div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 hidden md:block">
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
          >
            <ChevronRight className="h-10 w-10 text-white/50 transform rotate-90" />
          </motion.div>
        </div>
      </section>

      {/* Trending Content Section */}
      <section className="py-16 md:py-24 relative">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
          >
            <div>
              <Badge className="mb-4 bg-pink-500/10 text-pink-500 border-pink-500/20 hover:bg-pink-500/20">
                Em destaque
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
                Conteúdo <span className="text-pink-500">em alta</span>
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl">Os títulos mais assistidos e bem avaliados da semana</p>
            </div>
            <Button variant="ghost" className="text-pink-500 hover:text-pink-400 hover:bg-pink-500/10">
              Ver catálogo completo <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>

          <div className="relative">
            <ScrollArea className="w-full pb-6">
              <div className="flex space-x-6 pb-4">
                {!isLoaded
                  ? // Skeleton loading state
                    Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <div key={i} className="min-w-[250px] w-[250px]">
                          <ContentSkeleton />
                        </div>
                      ))
                  : // Actual content
                    trendingContent.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="min-w-[250px] w-[250px]"
                      >
                        <div className="group relative overflow-hidden rounded-xl">
                          <div className="aspect-[2/3] overflow-hidden rounded-xl">
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                            <Button size="sm" variant="default" className="bg-pink-500 hover:bg-pink-600 mb-4 w-full">
                              Assistir agora
                            </Button>
                          </div>
                          {item.new && (
                            <div className="absolute top-3 right-3 bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                              NOVO
                            </div>
                          )}
                          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-md flex items-center">
                            <Star className="h-3 w-3 text-yellow-500 mr-1 fill-yellow-500" />
                            {item.rating}
                          </div>
                        </div>
                        <div className="mt-3">
                          <h3 className="font-semibold text-white group-hover:text-pink-500 transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-sm text-gray-400">{item.category}</p>
                        </div>
                      </motion.div>
                    ))}
              </div>
            </ScrollArea>

            <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 bg-gradient-to-l from-black via-black/80 to-transparent w-16 h-full flex items-center justify-start pointer-events-none">
              <ChevronRight className="h-8 w-8 text-pink-500/70" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-16 md:py-24 relative">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-purple-500/10 text-purple-500 border-purple-500/20 hover:bg-purple-500/20">
              Recursos exclusivos
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
              Por que escolher o <span className="text-purple-500">Streamify</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Descubra por que somos a escolha número um para streaming de conteúdo
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className={`bg-gradient-to-br ${feature.gradient} ${feature.hoverGradient} backdrop-blur-sm border ${feature.borderColor} rounded-xl p-6 transition-all duration-300 hover:shadow-lg`}
              >
                <div className="bg-black/30 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshots Section */}
      <section className="py-16 md:py-24 relative">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20">
              Experiência visual
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
              Veja a <span className="text-blue-500">Plataforma</span> em Ação
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Uma experiência visual incrível em todos os dispositivos
            </p>
          </motion.div>

          <Tabs defaultValue="screenshot-0" className="w-full">
            <TabsList className="grid grid-cols-3 max-w-md mx-auto mb-8">
              {screenshots.map((_, index) => (
                <TabsTrigger
                  key={index}
                  value={`screenshot-${index}`}
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                >
                  {index + 1}
                </TabsTrigger>
              ))}
            </TabsList>

            {screenshots.map((screenshot, index) => (
              <TabsContent key={index} value={`screenshot-${index}`} className="mt-0">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col lg:flex-row gap-8 items-center"
                >
                  <div className="w-full lg:w-2/3 relative">
                    <div className="relative overflow-hidden rounded-xl border border-blue-500/20 shadow-xl shadow-blue-500/10">
                      <img
                        src={screenshot.image || "/placeholder.svg"}
                        alt={screenshot.title}
                        className="w-full h-auto object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent pointer-events-none"></div>
                    </div>
                    <div className="absolute -bottom-4 -right-4 bg-blue-500/10 backdrop-blur-sm border border-blue-500/20 rounded-lg p-3 transform rotate-6">
                      <Film className="h-6 w-6 text-blue-500" />
                    </div>
                  </div>

                  <div className="w-full lg:w-1/3 space-y-6">
                    <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">Recurso {index + 1}/3</Badge>
                    <h3 className="text-2xl font-bold text-white">{screenshot.title}</h3>
                    <p className="text-gray-300 text-lg">{screenshot.description}</p>
                    <Button variant="outline" className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10">
                      Saiba mais <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 relative">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20">
              Depoimentos
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
              O que nossos <span className="text-green-500">usuários</span> dizem
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">Experiências reais de assinantes do Streamify</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-sm border border-white/5 rounded-xl p-6 hover:border-green-500/20 transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-green-500/30">
                    <img
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{testimonial.name}</h4>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-300 italic">"{testimonial.content}"</p>
                <div className="mt-4 flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 relative">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="relative overflow-hidden bg-gradient-to-r from-purple-900/40 to-blue-900/40 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 md:p-12 text-center max-w-4xl mx-auto"
          >
            <motion.div
              className="absolute -top-24 -right-24 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 8,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />

            <motion.div
              className="absolute -bottom-32 -left-32 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 10,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />

            <div className="relative z-10">
              <Badge className="mb-6 bg-pink-500/20 text-pink-400 border-pink-500/30 hover:bg-pink-500/30">
                Oferta especial
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">Pronto para começar?</h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Junte-se a milhões de usuários e desfrute do melhor conteúdo de streaming disponível
              </p>
              <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium px-8 py-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
                  onClick={() => {
                    setActiveTab("register")
                    setShowLoginModal(true)
                  }}
                >
                  Criar Conta Agora <Play className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>

              <div className="mt-8 text-sm text-gray-400">Sem compromisso. Cancele quando quiser.</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Login Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <LoginModal
            isOpen={showLoginModal}
            onClose={() => setShowLoginModal(false)}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

