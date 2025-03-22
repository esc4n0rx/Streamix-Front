"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Bell, User, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"

interface NavbarProps {
  isScrolled: boolean
}

export function Navbar({ isScrolled }: NavbarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Define as rotas para navegação
  const navLinks = [
    { name: "Início", href: "/dashboard" },
    { name: "Séries", href: "/tvshow" },
    { name: "Filmes", href: "/movies" },
    { name: "Minha Lista", href: "/list" },
  ]

  return (
    <motion.header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-black/90 backdrop-blur-md shadow-lg" : "bg-gradient-to-b from-black/80 to-transparent",
      )}
    >
      <div className="container px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <motion.h1
              className="text-2xl font-bold"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-600 to-green-500">
                Streamify
              </span>
            </motion.h1>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {navLinks.map(({ name, href }, index) => (
                <motion.a
                  key={name}
                  href={href}
                  className={cn(
                    "relative font-medium transition-colors",
                    index === 0 ? "text-white" : "text-gray-400 hover:text-white",
                  )}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  {name}
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
            <button
              className="md:hidden text-gray-400 hover:text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
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

          {/* Action Buttons */}
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

            {/* Icons */}
            {["bell", "user", "settings"].map((icon, index) => (
              <motion.div
                key={icon}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
              >
                <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white transition-all duration-300"
                >
                {icon === "bell" && <Bell className="h-5 w-5" />}
                {icon === "user" && <User className="h-5 w-5" />}
                {icon === "settings" && <Settings className="h-5 w-5" />}
                </Button>
              </motion.div>
            ))}
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
                {navLinks.map(({ name, href }, index) => (
                  <motion.a
                    key={name}
                    href={href}
                    className={cn(
                      "text-lg font-medium py-2 border-b border-gray-800",
                      index === 0 ? "text-white" : "text-gray-400",
                    )}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {name}
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
      </div>
    </motion.header>
  )
}