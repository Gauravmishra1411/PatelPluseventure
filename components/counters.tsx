"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useInView, useSpring, useMotionValue } from "framer-motion"
import { db } from "@/lib/firebase"
import { collection, onSnapshot } from "firebase/firestore"
import { Users, Award, Clock, Target, Zap, Code, Brain, Shield, Star, Check, Plus, Percent } from "lucide-react";

const iconComponents: { [key: string]: React.ElementType } = {
    Users, Award, Clock, Target, Zap, Code, Brain, Shield, Star, Check, Plus, Percent
};

function Counter({ value, suffix = "" }: { value: number, suffix?: string }) {
    const ref = useRef<HTMLSpanElement>(null)
    const motionValue = useMotionValue(0)
    const springValue = useSpring(motionValue, { damping: 30, stiffness: 100 })
    const isInView = useInView(ref, { once: true, margin: "0px" })

    useEffect(() => {
        if (isInView) {
            motionValue.set(value)
        }
    }, [isInView, value, motionValue])

    useEffect(() => {
        return springValue.on("change", (latest) => {
            if (ref.current) {
                ref.current.textContent = Math.floor(latest).toLocaleString()
            }
        })
    }, [springValue])

    return <span ref={ref}>{value}</span>
}

export default function Counters() {
    const [stats, setStats] = useState<any[]>([])

    useEffect(() => {
        const unsub = onSnapshot(collection(db, "home_about_stats"), (snapshot) => {
            const loadedStats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setStats(loadedStats);
        });
        return () => unsub();
    }, [])

    // Fallback to default stats if none are loaded from database
    const displayStats = stats.length > 0 ? stats : [
        {
            number: "50",
            suffix: "+",
            title: "Projects Completed",
            icon: "Award"
        },
        {
            number: "100",
            suffix: "%",
            title: "Client Satisfaction",
            icon: "Star"
        },
        {
            number: "24",
            suffix: "/7",
            title: "Support Available",
            icon: "Clock"
        },
        {
            number: "10",
            suffix: "+",
            title: "Awards Won",
            icon: "Target"
        },
    ];

    return (
        <section id="counters" className="py-6 md:py-12 lg:py-20 dark:bg-gradient-to-br dark:from-[#0A0F1C] dark:via-[#0D1829] dark:to-[#0A0F1C] border-t border-gray-200 dark:border-accent/20 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-full h-full bg-[url('/grid.svg')] opacity-[0.02] dark:opacity-[0.05]" />
                <div className="absolute -top-20 -right-20 w-96 h-96 bg-emerald-400/10 dark:bg-accent/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-green-400/10 dark:bg-primary/10 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x-0 md:divide-x divide-gray-200 dark:divide-accent/20">
                    {displayStats.map((stat, index) => {
                        const Icon = iconComponents[stat.icon] || Target;
                        const numValue = parseInt(stat.number) || 0;

                        return (
                            <motion.div
                                key={stat.id || index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="flex flex-col items-center justify-center space-y-3"
                            >
                                <div className="w-14 h-14 rounded-xl bg-[hsl(88,60%,63%)]/20 dark:from-primary/20 dark:to-accent/20 flex items-center justify-center mb-2 shadow-sm dark:shadow-[0_0_20px_rgba(142,217,104,0.15)]">
                                    <Icon className="w-7 h-7 text-[#1A532A] dark:text-accent" />
                                </div>
                                <div className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-[#1A532A] via-[#8ED968] to-[#1A532A] dark:from-primary dark:to-accent bg-clip-text text-transparent flex items-center justify-center tracking-tight">
                                    <Counter value={numValue} />
                                    <span>{stat.suffix || ''}</span>
                                </div>
                                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 font-medium uppercase tracking-wider">{stat.title}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    )
}
