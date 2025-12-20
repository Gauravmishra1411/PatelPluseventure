
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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-gray-50 to-white dark:from-[#0A0F1C] dark:via-[#0D1829] dark:to-[#0A0F1C] pt-20 pb-24">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-full h-full bg-[url('/grid.svg')] opacity-[0.03] dark:opacity-[0.1]" />
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl opacity-50 dark:opacity-100" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50 dark:opacity-100" />
      </div>

      {/* Grid Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-5"></div>

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
            className="absolute w-12 h-12 text-green-500/20 dark:text-[#8ED968]/20"
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

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-8">
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="space-y-6 md:space-y-8"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center px-5 py-2.5 bg-green-50 dark:bg-[#8ED968]/10 border border-green-200 dark:border-[#8ED968]/30 rounded-full text-sm text-green-700 dark:text-[#8ED968] font-medium shadow-sm dark:shadow-[0_0_20px_rgba(142,217,104,0.15)]"
          >
            <Zap className="w-4 h-4 mr-2 text-green-600 dark:text-[#8ED968]" />
            Transforming Ideas into Digital Reality
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mt-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-center lg:gap-4">
              <div className="flex flex-wrap items-center justify-center gap-2 lg:gap-4">
                <span className="bg-gradient-to-r from-[#1A532A] via-[#8ED968] to-[#1A532A] bg-clip-text text-transparent font-extrabold">
                  Patel
                </span>
                <span className="bg-gradient-to-r from-[#1A532A] via-[#8ED968] to-[#1A532A] bg-clip-text text-transparent font-extrabold">
                  Pulse
                </span>
              </div>
              <span className="bg-gradient-to-r from-[#1A532A] via-[#8ED968] to-[#1A532A] bg-clip-text text-transparent font-bold">Ventures</span>
            </div>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-lg md:text-xl lg:text-2xl text-gray-700 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed px-4 mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            We craft cutting-edge digital experiences with{" "}
            <span className="text-[#8ED968] font-semibold">AI-powered solutions</span>,{" "}
            <span className="text-[#8ED968] font-semibold">modern web technologies</span>, and{" "}
            <span className="text-[#8ED968] font-semibold">innovative design</span> that drive business growth and user
            engagement.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <Link href="/contact">
              <Button
                size="lg"
                className="group bg-gradient-to-r from-[#1A532A] to-[#8ED968] dark:from-[#8ED968] dark:to-[#00FF88] text-white dark:text-black font-bold px-8 py-6 rounded-full border-0 hover:shadow-lg dark:hover:shadow-[0_0_30px_rgba(142,217,104,0.5)] transition-all duration-300 transform hover:scale-105"
              >
                Start Your Project
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          {stats.length > 0 && (
            <motion.div
              className="bg-white/70 dark:bg-[#0D1829]/80 backdrop-blur-xl p-5 md:p-6 rounded-2xl flex items-center justify-center gap-6 md:gap-8 border border-gray-200 dark:border-[#8ED968]/20 shadow-lg dark:shadow-[0_0_30px_rgba(142,217,104,0.1)] max-w-4xl mx-auto mt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.id}
                  className="text-center flex-1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.2 + index * 0.1 }}
                >
                  <div className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#1A532A] via-[#8ED968] to-[#1A532A] dark:from-[#8ED968] dark:to-[#00FF88] bg-clip-text text-transparent mb-1">
                    {stat.number}{stat.suffix || ''}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 text-xs md:text-sm font-medium">{stat.title}</div>
                </motion.div>
              ))}
            </motion.div>
          )}
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
    </section >
  )
}
