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

export default function TestimonialsSlider() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(
      collection(db, "testimonials"),
      where("status", "==", "approved"),
      orderBy("createdAt", "desc")
    )
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const testimonialsData = snapshot.docs.map(doc => {
          const data = doc.data()
          return {
            quote: data.quote,
            name: data.name,
            designation: data.role,
            company: data.company,
            src: data.src || "/placeholder.svg?height=400&width=400",
            rating: data.rating,
            project: data.project,
            results: data.results,
          }
        })
        setTestimonials(testimonialsData)
        setLoading(false)
      },
      (error) => {
        console.error("Error fetching testimonials:", error)
        setLoading(false)
      }
    )
    return () => unsubscribe()
  }, [])

  if (loading || testimonials.length === 0) {
    return null
  }

  return <AnimatedTestimonials testimonials={testimonials} autoplay={true} />
}
