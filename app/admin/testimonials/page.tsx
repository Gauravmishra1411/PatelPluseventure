
"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, Award, Briefcase, Building, Edit, Trash2, Plus, Filter, MoreHorizontal, ThumbsUp, ThumbsDown, Database } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import MobileBottomNav from "@/components/mobile-bottom-nav"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { db } from "@/lib/firebase"
import { collection, onSnapshot, query, orderBy, Timestamp, doc, deleteDoc, updateDoc, addDoc, serverTimestamp, getDocs, where } from "firebase/firestore"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"


interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  quote: string
  project: string
  results: string
  rating: number
  category: string
  src?: string
  status?: 'pending' | 'approved' | 'rejected'
  createdAt: Timestamp
}

const categories = ["All", "Web Development", "Web Application", "Mobile Development", "AI Development", "E-commerce", "Fullstack", "MERN"]

export default function TestimonialsAdminPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const router = useRouter()

  useEffect(() => {
    const q = query(collection(db, "testimonials"), orderBy("createdAt", "desc"))
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const testimonialsData: Testimonial[] = []
        querySnapshot.forEach((doc) => {
          testimonialsData.push({ id: doc.id, ...doc.data() } as Testimonial)
        })
        setTestimonials(testimonialsData)
        setLoading(false)
      },
      (error) => {
        console.error("Error fetching testimonials:", error)
        toast.error("Failed to load testimonials.")
        setLoading(false)
      }
    )
    return () => unsubscribe()
  }, [])

  const handleUpdateStatus = async (testimonialId: string, status: 'approved' | 'rejected') => {
    const testimonialRef = doc(db, "testimonials", testimonialId);
    try {
      await updateDoc(testimonialRef, { status });
      toast.success(`Testimonial has been ${status}.`);
    } catch (error) {
      toast.error("Failed to update status.");
      console.error(error);
    }
  }

  const handleDelete = async (testimonialId: string) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) return

    try {
      await deleteDoc(doc(db, "testimonials", testimonialId))
      toast.success("Testimonial deleted successfully.")
    } catch (error) {
      console.error("Error deleting testimonial: ", error)
      toast.error("Failed to delete testimonial.")
    }
  }

  const getStatusVariant = (status: string | undefined) => {
    switch (status) {
      case 'approved': return 'bg-green-500/20 text-[#81f5fd] border-[#81f5fd]/30';
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    }
  }

  const seedTestimonials = async () => {
    const seedData = [
      {
        name: "Aarav Patel",
        role: "CTO",
        company: "TechSolutions India",
        quote: "The team at CyberLim delivered an exceptional e-commerce platform that exceeded our expectations. Their attention to detail and technical expertise are unmatched.",
        project: "E-Commerce Upgrade",
        results: "200% Sales Growth",
        rating: 5,
        category: "E-Commerce",
        src: "https://plus.unsplash.com/premium_photo-1691030254390-aa56b22e6a45?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8aW5kaWFuJTIwbWFufGVufDB8fDB8fHww", // Verified Indian Male
        status: "approved"
      },
      {
        name: "Priya Sharma",
        role: "Marketing Director",
        company: "GrowthHub",
        quote: "We saw a 200% increase in user engagement after launching our new mobile app. The UI/UX design is simply world-class.",
        project: "Mobile App Launch",
        results: "High Engagement",
        rating: 5,
        category: "Mobile Development",
        src: "https://images.pexels.com/photos/1580272/pexels-photo-1580272.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500", // Verified Indian Female
        status: "approved"
      },
      {
        name: "Rohan Gupta",
        role: "Founder",
        company: "StartUp Z",
        quote: "Working with this team was a breeze. They understood our vision perfectly and executed it with precision. Highly recommended for any startup.",
        project: "MVP Development",
        results: "Successful Launch",
        rating: 5,
        category: "Web Development",
        src: "https://images.unsplash.com/photo-1607081692251-d689f1b9af84?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGluZGlhbiUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D", // Verified Indian Male
        status: "approved"
      },
      {
        name: "Ananya Singh",
        role: "Product Manager",
        company: "InnovateX",
        quote: "The AI integration they implemented has streamlined our operations significantly. While there were minor delays, the final product was worth the wait.",
        project: "AI Automation",
        results: "Efficiency Boost",
        rating: 4,
        category: "AI Development",
        src: "https://images.unsplash.com/photo-1619286188088-de820bdc1230?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGluZGlhbiUyMGdpcmx8ZW58MHx8MHx8fDA%3D", // Professional Indian Female
        status: "approved"
      },
      {
        name: "Vikram Malhotra",
        role: "CEO",
        company: "FinTech Corp",
        quote: "A reliable partner for our blockchain initiatives. Their security-first approach gave us the confidence to launch our DeFi wallet.",
        project: "DeFi Wallet",
        results: "Secure Deployment",
        rating: 5,
        category: "Web Application",
        src: "https://images.unsplash.com/photo-1629301085299-a0b879255825?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGluZGlhbiUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D", // Professional Indian Male
        status: "approved"
      }
    ];

    try {
      setLoading(true);
      const collectionRef = collection(db, "testimonials");
      let addedCount = 0;
      let updatedCount = 0;

      for (const t of seedData) {
        // Check if exists by name
        const q = query(collectionRef, where("name", "==", t.name));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          await addDoc(collectionRef, {
            ...t,
            createdAt: serverTimestamp(),
          });
          addedCount++;
        } else {
          // Update existing project with missing image
          const docRef = doc(db, "testimonials", querySnapshot.docs[0].id);
          await updateDoc(docRef, {
            name: t.name,
            role: t.role,
            company: t.company,
            src: t.src,
            quote: t.quote,
            // We can update other fields too if needed
          });
          updatedCount++;
        }
      }
      toast.success(`Seeding complete. Added ${addedCount}, Updated ${updatedCount}.`);
    } catch (error: any) {
      console.error("Seeding error:", error);
      toast.error("Failed to seed testimonials.");
    } finally {
      setLoading(false);
    }
  }

  const filteredTestimonials =
    selectedCategory === "All" ? testimonials : testimonials.filter((t) => t.category === selectedCategory)

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
                <Input placeholder="Search testimonials..." className="pl-10 bg-background/50 border-primary/20 text-foreground placeholder-muted-foreground" />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 bg-transparent">
                    <Filter className="w-4 h-4 mr-2" /> {selectedCategory}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-popover border-border">
                  {categories.map(cat => (
                    <DropdownMenuItem key={cat} onClick={() => setSelectedCategory(cat)} className="text-foreground hover:bg-secondary">{cat}</DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button onClick={() => router.push('/admin/add/testimonial')} className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90">
                <Plus className="w-4 h-4 mr-2" /> New Testimonial
              </Button>
              <Button onClick={seedTestimonials} variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
                <Database className="w-4 h-4 mr-2" /> Auto Fill
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Testimonials Grid */}
      <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        {filteredTestimonials.map((testimonial, index) => (
          <motion.div key={testimonial.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: index * 0.1 }}>
            <Card className="bg-card/50 border-primary/20 backdrop-blur-sm hover:bg-card/70 transition-all duration-300 flex flex-col h-full">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    {testimonial.src && (
                      <Image src={testimonial.src} alt={testimonial.name} width={48} height={48} className="rounded-full object-cover" />
                    )}
                    <div>
                      <CardTitle className="text-lg text-foreground">{testimonial.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{testimonial.role} at {testimonial.company}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-popover border-border">
                      <DropdownMenuItem className="text-foreground hover:bg-secondary" onClick={() => router.push(`/admin/testimonials/edit/${testimonial.id}`)}><Edit className="w-4 h-4 mr-2" />Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(testimonial.id)} className="text-destructive hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive"><Trash2 className="w-4 h-4 mr-2" />Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 flex-grow flex flex-col">
                <div className="flex items-center gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />)}
                </div>
                <blockquote className="text-sm text-muted-foreground line-clamp-4 flex-grow border-l-2 border-primary/50 pl-4 italic">&quot;{testimonial.quote}&quot;</blockquote>
                <div className="pt-2 border-t border-border space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="border-secondary text-foreground">{testimonial.category}</Badge>
                    <Badge variant="outline" className={getStatusVariant(testimonial.status)}>{testimonial.status || 'pending'}</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="w-full bg-green-500/20 text-[#81f5fd] hover:bg-green-500/30" onClick={() => handleUpdateStatus(testimonial.id, 'approved')}><ThumbsUp className="w-4 h-4 mr-2" />Approve</Button>
                    <Button size="sm" className="w-full bg-red-500/20 text-red-400 hover:bg-red-500/30" onClick={() => handleUpdateStatus(testimonial.id, 'rejected')}><ThumbsDown className="w-4 h-4 mr-2" />Reject</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        {filteredTestimonials.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            <Star className="mx-auto h-12 w-12 mb-4" />
            <p className="text-lg">No testimonials found for this category.</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}
