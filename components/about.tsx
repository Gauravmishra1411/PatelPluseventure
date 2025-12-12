
"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Users, Award, Clock, Target, Zap, Code, Brain, Shield, Plus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { db } from "@/lib/firebase"
import { collection, onSnapshot } from "firebase/firestore"
const iconComponents: { [key: string]: React.ElementType } = {
  Users, Award, Clock, Target, Zap, Code, Brain, Shield
};

export default function About() {
  const [stats, setStats] = useState<any[]>([])
  const [values, setValues] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const statsUnsub = onSnapshot(collection(db, "home_about_stats"), (snapshot) => {
      setStats(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    });

    const valuesUnsub = onSnapshot(collection(db, "about_values"), (snapshot) => {
      setValues(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      setLoading(false)
    })

    return () => {
      statsUnsub()
      valuesUnsub()
    }
  }, [])

  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-white dark:from-background dark:via-primary/20 dark:to-background">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-full h-full bg-[url('/grid.svg')] opacity-[0.03] dark:opacity-[0.1]" />
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl opacity-50 dark:opacity-100" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50 dark:opacity-100" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-[#1A532A] via-[#8ED968] to-[#1A532A] bg-clip-text text-transparent">
              About Patel Pulse Ventures
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            We are a team of passionate developers, designers, and innovators dedicated to transforming ideas into
            powerful digital solutions. With expertise in cutting-edge technologies and a commitment to excellence, we
            help businesses thrive in the digital age.
          </p>
        </motion.div>



        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-[#1A532A] to-[#8ED968] bg-clip-text text-transparent">
              Our Core Values
            </span>
          </h3>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const Icon = iconComponents[value.icon];
              if (!Icon) return null;
              return (
                <motion.div
                  key={value.id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="group p-6 rounded-2xl bg-white dark:bg-[#18181B] border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-lg bg-[hsl(88,60%,63%)] flex items-center justify-center flex-shrink-0 mb-4 shadow-[0_0_15px_rgba(142,217,104,0.3)]">
                      <Icon className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{value.title}</h4>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">{value.description}</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Card className="bg-white/50 dark:bg-gradient-to-br dark:from-background dark:to-primary border-gray-200 dark:border-accent/20 backdrop-blur-sm shadow-sm dark:shadow-none">
            <CardContent className="p-8 md:p-12">
              <h3 className="text-3xl md:text-4xl font-bold mb-6">
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  Our Mission
                </span>
              </h3>
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-4xl mx-auto">
                To empower businesses with innovative digital solutions that drive growth, enhance user experiences, and
                create lasting value. We believe in the transformative power of technology and are committed to
                delivering excellence in every project we undertake.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
