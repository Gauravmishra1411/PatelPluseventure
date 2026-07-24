"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Logo } from "@/components/logo"
import { Mail, Phone, Facebook, MapPin, Github, Twitter, Linkedin, Instagram, ArrowUp, Youtube } from "lucide-react"
import { usePathname } from "next/navigation"
import { navItems, handleNavClick } from "@/lib/navigation"
import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { collection, onSnapshot } from "firebase/firestore"

const footerLinks = {
  company: [], // Replaced by navItems below
  services: [
    { name: "Manpower", href: "/services" },
    { name: "Horticulture", href: "/services" },
    { name: "Housekeeping", href: "/services" },
    { name: "Canteen Services", href: "/services" },
  ],
  resources: [
    { name: "Documentation", href: "/about" },
    { name: "Support", href: "/contact" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
  ],
}

const socialLinks = [
  { name: "LinkedIn", icon: Linkedin, href: "https://www.linkedin.com/company/patel-pulse-ventures" },
  { name: "Facebook", icon: Facebook, href: "https://www.facebook.com/profile.php?id=61582011557077" },
  { name: "Twitter", icon: Twitter, href: "https://x.com/patel_puls43877" },
  { name: "Instagram", icon: Instagram, href: "https://www.instagram.com/patel_pulse_ventures/?hl=en" },
  { name: "YouTube", icon: Youtube, href: "https://youtube.com/@patelpulseventures?si=FvwL5VT3tQgmN4IC" },
]

export default function Footer() {
  const pathname = usePathname()
  const [dbServices, setDbServices] = useState<{ id: string, title: string }[]>([])

  useEffect(() => {
    const q = collection(db, "services")
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const servicesData = snapshot.docs.map(doc => ({ id: doc.id, title: doc.data().title }))
      setDbServices(servicesData)
    }, (error) => {
      console.error("Error fetching services for footer:", error)
    })
    return () => unsubscribe()
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="bg-[#171717] text-white border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="mb-6">
                <Logo size="lg" />
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                A leading provider of comprehensive solutions for construction, infrastructure, and allied sector tenders.
              </p>
              <div className="space-y-3">
                <div className="flex items-center text-gray-300">
                  <Mail className="h-4 w-4 text-[#FFA800] mr-3" />
                  contact@patelpulseventures.com
                </div>
                <div className="flex items-center text-gray-300">
                  <Phone className="h-4 w-4 text-[#FFA800] mr-3" />
                  +91 7838130064, +91 1205106926
                </div>
                <div className="flex items-start text-gray-300">
                  <MapPin className="h-4 w-4 text-[#FFA800] mr-3 mt-1 flex-shrink-0" />
                  <span>OC821, 8th Floor, Gaur city center,<br />sector 4, Greator noida west, 201318</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Company Links (Navigation) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-[#FFA800] font-semibold mb-4 capitalize">Company</h3>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item, pathname)}
                    className="text-gray-300 hover:text-[#FFA800] transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links], index) => {
            if (category === "company") return null;
            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: (index + 1) * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-[#FFA800] font-semibold mb-4 capitalize">{category}</h3>
                <ul className="space-y-2">
                  {category === "services" && dbServices.length > 0
                    ? dbServices.map((service) => (
                      <li key={service.id}>
                        <Link
                          href={`/services?id=${service.id}`}
                          className="text-gray-300 hover:text-[#FFA800] transition-colors duration-200"
                        >
                          {service.title}
                        </Link>
                      </li>
                    ))
                    : links.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-gray-300 hover:text-[#FFA800] transition-colors duration-200"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                </ul>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-neutral-800"
        >
          <div className="text-gray-400 text-sm mb-4 md:mb-0">© 2024 Patel Pulse Ventures. All rights reserved.</div>

          {/* Social Links */}
          <div className="flex items-center space-x-4">
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-gray-300 hover:text-[#FFA800] hover:border-[#FFA800] transition-all duration-300"
                >
                  <social.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>

            {/* Scroll to Top */}
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-gray-300 hover:text-[#FFA800] hover:border-[#FFA800] transition-all duration-300"
            >
              <ArrowUp className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
