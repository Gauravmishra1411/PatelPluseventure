"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Zap, Mail, Phone, Facebook, MapPin, Github, Twitter, Linkedin, Instagram, ArrowUp, Youtube } from "lucide-react"

const footerLinks = {
  company: [
    { name: "About Us", href: "/about" },
    { name: "Our Team", href: "/about" },
    { name: "Careers", href: "/about" },
    { name: "Contact", href: "/contact" },
  ],
  services: [
    { name: "Web Development", href: "/services" },
    { name: "Mobile Apps", href: "/services" },
    { name: "AI Solutions", href: "/services" },
    { name: "Cloud Services", href: "/services" },
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
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="bg-gradient-to-br from-white via-gray-50 to-white dark:from-background dark:via-primary/20 dark:to-background border-t border-gray-200 dark:border-accent/20">
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
              <Link href="/" className="flex items-center space-x-2 mb-6">
                <div className="p-2 rounded-lg bg-gradient-to-r from-primary to-accent">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Patel Pulse Ventures
                </span>
              </Link>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Transforming ideas into digital realities with cutting-edge technology and innovative design.
              </p>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Mail className="h-4 w-4 text-accent mr-3" />
                  contact@patelpulseventures.com
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Phone className="h-4 w-4 text-accent mr-3" />
                  +91 7838130064, +91 1205106926
                </div>
                <div className="flex items-start text-gray-600 dark:text-gray-300">
                  <MapPin className="h-4 w-4 text-accent mr-3 mt-1 flex-shrink-0" />
                  <span>OC1125, 11th Floor, Gaur city center,<br />sector 4, Greator noida west, 201318</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links], index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-gray-900 dark:text-white font-semibold mb-4 capitalize">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-600 dark:text-gray-300 hover:text-accent transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-200 dark:border-accent/20"
        >
          <div className="text-gray-500 dark:text-gray-400 text-sm mb-4 md:mb-0">© 2024 Patel Pulse Ventures. All rights reserved.</div>

          {/* Social Links */}
          <div className="flex items-center space-x-4">
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-white dark:bg-primary border border-gray-200 dark:border-accent/30 text-gray-500 dark:text-gray-300 hover:text-accent hover:border-accent transition-all duration-300"
                >
                  <social.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>

            {/* Scroll to Top */}
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-white dark:bg-primary border border-gray-200 dark:border-accent/30 text-gray-500 dark:text-gray-300 hover:text-accent hover:border-accent transition-all duration-300"
            >
              <ArrowUp className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </footer >
  )
}
