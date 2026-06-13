"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Check, Code, Zap } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import MobileBottomNav from "@/components/mobile-bottom-nav"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

interface Service {
    id: string
    icon?: string
    title: string
    description: string
    features: string[]
    technologies: string[]
    gradient: string
    price: string
}

export default function ServiceDetailPage() {
    const params = useParams()
    const id = params.id as string
    const [service, setService] = useState<Service | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const fetchService = async () => {
            try {
                const docRef = doc(db, "services", id)
                const docSnap = await getDoc(docRef)
                if (docSnap.exists()) {
                    setService({ id: docSnap.id, ...docSnap.data() } as Service)
                } else {
                    router.push("/services")
                }
            } catch (error) {
                console.error("Error fetching service:", error)
            } finally {
                setLoading(false)
            }
        }

        if (id) fetchService()
    }, [id, router])

    if (loading) {
        return (
            <div className="min-h-screen bg-background text-foreground flex flex-col">
                <Navbar />
                <main className="flex-grow pt-24 container mx-auto px-6">
                    <Skeleton className="h-12 w-3/4 mb-8" />
                    <Skeleton className="h-96 w-full rounded-2xl mb-8" />
                    <div className="grid md:grid-cols-2 gap-8">
                        <Skeleton className="h-64 w-full" />
                        <Skeleton className="h-64 w-full" />
                    </div>
                </main>
            </div>
        )
    }

    if (!service) return null

    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
            <main className="pt-24 pb-20">
                <div className="container mx-auto px-6">
                    <Button variant="ghost" onClick={() => router.back()} className="mb-8 pl-0 hover:bg-transparent text-muted-foreground hover:text-foreground group">
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Services
                    </Button>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className={`relative p-8 md:p-12 rounded-3xl overflow-hidden mb-12`}
                    >
                        {/* Background Gradient */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient || 'from-primary/10 to-accent/10'} opacity-10`} />
                        <div className="absolute inset-0 backdrop-blur-3xl" />

                        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                {service.icon && (
                                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${service.gradient || 'from-primary to-accent'} flex items-center justify-center mb-6 shadow-lg`}>
                                        <Image src={service.icon} alt={service.title} width={40} height={40} className="text-white invert" />
                                    </div>
                                )}
                                <h1 className="text-4xl md:text-5xl font-bold mb-6">{service.title}</h1>
                                <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                                    {service.description}
                                </p>
                                <div className="flex items-center gap-4">
                                    <span className="text-2xl font-bold text-primary">{service.price}</span>
                                    <Link href="/contact">
                                        <Button size="lg" className="bg-gradient-to-r from-[#1565c0] via-[#81f5fd] to-[#81f5fd] text-primary-foreground">
                                            Get Started...
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-12 mb-20">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-6"
                        >
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <Zap className="w-6 h-6 text-primary" /> Key Features
                            </h2>
                            <ul className="space-y-4">
                                {service.features && service.features.map((feature, index) => (
                                    <li key={index} className="flex items-start gap-3 p-4 rounded-xl bg-secondary/5 border border-border/50">
                                        <span className="mt-1 bg-green-500/20 text-[#81f5fd] rounded-full p-1"><Check className="w-3 h-3" /></span>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="space-y-6"
                        >
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <Code className="w-6 h-6 text-primary" /> Technologies
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {service.technologies && service.technologies.map((tech, index) => (
                                    <Badge key={index} variant="secondary" className="px-4 py-2 text-sm bg-secondary/10 hover:bg-secondary/20 border-border/50">
                                        {tech}
                                    </Badge>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    <section className="bg-secondary/5 rounded-3xl p-12 text-center border border-border/50">
                        <h2 className="text-3xl font-bold mb-4">Ready to elevate your business?</h2>
                        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">Get in touch with us today to discuss your project requirements.</p>
                        <Link href="/contact">
                            <Button size="lg" className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-8">
                                Contact Us Now
                            </Button>
                        </Link>
                    </section>
                </div>
            </main>

            <Footer />
            <MobileBottomNav />
        </div>
    )
}
