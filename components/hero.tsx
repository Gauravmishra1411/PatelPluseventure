
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Play, Zap, Axe, ChefHat, Armchair, ParkingCircleOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { db } from "@/lib/firebase"
import { collection, onSnapshot } from "firebase/firestore"
import Link from "next/link"

const iconComponents: { [key: string]: React.ElementType } = {
  Zap, Axe, ChefHat, Armchair, ParkingCircleOff, Users: Zap, Award: Zap, Clock: Zap, Target: Zap, Check: Zap, Star: Zap, Plus: Zap, Percent: Zap
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
    <section id="home" className="relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-gray-50 to-white dark:from-[#0A0F1C] dark:via-[#0D1829] dark:to-[#0A0F1C] pt-20 pb-10 md:pt-32 md:pb-12">
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
          { Icon: Axe, top: "20%", left: "10%", delay: 0 },
          { Icon: ChefHat, top: "30%", right: "15%", delay: 1 },
          { Icon: Armchair, bottom: "25%", left: "15%", delay: 2 },
          { Icon: ParkingCircleOff, bottom: "20%", right: "10%", delay: 3 },
        ].map(({ Icon, delay, ...position }, index) => (
          <motion.div
            key={index}
            className="absolute w-12 h-12 text-blue-500/20 dark:text-[#81f5fd]/20"
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
            className="inline-flex items-center px-5 py-2.5 bg-blue-50 dark:bg-[#81f5fd]/10 border border-blue-200 dark:border-[#81f5fd]/30 rounded-full text-sm text-blue-700 dark:text-[#81f5fd] font-medium shadow-sm dark:shadow-[0_0_20px_rgba(39,152,245,0.15)]"
          >
            <Zap className="w-4 h-4 mr-2 text-blue-600 dark:text-[#81f5fd]" />
            Excellence in Contracting & Services
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
                <span className="bg-gradient-to-r from-[#1565c0] via-[#81f5fd] to-[#1565c0] bg-clip-text text-transparent font-extrabold">
                  Patel
                </span>
                <span className="bg-gradient-to-r from-[#1565c0] via-[#81f5fd] to-[#1565c0] bg-clip-text text-transparent font-extrabold">
                  Pulse
                </span>
              </div>
              <span className="bg-gradient-to-r from-[#1565c0] via-[#81f5fd] to-[#1565c0] bg-clip-text text-transparent font-bold">Ventures</span>
            </div>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="mt-10 text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            We undertake{" "}
            <span className="text-[#81f5fd] font-semibold">Government and Private Tenders</span>{" "}
            across various sectors, including{" "}
            <span className="text-[#81f5fd] font-semibold">Manpower Supply, Housekeeping, Horticulture, Facility Management, and Maintenance Services</span>.
            We source opportunities through GeM, CPPP, e-Procurement, e-Tender portals, and direct client engagement, 
            ensuring timely execution, quality service, and complete compliance for every project.
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
                className="group bg-gradient-to-r from-[#1565c0] to-[#81f5fd] dark:from-[#81f5fd] dark:to-[#64B5F6] text-white font-bold px-8 py-6 rounded-full border-0 hover:shadow-lg dark:hover:shadow-[0_0_30px_rgba(39,152,245,0.5)] transition-all duration-300 transform hover:scale-105"
              >
                Contact Us
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          {stats.length > 0 && (
            <motion.div
              className="bg-white/70 dark:bg-[#0D1829]/80 backdrop-blur-xl p-5 md:p-6 rounded-2xl flex items-center justify-center gap-6 md:gap-8 border border-gray-200 dark:border-[#81f5fd]/20 shadow-lg dark:shadow-[0_0_30px_rgba(39,152,245,0.1)] max-w-4xl mx-auto mt-8"
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
                  <div className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#1565c0] via-[#81f5fd] to-[#1565c0] dark:from-[#81f5fd] dark:to-[#64B5F6] bg-clip-text text-transparent mb-1">
                    {stat.number}{stat.suffix || ''}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 text-xs md:text-sm font-medium">{stat.title}</div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section >
  )
}
