"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { db } from "@/lib/firebase"
import { collection, doc, getDoc, getDocs, query } from "firebase/firestore"
import { ExternalLink, Landmark, Building2, Laptop, ArrowRight } from "lucide-react"
import { SupportCard } from "@/components/support-card"
import Footer from "@/components/footer"
import MobileBottomNav from "@/components/mobile-bottom-nav"

const defaultGov = [
  {
    id: "gov-1",
    title: "Indian Railways E-Procurement System (IREPS)",
    category: "Government Tenders",
    bulletPoints: ["Railway supply, infrastructure construction, & specialized service contracts.", "Official zonal e-procurement bidding."]
  },
  {
    id: "gov-2",
    title: "GeM (Government e-Marketplace)",
    category: "Government Tenders",
    bulletPoints: ["Direct government order bids and reverse auction opportunities.", "Special MSME and Startup vendor allocations."]
  },
  {
    id: "gov-3",
    title: "Central Public Procurement Portal (CPPP)",
    category: "Government Tenders",
    bulletPoints: ["Central ministry infrastructure, civil works, & manpower supply tenders.", "Transparent bid evaluations."]
  }
]

const defaultPrivate = [
  {
    id: "pvt-1",
    title: "Industrial & Manufacturing Operations Contract",
    category: "Private Tenders",
    bulletPoints: ["Turnkey plant maintenance, operations management, & logistics.", "Long-term private enterprise contracts."]
  },
  {
    id: "pvt-2",
    title: "Corporate Infrastructure & Commercial Development",
    category: "Private Tenders",
    bulletPoints: ["Commercial building development, electrical fitting, & civil work.", "Strict milestone SLA delivery."]
  }
]

const defaultIT = [
  {
    id: "it-1",
    title: "Enterprise Web & Cloud Software Solutions",
    category: "IT Tenders",
    bulletPoints: ["Custom ERP portals, web application development, & cloud deployment.", "Cybersecurity compliance & audit."]
  },
  {
    id: "it-2",
    title: "Smart City Digital Transformation Platform",
    category: "IT Tenders",
    bulletPoints: ["IoT device network, analytics dashboards, & real-time monitoring.", "Mobile app & backend infrastructure."]
  }
]

