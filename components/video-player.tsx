"use client"
import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { 
  Play, Pause, Volume2, VolumeX, Maximize, Minimize, SkipBack, SkipForward, 
  X, Settings, ChevronLeft, Cast, Subtitles, RotateCw, Info, Share2, Heart
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface VideoPlayerProps {
  onClose: () => void
  videoUrl: string
  contentId: string
  title?: string
  description?: string
  thumbnailUrl?: string
}

export function VideoPlayer({ 
  onClose, 
  videoUrl, 
  contentId, 
  title = "Assistindo", 
  description = "", 
  thumbnailUrl = "" 
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const playerRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [bufferedTime, setBufferedTime] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const [showPreview, setShowPreview] = useState(false)
  const [isLandscape, setIsLandscape] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [quality, setQuality] = useState("Auto")
  const [subtitles, setSubtitles] = useState(false)
  const [lastWatchedTime, setLastWatchedTime] = useState(0)
  const [hasWatchRegistered, setHasWatchRegistered] = useState(false)
  const [isBuffering, setIsBuffering] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [doubleTapDirection, setDoubleTapDirection] = useState<null | "left" | "right">(null)
  
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const qualityOptions = ["Auto", "1080p", "720p", "480p", "360p"]
  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2]
  const baseUrl = "https://api.streamhivex.icu"

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
      
      // Verificar se o usuário assistiu a pelo menos 30 segundos ou 10% do vídeo
      if (!hasWatchRegistered && 
          ((video.currentTime > 30) || (video.duration && video.currentTime > video.duration * 0.1))) {
        sendWatchHistory()
      }
    }

    const handleLoadedMetadata = () => {
      setDuration(video.duration)
      
      // Recuperar o último tempo assistido
      try {
        const storageKey = `lastWatched_${contentId}`
        const savedTime = localStorage.getItem(storageKey)
        if (savedTime) {
          const parsedTime = parseFloat(savedTime)
          // Só aplicar se for menos que 95% do vídeo
          if (parsedTime < video.duration * 0.95) {
            video.currentTime = parsedTime
            setLastWatchedTime(parsedTime)
            setShowPreview(true)
            setTimeout(() => setShowPreview(false), 5000)
          }
        }
      } catch (error) {
        console.error("Erro ao recuperar o último tempo assistido:", error)
      }
    }

    const handleBuffering = () => {
      if (video.buffered.length > 0) {
        setBufferedTime(video.buffered.end(video.buffered.length - 1))
      }
    }

    const handleWaiting = () => {
      setIsBuffering(true)
    }

    const handlePlaying = () => {
      setIsBuffering(false)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      // Limpar o último tempo assistido quando o vídeo termina
      localStorage.removeItem(`lastWatched_${contentId}`)
    }

    video.addEventListener("timeupdate", handleTimeUpdate)
    video.addEventListener("loadedmetadata", handleLoadedMetadata)
    video.addEventListener("progress", handleBuffering)
    video.addEventListener("waiting", handleWaiting)
    video.addEventListener("playing", handlePlaying)
    video.addEventListener("ended", handleEnded)

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate)
      video.removeEventListener("loadedmetadata", handleLoadedMetadata)
      video.removeEventListener("progress", handleBuffering)
      video.removeEventListener("waiting", handleWaiting)
      video.removeEventListener("playing", handlePlaying)
      video.removeEventListener("ended", handleEnded)
    }
  }, [contentId, hasWatchRegistered])

  // Salvar o último tempo assistido a cada 5 segundos
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (videoRef.current && videoRef.current.currentTime > 0) {
        const storageKey = `lastWatched_${contentId}`
        localStorage.setItem(storageKey, videoRef.current.currentTime.toString())
      }
    }, 5000)

    return () => clearInterval(intervalId)
  }, [contentId])

  // Detectar mudança de orientação
  useEffect(() => {
    const handleOrientationChange = () => {
      const isLandscape = window.matchMedia("(orientation: landscape)").matches
      setIsLandscape(isLandscape)
      
      // Auto-fullscreen em dispositivos móveis quando muda para paisagem
      if (isLandscape && isMobile() && !document.fullscreenElement) {
        enterFullscreen()
      }
    }

    handleOrientationChange() // Verificar orientação inicial
    window.addEventListener("orientationchange", handleOrientationChange)
    window.addEventListener("resize", handleOrientationChange)

    return () => {
      window.removeEventListener("orientationchange", handleOrientationChange)
      window.removeEventListener("resize", handleOrientationChange)
    }
  }, [])

  // Detectar se está em tela cheia
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.play().catch((error) => {
        console.error("Erro ao reproduzir vídeo:", error)
        setIsPlaying(false)
      })
    } else {
      video.pause()
    }
  }, [isPlaying])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    
    video.volume = volume
    setIsMuted(volume === 0)
  }, [volume])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    
    video.muted = isMuted
    if (isMuted && volume !== 0) {
      setVolume(0)
    } else if (!isMuted && volume === 0) {
      setVolume(0.5)
    }
  }, [isMuted, volume])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    
    video.playbackRate = playbackSpeed
  }, [playbackSpeed])

  useEffect(() => {
    if (doubleTapDirection !== null) {
      const timer = setTimeout(() => {
        setDoubleTapDirection(null)
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [doubleTapDirection])

  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  }

  const enterFullscreen = () => {
    const player = playerRef.current
    if (!player) return
    
    if (player.requestFullscreen) {
      player.requestFullscreen()
    } else if ((player as any).webkitRequestFullscreen) {
      (player as any).webkitRequestFullscreen()
    } else if ((player as any).msRequestFullscreen) {
      (player as any).msRequestFullscreen()
    }
  }

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if ((document as any).webkitExitFullscreen) {
      (document as any).webkitExitFullscreen()
    } else if ((document as any).msExitFullscreen) {
      (document as any).msExitFullscreen()
    }
  }

  const sendWatchHistory = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        console.warn("Token não encontrado para enviar histórico de visualização")
        return
      }
      
      const res = await fetch(`${baseUrl}/api/watch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ conteudo_id: contentId })
      })
      
      if (!res.ok) {
        console.error("Erro ao enviar histórico de visualização")
      } else {
        console.log("Histórico de visualização registrado para o conteúdo id:", contentId)
        setHasWatchRegistered(true)
      }
    } catch (error) {
      console.error("Erro ao enviar histórico de visualização:", error)
    }
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      enterFullscreen()
    } else {
      exitFullscreen()
    }
  }

  const handleSeek = (value: number[]) => {
    const video = videoRef.current
    if (!video) return
    
    video.currentTime = value[0]
    setCurrentTime(value[0])
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0])
  }

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600)
    const minutes = Math.floor((time % 3600) / 60)
    const seconds = Math.floor(time % 60)
    
    if (hours > 0) {
      return `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
    }
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  const handleMouseMove = () => {
    setShowControls(true)
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying && !isDragging && !showSettings && !showInfo) {
        setShowControls(false)
      }
    }, 3000)
  }

  const skipForward = () => {
    const video = videoRef.current
    if (!video) return
    
    video.currentTime = Math.min(video.currentTime + 10, video.duration)
    setDoubleTapDirection("right")
  }

  const skipBackward = () => {
    const video = videoRef.current
    if (!video) return
    
    video.currentTime = Math.max(video.currentTime - 10, 0)
    setDoubleTapDirection("left")
  }

  const handleChangeQuality = (newQuality: string) => {
    setQuality(newQuality)
    // Normalmente, aqui você implementaria a lógica para mudar a qualidade
    // através de uma API de streaming adaptativo como HLS ou DASH
  }

  const handleChangeSpeed = (newSpeed: number) => {
    setPlaybackSpeed(newSpeed)
  }

  const continueWatching = () => {
    setShowPreview(false)
    setIsPlaying(true)
  }

  const startFromBeginning = () => {
    const video = videoRef.current
    if (!video) return
    
    video.currentTime = 0
    setCurrentTime(0)
    setIsPlaying(true)
    setShowPreview(false)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    // Detectar toque duplo
    const now = new Date().getTime()
    const touchX = e.touches[0].clientX
    const screenWidth = window.innerWidth
    
    if (touchX < screenWidth * 0.4) {
      skipBackward()
    } else if (touchX > screenWidth * 0.6) {
      skipForward()
    } else {
      togglePlay()
    }
  }

  const getProgressPercentage = (time: number) => {
    return duration > 0 ? (time / duration) * 100 : 0
  }

  const getQualityLabel = (quality: string) => {
    switch (quality) {
      case "1080p": return "Full HD"
      case "720p": return "HD"
      case "480p": return "SD"
      case "360p": return "Baixa"
      default: return "Automática"
    }
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
    // Implementar lógica para salvar nos favoritos
  }

  return (
    <motion.div
      ref={playerRef}
      className={`relative w-full ${isFullscreen ? "h-screen" : "h-[80vh]"} bg-black overflow-hidden`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
    >
      {/* Vídeo */}
      <video 
        ref={videoRef} 
        src={videoUrl} 
        className="w-full h-full object-contain" 
        onClick={togglePlay} 
        autoPlay
        playsInline
        />
        
        {/* Buffer e carregamento */}
        {isBuffering && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="h-16 w-16 rounded-full border-4 border-t-purple-500 border-r-purple-300 border-b-purple-200 border-l-transparent animate-spin" />
          </div>
        )}
        
        {/* Overlay de continuar assistindo */}
        {showPreview && lastWatchedTime > 0 && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
            <div className="max-w-md p-6 bg-gray-800/90 rounded-lg shadow-xl flex flex-col items-center">
              <h3 className="text-xl font-bold text-white mb-2">Continuar assistindo?</h3>
              <p className="text-gray-300 mb-4">Você assistiu até {formatTime(lastWatchedTime)}</p>
              <div className="flex gap-3">
                <Button 
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={continueWatching}
                >
                  Continuar
                </Button>
                <Button 
                  variant="outline" 
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  onClick={startFromBeginning}
                >
                  Reiniciar
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Título do vídeo e botão para voltar */}
        <div
          className={`absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black to-transparent transition-opacity duration-300 z-10 ${showControls ? "opacity-100" : "opacity-0"}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-black/30 rounded-full"
                onClick={onClose}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h3 className="text-xl font-bold text-white">{title}</h3>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className={`text-white hover:bg-black/30 rounded-full ${subtitles ? 'bg-purple-500/50' : ''}`}
                onClick={() => setSubtitles(!subtitles)}
              >
                <Subtitles className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-black/30 rounded-full"
                onClick={() => setShowInfo(!showInfo)}
              >
                <Info className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`text-white hover:bg-black/30 rounded-full ${isFavorite ? 'text-red-500' : ''}`}
                onClick={toggleFavorite}
              >
                <Heart className="h-5 w-5" fill={isFavorite ? "currentColor" : "none"} />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Controles centrais e indicadores de skip */}
        <div
          className={`absolute inset-0 flex items-center justify-center z-10 ${showControls || !isPlaying ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}
        >
          <div className="flex items-center gap-8">
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-full bg-black/30 hover:bg-black/50 text-white"
              onClick={skipBackward}
            >
              <SkipBack className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-20 w-20 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white"
              onClick={togglePlay}
            >
              {isPlaying ? <Pause className="h-10 w-10" /> : <Play className="h-10 w-10 ml-1" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-full bg-black/30 hover:bg-black/50 text-white"
              onClick={skipForward}
            >
              <SkipForward className="h-6 w-6" />
            </Button>
          </div>
        </div>
        
        {/* Indicador de avanço ou retrocesso rápido */}
        {doubleTapDirection && (
          <div className={`absolute top-1/2 ${doubleTapDirection === 'left' ? 'left-8' : 'right-8'} transform -translate-y-1/2 bg-black/60 rounded-full p-4 text-white`}>
            <div className="flex flex-col items-center justify-center">
              {doubleTapDirection === 'left' ? (
                <SkipBack className="h-10 w-10" />
              ) : (
                <SkipForward className="h-10 w-10" />
              )}
              <span className="text-sm font-bold mt-1">10s</span>
            </div>
          </div>
        )}
        
        {/* Controles inferiores */}
        <div
          className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 z-10 ${showControls ? "opacity-100" : "opacity-0"}`}
        >
          <div className="space-y-3">
            <div className="relative w-full h-1 group">
              {/* Buffer indicator */}
              <div 
                className="absolute h-full bg-white/30 rounded"
                style={{ width: `${getProgressPercentage(bufferedTime)}%` }}
              />
              {/* Progress bar */}
              <div 
                className="absolute h-full bg-purple-600 rounded"
                style={{ width: `${getProgressPercentage(currentTime)}%` }}
              />
              {/* Interactive slider */}
              <Slider
                value={[currentTime]}
                min={0}
                max={duration || 100}
                step={0.1}
                onValueChange={handleSeek}
                onValueCommit={() => {
                  setIsDragging(false)
                }}
                className="absolute inset-0 opacity-0 group-hover:opacity-100 cursor-pointer [&>span:first-child]:h-1 [&_[role=slider]]:bg-purple-500 [&_[role=slider]]:w-4 [&_[role=slider]]:h-4 [&_[role=slider]]:border-0 [&_[role=slider]]:opacity-0 group-hover:[&_[role=slider]]:opacity-100"
              />
              {/* Preview time pop-up (for future implementation) */}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full text-white hover:bg-white/10"
                  onClick={togglePlay}
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
                </Button>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full text-white hover:bg-white/10"
                    onClick={toggleMute}
                  >
                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </Button>
                  <div className="w-24 hidden sm:block">
                    <Slider
                      value={[volume]}
                      min={0}
                      max={1}
                      step={0.01}
                      onValueChange={handleVolumeChange}
                      className="[&>span:first-child]:h-1 [&>span:first-child]:bg-white/30 [&_[role=slider]]:bg-white [&_[role=slider]]:w-3 [&_[role=slider]]:h-3 [&_[role=slider]]:border-0"
                    />
                  </div>
                </div>
                <div className="text-sm text-gray-300">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full text-white hover:bg-white/10 hidden sm:flex"
                >
                  <Cast className="h-5 w-5" />
                </Button>
                {isMobile() && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full text-white hover:bg-white/10"
                  >
                    <RotateCw className="h-5 w-5" />
                  </Button>
                )}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-10 w-10 rounded-full text-white hover:bg-white/10"
                    >
                      <Settings className="h-5 w-5" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="bg-gray-900 border-gray-800 text-white w-56 p-0" side="top">
                    <div className="p-2">
                      <h4 className="font-medium text-sm mb-2">Qualidade</h4>
                      <div className="flex flex-col space-y-1">
                        {qualityOptions.map((q) => (
                          <Button
                            key={q}
                            variant="ghost"
                            className={`justify-start ${q === quality ? 'bg-purple-500/20 text-purple-300' : 'text-gray-300'}`}
                            onClick={() => handleChangeQuality(q)}
                          >
                            {getQualityLabel(q)}
                          </Button>
                        ))}
                      </div>
                      <div className="my-2 border-t border-gray-800"></div>
                      <h4 className="font-medium text-sm mb-2">Velocidade</h4>
                      <div className="flex flex-col space-y-1">
                        {speedOptions.map((s) => (
                          <Button
                            key={s}
                            variant="ghost"
                            className={`justify-start ${s === playbackSpeed ? 'bg-purple-500/20 text-purple-300' : 'text-gray-300'}`}
                            onClick={() => handleChangeSpeed(s)}
                          >
                            {s}x
                          </Button>
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full text-white hover:bg-white/10"
                  onClick={toggleFullscreen}
                >
                  {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Drawer para informações do conteúdo */}
        <Drawer open={showInfo} onOpenChange={setShowInfo}>
          <DrawerContent className="bg-gray-900 border-t-0 text-white max-h-[50vh]">
            <DrawerHeader>
              <DrawerTitle className="text-white text-xl">{title}</DrawerTitle>
            </DrawerHeader>
            <div className="p-4 pt-0">
              {thumbnailUrl && (
                <div className="mb-4 rounded-md overflow-hidden">
                  <img src={thumbnailUrl} alt={title} className="w-full object-cover aspect-video" />
                </div>
              )}
              <p className="text-gray-300 mb-4">{description || "Sem descrição disponível."}</p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 border-gray-700 text-gray-300 hover:bg-gray-800"
                  onClick={toggleFavorite}
                >
                  <Heart className="h-4 w-4" fill={isFavorite ? "currentColor" : "none"} />
                  {isFavorite ? "Favoritado" : "Adicionar aos favoritos"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  <Share2 className="h-4 w-4" />
                  Compartilhar
                </Button>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
        
        {/* Legenda (para futura implementação) */}
        {subtitles && (
          <div className="absolute bottom-24 left-0 right-0 flex justify-center pointer-events-none">
            <div className="bg-black/70 px-4 py-2 rounded-md max-w-md text-center">
              <p className="text-white font-medium">Exemplo de legenda</p>
            </div>
          </div>
        )}
        </motion.div>
        )}