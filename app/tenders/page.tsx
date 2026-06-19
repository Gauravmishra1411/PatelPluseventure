"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { db } from "@/lib/firebase"
import { collection, doc, getDoc, getDocs, query } from "firebase/firestore"
import Image from "next/image"
import { ExternalLink } from "lucide-react"
import { SupportCard } from "@/components/support-card"

export default function TendersPage() {
  const [headerData, setHeaderData] = useState<any>(null)
  const [tenders, setTenders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAllGov, setShowAllGov] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headerDoc = await getDoc(doc(db, "tenders_header", "main"))
        if (headerDoc.exists()) {
          setHeaderData(headerDoc.data())
        }

        const listQuery = query(collection(db, "tenders_list"))
        const listSnapshot = await getDocs(listQuery)
        const listData = listSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const govTenders = tenders.filter(t => (t.category || "").toLowerCase().includes("government"))
  const privateTenders = tenders.filter(t => (t.category || "").toLowerCase().includes("private"))

  return (
    <div className="min-h-screen bg-background text-foreground pt-24 pb-12">
      {/* Header Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-[60vh] flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight text-[#4AF3F3]">
            {headerData?.heading || "TENDERS & PROCUREMENT AT PATEL PULSE VENTURES"}
          </h1>

          {tenders.length > 0 && (
            <div className="w-full max-w-7xl mx-auto py-12 px-2 sm:px-6">
              {govTenders.length > 0 && (
                <div className="mb-12">
                  <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="text-2xl sm:text-3xl font-extrabold mb-4 text-left text-gray-900 dark:text-white pl-4 border-l-4 border-[#1E3A8A]"
                  >
                    Government Tenders
                  </motion.h2>
                  <button
                    onClick={() => setShowAllGov(!showAllGov)}
                    className="ml-4 mb-4 px-4 py-2 bg-[#1E3A8A]/20 text-[#1E3A8A] rounded-full hover:bg-[#1E3A8A] hover:text-black transition-colors"
                  >
                    {showAllGov ? 'Show Less' : 'View All'}
                  </button>

                  {showAllGov ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {govTenders.map((tender, index) => {
                        const bgColors = [
                          "bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-zinc-900",
                          "bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-zinc-900",
                          "bg-gradient-to-br from-teal-50 to-white dark:from-teal-900/20 dark:to-zinc-900",
                          "bg-gradient-to-br from-rose-50 to-white dark:from-rose-900/20 dark:to-zinc-900"
                        ];
                        const bgClass = bgColors[index % bgColors.length];
                        return (
                          <motion.div
                            key={tender.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -8, scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                            className={`snap-start shrink-0 w-full max-w-[300px] border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 shadow-lg hover:shadow-2xl relative overflow-hidden group flex flex-col h-[340px] ${bgClass}`}
                          >
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#4AF3F3] to-blue-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out" />
                            <div className="mb-4 flex items-center justify-between">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/80 dark:bg-black/50 text-gray-800 dark:text-gray-200 backdrop-blur-sm border border-gray-200 dark:border-zinc-700 shadow-sm">
                                {tender.category}
                              </span>
                              {tender.url && (
                                <a href={tender.url} target="_blank" rel="noopener noreferrer" className="bg-[#4AF3F3]/20 text-[#00E5E5] p-2.5 rounded-full hover:bg-[#4AF3F3] hover:text-black transition-all duration-300 shrink-0 shadow-sm group-hover:shadow-md">
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              )}
                            </div>
                            <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-4 pr-4 leading-tight">
                              {tender.title}
                            </h3>
                            {tender.bulletPoints && tender.bulletPoints.length > 0 && (
                              <ul className="space-y-3 mt-2 text-gray-600 dark:text-gray-400 flex-grow overflow-y-auto pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                {tender.bulletPoints.map((point: string, i: number) => (
                                  <li key={i} className="flex items-start">
                                    <span className="text-[#1E3A8A] mr-3 mt-1 text-lg leading-none">•</span>
                                    <span className="text-sm font-medium leading-relaxed">{point}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-[#4AF3F3]/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-nowrap overflow-x-auto scroll-smooth gap-6 pb-8 pt-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                      {govTenders.map((tender, index) => {
                        const bgColors = [
                          "bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-zinc-900",
                          "bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-zinc-900",
                          "bg-gradient-to-br from-teal-50 to-white dark:from-teal-900/20 dark:to-zinc-900",
                          "bg-gradient-to-br from-rose-50 to-white dark:from-rose-900/20 dark:to-zinc-9"
                        ];
                        const bgClass = bgColors[index % bgColors.length];
                        return (
                          <motion.div
                            key={tender.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -8, scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                            className={`snap-start shrink-0 w-[30%] md:w-[30%] max-w-[300px] border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 shadow-lg hover:shadow-2xl relative overflow-hidden group flex flex-col h-[340px] ${bgClass}`}
                          >
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#4AF3F3] to-blue-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out" />
                            <div className="mb-4 flex items-center justify-between">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/80 dark:bg-black/50 text-gray-800 dark:text-gray-200 backdrop-blur-sm border border-gray-200 dark:border-zinc-700 shadow-sm">
                                {tender.category}
                              </span>
                              {tender.url && (
                                <a href={tender.url} target="_blank" rel="noopener noreferrer" className="bg-[#4AF3F3]/20 text-[#00E5E5] p-2.5 rounded-full hover:bg-[#4AF3F3] hover:text-black transition-all duration-300 shrink-0 shadow-sm group-hover:shadow-md">
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              )}
                            </div>
                            <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-4 pr-4 leading-tight">
                              {tender.title}
                            </h3>
                            {tender.bulletPoints && tender.bulletPoints.length > 0 && (
                              <ul className="space-y-3 mt-2 text-gray-600 dark:text-gray-400 flex-grow overflow-y-auto pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                {tender.bulletPoints.map((point: string, i: number) => (
                                  <li key={i} className="flex items-start">
                                    <span className="text-[#1E3A8A] mr-3 mt-1 text-lg leading-none">•</span>
                                    <span className="text-sm font-medium leading-relaxed">{point}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-[#4AF3F3]/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {privateTenders.length > 0 && (
                <div className="mb-8">
                  <motion.h2 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="text-2xl sm:text-3xl font-extrabold mb-6 text-left text-gray-900 dark:text-white pl-4 border-l-4 border-purple-500"
                  >
                    Private Tenders
                  </motion.h2>
                  <div className="flex flex-nowrap overflow-x-auto scroll-smooth gap-6 pb-8 pt-4 px-2 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {privateTenders.map((tender, index) => {
                      const bgColors = [
                          "bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/20 dark:to-zinc-900",
                          "bg-gradient-to-br from-pink-50 to-white dark:from-pink-900/20 dark:to-zinc-900",
                          "bg-gradient-to-br from-fuchsia-50 to-white dark:from-fuchsia-900/20 dark:to-zinc-900",
                          "bg-gradient-to-br from-violet-50 to-white dark:from-violet-900/20 dark:to-zinc-900"
                      ];
                      const bgClass = bgColors[index % bgColors.length];
                      
                      return (
                        <motion.div 
                          key={tender.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          whileHover={{ y: -8, scale: 1.02 }}
                          transition={{ duration: 0.3 }}
                          className={`snap-center shrink-0 w-[300px] md:w-[380px] border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 shadow-lg hover:shadow-2xl relative overflow-hidden group flex flex-col h-[380px] ${bgClass}`}
                        >
                          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out" />
                          
                          <div className="mb-4 flex items-center justify-between">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/80 dark:bg-black/50 text-gray-800 dark:text-gray-200 backdrop-blur-sm border border-gray-200 dark:border-zinc-700 shadow-sm">
                              {tender.category}
                            </span>
                            {tender.url && (
                              <a 
                                href={tender.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="bg-purple-500/10 text-purple-600 dark:text-purple-400 p-2.5 rounded-full hover:bg-purple-500 hover:text-white transition-all duration-300 shrink-0 shadow-sm group-hover:shadow-md"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                          </div>

                          <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-4 pr-4 leading-tight">
                            {tender.title}
                          </h3>
                          
                          {tender.bulletPoints && tender.bulletPoints.length > 0 && (
                            <ul className="space-y-3 mt-2 text-gray-600 dark:text-gray-400 flex-grow overflow-y-auto pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                              {tender.bulletPoints.map((point: string, i: number) => (
                                <li key={i} className="flex items-start">
                                  <span className="text-purple-500 mr-3 mt-1 text-lg leading-none">•</span>
                                  <span className="text-sm font-medium leading-relaxed">{point}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                          
                          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              )}

            </div>
          )}
          
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-medium leading-relaxed">
            {headerData?.subheading || "We invite eligible contractors, suppliers, and service providers to bid on our construction and infrastructure projects. All tenders are evaluated on technical competence, financial capability, and value for money."}
          </p>

          {headerData?.description && (
            <p className="text-md text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              {headerData.description}
            </p>
          )}

          {headerData?.image && (
            <div className="mt-8 relative w-full max-w-3xl mx-auto aspect-video rounded-2xl overflow-hidden shadow-2xl">
              <Image 
                src={headerData.image} 
                alt="Tenders and Procurement" 
                fill 
                className="object-cover"
              />
            </div>
          )}


        </motion.div>
      </section>



      <SupportCard />
    </div>
  )
}
