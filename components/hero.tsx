
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Play, Zap, Code, Smartphone, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"
import { db } from "@/lib/firebase"
import { collection, onSnapshot } from "firebase/firestore"
import Link from "next/link"

const iconComponents: { [key: string]: React.ElementType } = {
  Zap, Code, Smartphone, Brain, Users: Zap, Award: Zap, Clock: Zap, Target: Zap, Check: Zap, Star: Zap, Plus: Zap, Percent: Zap
};


export default function Hero() {
  const [stats, setStats] = useState<any[]>([])

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "home_hero_stats"), (snapshot) => {
      setStats(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    });
    return () => unsub();
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-gray-50 to-white dark:from-[#05100a] dark:via-[#020617] dark:to-[#05100a] pt-12">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-accent/20 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-radial from-primary/40 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-radial from-accent/20 to-transparent rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Grid Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 dark:opacity-50"></div>

      {/* Floating Icons */}
      <div className="absolute inset-0 pointer-events-none">
        {[
          { Icon: Code, top: "20%", left: "10%", delay: 0 },
          { Icon: Smartphone, top: "30%", right: "15%", delay: 1 },
          { Icon: Brain, bottom: "25%", left: "15%", delay: 2 },
          { Icon: Zap, bottom: "20%", right: "10%", delay: 3 },
        ].map(({ Icon, delay, ...position }, index) => (
          <motion.div
            key={index}
            className="absolute w-12 h-12 text-[#8ED968]/20"
            style={position}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 180, 360],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 6,
              repeat: Number.POSITIVE_INFINITY,
              delay: delay,
              ease: "easeInOut",
            }}
          >
            <Icon className="w-full h-full" />
          </motion.div>
        ))}
      </div>

      <div className="relative z-20 pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="space-y-8"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center px-4 py-2 bg-white dark:bg-primary/30 border border-gray-200 dark:border-accent/30 rounded-full text-sm text-primary dark:text-accent font-medium shadow-sm dark:shadow-none"
          >
            <Zap className="w-4 h-4 mr-2" />
            Transforming Ideas into Digital Reality
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-center lg:gap-4">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Patel
              </span>
              <span className="text-gray-900 dark:text-white lg:mt-0">Pulse Ventures</span>
            </div>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            We craft cutting-edge digital experiences with{" "}
            <span className="text-accent font-semibold">AI-powered solutions</span>,{" "}
            <span className="text-accent font-semibold">modern web technologies</span>, and{" "}
            <span className="text-accent font-semibold">innovative design</span> that drive business growth and user
            engagement.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <Link href="/contact">
              <Button
                size="lg"
                className="group bg-white dark:bg-primary/20 text-gray-900 dark:text-white font-semibold px-8 py-4 rounded-full border border-gray-200 dark:border-accent/20 hover:bg-gray-50 dark:hover:bg-primary/30 transition-all duration-300 transform hover:scale-105"
              >
                Start Your Project
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="bg-white/50 dark:bg-background/50 p-2 rounded-2xl flex items-center gap-4 backdrop-blur-md border border-gray-200 dark:border-accent/10 shadow-lg dark:shadow-none max-w-xs"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.id}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 + index * 0.1 }}
              >
                <div className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-accent transition-colors">
                  {stat.value}
                </div>
                <div className="text-gray-500 dark:text-gray-400 text-sm">{stat.title}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.5 }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-gray-300 dark:border-[#8ED968]/30 rounded-full flex justify-center"
          animate={{ borderColor: ["rgba(142, 217, 104, 0.3)", "rgba(142, 217, 104, 0.8)", "rgba(142, 217, 104, 0.3)"] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          <motion.div
            className="w-1 h-3 bg-[#8ED968] rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
