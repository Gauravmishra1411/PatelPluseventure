
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
    const statsUnsub = onSnapshot(collection(db, "home_about_stats"), (snapshot: any) => {
      setStats(snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })))
    });

    const valuesUnsub = onSnapshot(collection(db, "about_values"), (snapshot: any) => {
      setValues(snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })))
      setLoading(false)
    })

    return () => {
      statsUnsub()
      valuesUnsub()
    }
  }, [])

  return (
    <section id="about" className="py-6 md:py-12 lg:py-20 relative overflow-hidden bg-[#FFFBF2] dark:bg-[#181510]">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-full h-full bg-[url('/grid.svg')] opacity-[0.03] dark:opacity-[0.1]" />
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#FFA800]/10 rounded-full blur-3xl opacity-50 dark:opacity-100" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-[#FFA800]/10 rounded-full blur-3xl opacity-50 dark:opacity-100" />
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
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-[#FFA800]">
            About Patel Pulse Ventures
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
      </div>
    </section>
  )
}
