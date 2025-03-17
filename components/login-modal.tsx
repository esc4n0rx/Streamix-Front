"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Mail, Lock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  activeTab: "login" | "register"
  setActiveTab: (tab: "login" | "register") => void
}

export default function LoginModal({ isOpen, onClose, activeTab, setActiveTab }: LoginModalProps) {
  const router = useRouter()

  // Estados para o formulário de login
  const [loginEmail, setLoginEmail] = useState("")
  const [loginSenha, setLoginSenha] = useState("")
  const [loginError, setLoginError] = useState("")

  // Estados para o formulário de registro
  const [registerNome, setRegisterNome] = useState("")
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerSenha, setRegisterSenha] = useState("")
  const [registerError, setRegisterError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")

    try {
      const response = await fetch("https://api.streamhivex.icu/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, senha: loginSenha })
      })

      if (!response.ok) {
        const errorData = await response.json()
        setLoginError(errorData.message || "Erro ao efetuar login")
        return
      }

      const data = await response.json()
      // Supondo que o token retorne em data.token
      localStorage.setItem("token", data.token)
      onClose()
      router.push("/profiles")
    } catch (error) {
      console.error("Erro de login:", error)
      setLoginError("Erro de conexão")
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegisterError("")

    try {
      const response = await fetch("https://api.streamhivex.icu/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: registerNome, email: registerEmail, senha: registerSenha })
      })

      if (!response.ok) {
        const errorData = await response.json()
        setRegisterError(errorData.message || "Erro ao efetuar registro")
        return
      }

      const data = await response.json()
      // Supondo que o token retorne em data.token
      localStorage.setItem("token", data.token)
      onClose()
      router.push("/profiles")
    } catch (error) {
      console.error("Erro de registro:", error)
      setRegisterError("Erro de conexão")
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="absolute top-4 right-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white hover:bg-gray-800 rounded-full"
                onClick={onClose}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-6">
              <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "register")}>
                <TabsList className="grid grid-cols-2 mb-8 bg-gray-800/50">
                  <TabsTrigger value="login" className="data-[state=active]:bg-purple-600">
                    Entrar
                  </TabsTrigger>
                  <TabsTrigger value="register" className="data-[state=active]:bg-pink-600">
                    Cadastrar
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          type="email"
                          placeholder="Email"
                          className="pl-10 bg-gray-800/50 border-gray-700 focus:border-purple-500 focus:ring-purple-500 transition-all"
                          required
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          type="password"
                          placeholder="Senha"
                          className="pl-10 bg-gray-800/50 border-gray-700 focus:border-purple-500 focus:ring-purple-500 transition-all"
                          required
                          value={loginSenha}
                          onChange={(e) => setLoginSenha(e.target.value)}
                        />
                      </div>
                    </div>

                    {loginError && <p className="text-red-500 text-sm">{loginError}</p>}

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-2 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Entrar
                    </Button>

                    <div className="text-center text-sm text-gray-400">
                      <a href="#" className="hover:text-purple-400 transition-colors">
                        Esqueceu sua senha?
                      </a>
                    </div>
                  </form>
                </TabsContent>

                <TabsContent value="register">
                  <form onSubmit={handleRegister} className="space-y-6">
                    <div className="space-y-2">
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          type="text"
                          placeholder="Nome completo"
                          className="pl-10 bg-gray-800/50 border-gray-700 focus:border-pink-500 focus:ring-pink-500 transition-all"
                          required
                          value={registerNome}
                          onChange={(e) => setRegisterNome(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          type="email"
                          placeholder="Email"
                          className="pl-10 bg-gray-800/50 border-gray-700 focus:border-pink-500 focus:ring-pink-500 transition-all"
                          required
                          value={registerEmail}
                          onChange={(e) => setRegisterEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          type="password"
                          placeholder="Senha"
                          className="pl-10 bg-gray-800/50 border-gray-700 focus:border-pink-500 focus:ring-pink-500 transition-all"
                          required
                          value={registerSenha}
                          onChange={(e) => setRegisterSenha(e.target.value)}
                        />
                      </div>
                    </div>

                    {registerError && <p className="text-red-500 text-sm">{registerError}</p>}

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-medium py-2 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Criar Conta
                    </Button>

                    <div className="text-center text-sm text-gray-400">
                      Ao criar uma conta, você concorda com nossos{" "}
                      <a href="#" className="hover:text-pink-400 transition-colors">
                        Termos de Serviço
                      </a>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
