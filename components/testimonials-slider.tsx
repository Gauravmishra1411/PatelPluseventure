"use client"

import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { collection, onSnapshot, query, where, orderBy, Timestamp } from "firebase/firestore"
import { toast } from "sonner"
import { AnimatedTestimonials } from "./animated-testimonials"

interface Testimonial {
  quote: string
  name: string
  designation: string
  company: string
  src: string
  rating: number
  project: string
  results: string
}

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    quote: "Working with PatelPluseventure transformed our digital presence completely. Outstanding quality and support.",
    name: "Rajesh Sharma",
    designation: "CEO",
    company: "TechNova Solutions",
    src: "/placeholder.svg?height=400&width=400",
    rating: 5,
    project: "Web Development",
    results: "300% increase in user engagement"
  },
  {
    quote: "The team delivered our complex enterprise software ahead of schedule with flawless precision.",
    name: "Priya Patel",
    designation: "CTO",
    company: "Venture Innovations",
    src: "/placeholder.svg?height=400&width=400",
    rating: 5,
    project: "Enterprise App",
    results: "50% reduction in operational cost"
  }
]

export default function TestimonialsSlider() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let unsubscribe = () => {}
    try {
      const q = query(
        collection(db, "testimonials"),
        where("status", "==", "approved"),
        orderBy("createdAt", "desc")
      )
      unsubscribe = onSnapshot(
        q,
        (snapshot: any) => {
          const testimonialsData = snapshot.docs.map((doc: any) => {
            const data = doc.data()
            return {
              quote: data.quote || "",
              name: data.name || "Anonymous",
              designation: data.role || data.designation || "",
              company: data.company || "",
              src: data.src || "/placeholder.svg?height=400&width=400",
              rating: data.rating || 5,
              project: data.project || "Client Project",
              results: data.results || "Great experience",
            }
          })
          setTestimonials(testimonialsData.length > 0 ? testimonialsData : DEFAULT_TESTIMONIALS)
          setLoading(false)
        },
        (error: any) => {
          console.error("Error fetching testimonials:", error)
          setTestimonials(DEFAULT_TESTIMONIALS)
          setLoading(false)
        }
      )
    } catch (e) {
      console.error("Firebase query error:", e)
      setTestimonials(DEFAULT_TESTIMONIALS)
      setLoading(false)
    }
    return () => unsubscribe()
  }, [])

  const displayTestimonials = testimonials.length > 0 ? testimonials : DEFAULT_TESTIMONIALS

  if (loading) {
    return null
  }

  return <AnimatedTestimonials testimonials={displayTestimonials} autoplay={true} />
}
