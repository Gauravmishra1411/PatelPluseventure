"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useInView, useSpring, useMotionValue } from "framer-motion"
import { db } from "@/lib/firebase"
import { collection, onSnapshot } from "firebase/firestore"
import { Users, Award, Clock, Target, Zap, Code, Brain, Shield, Star, Check, Plus, Percent } from "lucide-react";

const iconComponents: { [key: string]: React.ElementType } = {
    Users, Award, Clock, Target, Zap, Code, Brain, Shield, Star, Check, Plus, Percent
};

function Counter({ value }: { value: number }) {
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
        const unsub = onSnapshot(collection(db, "home_about_stats"), (snapshot: any) => {
            const loadedStats = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
            setStats(loadedStats);
        });
        return () => unsub();
    }, [])

    // Fallback to default stats if none are loaded from database
    const displayStats = stats.length > 0 ? stats : [
        {
            number: "50",
            suffix: "+",
            title: "PROJECTS COMPLETED",
            icon: "Award"
        },
        {
            number: "100",
            suffix: "%",
            title: "CLIENT SATISFACTION",
            icon: "Star"
        },
        {
            number: "24",
            suffix: "/7",
            title: "SUPPORT AVAILABLE",
            icon: "Clock"
        },
        {
            number: "10",
            suffix: "+",
            title: "AWARDS WON",
            icon: "Target"
        },
    ];

    return (
        <section
            id="counters"
            className="py-12 md:py-16 relative overflow-hidden border-y border-[#FDE68A]"
            style={{
                background: "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 35%, #FFFFFF 70%, #FFFBEB 100%)"
            }}
        >
            {/* Background Ambient Glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#FBBF24]/15 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-[#F59E0B]/15 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x-0 md:divide-x divide-[#FDE68A]">
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
                                className="flex flex-col items-center justify-center space-y-3 px-4"
                            >
                                {/* Icon Background & Icon */}
                                <div className="w-14 h-14 rounded-2xl bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center mb-1 shadow-sm hover:scale-105 transition-transform duration-300">
                                    <Icon className="w-7 h-7 text-[#F59E0B]" />
                                </div>

                                {/* Number (Amber Gradient) */}
                                <div className="text-4xl sm:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#D97706] bg-clip-text text-transparent flex items-center justify-center drop-shadow-sm">
                                    <span className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                                        <Counter value={numValue} />
                                    </span>
                                    <span>{stat.suffix || ''}</span>
                                </div>

                                {/* Subtitle / Label */}
                                <p className="text-xs sm:text-sm text-[#374151] font-bold uppercase tracking-wider">
                                    {stat.title}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    )
}
