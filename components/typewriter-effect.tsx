"use client"

import { useEffect, useState } from "react"
import { motion, stagger, useAnimate } from "framer-motion"

interface TypewriterProps {
  words: {
    text: string
    className?: string
  }[]
  className?: string
  cursorClassName?: string
}

export const TypewriterEffect = ({ words, className = "", cursorClassName = "" }: TypewriterProps) => {
  const [scope, animate] = useAnimate()
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const word = words[currentWordIndex]

  useEffect(() => {
    const wordsLength = words.length

    const animateWords = async () => {
      await animate([
        [
          ".word",
          {
            opacity: 1,
            x: 0,
          },
          {
            duration: 0.2,
            delay: stagger(0.08),
            ease: "easeInOut",
          },
        ],
        [
          ".word",
          {
            opacity: 0,
            x: 10,
          },
          {
            duration: 0.2,
            delay: stagger(0.08),
            ease: "easeInOut",
          },
        ],
      ])

      setCurrentWordIndex((prev) => (prev + 1) % wordsLength)
    }

    animateWords()

    const interval = setInterval(() => {
      animateWords()
    }, 3000)

    return () => clearInterval(interval)
  }, [animate, words.length, currentWordIndex])

  const renderWords = () => {
    return (
      <div className="relative">
        <div className="absolute">
          {word.text.split("").map((char, index) => (
            <motion.span
              key={`${char}-${index}`}
              className={`word opacity-0 ${word.className || ""}`}
              initial={{ opacity: 0, x: 10 }}
            >
              {char}
            </motion.span>
          ))}
        </div>
        <div className="invisible">
          {word.text.split("").map((char, index) => (
            <span key={`${char}-${index}`} className={word.className || ""}>
              {char}
            </span>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div ref={scope} className={`inline-flex ${className}`}>
      {renderWords()}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.8,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
        className={`ml-1 inline-block h-full w-[4px] rounded-full bg-purple-500 ${cursorClassName}`}
      />
    </div>
  )
}

