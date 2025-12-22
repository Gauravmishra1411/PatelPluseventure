
"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ExternalLink, Github, ArrowRight } from "lucide-react"
import Navbar from "@/components/navbar"
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
      <Navbar />

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
                  Our Portfolio
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                A showcase of our passion for innovation, design, and technology.
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
                    const projectUrl = (project.link && project.link !== '#') ? project.link : undefined;
                    const isExternal = projectUrl?.startsWith('http') ?? false;

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
                          <div className="group relative block overflow-hidden bg-gradient-to-br from-secondary/10 to-background/50 backdrop-blur-sm border border-primary/20 rounded-2xl h-full flex flex-col">
                            <div className="relative overflow-hidden aspect-video">
                              <Image
                                src={project.mainImage || "/placeholder.svg?height=400&width=600"}
                                alt={project.title}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-100 transition-opacity duration-300" />
                            </div>

                            <div className="p-6 flex flex-col flex-grow">
                              <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 mb-2">
                                {project.title}
                              </h3>
                              <p className="text-muted-foreground mb-4 leading-relaxed text-sm line-clamp-2 flex-grow">{project.tagline || project.description}</p>

                              <div className="flex flex-wrap gap-2 mb-4">
                                {project.tags?.slice(0, 3).map((tag) => (
                                  <Badge key={tag} variant="outline" className="border-primary/30 text-primary bg-primary/10 text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>

                              <div className="mt-auto flex justify-between items-center">
                                <span className="text-sm font-semibold text-primary flex items-center">
                                  View Project
                                  <ArrowRight className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
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
                <p className="text-lg">No projects found for this category.</p>
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
