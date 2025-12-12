"use client"

import { motion } from "framer-motion"
import { Shield, Lock, Database, User, Server, Mail, Phone } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import MobileBottomNav from "@/components/mobile-bottom-nav"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-16 relative overflow-hidden">
          <div className="container mx-auto px-6">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex justify-center mb-6">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-primary to-accent text-primary-foreground">
                  <Shield className="h-8 w-8" />
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Privacy Policy
                </span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Last Updated: September 2, 2024
              </p>
            </motion.div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12 bg-secondary/5 relative">
          <div className="container mx-auto px-6 max-w-4xl">
            <motion.div
              className="prose prose-invert max-w-none"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="space-y-8">
                <div className="bg-secondary/10 p-6 rounded-xl border border-primary/20">
                  <h2 className="text-2xl font-bold mb-4 flex items-center text-foreground">
                    <Lock className="mr-2 h-6 w-6 text-primary" />
                    Information We Collect
                  </h2>
                  <p className="text-muted-foreground">
                    We collect information that you provide directly to us, such as when you create an account, subscribe to our newsletter, or contact us. This may include:
                  </p>
                  <ul className="list-disc pl-6 mt-4 space-y-2 text-muted-foreground">
                    <li>Personal information (name, email, phone number)</li>

                    <li>Payment information</li>
                    <li>Communications with our team</li>
                  </ul>
                </div>

                <div className="bg-secondary/10 p-6 rounded-xl border border-primary/20">
                  <h2 className="text-2xl font-bold mb-4 flex items-center text-foreground">
                    <Database className="mr-2 h-6 w-6 text-accent" />
                    How We Use Your Information
                  </h2>
                  <ul className="space-y-4 text-muted-foreground">
                    <li className="flex items-start">
                      <Server className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <span>To provide, maintain, and improve our services</span>
                    </li>
                    <li className="flex items-start">
                      <User className="h-5 w-5 text-accent mr-3 mt-0.5 flex-shrink-0" />
                      <span>To personalize your experience</span>
                    </li>
                    <li className="flex items-start">
                      <Mail className="h-5 w-5 text-sky-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span>To communicate with you about updates and offers</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-secondary/10 p-6 rounded-xl border border-primary/20">
                  <h2 className="text-2xl font-bold mb-4 text-foreground">Data Security</h2>
                  <p className="text-muted-foreground mb-4">
                    We implement appropriate security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information.
                  </p>
                  <p className="text-muted-foreground">
                    While we strive to protect your personal information, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security but we work hard to protect it to the best of our ability.
                  </p>
                </div>

                <div className="bg-secondary/10 p-6 rounded-xl border border-primary/20">
                  <h2 className="text-2xl font-bold mb-4 text-foreground">Contact Us</h2>
                  <p className="text-muted-foreground">
                    If you have any questions about this Privacy Policy, please contact us:
                  </p>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-muted-foreground">
                      <Mail className="h-5 w-5 text-primary mr-3" />
                      <span>contact@patelpulseventures.com</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Phone className="h-5 w-5 text-accent mr-3" />
                      <span>+91 7838130064</span>
                    </div>
                  </div>
                </div>
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
