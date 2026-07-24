"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Landmark, Building2, Laptop, ClipboardCheck, ShieldCheck, Handshake, CheckCircle2, Sparkles } from 'lucide-react'

const expertiseItems = [
  {
    icon: Landmark,
    title: "Government Tender Projects",
    description: "End-to-end execution of municipal, state & central tender contracts.",
    emoji: "🏛️",
  },
  {
    icon: Building2,
    title: "Private Sector Projects",
    description: "Turnkey commercial, industrial & private enterprise solutions.",
    emoji: "🏢",
  },
  {
    icon: Laptop,
    title: "IT & Software Development",
    description: "Custom software, web apps, mobile solutions & cloud infrastructure.",
    emoji: "💻",
  },
  {
    icon: ClipboardCheck,
    title: "Project Planning & Management",
    description: "Structured workflows, milestone tracking & transparent communication.",
    emoji: "📋",
  },
  {
    icon: ShieldCheck,
    title: "Quality Assurance & Compliance",
    description: "Strict quality benchmarks, safety protocols & regulatory standards.",
    emoji: "⚙️",
  },
  {
    icon: Handshake,
    title: "Post-Project Support & Maintenance",
    description: "Long-term operational support, maintenance & dedicated assistance.",
    emoji: "🤝",
  },
]

export default function DevelopmentStages() {
  return (
    <section
      id="tenders"
      className="py-16 md:py-24 relative overflow-hidden bg-[#0B101D] text-white border-b border-white/10"
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slowPulse {
          0%, 100% { opacity: 0.25; transform: scale(1); }
          50% { opacity: 0.45; transform: scale(1.06); }
        }
        .animate-slow-pulse {
          animation: slowPulse 12s ease-in-out infinite;
        }
      ` }} />

      {/* Ultra-soft ambient slow glowing accents */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-15%] left-[-10%] w-[600px] h-[600px] bg-[#FFA800]/12 rounded-full blur-[140px] animate-slow-pulse" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[600px] h-[600px] bg-[#3B82F6]/12 rounded-full blur-[140px] animate-slow-pulse" style={{ animationDelay: '6s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Column: Text */}
          <motion.div
            className="lg:col-span-6 space-y-6"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#FFA800]/20 border border-[#FFA800]/40 text-[#FFA800]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Reliable Project Execution</span>
            </div>

            {/* Main Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-[1.15] tracking-tight">
              Building Success Through{" "}
              <span className="text-[#FFA800] underline decoration-[#FFA800]/40 underline-offset-8">
                Reliable Project Execution
              </span>
            </h2>

            {/* Paragraph Text */}
            <p className="text-base sm:text-lg text-gray-200 leading-relaxed font-normal">
              Patel Pulse Ventures delivers high-quality solutions across Government, Private, and IT sectors. Our expertise spans infrastructure development, tender-based projects, software solutions, digital transformation, and business services. We follow a structured approach that emphasizes strategic planning, transparent communication, quality execution, and on-time delivery. Every project is managed with professionalism, innovation, and a commitment to exceeding client expectations.
            </p>

            {/* Value Highlights */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-2.5 text-sm font-medium text-white">
                <CheckCircle2 className="w-5 h-5 text-[#FFA800] flex-shrink-0" />
                <span>On-Time Delivery</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm font-medium text-white">
                <CheckCircle2 className="w-5 h-5 text-[#FFA800] flex-shrink-0" />
                <span>Transparent Communication</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm font-medium text-white">
                <CheckCircle2 className="w-5 h-5 text-[#FFA800] flex-shrink-0" />
                <span>Quality Execution</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm font-medium text-white">
                <CheckCircle2 className="w-5 h-5 text-[#FFA800] flex-shrink-0" />
                <span>Structured Management</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Our Expertise Includes */}
          <motion.div
            className="lg:col-span-6"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="bg-[#0B1329]/90 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-amber-500/30 shadow-2xl relative overflow-hidden">
              <div className="mb-6">
                <h3 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                  Our Expertise Includes
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFA800] inline-block animate-ping" />
                </h3>
                <div className="w-20 h-1 bg-[#FFA800] rounded-full mt-2" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {expertiseItems.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                    viewport={{ once: true }}
                    className="group p-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 hover:border-[#FFA800]/60 transition-all duration-300 hover:shadow-[0_4px_20px_rgba(255,168,0,0.2)] flex items-start gap-3"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#FFA800]/20 border border-[#FFA800]/30 flex items-center justify-center flex-shrink-0 text-lg group-hover:scale-110 transition-transform duration-300">
                      {item.emoji}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-bold text-white group-hover:text-[#FFA800] transition-colors leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-300 mt-1 leading-normal line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
