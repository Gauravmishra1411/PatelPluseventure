
"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, Award, Briefcase, Building } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import MobileBottomNav from "@/components/mobile-bottom-nav"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { db } from "@/lib/firebase"
import { collection, onSnapshot, query, orderBy, Timestamp } from "firebase/firestore"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

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
  createdAt: Timestamp
}

const categories = ["All", "Web Development", "Web Application", "Mobile Development", "AI Development", "E-commerce", "Fullstack", "MERN"]

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("All")

  useEffect(() => {
    const q = query(collection(db, "testimonials"), orderBy("createdAt", "desc"))
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot: any) => {
        const testimonialsData: Testimonial[] = []
        querySnapshot.forEach((doc: any) => {
          testimonialsData.push({ id: doc.id, ...doc.data() } as Testimonial)
        })
        setTestimonials(testimonialsData)
        setLoading(false)
      },
      (error: any) => {
        console.error("Error fetching testimonials:", error)
        toast.error("Failed to load testimonials.")
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  const filteredTestimonials =
    selectedCategory === "All" ? testimonials : testimonials.filter((t) => t.category === selectedCategory)

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
                  Client Success Stories
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                have to say about our partnership and the results we&apos;ve delivered.
              </p>
            </motion.div>


          </div>
        </section>

        {/* Testimonials Grid */}
        <section className="py-10">
          <div className="container mx-auto px-6">
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="bg-secondary/10 backdrop-blur-sm border border-primary/20 rounded-2xl p-8 space-y-4">
                    <div className="flex items-center gap-4">
                      <Skeleton className="w-16 h-16 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence>
                  {filteredTestimonials.map((testimonial, index) => (
                    <motion.div
                      key={testimonial.id}
                      layout
                      initial={{ opacity: 0, y: 50, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -50, scale: 0.8 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-gradient-to-br from-secondary/10 to-background/50 backdrop-blur-sm border border-primary/20 rounded-2xl p-8 flex flex-col"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <Image src={testimonial.src || "/placeholder.svg"} alt={testimonial.name} width={64} height={64} className="w-16 h-16 rounded-full object-cover border-2 border-primary/30" />
                        <div>
                          <h3 className="text-lg font-bold text-foreground">{testimonial.name}</h3>
                          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                          <p className="text-sm text-primary flex items-center gap-1"><Building className="w-3 h-3" />{testimonial.company}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 mb-4">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                      </div>

                      <blockquote className="text-muted-foreground italic mb-6 border-l-2 border-accent/50 pl-4">
                        &quot;{testimonial.quote}&quot;
                      </blockquote>

                      <div className="mt-auto space-y-4">
                        <div className="bg-background/50 p-4 rounded-lg">
                          <h4 className="text-sm font-semibold text-accent flex items-center gap-2 mb-2"><Briefcase className="w-4 h-4" /> Project: {testimonial.project}</h4>
                          <h4 className="text-sm font-semibold text-accent flex items-center gap-2"><Award className="w-4 h-4" /> Results:</h4>
                          <p className="text-sm text-muted-foreground">{testimonial.results}</p>
                        </div>
                        <Badge variant="outline" className="border-primary/30 text-primary bg-primary/10 text-xs">
                          {testimonial.category}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
            {!loading && filteredTestimonials.length === 0 && (
              <div className="text-center text-muted-foreground py-20">
                <p className="text-lg">No testimonials found for this category.</p>
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

