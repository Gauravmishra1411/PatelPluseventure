
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

import { Check } from "lucide-react"

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

/* Map service titles to inline SVG icons */
function ServiceIcon({ title }: { title: string }) {
  const t = title.toLowerCase()
  const cls = "w-6 h-6"

  if (t.includes("canteen") || t.includes("catering"))
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
      </svg>
    )

  if (t.includes("horticulture") || t.includes("landscape"))
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 8c.7-1 1-2.2 1-3.5A5.5 5.5 0 0 0 12.5 0 5.5 5.5 0 0 0 7 4.5C7 5.8 7.3 7 8 8"/><path d="M12 4v16"/><path d="M8 20h8"/><path d="M5 12c-1.5 0-3 .5-4 1.5a5.5 5.5 0 0 0 4.5 7c1.3 0 2.5-.3 3.5-1"/><path d="M19 12c1.5 0 3 .5 4 1.5a5.5 5.5 0 0 1-4.5 7c-1.3 0-2.5-.3-3.5-1"/>
      </svg>
    )

  if (t.includes("manpower") || t.includes("supply"))
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    )

  if (t.includes("housekeeping") || t.includes("cleaning"))
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L12 6"/><path d="M12 6C8 6 4 10 4 16h16c0-6-4-10-8-10z"/><path d="M4 16c0 2 2 4 4 4h8c2 0 4-2 4-4"/><line x1="10" y1="20" x2="10" y2="22"/><line x1="14" y1="20" x2="14" y2="22"/>
      </svg>
    )

  if (t.includes("facility") && t.includes("management"))
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="9" y1="6" x2="9" y2="6.01"/><line x1="15" y1="6" x2="15" y2="6.01"/><line x1="9" y1="10" x2="9" y2="10.01"/><line x1="15" y1="10" x2="15" y2="10.01"/><path d="M9 22v-4h6v4"/>
        <circle cx="19" cy="19" r="3" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M19 18v1h1"/>
      </svg>
    )

  if (t.includes("maintenance"))
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
      </svg>
    )

  if (t.includes("tender") || t.includes("government") || t.includes("private"))
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/>
      </svg>
    )

  if (t.includes("it") || t.includes("software") || t.includes("technology"))
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
        <polyline points="9 8 7 10 9 12"/><polyline points="15 8 17 10 15 12"/>
      </svg>
    )

  /* Default fallback icon */
  return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  )
}


