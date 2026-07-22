
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
    <section className="py-6 md:py-12 lg:py-20 relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-white dark:from-background dark:via-primary/20 dark:to-background">
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
            <span className="bg-gradient-to-r from-[#1565c0] via-[#81f5fd] to-[#1565c0] bg-clip-text text-transparent">
              About Patel Pulse Ventures
            </span>
          </h2>
          <div className="space-y-10 text-center">
            {/* First Paragraph */}
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed" style={{ textAlign: "justify" }}>
              at Patel Pulse Ventures, we specialize in handling both government and
              private sector tenders with professionalism, transparency, and
              efficiency. Our commitment to delivering high-quality projects on time
              has earned the trust of our clients across various industries.
            </p>

            {/* First 3 Images */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              <img
                src="https://res.cloudinary.com/ddthlutz4/image/upload/v1781244828/vjchttcd2lxyz8puoxwl.png"
                alt="Government Tender"
                className="w-full h-64 object-cover rounded-lg shadow-lg transition-transform duration-300 hover:scale-110 cursor-pointer"
              />
              <img
                src="https://res.cloudinary.com/ddthlutz4/image/upload/v1781244828/g06ldthf4i7sf1cyns7g.png"
                alt="Government Tender"
                className="w-full h-64 object-cover rounded-lg shadow-lg transition-transform duration-300 hover:scale-110 cursor-pointer"
              />
              <img
                src="https://res.cloudinary.com/ddthlutz4/image/upload/v1781244827/npdijotkgxqlz4wa4c6r.png"
                alt="Government Tender"
                className="w-full h-64 object-cover rounded-lg shadow-lg transition-transform duration-300 hover:scale-110 cursor-pointer"
              />
            </div>

            {/* Second Paragraph */}
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed" style={{ textAlign: "justify" }}>
              We ensure that every project is supported by legally compliant
              documentation and is executed under our registered GST business,
              maintaining complete transparency throughout the process. From tender
              participation to project completion, we provide regular day-to-day
              updates, ensuring our clients stay informed at every stage.
            </p>

            {/* Second 3 Images */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              <img
                src="https://res.cloudinary.com/ddthlutz4/image/upload/v1781245931/abh4h5wdoqnigbxw5eyc.png"
                alt="Trusted Services"
                className="w-full h-64 object-cover rounded-lg shadow-lg transition-transform duration-300 hover:scale-110 cursor-pointer"
              />
              <img
                src="https://res.cloudinary.com/ddthlutz4/image/upload/v1781245930/aghdcbovggt5dr6ze3v5.png"
                alt="Trusted Services"
                className="w-full h-64 object-cover rounded-lg shadow-lg transition-transform duration-300 hover:scale-110 cursor-pointer"
              />
              <img
                src="https://res.cloudinary.com/ddthlutz4/image/upload/v1781245925/ou8o6mz4eh00mu6tzfrm.png"
                alt="Trusted Services"
                className="w-full h-64 object-cover rounded-lg shadow-lg transition-transform duration-300 hover:scale-110 cursor-pointer"
              />
            </div>

            {/* Third Paragraph */}
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed" style={{ textAlign: "justify" }}>
              Our team is dedicated to timely project delivery, no unnecessary
              delays, and smooth billing processes, ensuring that invoices and
              payments are managed promptly and professionally. With a strong focus
              on reliability, quality, and customer satisfaction, we strive to build
              long-term partnerships and deliver results that exceed expectations.
            </p>

            {/* Third 3 Images */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              <img
                src="https://res.cloudinary.com/ddthlutz4/image/upload/v1781246600/jmpohekhlkf4spyflhjk.png"
                alt="Project Delivery"
                className="w-full h-64 object-cover rounded-lg shadow-lg transition-transform duration-300 hover:scale-110 cursor-pointer"
              />
              <img
                src="https://res.cloudinary.com/ddthlutz4/image/upload/v1781246599/psuo2np0ynziu3ggvdc9.png"
                alt="Billing Process"
                className="w-full h-64 object-cover rounded-lg shadow-lg transition-transform duration-300 hover:scale-110 cursor-pointer"
              />
              <img
                src="https://res.cloudinary.com/ddthlutz4/image/upload/v1781246599/itextrrikxdxvrxt2acy.png"
                alt="Customer Satisfaction"
                className="w-full h-64 object-cover rounded-lg shadow-lg transition-transform duration-300 hover:scale-110 cursor-pointer"
              />
            </div>
          </div>
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
            <span className="bg-gradient-to-r from-[#1565c0] to-[#81f5fd] bg-clip-text text-transparent">
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
                    <div className="w-12 h-12 rounded-lg bg-[#81f5fd] flex items-center justify-center flex-shrink-0 mb-4 shadow-[0_0_15px_rgba(39,152,245,0.3)]">
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
              <h3 className="text-3xl md:text-4xl font-bold mb-6" style={{ textShadow: "-10px -13px 13px rgba(255,255,255,0.8)" }}>
                <span className="bg-gradient-to-r from-[#1565c0] via-[#81f5fd] to-[#81f5fd] bg-clip-text text-transparent">
                  Our Mission
                </span>
              </h3>
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-4xl mx-auto">
                To deliver government and private sector tender projects with integrity, transparency, and excellence while ensuring timely execution and complete client satisfaction. We are committed to providing legally compliant, GST-registered services, maintaining clear communication throughout every stage of the project, and building long-term partnerships through quality workmanship, reliability, and trust.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