export default function TendersPage() {
  const [headerData, setHeaderData] = useState<any>(null)
  const [tenders, setTenders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headerDoc = await getDoc(doc(db, "tenders_header", "main"))
        if (headerDoc.exists()) {
          setHeaderData(headerDoc.data())
        }

        const listQuery = query(collection(db, "tenders_list"))
        const listSnapshot = await getDocs(listQuery)
        const listData = listSnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
        setTenders(listData)
      } catch (error) {
        console.error("Error fetching tenders data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617]">
        <div className="w-10 h-10 border-4 border-[#FFA800] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const dbGov = tenders.filter(t => {
    const cat = (t.category || "").toLowerCase()
    return cat.includes("government") || cat.includes("gov") || cat.includes("public")
  })
  const dbPrivate = tenders.filter(t => {
    const cat = (t.category || "").toLowerCase()
    return cat.includes("private") || cat.includes("corporate") || cat.includes("commercial")
  })
  const dbIT = tenders.filter(t => {
    const cat = (t.category || "").toLowerCase()
    return cat.includes("it") || cat.includes("software") || cat.includes("tech") || cat.includes("app") || cat.includes("cloud")
  })

  const govList = dbGov.length > 0 ? dbGov : defaultGov
  const privateList = dbPrivate.length > 0 ? dbPrivate : defaultPrivate
  const itList = dbIT.length > 0 ? dbIT : defaultIT

  return (
    <div
      className="min-h-screen text-white pt-24 pb-16 relative overflow-hidden bg-[linear-gradient(-45deg,#020617,#111827,#1e293b,#f59e0b,#facc15,#111827)] bg-400 animate-gradient transition-all duration-1000"
    >
      {/* ── Header ── */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-6 pb-12 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto space-y-4"
        >
          <div className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FFA800]/15 border border-[#FFA800]/30 text-[#FFA800]">
            Procurement Portal
          </div>
          <h1
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight text-[#FFA800] leading-tight"
            style={{ textShadow: "0 0 35px rgba(255,168,0,0.3)" }}
          >
            {headerData?.heading || "TENDERS & PROCUREMENT AT PATEL PULSE VENTURES"}
          </h1>
          <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto font-medium leading-relaxed">
            {headerData?.subheading || "Explore open procurement contracts across Government, Private enterprise, and IT software sectors."}
          </p>
        </motion.div>
      </section>

      {/* ── 3 Column-Wise Listing Section (Government, Private, IT) ── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">

          {/* 🏛️ COLUMN 1: GOVERNMENT TENDERS */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col h-full bg-[#0B1329]/90 border border-amber-500/25 rounded-3xl p-6 shadow-2xl backdrop-blur-md relative overflow-hidden"
          >
            <div className="flex items-center gap-3 pb-4 mb-6 border-b border-amber-500/30">
              <div className="w-10 h-10 rounded-xl bg-[#FFA800]/15 border border-[#FFA800]/30 flex items-center justify-center text-[#FFA800]">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-[#FFA800]">Government Tenders</h2>
                <span className="text-xs text-gray-400">{govList.length} Opportunities Available</span>
              </div>
            </div>

            <div className="space-y-4 flex-grow">
              {govList.map((tender) => (
                <div
                  key={tender.id}
                  className="group bg-[#0F172A] border border-white/10 hover:border-[#FFA800]/60 rounded-2xl p-5 transition-all duration-300 shadow-md hover:shadow-[0_0_20px_rgba(255,168,0,0.15)] flex flex-col"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FFA800]/10 text-[#FFA800] border border-[#FFA800]/25">
                      Government
                    </span>
                    {tender.url && (
                      <a href={tender.url} target="_blank" rel="noopener noreferrer" className="text-[#FFA800] hover:text-white p-1">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-[#FFA800] transition-colors leading-snug mb-2">
                    {tender.title}
                  </h3>
                  {tender.bulletPoints && tender.bulletPoints.length > 0 && (
                    <ul className="space-y-1.5 text-xs text-gray-300 leading-relaxed">
                      {tender.bulletPoints.map((point: string, i: number) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-[#FFA800] font-bold">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* 🏢 COLUMN 2: PRIVATE TENDERS */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col h-full bg-[#0B1329]/90 border border-cyan-500/25 rounded-3xl p-6 shadow-2xl backdrop-blur-md relative overflow-hidden"
          >
            <div className="flex items-center gap-3 pb-4 mb-6 border-b border-cyan-500/30">
              <div className="w-10 h-10 rounded-xl bg-[#4AF3F3]/15 border border-[#4AF3F3]/30 flex items-center justify-center text-[#4AF3F3]">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-[#4AF3F3]">Private Tenders</h2>
                <span className="text-xs text-gray-400">{privateList.length} Opportunities Available</span>
              </div>
            </div>

            <div className="space-y-4 flex-grow">
              {privateList.map((tender) => (
                <div
                  key={tender.id}
                  className="group bg-[#0F172A] border border-white/10 hover:border-[#4AF3F3]/60 rounded-2xl p-5 transition-all duration-300 shadow-md hover:shadow-[0_0_20px_rgba(74,243,243,0.15)] flex flex-col"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#4AF3F3]/10 text-[#4AF3F3] border border-[#4AF3F3]/25">
                      Private Enterprise
                    </span>
                    {tender.url && (
                      <a href={tender.url} target="_blank" rel="noopener noreferrer" className="text-[#4AF3F3] hover:text-white p-1">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-[#4AF3F3] transition-colors leading-snug mb-2">
                    {tender.title}
                  </h3>
                  {tender.bulletPoints && tender.bulletPoints.length > 0 && (
                    <ul className="space-y-1.5 text-xs text-gray-300 leading-relaxed">
                      {tender.bulletPoints.map((point: string, i: number) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-[#4AF3F3] font-bold">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* 💻 COLUMN 3: IT & SOFTWARE TENDERS */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col h-full bg-[#0B1329]/90 border border-purple-500/25 rounded-3xl p-6 shadow-2xl backdrop-blur-md relative overflow-hidden"
          >
            <div className="flex items-center gap-3 pb-4 mb-6 border-b border-purple-500/30">
              <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Laptop className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-purple-400">IT & Software Tenders</h2>
                <span className="text-xs text-gray-400">{itList.length} Opportunities Available</span>
              </div>
            </div>

            <div className="space-y-4 flex-grow">
              {itList.map((tender) => (
                <div
                  key={tender.id}
                  className="group bg-[#0F172A] border border-white/10 hover:border-purple-400/60 rounded-2xl p-5 transition-all duration-300 shadow-md hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] flex flex-col"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/25">
                      IT & Tech
                    </span>
                    {tender.url && (
                      <a href={tender.url} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-white p-1">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-purple-400 transition-colors leading-snug mb-2">
                    {tender.title}
                  </h3>
                  {tender.bulletPoints && tender.bulletPoints.length > 0 && (
                    <ul className="space-y-1.5 text-xs text-gray-300 leading-relaxed">
                      {tender.bulletPoints.map((point: string, i: number) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-purple-400 font-bold">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </section>

      <SupportCard />
      <Footer />
      <MobileBottomNav />
    </div>
  )
}
