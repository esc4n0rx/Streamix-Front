"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Play, Star, Zap, Users, Brain, Film } from "lucide-react"
import { Button } from "@/components/ui/button"
import LoginModal from "@/components/login-modal"
import { TypewriterEffect } from "@/components/typewriter-effect"
import { BackgroundGradientAnimation } from "@/components/background-gradient-animation"
import { FeatureCard } from "@/components/feature-card"
import { ScreenshotCard } from "@/components/screenshot-card"

export default function Home() {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [activeTab, setActiveTab] = useState<"login" | "register">("login")

  const features = [
    {
      icon: <Zap className="h-6 w-6 text-pink-500" />,
      title: "Streaming fluido e rápido",
      description: "Assista a conteúdos em alta definição sem interrupções",
    },
    {
      icon: <Film className="h-6 w-6 text-blue-500" />,
      title: "Interface intuitiva",
      description: "Navegue facilmente por todo o nosso catálogo",
    },
    {
      icon: <Star className="h-6 w-6 text-yellow-500" />,
      title: "Catálogo atualizado",
      description: "Novos filmes e séries adicionados semanalmente",
    },
    {
      icon: <Users className="h-6 w-6 text-green-500" />,
      title: "Multiperfis",
      description: "Crie até 5 perfis diferentes para sua família",
    },
    {
      icon: <Brain className="h-6 w-6 text-purple-500" />,
      title: "Recomendação inteligente",
      description: "Sugestões personalizadas baseadas nos seus gostos",
    },
  ]

  const screenshots = [
    {
      title: "Catálogo extenso",
      image: "/logo1.jpeg?height=600&width=800",
    },
    {
      title: "Detalhes do conteúdo",
      image: "/logo2.jpeg?height=600&width=800",
    },
    {
      title: "Experiência mobile",
      image: "/logo3.jpeg?height=600&width=800",
    },
  ]

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      <BackgroundGradientAnimation />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4 max-w-3xl"
            >
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
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
              <p className="text-xl text-gray-400 md:text-2xl max-w-2xl mx-auto">
                Filmes, séries e documentários em uma plataforma revolucionária, projetada para uma experiência
                imersiva.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium px-8 rounded-full"
                onClick={() => {
                  setActiveTab("register")
                  setShowLoginModal(true)
                }}
              >
                Criar Conta
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-gray-700 text-white hover:bg-gray-800 rounded-full px-8"
                onClick={() => {
                  setActiveTab("login")
                  setShowLoginModal(true)
                }}
              >
                Entrar
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 relative">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
              Recursos <span className="text-purple-500">Exclusivos</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Descubra por que somos a escolha número um para streaming de conteúdo
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                index={index}
              />
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
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
              Veja a <span className="text-blue-500">Plataforma</span> em Ação
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Uma experiência visual incrível em todos os dispositivos
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {screenshots.map((screenshot, index) => (
              <ScreenshotCard key={index} title={screenshot.title} image={screenshot.image} index={index} />
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
            className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 md:p-12 text-center max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">Pronto para começar?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Junte-se a milhões de usuários e desfrute do melhor conteúdo de streaming disponível
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium px-8 rounded-full"
              onClick={() => {
                setActiveTab("register")
                setShowLoginModal(true)
              }}
            >
              Criar Conta Agora <Play className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </div>
  )
}

