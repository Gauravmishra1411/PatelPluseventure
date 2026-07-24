
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Users, Target, Zap, Award, Heart, Code, Lightbulb, Rocket, Check, Star, Plus, Percent } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import MobileBottomNav from "@/components/mobile-bottom-nav"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { db } from "@/lib/firebase"
import { collection, doc, getDoc, onSnapshot, query, orderBy } from "firebase/firestore"
import { toast } from "sonner"
const iconComponents: { [key: string]: React.ElementType } = {
  Users, Target, Zap, Award, Code, Heart, Lightbulb, Rocket, Check, Star, Plus, Percent
};

const statGradients: { [key: string]: string } = {
  Users: "from-primary to-accent",
  Target: "from-accent to-sky-400",
  Zap: "from-sky-400 to-pink-500",
  Award: "from-pink-500 to-primary",
  Check: "from-green-400 to-emerald-400",
  Star: "from-yellow-400 to-amber-400",
  Plus: "from-sky-400 to-blue-400",
  Percent: "from-purple-400 to-pink-400",
}

export default function AboutPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<any[]>([])
  const [story, setStory] = useState({ paragraphs: [""], image: "" })
  const [values, setValues] = useState<any[]>([])
  const [team, setTeam] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsUnsub = onSnapshot(collection(db, "about_stats"), (snapshot) => {
          setStats(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
        });

        const storyUnsub = onSnapshot(doc(db, "about_story", "main"), (doc) => {
          if (doc.exists()) {
            setStory(doc.data() as any);
          }
        });

        const valuesUnsub = onSnapshot(collection(db, "about_values"), (snapshot) => {
          setValues(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
        })

        const teamQuery = query(collection(db, "about_team"), orderBy("order", "asc"));
        const teamUnsub = onSnapshot(teamQuery, (snapshot) => {
          setTeam(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
        })

        setLoading(false)

        return () => {
          statsUnsub();
          storyUnsub();
          valuesUnsub()
          teamUnsub()
        }
      } catch (error) {
        console.error("Failed to fetch about data:", error)
        toast.error("Could not load page content.")
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-foreground"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <main className="pt-24">

      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  )
}
