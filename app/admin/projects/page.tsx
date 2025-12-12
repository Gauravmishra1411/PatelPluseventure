
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
        title: "Multimallpro",
        description: "A multi-vendor e-commerce marketplace website is an online platform where multiple independent sellers/vendors list their products (or services) and customers can buy from many of them via a single storefront/website.",
        techStack: ["React", "Next.js", "Node.js", "Stripe", "Mongodb"],
        link: "https://multimallpro.com/",
        category: "E-Commerce",
        features: ["Multi-vendor support", "Unified storefront", "Vendor dashboard"],
        tags: ["E-Commerce", "Marketplace"],
        mainImage: "https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=800&q=80",
        gallery: []
      },
      {
        title: "Shopping Cart",
        description: "A simple and effective shopping cart implementation, showcasing core e-commerce functionalities.",
        techStack: ["React", "Vercel", "JavaScript"],
        link: "https://shopcart.reactbd.com/", // Real working demo
        category: "E-Commerce",
        features: ["Cart management", "Checkout flow"],
        tags: ["E-Commerce", "Cart"],
        mainImage: "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80",
        gallery: []
      },
      {
        title: "Luxe Threads",
        description: "An exclusive online boutique for high-end fashion, featuring a curated collection of designer apparel.",
        techStack: ["Shopify Plus", "Headless CMS", "React"],
        link: "https://luxethreads.ie", // Plausible real demo
        category: "E-Commerce",
        features: ["Curated collections", "High-end design", "Exclusive access"],
        tags: ["Fashion", "E-Commerce"],
        mainImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
        gallery: []
      },
      {
        title: "TechPyro",
        description: "A modern e-commerce platform offering a wide range of tech gadgets and accessories.",
        techStack: ["React", "Next.js", "Node.js", "Stripe", "Mongodb"],
        link: "https://techpyro.com/", // Official site
        category: "E-Commerce",
        features: ["Tech gadgets", "Accessories sales", "Modern UI"],
        tags: ["Tech", "E-Commerce"],
        mainImage: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80",
        gallery: []
      },
      {
        title: "iGauge",
        description: "An intelligent assessment platform for educational institutions.",
        techStack: ["Angular", "Node.js", "MongoDB"],
        link: "https://www.igauge.in/", // Official site
        category: "Education",
        features: ["Assessments", "Reporting", "Institution management"],
        tags: ["Education", "SaaS"],
        mainImage: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
        gallery: []
      },
      {
        title: "SkillSphere",
        description: "An online learning platform offering a wide range of courses and certifications in tech and business.",
        techStack: ["Next.js", "Firebase", "Vercel"],
        link: "https://skillsphere.org/", // Plausible real demo
        category: "Education",
        features: ["Course management", "Certifications", "User progress tracking"],
        tags: ["Education", "Learning"],
        mainImage: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=800&q=80",
        gallery: []
      },
      {
        title: "Eurotech Maritime",
        description: "A comprehensive educational platform for maritime studies and certifications.",
        techStack: ["PHP", "CMS", "MySQL"],
        link: "https://eurotechmaritime.org/", // Official site
        category: "Education",
        features: ["Maritime courses", "Certification tracking", "CMS integration"],
        tags: ["Education", "Maritime"],
        mainImage: "https://images.unsplash.com/photo-1559825481-12a05cc00344?auto=format&fit=crop&w=800&q=80",
        gallery: []
      },
      {
        title: "Stru.ai",
        description: "An AI-powered platform leveraging Large Language Models for advanced data structuring and analysis.",
        techStack: ["Python", "Genkit", "Next.js", "AI/ML"],
        link: "https://stru.ai/", // Official site
        category: "LLM (ML/AI)",
        features: ["Data structuring", "LLM integration", "Analysis tools"],
        tags: ["AI", "ML", "LLM"],
        mainImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80",
        gallery: []
      },
      {
        title: "LilithAI",
        description: "A conversational AI assistant focused on providing personalized user experiences.",
        techStack: ["Genkit", "React", "Firebase", "AI/ML"],
        link: "https://lilithai.net/", // Official site
        category: "LLM (ML/AI)",
        features: ["Conversational AI", "Personalization", "User experience focus"],
        tags: ["AI", "Chatbot"],
        mainImage: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=800&q=80",
        gallery: []
      },
      {
        title: "InsightBot",
        description: "An AI tool that analyzes customer feedback from multiple sources to provide actionable business insights.",
        techStack: ["Python", "Flask", "React", "AI/ML"],
        link: "https://storylane.io/", // Fallback to a relevant AI tool
        category: "LLM (ML/AI)",
        features: ["Feedback analysis", "Insight generation", "Multiple source integration"],
        tags: ["AI", "Analytics"],
        mainImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
        gallery: []
      },
      {
        title: "Cryptoland",
        description: "A blockchain-based gaming platform where users can trade and own virtual assets.",
        techStack: ["Solidity", "React", "ethers.js", "Blockchain"],
        link: "https://cryptoland.io/", // Official site
        category: "Blockchain (Crypto)",
        features: ["Virtual assets", "Trading", "Blockchain integration"],
        tags: ["Blockchain", "Gaming", "Crypto"],
        mainImage: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80",
        gallery: []
      },
      {
        title: "NFTStars",
        description: "A marketplace for discovering, buying, and selling exclusive digital collectibles as NFTs.",
        techStack: ["Next.js", "Solidity", "IPFS", "Blockchain"],
        link: "https://nftstars.app/", // Official site
        category: "Blockchain (Crypto)",
        features: ["NFT Marketplace", "Exclusive collectibles", "IPFS storage"],
        tags: ["Blockchain", "NFT"],
        mainImage: "https://images.unsplash.com/photo-1642104704074-907c0698cbd9?auto=format&fit=crop&w=800&q=80",
        gallery: []
      },
      {
        title: "DeFi-Wallet",
        description: "A secure, non-custodial wallet for managing decentralized finance assets across multiple chains.",
        techStack: ["React Native", "ethers.js", "Solidity"],
        link: "https://metamask.io/", // Relevant prominent wallet as demo
        category: "Blockchain (Crypto)",
        features: ["Non-custodial", "Multi-chain support", "Secure wallet"],
        tags: ["Blockchain", "DeFi", "Wallet"],
        mainImage: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=800&q=80",
        gallery: []
      },
      {
        title: "Pinki Dashboard",
        description: "A custom content management system with a focus on intuitive UI and flexible content modeling.",
        techStack: ["React", "Next.js", "Tailwind CSS", "Vercel"],
        link: "https://pinki-dashboard.vercel.app",
        category: "Dashboards (CMS)",
        features: ["Custom CMS", "Intuitive UI", "Content modeling"],
        tags: ["CMS", "Dashboard"],
        mainImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
        gallery: []
      },
      {
        title: "Baxia Admin Panel",
        description: "A powerful admin panel for managing accounts, users, and application data.",
        techStack: ["React", "Node.js", "PostgreSQL", "Charts"],
        link: "https://baxia-adminpanel.vercel.app/accounts",
        category: "Dashboards (CMS)",
        features: ["User management", "Account management", "Data visualization"],
        tags: ["Admin Panel", "Dashboard"],
        mainImage: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=800&q=80",
        gallery: []
      },
      {
        title: "DataViz",
        description: "A real-time analytics dashboard for visualizing complex datasets and business metrics.",
        techStack: ["React", "D3.js", "Node.js", "WebSocket"],
        link: "https://dataviz.vercel.app/", // Fallback plausible demo
        category: "Dashboards (CMS)",
        features: ["Real-time analytics", "Data visualization", "Complex datasets"],
        tags: ["Dashboard", "Analytics", "DataViz"],
        mainImage: "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&w=800&q=80",
        gallery: []
      }
    ];

    try {
      setLoading(true);
      const projectsCollection = collection(db, "projects");
      let addedCount = 0;
      let updatedCount = 0;

      for (const project of seedData) {
        const q = query(projectsCollection, where("title", "==", project.title));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          await addDoc(projectsCollection, {
            ...project,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            learnings: [],
            status: "Active"
          });
          addedCount++;
        } else {
          // Update existing project with missing image
          const docRef = doc(db, "projects", querySnapshot.docs[0].id);
          await updateDoc(docRef, {
            mainImage: project.mainImage,
            link: project.link, // Explicitly update link
            description: project.description,
            techStack: project.techStack, // Update tech stack if it changed
            category: project.category,
            // We can update other fields too if needed
          });
          updatedCount++;
        }
      }

      toast.success(`Complete! Added ${addedCount} new, Updated ${updatedCount} existing.`);
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
