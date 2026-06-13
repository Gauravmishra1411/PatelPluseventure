"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { Logo } from "@/components/logo"
import { Code, Smartphone, Brain, Cloud, Shield, Zap } from "lucide-react"

const icons = [Zap, Code, Smartphone, Brain, Cloud, Shield]

export default function PreLoader() {
  const [progress, setProgress] = useState(0)
  const [currentIcon, setCurrentIcon] = useState(0)

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 2
      })
    }, 50)

    const iconInterval = setInterval(() => {
      setCurrentIcon((prev) => (prev + 1) % icons.length)
    }, 400)

    return () => {
      clearInterval(progressInterval)
      clearInterval(iconInterval)
    }
  }, [])

  const IconComponent = icons[currentIcon]

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-white via-gray-50 to-white dark:from-background dark:via-primary/20 dark:to-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-accent/10 to-transparent rounded-full blur-3xl animate-pulse opacity-50 dark:opacity-100" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-radial from-primary/10 to-transparent rounded-full blur-3xl animate-pulse opacity-50 dark:opacity-100" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-radial from-accent/10 to-transparent rounded-full blur-3xl animate-pulse opacity-50 dark:opacity-100" />
      </div>

      <div className="text-center relative z-10 px-4">
        {/* Logo */}
        <motion.div
          className="flex items-center justify-center mb-6 md:mb-8"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            animate={{
              filter: [
                "drop-shadow(0 0 8px rgba(142, 217, 104, 0.3))",
                "drop-shadow(0 0 20px rgba(142, 217, 104, 0.7))",
                "drop-shadow(0 0 8px rgba(142, 217, 104, 0.3))",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <Logo size="xl" linked={false} priority />
          </motion.div>
        </motion.div>

        {/* Animated Icon */}
        <motion.div
          className="mb-6 md:mb-8"
          key={currentIcon}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{ duration: 0.4 }}
        >
          <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 mx-auto bg-white dark:bg-gradient-to-r dark:from-background dark:to-primary rounded-full flex items-center justify-center border-2 border-gray-200 dark:border-accent/30 shadow-md dark:shadow-none">
            <IconComponent className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-accent" />
          </div>
        </motion.div>

        {/* Loading Text */}
        <motion.div
          className="mb-6 md:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-2">Loading Experience</h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Preparing cutting-edge solutions...</p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          className="w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="relative">
            <div className="w-full h-2 bg-gray-200 dark:bg-primary rounded-full overflow-hidden border border-gray-300 dark:border-accent/20">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <motion.div
              className="absolute -top-1 h-4 w-4 bg-gradient-to-r from-primary to-accent rounded-full shadow-lg"
              animate={{ left: `${progress}%` }}
              transition={{ duration: 0.1 }}
              style={{ marginLeft: "-8px" }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            <span>0%</span>
            <motion.span
              className="text-accent font-semibold"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
            >
              {progress}%
            </motion.span>
            <span>100%</span>
          </div>
        </motion.div>

        {/* Loading Messages */}
        <motion.div
          className="mt-6 h-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {progress < 30 && (
            <motion.p
              className="text-gray-500 dark:text-gray-400 text-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              Initializing systems...
            </motion.p>
          )}
          {progress >= 30 && progress < 60 && (
            <motion.p
              className="text-gray-500 dark:text-gray-400 text-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              Loading components...
            </motion.p>
          )}
          {progress >= 60 && progress < 90 && (
            <motion.p
              className="text-gray-500 dark:text-gray-400 text-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              Preparing interface...
            </motion.p>
          )}
          {progress >= 90 && (
            <motion.p
              className="text-accent text-sm font-semibold"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              Almost ready!
            </motion.p>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}
