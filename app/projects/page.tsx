
"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ExternalLink, Github, ArrowRight } from "lucide-react"
import Navbar from "@/components/navbar"
import Logo from "@/components/logo"
import Footer from "@/components/footer"
import MobileBottomNav from "@/components/mobile-bottom-nav"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { db } from "@/lib/firebase"
import { collection, onSnapshot, query, orderBy } from "firebase/firestore"
import { toast } from "sonner"
import Link from "next/link"

interface Project {
  id: string
  title: string
  tagline: string
  mainImage?: string
  category: string
  tags: string[]
  link?: string; // Added link
  description?: string; // Added description
}

const categories = ["All", "Web Development", "Web Application", "Mobile Development", "AI Development", "E-commerce", "Fullstack", "MERN", "Fintech", "Public Service", "Health & Fitness"]

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("All")

  useEffect(() => {
    const q = query(collection(db, "projects"), orderBy("order", "asc"))
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const projectsData: Project[] = []
        querySnapshot.forEach((doc) => {
          projectsData.push({ id: doc.id, ...doc.data() } as Project)
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

  const filteredProjects =
    selectedCategory === "All" ? projects : projects.filter((project) => project.tags?.includes(selectedCategory))

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="container mx-auto px-6">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Our Tenders
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Explore our active and completed tender opportunities across construction, infrastructure, and allied sectors.
              </p>
            </motion.div>


          </div>
        </section>

        {/* Projects Grid */}
        <section className="py-10">
          <div className="container mx-auto px-6">
            {loading ? (
              <div className="text-center text-muted-foreground py-10">Loading projects...</div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence>
                  {filteredProjects.map((project, index) => {
                    const projectUrl = (project.link && project.link !== '#') ? project.link : `/projects/${project.id}`;
                    const isExternal = projectUrl.startsWith('http');
                    return (
                      <motion.div
                        key={project.id}
                        layout
                        initial={{ opacity: 0, y: 50, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -50, scale: 0.8 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <Link
                          href={projectUrl}
                          target={isExternal ? "_blank" : undefined}
                          rel={isExternal ? "noopener noreferrer" : undefined}
                          passHref
                          className="block h-full cursor-pointer"
                        >
                          <div className="group relative block overflow-hidden bg-white border-2 border-[#81f5fd] rounded-xl h-full flex flex-col hover:shadow-lg transition-all duration-300">
                            <div className="relative overflow-hidden aspect-[4/3] w-full">
                              <Image
                                src={project.mainImage || "/placeholder.svg?height=400&width=600"}
                                alt={project.title}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                            </div>

                            <div className="p-6 pt-2 flex flex-col flex-grow bg-white relative z-10">
                              <h3 className="text-xl font-bold text-[#81f5fd] mb-2 leading-tight transition-colors duration-300">
                                {project.title}
                              </h3>
                              <p className="text-gray-500 mb-4 leading-relaxed text-sm flex-grow line-clamp-2">
                                {project.tagline || project.description || project.category}
                              </p>

                              <div className="flex flex-wrap gap-2 mb-6">
                                {project.tags && project.tags.length > 0 ? (
                                  project.tags.slice(0, 3).map((tag) => (
                                    <span key={tag} className="inline-block px-3 py-0.5 border border-[#81f5fd]/40 text-[#81f5fd] bg-blue-50/50 rounded-full text-xs">
                                      {tag}
                                    </span>
                                  ))
                                ) : (
                                  <span className="inline-block w-8 h-2.5 border border-[#81f5fd]/40 rounded-full bg-blue-50/30"></span>
                                )}
                              </div>

                              <div className="mt-auto flex justify-start items-center">
                                <span className="text-sm font-bold text-[#81f5fd] flex items-center">
                                  View Tender
                                  <ArrowRight className="w-4 h-4 ml-1.5 transition-transform duration-300 group-hover:translate-x-1" />
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            )}
            {!loading && filteredProjects.length === 0 && (
              <div className="text-center text-muted-foreground py-20">
                <p className="text-lg">No tenders found for this category.</p>
                <p className="text-sm">Try selecting a different one.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  )
}