export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const id = params.get("id")
      if (id) {
        setSelectedId(id)
      }
    }
  }, [])

  useEffect(() => {
    const q = collection(db, "services")
    const unsubscribe = onSnapshot(
      q,
      (snapshot: any) => {
        const servicesData = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as Service))
        servicesData.sort((a: any, b: any) => {
          const timeA = a.createdAt?.toMillis?.() || (a.createdAt as any)?.seconds * 1000 || 0
          const timeB = b.createdAt?.toMillis?.() || (b.createdAt as any)?.seconds * 1000 || 0
          return timeB - timeA
        })
        setServices(servicesData)
        setLoading(false)
      },
      (error: any) => {
        console.error("Error fetching services:", error)
        toast.error("Failed to load services.")
        setLoading(false)
      }
    )
    return () => unsubscribe()
  }, [])

  const displayedServices = selectedId
    ? services.filter((s) => s.id === selectedId)
    : services

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "linear-gradient(135deg, #FFF7EB 0%, #FFE3C2 100%)" }}>
      {/* ── Animated Gradient Blobs ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />

        {/* Blob 1 — Top-left, slow drift */}
        <div
          className="absolute w-[500px] h-[500px] rounded-full blur-[100px] opacity-60"
          style={{
            background: "radial-gradient(circle, rgba(255,168,0,0.35) 0%, rgba(255,209,102,0.15) 60%, transparent 80%)",
            top: "-10%",
            left: "-5%",
            animation: "blobDrift1 18s ease-in-out infinite",
          }}
        />

        {/* Blob 2 — Bottom-right, slow drift */}
        <div
          className="absolute w-[450px] h-[450px] rounded-full blur-[110px] opacity-50"
          style={{
            background: "radial-gradient(circle, rgba(255,140,0,0.25) 0%, rgba(255,209,102,0.10) 65%, transparent 85%)",
            bottom: "-8%",
            right: "-3%",
            animation: "blobDrift2 22s ease-in-out infinite",
          }}
        />
      </div>

      {/* Blob animation keyframes */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes blobDrift1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(60px, 40px) scale(1.08); }
          50% { transform: translate(30px, 80px) scale(0.95); }
          75% { transform: translate(-40px, 30px) scale(1.05); }
        }
        @keyframes blobDrift2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          30% { transform: translate(-50px, -40px) scale(1.1); }
          60% { transform: translate(-20px, -70px) scale(0.92); }
          80% { transform: translate(30px, -30px) scale(1.04); }
        }
        @keyframes rotateBorder {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
      ` }} />

      <main className="pt-16 relative z-10">
        {/* Hero Section */}
        <section className="pt-8 pb-4 relative overflow-hidden">
          <div className="container mx-auto px-6">
            <motion.div
              className="text-center mb-6"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6 text-[#111111]">
                Our <span className="text-[#FFA800]" style={{ textShadow: "0 0 40px rgba(255,168,0,0.3), 0 0 80px rgba(255,168,0,0.12)" }}>Services</span>
              </h1>
              <p
                className="max-w-4xl text-xl md:text-2xl font-bold leading-relaxed mx-auto"
                style={{ color: "#1a1a1a" }}
              >
                We deliver cost-effective solutions for Government & Private Tenders and modern IT requirements.
                <span className="block mt-3 text-base md:text-lg font-medium leading-relaxed opacity-85" style={{ color: "#2d2d2d" }}>
                  From manpower, housekeeping, horticulture, canteen, facility management, and maintenance services to website, mobile app, software, cloud, and cybersecurity solutions — we provide quality services at competitive prices with reliable execution and professional support.
                </span>
              </p>
            </motion.div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-6">
          <div className="container mx-auto px-6">
            {selectedId && (
              <div className="mb-6 flex justify-center">
                <Button
                  onClick={() => {
                    setSelectedId(null)
                    if (typeof window !== "undefined") {
                      window.history.replaceState({}, "", "/services")
                    }
                  }}
                  className="bg-[#FFA800] hover:bg-[#E58F00] text-black font-semibold px-8 py-3 rounded-full shadow-lg"
                >
                  ← Show All Services
                </Button>
              </div>
            )}
            <div className={`grid ${selectedId ? "grid-cols-1 max-w-lg mx-auto" : "md:grid-cols-2 lg:grid-cols-3"} gap-8`}>
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
                displayedServices.map((service, index) => (
                  <motion.div
                    key={service.id}
                    className="group relative flex flex-col h-full"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -10 }}
                  >
                    {/* Rotating border animation wrapper */}
                    <div className="service-card-border group relative h-full rounded-[22px] overflow-hidden transition-all duration-[350ms] ease-out hover:-translate-y-1.5 w-full flex flex-col">
                      {/* Rotating conic gradient (the animated border) */}
                      <div
                        className="absolute w-[200%] h-[200%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0"
                        style={{
                          background: "conic-gradient(from 0deg at 50% 50%, #00c3ff 0%, #7b2ff7 25%, #00f2c3 55%, #ffe600 85%, #00c3ff 100%)",
                          animation: "rotateBorder 5s linear infinite",
                          filter: "blur(10px) brightness(1.25)",
                        }}
                      />
                      {/* Inner card (mask) */}
                      <div
                        className="relative z-[1] h-full rounded-[19px] flex flex-col flex-grow"
                        style={{
                          margin: "3px",
                          background: "rgba(23,23,23,0.95)",
                          backdropFilter: "blur(12px)",
                          boxShadow: "inset 0 0 20px rgba(255,168,0,0.05), 0 4px 30px rgba(0,0,0,0.3)",
                        }}
                      >
                        {/* Card Content */}
                        <div className="relative z-10 flex flex-col flex-grow p-4 sm:p-5 text-left">
                          {/* Service Image */}
                          {service.icon ? (
                            <div className="relative w-full aspect-[2/1] rounded-[14px] overflow-hidden mb-4 border border-white/[0.06]">
                              <Image
                                src={service.icon}
                                alt={`${service.title} image`}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                              />
                              {/* Dark gradient overlay on image */}
                              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/60 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-300" />
                              {/* Orange hover overlay */}
                              <div className="absolute inset-0 bg-gradient-to-t from-[#FFA800]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                          ) : null}

                          {/* Icon Badge + Title Row */}
                          <div className="flex items-start gap-2.5 mb-3">
                            {/* Orange Icon Badge */}
                            <div
                              className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-[#FFA800] mt-0.5 transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(255,168,0,0.25)]"
                              style={{
                                background: "rgba(255,168,0,0.08)",
                                border: "1px solid rgba(255,168,0,0.20)",
                              }}
                            >
                              <ServiceIcon title={service.title} />
                            </div>
                            <h3 className="text-lg lg:text-xl font-bold text-white group-hover:text-[#FFA800] transition-colors duration-300 leading-snug">
                              {service.title}
                            </h3>
                          </div>

                          {/* Description */}
                          <p className="text-sm leading-relaxed mb-3 flex-grow line-clamp-3" style={{ color: "#A8A8A8" }}>
                            {service.description}
                          </p>

                          {/* Features */}
                          <div className="mb-4">
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
                              {service.features?.map((feature, idx) => (
                                <li key={idx} className="flex items-center text-xs">
                                  <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mr-2" style={{ background: "rgba(255,168,0,0.10)" }}>
                                    <Check className="w-2.5 h-2.5 text-[#FFA800]" />
                                  </div>
                                  <span style={{ color: "#A8A8A8" }}>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Price Tag if exists */}
                          {service.price && (
                            <div className="mb-4">
                              <p className="text-base font-bold text-[#FFA800]">{service.price}</p>
                            </div>
                          )}

                          {/* Action Button */}
                          <div className="mt-auto">
                            <Link href="/contact" className="w-full block">
                              <button
                                className="w-full py-2.5 px-4 rounded-xl font-semibold text-sm transition-all duration-300 cursor-pointer text-[#0A0A0A] bg-[#FFA800] border border-[#FFA800] hover:bg-[#E58F00] hover:border-[#E58F00] hover:shadow-[0_0_20px_rgba(255,168,0,0.3)]"
                              >
                                Get Started
                              </button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </section>

      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  )
}
