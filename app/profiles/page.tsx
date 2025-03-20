"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Settings, User, ChevronLeft, ChevronRight, Check, X, Lock, Unlock } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BackgroundGradientAnimation } from "@/components/background-gradient-animation"
import { cn } from "@/lib/utils"

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
  const [selectedAvatar, setSelectedAvatar] = useState<string>("")
  const [avatars, setAvatars] = useState<string[]>([])
  const [newProfileError, setNewProfileError] = useState("")

  // Estado para controlar a animação de saída
  const [isExiting, setIsExiting] = useState(false)
  // Estado para controlar a exibição do popup para selecionar avatar
  const [showAvatarPicker, setShowAvatarPicker] = useState(false)

  // Paginação para o Avatar Picker
  const AVATARS_PER_PAGE = 12
  const [currentAvatarPage, setCurrentAvatarPage] = useState(0)
  const paginatedAvatars = avatars.slice(
    currentAvatarPage * AVATARS_PER_PAGE,
    (currentAvatarPage + 1) * AVATARS_PER_PAGE,
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
          Authorization: `Bearer ${token}`,
        },
      })
      if (!res.ok) throw new Error("Erro ao buscar perfis")
      const data = await res.json()
      // Converte o avatar para URL completa
      const profilesWithUrl = data.data.map((profile: Profile) => ({
        ...profile,
        avatar: profile.avatar ? `https://api.streamhivex.icu${profile.avatar}` : "/placeholder.svg",
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
      const res = await fetch(`https://api.streamhivex.icu/api/perfis/validar-pin/${selectedProfile.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ pin: pinInput }),
      })
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
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome: newProfileName,
          // Envia somente o caminho (a API retorna esse mesmo caminho)
          avatar: `/assets/perfil/${selectedAvatar}`,
          pin: newProfilePin || undefined,
        }),
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
      initial={{ opacity: 0 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen overflow-hidden bg-black text-white"
    >
      <BackgroundGradientAnimation intensity={0.4} />

      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/80 z-0"></div>

      <div className="container relative z-10 px-4 md:px-6 py-20 md:py-32 flex flex-col items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
            StreamFlix
          </h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl font-medium text-white/90">Quem está assistindo?</h2>
          </motion.div>
        </motion.div>

        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-40"
          >
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-400">Carregando perfis...</p>
          </motion.div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 bg-red-900/30 backdrop-blur-sm border border-red-800 rounded-lg text-red-200"
          >
            <p>{error}</p>
            <Button onClick={fetchProfiles} className="mt-2 bg-red-700 hover:bg-red-600 text-white">
              Tentar novamente
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8 max-w-5xl">
            {profiles.map((profile, index) => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                index={index}
                onClick={() => handleProfileSelect(profile)}
              />
            ))}

            {/* Card para adicionar novo perfil */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: profiles.length * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNewProfileModal(true)}
              className="cursor-pointer"
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur opacity-0 group-hover:opacity-75 transition duration-300"></div>
                  <div className="relative flex items-center justify-center bg-gray-800/80 backdrop-blur-sm rounded-full overflow-hidden aspect-square">
                    <Plus className="w-12 h-12 text-gray-300 group-hover:text-white transition-colors" />
                  </div>
                </div>
                <span className="text-lg font-medium text-gray-300 group-hover:text-white transition-colors">
                  Novo Perfil
                </span>
              </div>
            </motion.div>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16"
        >
          <Button
            variant="outline"
            className="border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800/50 hover:border-gray-600 backdrop-blur-sm"
          >
            <Settings className="mr-2 h-4 w-4" /> Gerenciar Perfis
          </Button>
        </motion.div>
      </div>

      {/* Modal de validação do PIN */}
      <AnimatePresence>
        {showValidatePinModal && (
          <Modal onClose={() => setShowValidatePinModal(false)}>
            <div className="text-center mb-4">
              <div className="mx-auto w-20 h-20 mb-4 rounded-full overflow-hidden border-2 border-purple-500">
                <img
                  src={selectedProfile?.avatar || "/placeholder.svg"}
                  alt={selectedProfile?.nome}
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-2xl font-bold">{selectedProfile?.nome}</h2>
              <p className="text-gray-400 mt-1">Este perfil é protegido por PIN</p>
            </div>

            <form onSubmit={handleValidatePin} className="space-y-4">
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input
                  type="password"
                  placeholder="Digite o PIN"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 focus:border-purple-500 focus:ring-purple-500"
                  required
                  maxLength={6}
                />
              </div>

              {pinError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-2 rounded bg-red-900/30 border border-red-800/50 text-red-200 text-sm"
                >
                  {pinError}
                </motion.div>
              )}

              <div className="flex justify-between space-x-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowValidatePinModal(false)}
                  className="flex-1 border-gray-700 hover:bg-gray-800 hover:text-white"
                >
                  <X className="mr-2 h-4 w-4" /> Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Check className="mr-2 h-4 w-4" /> Confirmar
                </Button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>

      {/* Modal de criação de novo perfil */}
      <AnimatePresence>
        {showNewProfileModal && (
          <Modal onClose={() => setShowNewProfileModal(false)} size="lg">
            <h2 className="text-2xl font-bold mb-6 text-center">Criar Novo Perfil</h2>

            <form onSubmit={handleCreateProfile} className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                  <div
                    className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-transparent cursor-pointer"
                    onClick={() => setShowAvatarPicker(true)}
                  >
                    {selectedAvatar ? (
                      <img
                        src={`https://api.streamhivex.icu/assets/perfil/${selectedAvatar}`}
                        alt="Avatar Selecionado"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-800">
                        <User className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <p className="text-white text-sm font-medium">Alterar</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 w-full">
                  <label className="block text-sm font-medium text-gray-400 mb-1">Nome do Perfil</label>
                  <Input
                    type="text"
                    placeholder="Digite o nome do perfil"
                    value={newProfileName}
                    onChange={(e) => setNewProfileName(e.target.value)}
                    className="bg-gray-800 border-gray-700 focus:border-purple-500 focus:ring-purple-500"
                    required
                  />

                  <div className="mt-4">
                    <label className="flex items-center justify-between text-sm font-medium text-gray-400 mb-1">
                      <span>PIN de Proteção (opcional)</span>
                      {newProfilePin ? (
                        <Lock className="h-4 w-4 text-purple-400" />
                      ) : (
                        <Unlock className="h-4 w-4 text-gray-500" />
                      )}
                    </label>
                    <Input
                      type="password"
                      placeholder="Digite um PIN (opcional)"
                      value={newProfilePin}
                      onChange={(e) => setNewProfilePin(e.target.value)}
                      className="bg-gray-800 border-gray-700 focus:border-purple-500 focus:ring-purple-500"
                      maxLength={6}
                    />
                    <p className="text-xs text-gray-500 mt-1">O PIN protege o acesso a este perfil</p>
                  </div>
                </div>
              </div>

              {newProfileError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded bg-red-900/30 border border-red-800/50 text-red-200 text-sm"
                >
                  {newProfileError}
                </motion.div>
              )}

              <div className="flex justify-between space-x-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowNewProfileModal(false)}
                  className="flex-1 border-gray-700 hover:bg-gray-800 hover:text-white"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  disabled={!newProfileName || !selectedAvatar}
                >
                  Criar Perfil
                </Button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>

      {/* Popup para seleção de avatar */}
      <AnimatePresence>
        {showAvatarPicker && (
          <Modal onClose={() => setShowAvatarPicker(false)} size="lg">
            <h3 className="text-xl font-bold mb-4">Escolha um Avatar</h3>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 max-h-[300px] overflow-y-auto p-1">
              {paginatedAvatars.map((avatar, index) => (
                <motion.div
                  key={index}
                  className={cn(
                    "relative rounded-lg overflow-hidden cursor-pointer transition-all duration-200",
                    selectedAvatar === avatar
                      ? "ring-2 ring-purple-500 ring-offset-2 ring-offset-gray-900"
                      : "hover:ring-1 hover:ring-purple-400 hover:ring-offset-1 hover:ring-offset-gray-900",
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedAvatar(avatar)
                    setShowAvatarPicker(false)
                  }}
                >
                  <img
                    src={`https://api.streamhivex.icu/assets/perfil/${avatar}`}
                    alt="Avatar"
                    className="w-full aspect-square object-cover"
                  />
                  {selectedAvatar === avatar && (
                    <div className="absolute inset-0 bg-purple-500/30 flex items-center justify-center">
                      <Check className="w-6 h-6 text-white" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Paginação */}
            {avatars.length > AVATARS_PER_PAGE && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-400">
                  Página {currentAvatarPage + 1} de {Math.ceil(avatars.length / AVATARS_PER_PAGE)}
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={currentAvatarPage === 0}
                    onClick={() => setCurrentAvatarPage((prev) => Math.max(prev - 1, 0))}
                    className="h-9 px-3"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={(currentAvatarPage + 1) * AVATARS_PER_PAGE >= avatars.length}
                    onClick={() => setCurrentAvatarPage((prev) => prev + 1)}
                    className="h-9 px-3"
                  >
                    Próximo <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </Modal>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Profile Card Component
interface ProfileCardProps {
  profile: Profile
  index: number
  onClick: () => void
}

function ProfileCard({ profile, index, onClick }: ProfileCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="relative group">
          {/* Glow effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full blur opacity-0 group-hover:opacity-75 transition duration-300"></div>

          {/* Avatar container */}
          <div className="relative bg-gray-900/80 backdrop-blur-sm rounded-full overflow-hidden aspect-square">
            <img
              src={profile.avatar || "/placeholder.svg"}
              alt={profile.nome}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />

            {/* PIN indicator */}
            {profile.requiresPin && (
              <div className="absolute bottom-0 right-0 bg-purple-600 rounded-full p-1 m-1 border-2 border-gray-900">
                <Lock className="h-3 w-3 text-white" />
              </div>
            )}
          </div>
        </div>

        {/* Profile name with animated underline on hover */}
        <div className="relative">
          <span className="text-lg font-medium text-gray-200 group-hover:text-white transition-colors">
            {profile.nome}
          </span>
          <motion.div
            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full"
            initial={{ width: 0, opacity: 0 }}
            whileHover={{ width: "100%", opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </motion.div>
  )
}

// Reusable Modal Component
interface ModalProps {
  children: React.ReactNode
  onClose: () => void
  size?: "sm" | "md" | "lg"
}

function Modal({ children, onClose, size = "md" }: ModalProps) {
  // Handle size classes
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className={cn("bg-gray-900 p-6 rounded-xl w-full border border-gray-800 shadow-xl", sizeClasses[size])}
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 20, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

