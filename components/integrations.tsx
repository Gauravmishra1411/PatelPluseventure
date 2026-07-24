"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { db } from "@/lib/firebase"
import { collection, getDocs, query } from "firebase/firestore"
import { ExternalLink } from "lucide-react"

export default function Integrations() {
    const [tenders, setTenders] = useState<any[]>([])

    useEffect(() => {
        const fetchTenders = async () => {
            try {
                const listQuery = query(collection(db, "tenders_list"))
                const listSnapshot = await getDocs(listQuery)
                const listData = listSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
                setTenders(listData)
            } catch (error) {
                console.error("Error fetching tenders:", error)
            }
        }
        fetchTenders()
    }, [])

    return (
        <section
            id="tenders"
            className="py-24 overflow-hidden text-white relative"
            style={{
                background: "linear-gradient(135deg, #020617 0%, #0F172A 35%, #1E293B 70%, #0F172A 100%)"
            }}
        >
            <div className="relative container mx-auto px-6 text-center z-10">
                <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-[#FFA800] max-w-4xl mx-auto leading-tight" style={{ textShadow: "0 0 30px rgba(255,168,0,0.3)" }}>
                    TENDERS & PROCUREMENT <br className="hidden md:block" /> AT PATEL PULSE VENTURES
                </h2>
                
                {tenders.length > 0 && (
                    <div className="w-full max-w-6xl mx-auto py-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                            {tenders.map((tender) => (
                                <motion.div 
                                    key={tender.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="bg-[#0F172A]/90 border border-white/15 rounded-2xl p-6 shadow-xl hover:border-[#FFA800]/60 transition-all duration-300 relative overflow-hidden group flex flex-col h-full backdrop-blur-md"
                                >
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FFA800] to-amber-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                                    
                                    <div className="mb-3 flex items-center justify-between">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/10 text-[#FFA800] border border-[#FFA800]/30">
                                            {tender.category}
                                        </span>
                                        {tender.url && (
                                            <a 
                                                href={tender.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="bg-[#FFA800]/15 text-[#FFA800] p-2 rounded-full hover:bg-[#FFA800] hover:text-black transition-colors shrink-0"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                        )}
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pr-4">
                                        {tender.title}
                                    </h3>
                                    
                                    {tender.bulletPoints && tender.bulletPoints.length > 0 && (
                                        <ul className="space-y-2 mt-auto text-gray-600 dark:text-gray-400 flex-grow">
                                            {tender.bulletPoints.map((point: string, i: number) => (
                                                <li key={i} className="flex items-start">
                                                    <span className="text-[#81f5fd] mr-2 mt-1 text-sm leading-none">•</span>
                                                    <span className="text-sm leading-relaxed">{point}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                <p className="mt-6 text-lg text-muted-foreground dark:text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
                    We invite eligible contractors, suppliers, and service providers to bid on our construction and infrastructure projects. All tenders are evaluated on technical competence, financial capability, and value for money.
                </p>
                <Link
                    href="/tenders"
                    className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-gray-900 bg-[#81f5fd] hover:bg-[#1565c0] hover:text-white rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
                >
                    View open tenders
                </Link>
            </div>
        </section>
    )
}
