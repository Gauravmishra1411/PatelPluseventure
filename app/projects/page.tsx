"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import Footer from "@/components/footer"
import MobileBottomNav from "@/components/mobile-bottom-nav"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { db } from "@/lib/firebase"
import { collection, onSnapshot } from "firebase/firestore"
import { toast } from "sonner"
import Link from "next/link"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Project {
  id: string
  title: string
  tagline: string
  mainImage?: string
  category: string
  tags: string[]
  link?: string
  description?: string
  order?: number
  createdAt?: any
}

const expertiseItems = [
  { emoji: "🏛️", title: "Government Tender Projects", desc: "Municipal, state & central contract execution." },
  { emoji: "🏢", title: "Private Sector Projects", desc: "Commercial & industrial turnkey solutions." },
  { emoji: "💻", title: "IT & Software Development", desc: "Web, mobile, software & cloud solutions." },
  { emoji: "📋", title: "Project Planning & Management", desc: "Strategic workflows & milestone tracking." },
  { emoji: "⚙️", title: "Quality Assurance & Compliance", desc: "Strict quality benchmarks & safety standards." },
  { emoji: "🤝", title: "Post-Project Support & Maintenance", desc: "Long-term operational & maintenance support." },
]

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
  })

  useEffect(() => {
    const q = collection(db, "projects")
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot: any) => {
        const projectsData: Project[] = []
        querySnapshot.forEach((doc: any) => {
          projectsData.push({ id: doc.id, ...doc.data() } as Project)
        })
        projectsData.sort((a, b) => {
          if (a.order !== undefined && b.order !== undefined) return a.order - b.order
          const timeA = a.createdAt?.toMillis?.() || (a.createdAt as any)?.seconds * 1000 || 0
          const timeB = b.createdAt?.toMillis?.() || (b.createdAt as any)?.seconds * 1000 || 0
          return timeB - timeA
        })
        setProjects(projectsData)
        setLoading(false)
      },
      (error: any) => {
        console.error("Error fetching projects:", error)
        toast.error("Failed to load projects.")
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (!emblaApi || loading) return
    const interval = setInterval(() => {
      emblaApi.scrollNext()
    }, 5000)
    return () => clearInterval(interval)
  }, [emblaApi, loading])

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "linear-gradient(135deg, #FFF7EB 0%, #FFE3C2 100%)" }}>
      {/* ── Background Blobs & Keyframes ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-5%] left-[-5%] w-[500px] h-[500px] bg-[#FFA800]/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[450px] h-[450px] bg-[#FFA800]/15 rounded-full blur-[110px]" />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes rotateBorder {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
      ` }} />

      <main className="pt-20 relative z-10">
        {/* Header & Overview Section */}
        <section className="pt-8 pb-12 relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-[#111111] leading-tight">
                Our <span className="text-[#FFA800]" style={{ textShadow: "0 0 40px rgba(255,168,0,0.3)" }}>Projects</span>
              </h1>
            </motion.div>

            {/* 2-Column Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Left Column Text */}
              <motion.div
                className="lg:col-span-6 space-y-5"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="inline-block px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FFA800]/15 border border-[#FFA800]/30 text-[#B87A00]">
                  Project Execution
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#111111] leading-tight">
                  Building Success Through{" "}
                  <span className="text-[#FFA800]">Reliable Project Execution</span>
                </h2>
                <p className="text-base sm:text-lg text-[#2d2d2d] leading-relaxed font-medium">
                  Patel Pulse Ventures delivers high-quality solutions across Government, Private, and IT sectors. Our expertise spans infrastructure development, tender-based projects, software solutions, digital transformation, and business services. We follow a structured approach that emphasizes strategic planning, transparent communication, quality execution, and on-time delivery. Every project is managed with professionalism, innovation, and a commitment to exceeding client expectations.
                </p>
              </motion.div>

              {/* Right Column Expertise */}
              <motion.div
                className="lg:col-span-6"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <div className="bg-[#171717] p-6 sm:p-7 rounded-3xl border border-[#FFA800]/25 shadow-2xl relative overflow-hidden">
                  <div className="mb-5 border-b border-white/10 pb-3">
                    <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
                      <span>Our Expertise Includes:</span>
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FFA800] animate-ping" />
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {expertiseItems.map((item) => (
                      <div
                        key={item.title}
                        className="group p-3 rounded-xl bg-white/[0.05] border border-white/10 hover:border-[#FFA800]/50 transition-all duration-300 flex items-start gap-3"
                      >
                        <div className="w-9 h-9 rounded-lg bg-[#FFA800]/15 border border-[#FFA800]/30 flex items-center justify-center flex-shrink-0 text-base">
                          {item.emoji}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#FFA800] transition-colors leading-snug">
                            {item.title}
                          </h4>
                          <p className="text-[11px] text-gray-400 mt-0.5 leading-tight line-clamp-2">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Projects Slider (4 in a row on LG, rotating cards, Left/Right scroll buttons) ── */}
        <section className="py-6 pb-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#111111]">
                Active & Featured <span className="text-[#FFA800]" style={{ textShadow: "0 0 30px rgba(255,168,0,0.3)" }}>Projects</span>
              </h2>
            </div>

            <div className="relative">
              {loading ? (
                <div className="text-center text-gray-700 py-16 font-medium text-lg">Loading projects...</div>
              ) : (
                <div className="overflow-hidden" ref={emblaRef}>
                  <div className="flex -ml-5">
                    {projects.map((project, index) => {
                      const projectUrl = (project.link && project.link !== '#') ? project.link : `/projects/${project.id}`;
                      const isExternal = projectUrl.startsWith('http');
                      return (
                        <div key={project.id} className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 pl-5">
                          <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.08 }}
                            viewport={{ once: true }}
                            className="h-full"
                          >
                            {/* Rotating border card (identical to services page) */}
                            <div className="service-card-border group relative h-full rounded-[22px] overflow-hidden transition-all duration-[350ms] ease-out hover:-translate-y-1.5 flex flex-col">
                              {/* Rotating conic gradient */}
                              <div
                                className="absolute w-[200%] h-[200%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0"
                                style={{
                                  background: "conic-gradient(from 0deg at 50% 50%, #00c3ff 0%, #7b2ff7 25%, #00f2c3 55%, #ffe600 85%, #00c3ff 100%)",
                                  animation: "rotateBorder 5s linear infinite",
                                  filter: "blur(10px) brightness(1.25)",
                                }}
                              />
                              {/* Inner card mask */}
                              <div
                                className="relative z-[1] h-full rounded-[19px] flex flex-col flex-grow text-left transform scale-[1.01] transition-transform duration-300"
                                style={{
                                  margin: "3px",
                                  background: "rgba(23,23,23,0.95)",
                                  backdropFilter: "blur(12px)",
                                  boxShadow: "inset 0 0 20px rgba(255,168,0,0.05), 0 4px 30px rgba(0,0,0,0.3)",
                                }}
                              >
                                <div className="relative z-10 flex flex-col flex-grow p-5 sm:p-6">
                                  {/* Project Image */}
                                  {project.mainImage ? (
                                    <div className="relative w-full h-48 sm:h-52 rounded-[16px] overflow-hidden mb-4 border border-white/[0.06]">
                                      <Image
                                        src={project.mainImage}
                                        alt={`${project.title} image`}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                                      />
                                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/60 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-300" />
                                      <div className="absolute inset-0 bg-gradient-to-t from-[#FFA800]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>
                                  ) : null}

                                  {/* Title */}
                                  <h3 className="text-xl lg:text-[22px] font-bold text-white group-hover:text-[#FFA800] transition-colors duration-300 leading-snug mb-2.5">
                                    {project.title}
                                  </h3>

                                  {/* Tagline / Description */}
                                  <p className="text-[15px] leading-relaxed mb-3.5 flex-grow line-clamp-2" style={{ color: "#A8A8A8" }}>
                                    {project.tagline || project.description || project.category}
                                  </p>

                                  {/* Tags */}
                                  <div className="flex flex-wrap gap-1.5 mb-4">
                                    {project.tags && project.tags.length > 0 ? (
                                      project.tags.slice(0, 2).map((tag) => (
                                        <span key={tag} className="inline-block px-3 py-1 border border-[#FFA800]/30 text-[#FFA800] bg-[#FFA800]/10 rounded-full text-xs font-medium">
                                          {tag}
                                        </span>
                                      ))
                                    ) : (
                                      <span className="inline-block px-3 py-1 border border-[#FFA800]/30 text-[#FFA800] bg-[#FFA800]/10 rounded-full text-xs font-medium">
                                        Featured Project
                                      </span>
                                    )}
                                  </div>

                                  {/* Action Button */}
                                  <Link
                                    href={projectUrl}
                                    target={isExternal ? "_blank" : undefined}
                                    rel={isExternal ? "noopener noreferrer" : undefined}
                                    className="mt-auto block"
                                  >
                                    <button
                                      className="w-full py-3 px-5 rounded-xl font-semibold text-[15px] transition-all duration-300 cursor-pointer text-[#0A0A0A] bg-[#FFA800] border border-[#FFA800] hover:bg-[#E58F00] hover:shadow-[0_0_22px_rgba(255,168,0,0.35)]"
                                    >
                                      View Project Details →
                                    </button>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* ── Left & Right Navigation Scroll Buttons ── */}
              <Button
                onClick={scrollPrev}
                variant="outline"
                size="icon"
                className="absolute left-[-18px] top-1/2 -translate-y-1/2 w-11 h-11 rounded-full border-[#FFA800]/40 bg-[#111]/80 backdrop-blur-sm text-[#FFA800] hover:bg-[#FFA800] hover:text-[#0A0A0A] hover:border-[#FFA800] transition-all duration-300 shadow-lg disabled:opacity-40 disabled:cursor-not-allowed z-20"
                disabled={loading}
                aria-label="Previous project"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                onClick={scrollNext}
                variant="outline"
                size="icon"
                className="absolute right-[-18px] top-1/2 -translate-y-1/2 w-11 h-11 rounded-full border-[#FFA800]/40 bg-[#111]/80 backdrop-blur-sm text-[#FFA800] hover:bg-[#FFA800] hover:text-[#0A0A0A] hover:border-[#FFA800] transition-all duration-300 shadow-lg disabled:opacity-40 disabled:cursor-not-allowed z-20"
                disabled={loading}
                aria-label="Next project"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  )
}
