
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
  link?: string // Added link property
}


export default function ProjectsSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
  })

  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, "projects"), orderBy("createdAt", "desc"))
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const projectsData: Project[] = []
        querySnapshot.forEach((doc) => {
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
        setProjects(projectsData)
        setLoading(false)
      },
      (error) => {
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
    <section className="py-6 md:py-12 lg:py-20 bg-gradient-to-br from-white via-gray-50 to-white dark:from-background dark:via-primary/20 dark:to-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-radial from-accent/5 to-transparent rounded-full blur-3xl opacity-50 dark:opacity-100" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-radial from-primary/5 to-transparent rounded-full blur-3xl opacity-50 dark:opacity-100" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-radial from-accent/5 to-transparent rounded-full blur-3xl opacity-50 dark:opacity-100" />
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
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Featured Projects
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Explore our portfolio of successful digital transformations and innovative solutions
          </p>
        </motion.div>

        {/* Projects Slider */}
        <div className="relative">
          {loading ? (
            <div className="flex justify-center items-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF0080]"></div>
            </div>
          ) : (
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex -ml-4">
                {projects.map((project) => {
                  const projectUrl = (project.link && project.link !== '#') ? project.link : undefined;
                  const isExternal = projectUrl?.startsWith('http') ?? false;

                  return (
                    <div
                      key={project.id}
                      className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 pl-4"
                    >
                      <Link
                        href={projectUrl || '#'}
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noopener noreferrer" : undefined}
                        passHref
                        className="block h-full cursor-pointer"
                        onClick={(e) => {
                          if (!projectUrl) {
                            e.preventDefault();
                          }
                        }}
                      >
                        <Card className="group relative overflow-hidden rounded-2xl h-96 bg-white dark:bg-primary/30 border border-gray-200 dark:border-accent/20 shadow-sm dark:shadow-none transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
                          <Image
                            src={project.mainImage || "/placeholder.svg?height=400&width=600"}
                            alt={project.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                          <div className="absolute inset-0 flex flex-col justify-end p-6">
                            <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
                            <p className="text-gray-300 text-sm mb-4 line-clamp-2">{project.description}</p>
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: 0.2 }}
                            >
                              <div
                                className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 w-full mt-auto bg-gradient-to-r from-[#FF0080] to-[#D400FF] text-white hover:shadow-lg hover:shadow-[#FF0080]/25 transition-all duration-300`}
                              >
                                View Project
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
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-12 w-12 h-12 bg-white/80 dark:bg-primary/80 backdrop-blur-sm border border-gray-200 dark:border-accent/20 rounded-full md:flex items-center justify-center text-accent hover:bg-accent/10 hover:border-accent/40 transition-all duration-300 z-10 hidden shadow-md dark:shadow-none"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={scrollNext}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-12 w-12 h-12 bg-white/80 dark:bg-[#1A532A]/80 backdrop-blur-sm border border-gray-200 dark:border-[#8ED968]/20 rounded-full md:flex items-center justify-center text-[#8ED968] hover:bg-[#8ED968]/10 hover:border-[#8ED968]/40 transition-all duration-300 z-10 hidden shadow-md dark:shadow-none"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  )
}
