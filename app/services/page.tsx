
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Navbar from "@/components/navbar"
import Logo from "@/components/logo"
import Footer from "@/components/footer"
import MobileBottomNav from "@/components/mobile-bottom-nav"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { db } from "@/lib/firebase"
import { collection, onSnapshot, query, orderBy, Timestamp } from "firebase/firestore"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

interface Service {
  id: string
  icon?: string
  title: string
  description: string
  features: string[]
  technologies: string[]
  gradient: string
  price: string
  createdAt: Timestamp
}


export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, "services"), orderBy("createdAt", "desc"))
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const servicesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service))
        setServices(servicesData)
        setLoading(false)
      },
      (error) => {
        console.error("Error fetching services:", error)
        toast.error("Failed to load services.")
        setLoading(false)
      }
    )
    return () => unsubscribe()
  }, [])

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
                <span className="bg-gradient-to-r from-[#1565c0] via-[#81f5fd] to-[#81f5fd] bg-clip-text text-transparent">
                  Our Services
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Comprehensive tender solutions tailored for construction, infrastructure, and allied sectors
              </p>
            </motion.div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {loading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <motion.div key={index} className="group relative">
                    <div className="relative p-8 h-full bg-secondary/10 backdrop-blur-sm border border-primary/20 rounded-2xl overflow-hidden">
                      <Skeleton className="w-16 h-16 rounded-2xl mb-6" />
                      <Skeleton className="h-8 w-3/4 mb-4" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-5/6 mb-6" />
                      <div className="space-y-2 mb-6">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </motion.div>
                ))
              ) : (
                services.map((service, index) => (
                  <motion.div
                    key={service.id}
                    className="group relative flex flex-col h-full"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -10 }}
                  >
                    <div className="relative p-8 h-full bg-secondary/10 backdrop-blur-sm border border-primary/20 rounded-2xl overflow-hidden flex flex-col">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />

                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-r ${service.gradient} opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity duration-300`}
                      />

                      <div className="relative z-10 flex flex-col h-full flex-grow">
                        {service.icon ? (
                          <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-6 border border-[#81f5fd]/25 bg-gray-50 shadow-sm">
                            <Image
                              src={service.icon}
                              alt={`${service.title} image`}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                        ) : null}

                        <h3 className="text-2xl font-bold text-foreground mb-4">{service.title}</h3>
                        <p className="text-muted-foreground mb-6 leading-relaxed flex-grow">{service.description}</p>

                        <ul className="space-y-2 mb-6">
                          {service.features?.slice(0, 4).map((feature, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground flex items-center">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3" />
                              {feature}
                            </li>
                          ))}
                        </ul>



                        <div className="mb-6">
                          <p className="text-lg font-bold text-primary">{service.price}</p>
                        </div>

                        <div className="flex gap-3 mt-auto">
                          <Link href={`/services/${service.id}`} className="flex-1">
                            <Button variant="outline" className="w-full border-primary/20 hover:bg-primary/5 transition-all duration-300">
                              Learn More
                            </Button>
                          </Link>
                          <Link href="/contact" className="flex-1">
                            <Button className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300">
                              Get Started
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <motion.div
              className="text-center p-12 bg-secondary/10 backdrop-blur-sm border border-primary/20 rounded-2xl"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-[#1565c0] via-[#81f5fd] to-[#81f5fd] bg-clip-text text-transparent">
                  Ready to Start Your Project?
                </span>
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Let&apos;s discuss your requirements and create something amazing together
              </p>
              <Link href="/contact">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold px-8 py-4 text-lg hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
                >
                  Contact Us Today
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  )
}
