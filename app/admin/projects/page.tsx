
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Filter, Plus, Calendar, DollarSign, User, Eye, Edit, Trash2, MoreHorizontal } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { db } from "@/lib/firebase"
import { collection, onSnapshot, query, orderBy, Timestamp, deleteDoc, doc, addDoc, serverTimestamp, where, getDocs, updateDoc } from "firebase/firestore"
import { toast } from "sonner"
import Image from "next/image"

interface Project {
  id: string
  title: string
  description: string
  mainImage?: string
  category: string
  tags: string[]
  status?: string
  timeline?: string
  client?: string
  createdAt: Timestamp
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const q = query(collection(db, "projects"), orderBy("createdAt", "desc"))
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const projectsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project))
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

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      try {
        await deleteDoc(doc(db, "projects", id));
        toast.success("Project deleted successfully.");
      } catch (error) {
        console.error("Error deleting project:", error);
        toast.error("Failed to delete project.");
      }
    }
  }

  const seedProjects = async () => {
    const seedData = [
      {
        title: "Multimall Pro",
        description: "A sophisticated multi-vendor e-commerce marketplace platform where multiple independent sellers can list their products and customers can shop from various vendors through a unified storefront. Features advanced vendor management, unified checkout, and comprehensive analytics.",
        techStack: ["React", "Next.js", "Node.js", "MongoDB", "Stripe"],
        link: "https://www.multimallpro.com",
        category: "E-Commerce",
        features: ["Multi-vendor support", "Unified storefront", "Vendor dashboard", "Payment integration"],
        tags: ["E-Commerce", "Marketplace", "Multi-vendor"],
        mainImage: "/multimall-pro.png",
        gallery: []
      },
      {
        title: "Urbanprox",
        description: "A modern urban lifestyle e-commerce platform offering curated products for contemporary living. Features seamless shopping experience with advanced product filtering and personalized recommendations.",
        techStack: ["React", "Next.js", "Firebase", "Tailwind CSS"],
        link: "https://www.urbanprox.com",
        category: "E-Commerce",
        features: ["Product curation", "Personalized recommendations", "Modern UI/UX"],
        tags: ["E-Commerce", "Lifestyle", "Modern"],
        mainImage: "/urbanprox.png",
        gallery: []
      },
      {
        title: "Noircart",
        description: "An elegant e-commerce store powered by CyberLim, featuring a dark-themed interface with smooth animations and modern shopping cart functionality. Built for premium product showcases.",
        techStack: ["Next.js", "React", "Vercel", "Stripe"],
        link: "https://cyberlimstore.vercel.app",
        category: "E-Commerce",
        features: ["Dark theme UI", "Smooth animations", "Premium showcase"],
        tags: ["E-Commerce", "Premium", "Dark Theme"],
        mainImage: "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80",
        gallery: []
      },
      {
        title: "KhuliKitaab",
        description: "An open-source digital library and book sharing platform that makes reading accessible to everyone. Features book cataloging, reading lists, and community-driven recommendations.",
        techStack: ["Next.js", "React", "Vercel", "PostgreSQL"],
        link: "https://khulikitab.vercel.app",
        category: "Education",
        features: ["Digital library", "Book cataloging", "Community recommendations"],
        tags: ["Education", "Books", "Open Source"],
        mainImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80",
        gallery: []
      },
      {
        title: "Food Sharing Platform",
        description: "A social impact platform dedicated to reducing food waste by connecting food donors with those in need. Features real-time matching, location-based services, and impact tracking.",
        techStack: ["React", "Next.js", "Firebase", "Google Maps API"],
        link: "https://food-waste-reduction-eta.vercel.app",
        category: "Social Impact",
        features: ["Food waste reduction", "Real-time matching", "Impact tracking"],
        tags: ["Social Impact", "Food", "Sustainability"],
        mainImage: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=800&q=80",
        gallery: []
      },
      {
        title: "Nexa AI",
        description: "An advanced AI-powered platform leveraging cutting-edge language models for intelligent conversations and task automation. Features natural language processing and context-aware responses.",
        techStack: ["Next.js", "OpenAI API", "React", "TypeScript"],
        link: "https://nexa-ai-neon-yogesh.vercel.app",
        category: "AI/ML",
        features: ["AI conversations", "Task automation", "NLP integration"],
        tags: ["AI", "Machine Learning", "NLP"],
        mainImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80",
        gallery: []
      },
      {
        title: "Movie Hub",
        description: "A comprehensive movie discovery platform with detailed information, ratings, reviews, and personalized recommendations. Powered by TMDB API for up-to-date content.",
        techStack: ["React", "Next.js", "TMDB API", "Tailwind CSS"],
        link: "https://mymovieapp-yogesh.vercel.app",
        category: "Entertainment",
        features: ["Movie search", "Ratings & reviews", "Personalized recommendations"],
        tags: ["Entertainment", "Movies", "TMDB"],
        mainImage: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80",
        gallery: []
      },
      {
        title: "EchoBlog",
        description: "A modern blogging platform with rich text editing, markdown support, and social sharing features. Built for content creators who want a fast, elegant blogging experience.",
        techStack: ["Next.js", "MDX", "Vercel", "TailwindCSS"],
        link: "https://echoblog-yogesh.vercel.app",
        category: "Content Platform",
        features: ["Rich text editing", "Markdown support", "Social sharing"],
        tags: ["Blog", "Content", "Writing"],
        mainImage: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80",
        gallery: []
      },
      {
        title: "Flavorverse",
        description: "A culinary exploration platform featuring recipes, cooking tutorials, and food blog content. Discover flavors from around the world with detailed step-by-step guides.",
        techStack: ["Next.js", "React", "Contentful CMS", "Vercel"],
        link: "https://flavorverse-yogesh.vercel.app",
        category: "Food & Cooking",
        features: ["Recipe database", "Cooking tutorials", "Food blogging"],
        tags: ["Food", "Recipes", "Cooking"],
        mainImage: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80",
        gallery: []
      },
      {
        title: "Holiday Explorer",
        description: "A travel and holiday planning website with destination guides, booking capabilities, and personalized itinerary planning. Your gateway to unforgettable adventures.",
        techStack: ["Next.js", "React", "Google Maps API", "Stripe"],
        link: "https://project-x-yogesh.vercel.app",
        category: "Travel & Tourism",
        features: ["Destination guides", "Itinerary planning", "Booking integration"],
        tags: ["Travel", "Tourism", "Holidays"],
        mainImage: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80",
        gallery: []
      },
      {
        title: "Samajwadi Tech Force",
        description: "Official technology platform for the Samajwadi Party, featuring news updates, digital campaigns, and community engagement tools. Empowering political participation through technology.",
        techStack: ["WordPress", "PHP", "MySQL", "Custom CMS"],
        link: "https://www.samajwaditechforce.com",
        category: "Political Tech",
        features: ["News updates", "Campaign management", "Community engagement"],
        tags: ["Politics", "Website", "CMS"],
        mainImage: "/samajwadi-tech-force.png",
        gallery: []
      },
      {
        title: "Patel Pulse Ventures",
        description: "Corporate website for Patel Pulse Ventures showcasing digital solutions, AI-powered services, and innovative web technologies. Featuring portfolio, services, and client success stories.",
        techStack: ["Next.js", "React", "Firebase", "Framer Motion"],
        link: "https://www.patelpulseventures.com",
        category: "Corporate Website",
        features: ["Portfolio showcase", "Service catalog", "Client testimonials"],
        tags: ["Corporate", "Agency", "Portfolio"],
        mainImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
        gallery: []
      },
      {
        title: "Edemy",
        description: "A comprehensive online learning management system with course creation tools, student progress tracking, and interactive learning features. Democratizing education through technology.",
        techStack: ["Next.js", "React", "Firebase", "Video.js"],
        link: "https://edemy-yogesh.vercel.app",
        category: "Education",
        features: ["Course management", "Progress tracking", "Interactive learning"],
        tags: ["Education", "LMS", "E-Learning"],
        mainImage: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=800&q=80",
        gallery: []
      },
      {
        title: "NextStep",
        description: "A career guidance and job portal platform connecting job seekers with opportunities. Features resume building, skill assessments, and personalized job recommendations.",
        techStack: ["Next.js", "React", "MongoDB", "Node.js"],
        link: "https://nextstep-yogesh.vercel.app",
        category: "Career & Jobs",
        features: ["Job portal", "Resume builder", "Skill assessments"],
        tags: ["Jobs", "Career", "Portal"],
        mainImage: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80",
        gallery: []
      },
      {
        title: "GoCart",
        description: "A modern e-commerce shopping cart solution with advanced features like wishlist management, product comparisons, and seamless checkout experience. Built for conversion optimization.",
        techStack: ["React", "Next.js", "Redux", "Stripe"],
        link: "https://gocart-yogesh.vercel.app",
        category: "E-Commerce",
        features: ["Shopping cart", "Wishlist", "Product comparison"],
        tags: ["E-Commerce", "Shopping", "Cart"],
        mainImage: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80",
        gallery: []
      }
    ];

    try {
      setLoading(true);
      toast.info("Clearing old projects and adding new ones...");

      const projectsCollection = collection(db, "projects");

      // Delete ALL existing projects first
      const allProjects = await getDocs(projectsCollection);
      const deletePromises = allProjects.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      toast.success(`Deleted ${allProjects.size} old projects`);

      // Add new projects
      let addedCount = 0;
      for (const project of seedData) {
        await addDoc(projectsCollection, {
          ...project,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          learnings: [],
          status: "Completed"
        });
        addedCount++;
      }

      toast.success(`Successfully added ${addedCount} new projects! 🎉`);
    } catch (e: any) {
      toast.error("Error seeding projects: " + e.message);
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case "Completed": return "bg-green-500/20 text-green-400 border-green-500/30"
      case "In Progress": return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "On Hold": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "Planning": return "bg-gray-500/20 text-gray-400 border-gray-500/30"
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }


  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground p-4 md:p-6 lg:p-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6 lg:p-8">
      {/* Search and Filter */}
      <motion.div className="mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <Card className="bg-card/50 border-primary/20 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input placeholder="Search projects by title, client, or category..." className="pl-10 bg-background/50 border-primary/20 text-foreground placeholder-muted-foreground" />
              </div>
              <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 bg-transparent">
                <Filter className="w-4 h-4 mr-2" /> Filter
              </Button>
              <Button onClick={() => router.push('/admin/add/project')} className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90">
                <Plus className="w-4 h-4 mr-2" /> New Project
              </Button>
              <Button onClick={seedProjects} variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
                Auto Fill Projects
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Projects Grid */}
      <motion.div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        {projects.map((project, index) => (
          <motion.div key={project.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: index * 0.1 }}>
            <Card className="bg-card/50 border-primary/20 backdrop-blur-sm hover:bg-card/70 transition-all duration-300 flex flex-col h-full">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-1">{project.title}</CardTitle>
                    <CardDescription className="text-muted-foreground">{project.category}</CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-popover border-primary/20">
                      <DropdownMenuItem className="text-foreground hover:bg-primary/10" onClick={() => router.push(`/projects/${project.id}`)}><Eye className="w-4 h-4 mr-2" />View Details</DropdownMenuItem>
                      <DropdownMenuItem className="text-foreground hover:bg-primary/10" onClick={() => router.push(`/admin/projects/edit/${project.id}`)}><Edit className="w-4 h-4 mr-2" />Edit Project</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(project.id)} className="text-destructive hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive"><Trash2 className="w-4 h-4 mr-2" />Delete Project</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 flex-grow flex flex-col">
                <div className="relative w-full h-40 rounded-lg overflow-hidden">
                  <Image src={project.mainImage || "/placeholder.svg?height=400&width=600"} alt={project.title} fill className="object-cover" />
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 flex-grow">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags?.slice(0, 3).map(tag => <Badge key={tag} variant="outline" className="border-primary/30 text-primary">{tag}</Badge>)}
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm pt-2 border-t border-border">
                  <div className="flex items-center gap-2 text-muted-foreground"><User className="w-4 h-4" /><span>{project.client || 'N/A'}</span></div>
                  <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="w-4 h-4" /><span>{project.timeline || 'N/A'}</span></div>
                </div>
                <Button size="sm" variant="outline" className="w-full border-primary/30 text-primary hover:bg-primary/10 bg-transparent" onClick={() => router.push(`/projects/${project.id}`)}>
                  <Eye className="w-3 h-3 mr-1" /> View Full Details
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
