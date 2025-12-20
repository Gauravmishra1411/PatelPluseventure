"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { collection, onSnapshot, query, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface TeamMember {
    id: string
    name: string
    role: string
    bio: string
    image: string
    skills?: string[]
    order?: number
}

export default function Team() {
    const [team, setTeam] = useState<TeamMember[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const q = query(collection(db, "about_team"), orderBy("order", "asc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setTeam(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TeamMember)))
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    if (loading) return null

    return (
        <section className="py-6 md:py-12 lg:py-20 bg-background relative overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-6">
                        Meet Our Team
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        The talented individuals driving innovation and excellence at Patel Pulse Ventures.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {team.map((member, index) => (
                        <motion.div
                            key={member.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="group relative bg-card/60 backdrop-blur-sm border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
                        >
                            <div className="aspect-square relative overflow-hidden bg-muted">
                                <img
                                    src={member.image || "/placeholder.svg"}
                                    alt={member.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>

                            <div className="p-6">
                                <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                                    {member.name}
                                </h3>
                                <p className="text-sm font-medium text-primary mb-3">
                                    {member.role}
                                </p>
                                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                                    {member.bio}
                                </p>

                                {member.skills && (
                                    <div className="flex flex-wrap gap-2">
                                        {member.skills.slice(0, 3).map((skill, i) => (
                                            <span
                                                key={i}
                                                className="text-xs px-2 py-1 rounded-full bg-secondary/20 text-secondary-foreground border border-secondary/20"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
