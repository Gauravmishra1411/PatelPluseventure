"use client"

import { motion } from "framer-motion"
import { FileText, Scale, Mail, Gavel, AlertTriangle, ShieldCheck, CreditCard } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import MobileBottomNav from "@/components/mobile-bottom-nav"
import Link from "next/link"

export default function TermsOfService() {
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
                  <FileText className="h-8 w-8" />
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Terms of Service
                </span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Effective Date: September 2, 2024
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
                    <Scale className="mr-2 h-6 w-6 text-sky-400" />
                    1. Acceptance of Terms
                  </h2>
                  <p className="text-muted-foreground">
                    By accessing or using our services, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must not use our services.
                  </p>
                </div>

                <div className="bg-secondary/10 p-6 rounded-xl border border-primary/20">
                  <h2 className="text-2xl font-bold mb-4 flex items-center text-foreground">
                    <Gavel className="mr-2 h-6 w-6 text-indigo-500" />
                    2. User Responsibilities
                  </h2>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>You must be at least 18 years old to use our services</li>
                    <li>You are responsible for maintaining the confidentiality of your account</li>
                    <li>You agree not to use the service for any illegal activities</li>
                    <li>You must not interfere with or disrupt the service or servers</li>
                  </ul>
                </div>

                <div className="bg-secondary/10 p-6 rounded-xl border border-primary/20">
                  <h2 className="text-2xl font-bold mb-4 flex items-center text-foreground">
                    <CreditCard className="mr-2 h-6 w-6 text-accent" />
                    3. Payments and Billing
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    All fees are stated in USD and Rupee and are non-refundable. We use third-party payment processors and do not store your payment information on our servers.
                  </p>
                </div>

                <div className="bg-secondary/10 p-6 rounded-xl border border-primary/20">
                  <h2 className="text-2xl font-bold mb-4 flex items-center text-foreground">
                    <AlertTriangle className="mr-2 h-6 w-6 text-yellow-400" />
                    4. Disclaimers
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    Our services are provided &quot;as is&quot; without any warranties, express or implied. We do not guarantee that the service will be uninterrupted or error-free.
                  </p>
                </div>

                <div className="bg-secondary/10 p-6 rounded-xl border border-primary/20">
                  <h2 className="text-2xl font-bold mb-4 flex items-center text-foreground">
                    <ShieldCheck className="mr-2 h-6 w-6 text-primary" />
                    5. Limitation of Liability
                  </h2>
                  <p className="text-muted-foreground">
                    In no event shall Patel Pulse Ventures be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.
                  </p>
                </div>

                <div className="bg-secondary/10 p-6 rounded-xl border border-primary/20">
                  <h2 className="text-2xl font-bold mb-4 text-foreground">Contact Information</h2>
                  <p className="text-muted-foreground">
                    If you have any questions about these Terms of Service, please contact us at:
                  </p>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-muted-foreground">
                      <Mail className="h-5 w-5 text-primary mr-3" />
                      <span>contact@patelpulseventures.com</span>
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
