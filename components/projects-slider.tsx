
"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import useEmblaCarousel from "embla-carousel-react"
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Github,
  Calendar,
  Users,
  Check,
  Star,
  X,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { db } from "@/lib/firebase"
import { collection, onSnapshot, query, orderBy, Timestamp } from "firebase/firestore"
import { toast } from "sonner"
import Link from "next/link"

interface Project {
  id: string
  title: string
  description: string
  mainImage?: string
  category: string
  technologies: string[]
  status: string
  budget?: string
  deadline?: Timestamp
  startDate?: Timestamp
  liveLink?: string
  githubLink?: string
  client?: string
  features?: string[]
  results?: string
  duration?: string
  team?: string
  color?: string
  link?: string
  order?: number
  createdAt?: any
}


export default function ProjectsSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
  })

  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = collection(db, "projects")
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot: any) => {
        const projectsData: Project[] = []
        querySnapshot.forEach((doc: any) => {
          const data = doc.data()
          projectsData.push({
            id: doc.id,
            title: data.title || '',
            description: data.description || '',
            category: data.category || '',
            technologies: Array.isArray(data.technologies) ? data.technologies : [],
            status: data.status || 'Planning',
            mainImage: data.mainImage || '',
            ...data
          } as Project)
        })
        projectsData.sort((a, b) => {
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

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])


  useEffect(() => {
    if (!emblaApi || loading) return

    const interval = setInterval(() => {
      emblaApi.scrollNext()
    }, 6000)

    return () => clearInterval(interval)
  }, [emblaApi, loading])


  return (
    <section id="projects" className="py-6 md:py-12 lg:py-20 bg-[#FFFBF2] dark:bg-[#181510] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-[#FFA800]/5 rounded-full blur-3xl opacity-50 dark:opacity-100" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#FFA800]/5 rounded-full blur-3xl opacity-50 dark:opacity-100" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-[#FFA800]/5 rounded-full blur-3xl opacity-50 dark:opacity-100" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#111111] dark:text-white">
            Featured <span className="text-[#FFA800]">Projects & Tenders</span>
          </h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto font-medium">
            Explore our track record of successful construction, infrastructure, and IT projects
          </p>
        </motion.div>

        {/* Projects Slider */}
        <div className="relative">
          {loading ? (
            <div className="flex justify-center items-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFA800]"></div>
            </div>
          ) : (
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex -ml-4">
                {projects.map((project) => {
                  return (
                    <div
                      key={project.id}
                      className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 pl-4"
                    >
                      <Link
                        href={`/projects/${project.id}`}
                        passHref
                        className="block h-full cursor-pointer"
                      >
                        <Card className="group relative overflow-hidden rounded-2xl h-[26rem] sm:h-[28rem] bg-[#171717] border border-[#FFA800]/20 hover:border-[#FFA800]/60 shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,168,0,0.25)]">
                          <Image
                            src={project.mainImage || "/placeholder.svg?height=400&width=600"}
                            alt={project.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/50 to-transparent opacity-90" />
                          <div className="absolute inset-0 flex flex-col justify-end p-6 z-10 text-left">
                            <h3 className="text-xl font-bold text-white group-hover:text-[#FFA800] mb-2 leading-tight transition-colors duration-300">{project.title}</h3>
                            <p className="text-gray-300 text-sm mb-4 line-clamp-2">{project.description}</p>
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: 0.2 }}
                            >
                              <div
                                className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold h-10 px-4 py-2 w-full mt-auto bg-[#FFA800] text-[#0A0A0A] hover:bg-[#E58F00] hover:shadow-[0_0_20px_rgba(255,168,0,0.3)] transition-all duration-300`}
                              >
                                View Project →
                              </div>
                            </motion.div>
                          </div>
                        </Card>
                      </Link>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <button
            onClick={scrollPrev}
            aria-label="Previous tender"
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-12 w-12 h-12 bg-white/80 dark:bg-primary/80 backdrop-blur-sm border border-gray-200 dark:border-accent/20 rounded-full md:flex items-center justify-center text-accent hover:bg-accent/10 hover:border-accent/40 transition-all duration-300 z-10 hidden shadow-md dark:shadow-none"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={scrollNext}
            aria-label="Next tender"
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-12 w-12 h-12 bg-white/80 dark:bg-[#1565c0]/80 backdrop-blur-sm border border-gray-200 dark:border-[#81f5fd]/20 rounded-full md:flex items-center justify-center text-[#81f5fd] hover:bg-[#81f5fd]/10 hover:border-[#81f5fd]/40 transition-all duration-300 z-10 hidden shadow-md dark:shadow-none"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  )
}
