
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
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  About Patel Pulse Ventures
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Pioneering excellence in construction, infrastructure, and contracting services
              </p>
            </motion.div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                className="space-y-8"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold mb-6">
                    <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      Our Story
                    </span>
                  </h2>
                  {story.paragraphs.map((p, i) => (
                    <p key={i} className="text-lg text-muted-foreground leading-relaxed mb-6">
                      {p}
                    </p>
                  ))}
                </div>
              </motion.div>

              <motion.div
                className="relative"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="relative group">
                  <motion.div
                    className="relative overflow-hidden rounded-2xl"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Image
                      src={story.image || "https://placehold.co/600x500.png"}
                      alt="Patel Pulse Ventures Team"
                      width={600}
                      height={500}
                      data-ai-hint="team business"
                      className="w-full h-[400px] md:h-[500px] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
                  </motion.div>

                  <motion.div
                    className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-r from-primary to-accent rounded-2xl opacity-20 blur-xl hidden lg:block"
                    animate={{ y: [0, -20, 0], rotate: [0, 180, 360], scale: [1, 1.2, 1] }}
                    transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  />

                  <motion.div
                    className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-r from-sky-400 to-pink-500 rounded-full opacity-20 blur-xl hidden lg:block"
                    animate={{ y: [0, 20, 0], rotate: [360, 180, 0], scale: [1, 1.3, 1] }}
                    transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, delay: 1, ease: "easeInOut" }}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-6"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              {stats.map((stat, index) => {
                const Icon = iconComponents[stat.icon];
                if (!Icon) return null;
                const gradient = statGradients[stat.icon as keyof typeof statGradients] || "from-gray-400 to-gray-600";
                return (
                  <motion.div
                    key={stat.id}
                    className="relative group text-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="p-8 bg-secondary/10 backdrop-blur-sm border border-primary/20 rounded-2xl relative overflow-hidden">
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                      />

                      <div className="relative z-10">
                        <motion.div
                          className={`w-16 h-16 bg-gradient-to-r ${gradient} rounded-2xl flex items-center justify-center mx-auto mb-4`}
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Icon className="w-8 h-8 text-white" />
                        </motion.div>

                        <motion.div
                          className="text-4xl font-bold text-foreground mb-2"
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                          viewport={{ once: true }}
                        >
                          {stat.number}{stat.suffix}
                        </motion.div>

                        <div className="text-muted-foreground font-medium">{stat.title}</div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Our Values
                </span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">The principles that guide everything we do</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const Icon = iconComponents[value.icon];
                if (!Icon) return null;
                const gradient = "from-primary to-accent";
                return (
                  <motion.div
                    key={value.id}
                    className="group relative"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -10 }}
                  >
                    <div className="p-8 h-full bg-secondary/10 backdrop-blur-sm border border-primary/20 rounded-2xl text-center relative overflow-hidden">
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                      />
                      <div className="relative z-10">
                        <motion.div
                          className={`w-16 h-16 bg-gradient-to-r ${gradient} rounded-2xl flex items-center justify-center mx-auto mb-6`}
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Icon className="w-8 h-8 text-primary-foreground" />
                        </motion.div>

                        <h3 className="text-xl font-bold text-foreground mb-4">{value.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-[#1565c0] via-[#81f5fd] to-[#1565c0] bg-clip-text text-transparent">
                  Meet Our Team
                </span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                The talented individuals behind Patel Pulse Ventures&apos;s success
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <motion.div
                  key={member.id}
                  className="group relative"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                >
                  <div className="p-6 bg-secondary/10 backdrop-blur-sm border border-primary/20 rounded-2xl text-center relative overflow-hidden">
                    <div className="relative z-10">
                      <motion.div className="relative mb-6" whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                        <Image
                          src={member.image || "https://placehold.co/200x200.png"}
                          alt={member.name}
                          width={200}
                          height={200}
                          data-ai-hint="person face"
                          className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-primary/20"
                        />

                      </motion.div>

                      <h3 className="text-xl font-bold text-foreground mb-2">{member.name}</h3>
                      <p className="text-primary font-medium mb-4">{member.role}</p>
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{member.bio}</p>

                      <div className="flex flex-wrap gap-2 justify-center">
                        {member.skills.map((skill: string) => (
                          <span
                            key={skill}
                            className="px-2 py-1 bg-primary/10 border border-primary/20 rounded-lg text-xs text-primary"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
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
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Ready to Work Together?
                </span>
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Let&apos;s collaborate on your next major infrastructure project. Get in touch with our team today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold px-8 py-4 text-lg hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
                >
                  <Link href="/contact">
                    Start Your Project
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-primary/30 text-primary hover:bg-primary/10 hover:border-primary px-8 py-4 text-lg bg-transparent"
                >
                  <Link href="/services">
                    View Our Services
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  )
}
