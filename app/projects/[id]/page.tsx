
"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, CheckCircle, Code, Layers, ExternalLink, Github, Calendar, User, Lightbulb, Tag, BookOpen } from "lucide-react"
import { db } from "@/lib/firebase"
import { doc, getDoc, DocumentData } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import MobileBottomNav from "@/components/mobile-bottom-nav"

interface Project extends DocumentData {
  id: string
  title: string
  tagline: string
  mainImage?: string
  gallery?: string[]
  description: string
  features: string[]
  techStack: string[]
  demoUrl?: string
  githubFrontend?: string
  githubBackend?: string
  timeline?: string
  role?: string
  learnings: string[]
  tags: string[]
  category: string
}

export default function ProjectDetailPage() {
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const params = useParams()
  const router = useRouter()
  const { id } = params

  useEffect(() => {
    if (id) {
      const fetchProject = async () => {
        const docRef = doc(db, "projects", id as string)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          setProject({ id: docSnap.id, ...docSnap.data() } as Project)
        } else {
          console.error("No such document!")
        }
        setLoading(false)
      }
      fetchProject()
    }
  }, [id])

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-foreground"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>
  }

  if (!project) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-foreground"><p>Project not found.</p></div>
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-6">
          {/* Back Button */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <Button variant="ghost" onClick={() => router.back()} className="mb-8 text-muted-foreground hover:text-foreground hover:bg-secondary/20">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Projects
            </Button>
          </motion.div>

          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{project.title}</h1>
            <p className="text-xl text-muted-foreground">{project.tagline}</p>
          </motion.header>

          {/* Main Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative w-full aspect-video rounded-2xl overflow-hidden mb-12 shadow-2xl shadow-primary/10 border border-primary/20"
          >
            <Image src={project.mainImage || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-12">
              {/* Description */}
              <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true }}>
                <h2 className="text-2xl font-bold mb-4 text-primary flex items-center"><Lightbulb className="w-6 h-6 mr-3" />Project Overview</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{project.description}</p>
              </motion.section>

              {/* Features */}
              {project.features && project.features.length > 0 && (
                <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} viewport={{ once: true }}>
                  <h2 className="text-2xl font-bold mb-4 text-primary flex items-center"><CheckCircle className="w-6 h-6 mr-3" />Key Features</h2>
                  <ul className="grid md:grid-cols-2 gap-4">
                    {project.features.map((feature, i) => (
                      <li key={i} className="flex items-start bg-secondary/10 p-3 rounded-lg border border-primary/10">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 mt-1.5 flex-shrink-0"></div>
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </motion.section>
              )}

              {/* Gallery */}
              {project.gallery && project.gallery.length > 0 && (
                <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} viewport={{ once: true }}>
                  <h2 className="text-2xl font-bold mb-4 text-primary">Gallery</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {project.gallery.map((img, i) => (
                      <motion.div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-primary/20 group" whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                        <Image src={img} alt={`${project.title} gallery image ${i + 1}`} fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              )}

              {/* Learnings */}
              {project.learnings && project.learnings.length > 0 && (
                <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} viewport={{ once: true }}>
                  <h2 className="text-2xl font-bold mb-4 text-primary flex items-center"><BookOpen className="w-6 h-6 mr-3" />What I Learned</h2>
                  <ul className="space-y-3">
                    {project.learnings.map((learning, i) => (
                      <li key={i} className="flex items-center text-muted-foreground bg-secondary/10 p-3 rounded-lg border border-primary/10">
                        <Layers className="w-4 h-4 text-accent mr-3" />
                        {learning}
                      </li>
                    ))}
                  </ul>
                </motion.section>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <aside className="lg:col-span-1 space-y-8 sticky top-24 h-fit">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} viewport={{ once: true }} className="bg-secondary/10 p-6 rounded-2xl border border-primary/20">
                <h3 className="text-xl font-bold mb-4 text-foreground">Project Info</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center"><span className="text-muted-foreground flex items-center"><Calendar className="w-4 h-4 mr-2" />Timeline</span> <span className="font-medium text-foreground">{project.timeline}</span></div>
                  <div className="flex justify-between items-center"><span className="text-muted-foreground flex items-center"><User className="w-4 h-4 mr-2" />Role</span> <span className="font-medium text-foreground">{project.role}</span></div>
                  <div className="flex justify-between items-center"><span className="text-muted-foreground flex items-center"><Tag className="w-4 h-4 mr-2" />Category</span> <Badge variant="outline" className="border-primary/50 text-primary">{project.category}</Badge></div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} viewport={{ once: true }} className="bg-secondary/10 p-6 rounded-2xl border border-primary/20">
                <h3 className="text-xl font-bold mb-4 text-foreground flex items-center"><Code className="w-5 h-5 mr-2" />Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {project.techStack && project.techStack.map(tech => <Badge key={tech} className="bg-secondary text-secondary-foreground hover:bg-secondary/80">{tech}</Badge>)}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} viewport={{ once: true }} className="bg-secondary/10 p-6 rounded-2xl border border-primary/20">
                <h3 className="text-xl font-bold mb-4 text-foreground">Links</h3>
                <div className="space-y-3">
                  {project.demoUrl && <Button asChild className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground"><a href={project.demoUrl} target="_blank" rel="noopener noreferrer"><ExternalLink className="w-4 h-4 mr-2" />Live Demo</a></Button>}

                </div>
              </motion.div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  )
}
