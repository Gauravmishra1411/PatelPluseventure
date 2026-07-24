
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
    const unsub = onSnapshot(collection(db, "home_hero_stats"), (snapshot: any) => {
      setStats(snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })))
    });
    return () => unsub();
  }, [])

  return (
    <section id="home" className="relative flex items-center justify-center overflow-hidden bg-[#0B0B0B] text-white pt-20 pb-10 md:pt-32 md:pb-12 border-b border-neutral-900">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-full h-full bg-[url('/grid.svg')] opacity-[0.05] invert" />
        
        {/* Spotlights and Ambient Glow */}
        <div className="absolute top-[-10%] right-[10%] w-[500px] h-[500px] bg-[#FFA800]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-[#FFA800]/5 rounded-full blur-[100px]" />

        {/* Large 3D Metallic Abstract Glowing Rings (Right Side) */}
        <div className="absolute right-[-10%] top-[10%] w-[480px] h-[480px] rounded-full border-[28px] border-t-[#FFA800] border-r-[#FFA800]/70 border-b-[#FFD166]/30 border-l-transparent opacity-25 blur-[2px] rotate-[45deg] animate-[spin_40s_linear_infinite] hidden lg:block pointer-events-none drop-shadow-[0_0_55px_rgba(255,168,0,0.35)]" />
        <div className="absolute right-[5%] bottom-[12%] w-[320px] h-[320px] rounded-full border-[18px] border-t-[#FFD166]/80 border-l-[#FFA800]/40 border-r-transparent border-b-transparent opacity-15 blur-[1px] rotate-[-30deg] animate-[spin_65s_linear_infinite] hidden lg:block pointer-events-none drop-shadow-[0_0_35px_rgba(255,168,0,0.25)]" />

        {/* Floating Subtle Particles */}
        <div className="absolute top-[25%] left-[20%] w-2 h-2 bg-[#FFA800] rounded-full opacity-40 blur-[1px] animate-pulse" />
        <div className="absolute top-[55%] left-[10%] w-1.5 h-1.5 bg-[#FFD166] rounded-full opacity-30 blur-[0.5px]" />
        <div className="absolute bottom-[25%] right-[25%] w-3 h-3 bg-[#FFA800] rounded-full opacity-50 blur-[1.5px] animate-pulse" />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Live Content */}
          <div className="lg:col-span-7 text-left space-y-6 md:space-y-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center px-5 py-2.5 bg-[#FFA800]/8 border border-[#FFA800] rounded-full text-sm text-[#FFA800] font-semibold shadow-sm"
            >
              <Zap className="w-4 h-4 mr-2 text-[#FFA800]" />
              Excellence in Contracting & Services
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              <span className="text-[#FFFFFF]">Patel </span>
              <span className="text-[#FFA800]">Pulse </span>
              <span className="text-[#FFFFFF]">Ventures</span>
            </motion.h1>

            {/* Subtitle / Description */}
            <motion.p
              className="mt-6 text-xl md:text-2xl text-[#F5F5F5] leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              We undertake{" "}
              <span className="text-[#FFA800] font-bold">Government and Private Tenders across various sectors, including IT Services & Software Development,</span>{" "}
              across various sectors, including{" "}
              <span className="text-[#FFA800] font-bold">Manpower Supply, Housekeeping, Horticulture, Facility Management, and Maintenance Services.</span>{" "}
              We source opportunities through GeM, CPPP, e-Procurement, e-Tender portals, and direct client engagement, 
              ensuring timely execution, quality service, and complete compliance for every project.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              <Link href="/contact">
                <Button
                  size="lg"
                  className="group bg-[#FFA800] hover:bg-[#FFD166] text-[#0B0B0B] font-bold px-8 py-6 rounded-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Contact Us
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            {stats.length > 0 && (
              <motion.div
                className="bg-[#151515]/95 backdrop-blur-xl p-5 md:p-6 rounded-2xl flex items-center justify-center gap-6 md:gap-8 border border-white/10 shadow-2xl max-w-4xl mt-8"
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
                    <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#FFA800] mb-1">
                      {stat.number}{stat.suffix || ''}
                    </div>
                    <div className="text-gray-300 text-xs md:text-sm font-medium">{stat.title}</div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Right Column: 3D Emblem Image & Interactive Floating Icons */}
          <div className="lg:col-span-5 hidden lg:block relative h-[520px] w-full">
            {/* Central 3D Logo Emblem Container */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1 }}
                className="relative w-[400px] h-[400px] rounded-full overflow-hidden border-2 border-[#FFA800]/30 flex items-center justify-center"
                style={{
                  background: "radial-gradient(circle at 40% 40%, #1a1a1a 0%, #0B0B0B 70%, #050505 100%)",
                  boxShadow: "0 0 80px rgba(255,168,0,0.25), 0 0 160px rgba(255,168,0,0.1), inset 0 0 60px rgba(255,168,0,0.05)"
                }}
              >
                {/* Inner glow ring */}
                <div className="absolute inset-[3px] rounded-full border border-[#FFA800]/10" />
                <motion.img
                  src="/fabicons.png"
                  alt="Patel Pulse Ventures Logo"
                  className="w-[95%] h-[95%] object-contain drop-shadow-[0_0_30px_rgba(255,168,0,0.4)] relative z-10"
                  animate={{ scale: [1, 1.04, 1] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                />
              </motion.div>
            </div>

            {/* Interactive Floating Cubes — Government & IT Services */}

            {/* 📄 Government Tender (Top-Left) — Document + Seal */}
            <motion.div
              className="absolute top-[5%] left-[10%] w-20 h-20 bg-gradient-to-br from-[#1c1c1c] to-[#0d0d0d] border border-white/10 rounded-2xl flex items-center justify-center text-[#FFA800] shadow-2xl cursor-pointer backdrop-blur-sm"
              animate={{ y: [0, -12, 0], rotate: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 4.2, ease: "easeInOut" }}
              whileHover={{ scale: 1.18, rotate: 10, borderColor: "#FFA800", boxShadow: "0 0 25px rgba(255,168,0,0.4)" }}
              title="Government Tender"
            >
              <svg className="w-9 h-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                <circle cx="17" cy="19" r="3" fill="currentColor" opacity="0.3"/><path d="M16.5 18.5l1 1"/>
              </svg>
            </motion.div>

            {/* 🏛️ Government Procurement (Bottom-Left) — Government Building */}
            <motion.div
              className="absolute bottom-[12%] left-[3%] w-20 h-20 bg-gradient-to-br from-[#1c1c1c] to-[#0d0d0d] border border-white/10 rounded-2xl flex items-center justify-center text-[#FFA800] shadow-2xl cursor-pointer backdrop-blur-sm"
              animate={{ y: [0, 14, 0], rotate: [0, -7, 0] }}
              transition={{ repeat: Infinity, duration: 4.8, ease: "easeInOut", delay: 0.6 }}
              whileHover={{ scale: 1.18, rotate: -10, borderColor: "#FFA800", boxShadow: "0 0 25px rgba(255,168,0,0.4)" }}
              title="Government Procurement"
            >
              <svg className="w-9 h-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><path d="M9 21v-4h6v4"/><line x1="9" y1="10" x2="9" y2="10.01"/><line x1="15" y1="10" x2="15" y2="10.01"/><line x1="9" y1="14" x2="9" y2="14.01"/><line x1="15" y1="14" x2="15" y2="14.01"/>
              </svg>
            </motion.div>

            {/* 💻 IT Solutions (Top-Right) — Code + Monitor */}
            <motion.div
              className="absolute top-[3%] right-[8%] w-20 h-20 bg-gradient-to-br from-[#1c1c1c] to-[#0d0d0d] border border-white/10 rounded-2xl flex items-center justify-center text-[#FFA800] shadow-2xl cursor-pointer backdrop-blur-sm"
              animate={{ y: [0, -10, 0], rotate: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.3 }}
              whileHover={{ scale: 1.18, rotate: 12, borderColor: "#FFA800", boxShadow: "0 0 25px rgba(255,168,0,0.4)" }}
              title="IT Solutions"
            >
              <svg className="w-9 h-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
                <polyline points="9 8 7 10 9 12"/><polyline points="15 8 17 10 15 12"/>
              </svg>
            </motion.div>

            {/* 🌐 Website Development (Mid-Right) — Globe + Browser */}
            <motion.div
              className="absolute top-[42%] right-[-6%] w-20 h-20 bg-gradient-to-br from-[#1c1c1c] to-[#0d0d0d] border border-white/10 rounded-2xl flex items-center justify-center text-[#FFA800] shadow-2xl cursor-pointer backdrop-blur-sm"
              animate={{ y: [0, 12, 0], rotate: [0, -9, 0] }}
              transition={{ repeat: Infinity, duration: 5.2, ease: "easeInOut", delay: 1 }}
              whileHover={{ scale: 1.18, rotate: -12, borderColor: "#FFA800", boxShadow: "0 0 25px rgba(255,168,0,0.4)" }}
              title="Website Development"
            >
              <svg className="w-9 h-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>
              </svg>
            </motion.div>

            {/* 🛡️ Cybersecurity (Bottom-Right) — Shield + Lock */}
            <motion.div
              className="absolute bottom-[8%] right-[12%] w-20 h-20 bg-gradient-to-br from-[#1c1c1c] to-[#0d0d0d] border border-white/10 rounded-2xl flex items-center justify-center text-[#FFA800] shadow-2xl cursor-pointer backdrop-blur-sm"
              animate={{ y: [0, -11, 0], rotate: [0, 9, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 1.4 }}
              whileHover={{ scale: 1.18, rotate: 14, borderColor: "#FFA800", boxShadow: "0 0 25px rgba(255,168,0,0.4)" }}
              title="Cybersecurity"
            >
              <svg className="w-9 h-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <rect x="9" y="10" width="6" height="5" rx="1"/><path d="M10 10V8a2 2 0 1 1 4 0v2"/>
              </svg>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}
