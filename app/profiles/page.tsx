"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Settings } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BackgroundGradientAnimation } from "@/components/background-gradient-animation"

interface Profile {
  id: string
  nome: string
  avatar: string
  requiresPin?: boolean
}

interface AvatarResponse {
  status: number
  data: {
    perfil: string[]
  }
}

export default function ProfilesPage() {
  const router = useRouter()

  // Estados dos perfis do usuário
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Estados para os modais
  const [showNewProfileModal, setShowNewProfileModal] = useState(false)
  const [showValidatePinModal, setShowValidatePinModal] = useState(false)
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null)

  // Estado para o formulário de validação de PIN
  const [pinInput, setPinInput] = useState("")
  const [pinError, setPinError] = useState("")

  // Estados para criação de novo perfil
  const [newProfileName, setNewProfileName] = useState("")
  const [newProfilePin, setNewProfilePin] = useState("")
  // selectedAvatar guarda somente o nome do arquivo (ex: "default.png" ou outro)
  const [selectedAvatar, setSelectedAvatar] = useState<string>("")
  const [avatars, setAvatars] = useState<string[]>([])
  const [newProfileError, setNewProfileError] = useState("")

  // Estado para controlar a animação de saída
  const [isExiting, setIsExiting] = useState(false)
  // Estado para controlar a exibição do popup para selecionar avatar
  const [showAvatarPicker, setShowAvatarPicker] = useState(false)

  // Paginação para o Avatar Picker: 10 itens por página
  const AVATARS_PER_PAGE = 10
  const [currentAvatarPage, setCurrentAvatarPage] = useState(0)
  const paginatedAvatars = avatars.slice(
    currentAvatarPage * AVATARS_PER_PAGE,
    (currentAvatarPage + 1) * AVATARS_PER_PAGE
  )

  // Busca os perfis do usuário ao montar o componente
  useEffect(() => {
    fetchProfiles()
  }, [])

  async function fetchProfiles() {
    setLoading(true)
    setError("")
    try {
      const token = localStorage.getItem("token")
      const res = await fetch("https://api.streamhivex.icu/api/perfis", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      })
      if (!res.ok) throw new Error("Erro ao buscar perfis")
      const data = await res.json()
      // Converte o avatar para URL completa
      const profilesWithUrl = data.data.map((profile: Profile) => ({
        ...profile,
        avatar: profile.avatar
          ? `https://api.streamhivex.icu${profile.avatar}`
          : "/placeholder.svg"
      }))
      setProfiles(profilesWithUrl)
    } catch (err) {
      setError("Erro ao carregar perfis")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleProfileSelect = (profile: Profile) => {
    if (profile.requiresPin) {
      setSelectedProfile(profile)
      setShowValidatePinModal(true)
    } else {
      setIsExiting(true)
      setTimeout(() => router.push("/dashboard"), 500)
    }
  }

  const handleValidatePin = async (e: React.FormEvent) => {
    e.preventDefault()
    setPinError("")
    if (!selectedProfile) return

    try {
      const token = localStorage.getItem("token")
      const res = await fetch(
        `https://api.streamhivex.icu/api/perfis/validar-pin/${selectedProfile.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ pin: pinInput })
        }
      )
      if (!res.ok) {
        const errorData = await res.json()
        setPinError(errorData.message || "PIN inválido")
        return
      }
      setIsExiting(true)
      setShowValidatePinModal(false)
      setTimeout(() => router.push("/dashboard"), 500)
    } catch (error) {
      console.error("Erro ao validar PIN:", error)
      setPinError("Erro de conexão")
    }
  }

  // Busca os avatares disponíveis ao abrir o modal de novo perfil
  useEffect(() => {
    if (showNewProfileModal) {
      fetchAvatars()
    }
  }, [showNewProfileModal])

  async function fetchAvatars() {
    try {
      const res = await fetch("https://api.streamhivex.icu/api/auth/avatars")
      if (!res.ok) throw new Error("Erro ao buscar avatares")
      const data: AvatarResponse = await res.json()
      setAvatars(data.data.perfil)
      setCurrentAvatarPage(0)
    } catch (err) {
      console.error(err)
    }
  }

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setNewProfileError("")
    if (!newProfileName || !selectedAvatar) {
      setNewProfileError("Preencha o nome e selecione um avatar")
      return
    }
    try {
      const token = localStorage.getItem("token")
      const res = await fetch("https://api.streamhivex.icu/api/perfis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          nome: newProfileName,
          // Envia somente o caminho (a API retorna esse mesmo caminho)
          avatar: `/assets/perfil/${selectedAvatar}`,
          pin: newProfilePin || undefined
        })
      })
      if (!res.ok) {
        const errorData = await res.json()
        setNewProfileError(errorData.message || "Erro ao criar perfil")
        return
      }
      await fetchProfiles()
      setShowNewProfileModal(false)
      setNewProfileName("")
      setNewProfilePin("")
      // Não limpamos o selectedAvatar para que o novo perfil mantenha a imagem
    } catch (error) {
      console.error("Erro ao criar perfil:", error)
      setNewProfileError("Erro de conexão")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen overflow-hidden bg-black"
    >
      <BackgroundGradientAnimation />

      <div className="container px-4 md:px-6 py-20 md:py-32 flex flex-col items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Quem está assistindo?</h1>
        </motion.div>

        {loading && <p className="text-gray-400">Carregando perfis...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl">
          {profiles.map((profile, index) => (
            <motion.div
              key={profile.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleProfileSelect(profile)}
              className="cursor-pointer"
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                  <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-square">
                    <img
                      src={profile.avatar}
                      alt={profile.nome}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                </div>
                <span className="text-lg font-medium text-gray-200 group-hover:text-white transition-colors">
                  {profile.nome}
                </span>
              </div>
            </motion.div>
          ))}

          {/* Card para adicionar novo perfil */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: profiles.length * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNewProfileModal(true)}
            className="cursor-pointer"
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative flex items-center justify-center bg-gray-800 rounded-lg overflow-hidden aspect-square">
                  <Plus className="w-16 h-16 text-gray-400 group-hover:text-white transition-colors" />
                </div>
              </div>
              <span className="text-lg font-medium text-gray-200 group-hover:text-white transition-colors">
                Adicionar Perfil
              </span>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12"
        >
          <Button variant="outline" className="border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800">
            <Settings className="mr-2 h-4 w-4" /> Gerenciar Perfis
          </Button>
        </motion.div>
      </div>

      {/* Modal de validação do PIN */}
      <AnimatePresence>
        {showValidatePinModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-900 p-6 rounded-lg max-w-sm w-full"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <h2 className="text-xl font-bold mb-4">Digite o PIN</h2>
              <form onSubmit={handleValidatePin} className="space-y-4">
                <Input
                  type="password"
                  placeholder="PIN"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  required
                />
                {pinError && <p className="text-red-500 text-sm">{pinError}</p>}
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setShowValidatePinModal(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Confirmar</Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de criação de novo perfil */}
      <AnimatePresence>
        {showNewProfileModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-900 p-6 rounded-lg max-w-md w-full"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <h2 className="text-xl font-bold mb-4">Criar Novo Perfil</h2>
              <form onSubmit={handleCreateProfile} className="space-y-4">
                <Input
                  type="text"
                  placeholder="Nome do Perfil"
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  required
                />
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16">
                    <img
                      src={`https://api.streamhivex.icu/assets/perfil/${selectedAvatar || "default.png"}`}
                      alt="Avatar Selecionado"
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <Button type="button" onClick={() => setShowAvatarPicker(true)}>
                    Alterar Avatar
                  </Button>
                </div>
                <Input
                  type="password"
                  placeholder="PIN (opcional)"
                  value={newProfilePin}
                  onChange={(e) => setNewProfilePin(e.target.value)}
                />
                {newProfileError && <p className="text-red-500 text-sm">{newProfileError}</p>}
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setShowNewProfileModal(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Criar Perfil</Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Popup fixo para seleção de avatar */}
      <AnimatePresence>
        {showAvatarPicker && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-800 p-4 rounded-lg max-w-md w-full"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <h3 className="text-lg font-semibold mb-2">Selecione um Avatar</h3>
              {/* Container com altura fixa e scroll para paginar */}
              <div className="grid grid-cols-4 gap-2 max-h-60 overflow-y-auto">
                {paginatedAvatars.map((avatar, index) => (
                  <div
                    key={index}
                    className={`border rounded p-1 cursor-pointer ${
                      selectedAvatar === avatar ? "border-blue-500" : "border-transparent"
                    }`}
                    onClick={() => {
                      setSelectedAvatar(avatar)
                      setShowAvatarPicker(false)
                    }}
                  >
                    <img
                      src={`https://api.streamhivex.icu/assets/perfil/${avatar}`}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              {/* Controles de paginação */}
              <div className="flex justify-between mt-2">
                <Button
                  type="button"
                  disabled={currentAvatarPage === 0}
                  onClick={() => setCurrentAvatarPage((prev) => Math.max(prev - 1, 0))}
                >
                  Anterior
                </Button>
                <Button
                  type="button"
                  disabled={(currentAvatarPage + 1) * AVATARS_PER_PAGE >= avatars.length}
                  onClick={() => setCurrentAvatarPage((prev) => prev + 1)}
                >
                  Próximo
                </Button>
              </div>
              <div className="mt-4 flex justify-end">
                <Button type="button" variant="outline" onClick={() => setShowAvatarPicker(false)}>
                  Fechar
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
