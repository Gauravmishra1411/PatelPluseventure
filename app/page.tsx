"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Navbar from "@/components/navbar"
import PreLoader from "@/components/pre-loader"
import Hero from "@/components/hero"
import ServicesSlider from "@/components/services-slider"
import ProjectsSlider from "@/components/projects-slider"
import DevelopmentStages from "@/components/development-stages"

import About from "@/components/about"
import Team from "@/components/team"
import Counters from "@/components/counters"
import Contact from "@/components/contact"
import Footer from "@/components/footer"
import MobileBottomNav from "@/components/mobile-bottom-nav"
export default function Home() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setLoading(false)
    }, 2500)

    return () => {
      clearTimeout(loadingTimer)
    }
  }, [])

  if (loading) {
    return <PreLoader />
  }

  return (
    <div className="min-h-screen text-gray-900 dark:text-white overflow-x-hidden">
      <AnimatePresence>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="w-full">
          <main>
            <Hero />
            <ServicesSlider />
            <ProjectsSlider />
            <DevelopmentStages />

            <Counters />
            <About />
            <Team />
            <Contact />
          </main>
          <Footer />
          <MobileBottomNav />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
