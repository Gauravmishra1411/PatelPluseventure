
"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Send, Mail, Phone, MapPin, Clock, Linkedin, Github, Twitter, Instagram } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import MobileBottomNav from "@/components/mobile-bottom-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { db } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { toast } from "sonner"

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "contact@patelpulseventures.com",
    href: "mailto:contact@patelpulseventures.com",
    gradient: "from-primary to-accent",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+91 7838130064, +91 1205106926",
    href: "tel:+917838130064",
    gradient: "from-accent to-[#00D4FF]",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "OC1125, 11th Floor, Gaur city center, sector 4, Greator noida west, 201318",
    href: "https://www.google.com/maps/search/?api=1&query=Gaur+City+Center+Greater+Noida+West",
    gradient: "from-[#00D4FF] to-[#FF6B6B]",
  },
  {
    icon: Clock,
    label: "Working Hours",
    value: "Mon - Fri, 10AM - 7PM IST",
    href: null,
    gradient: "from-[#FF6B6B] to-primary",
  },
]

const socialLinks = [
  {
    icon: Linkedin,
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/patel-pulse-ventures",
    gradient: "from-[#0077B5] to-[#00A0DC]",
  },
  {
    icon: Instagram,
    label: "Instagram",
    href: "https://www.instagram.com/patel_pulse_ventures/?hl=en",
    gradient: "from-[#833AB4] to-[#C13584]",
  },
  {
    icon: Twitter,
    label: "Twitter",
    href: "https://x.com/patel_puls43877",
    gradient: "from-[#1DA1F2] to-[#0d8bd9]",
  },
  {
    icon: Mail,
    label: "Email",
    href: "mailto:contact@patelpulseventures.com",
    gradient: "from-[#EA4335] to-[#FBBC05]",
  },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "General Inquiry",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await addDoc(collection(db, "contactMessages"), {
        ...formData,
        status: "unread",
        priority: "medium",
        starred: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })

      await addDoc(collection(db, "notifications"), {
        type: 'new_message',
        message: `New contact message from ${formData.name}`,
        link: `/admin/messages`,
        isRead: false,
        createdAt: serverTimestamp(),
        senderInfo: {
          name: formData.name,
          email: formData.email,
        }
      });

      toast.success("Message sent! We'll get back to you soon.")

      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        subject: "General Inquiry",
        message: "",
      })
    } catch (error) {
      console.error("Error submitting form:", error)
      toast.error("Failed to send message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      <main className="pt-20 pb-24">
        {/* Hero Section */}
        <section className="py-12 md:py-20 relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6">
            <motion.div
              className="text-center mb-12 md:mb-16"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6">
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Get in Touch
                </span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
                Ready to transform your ideas into digital reality? Let's start the conversation and build something
                amazing together.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-8 md:py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto">
              {/* Contact Form */}
              <motion.div
                className="relative order-2 lg:order-1"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="p-6 md:p-8 bg-secondary/10 backdrop-blur-sm border border-primary/20 rounded-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />

                  <div className="relative z-10">
                    <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4 md:mb-6">Send us a message</h3>

                    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                      <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.1 }}
                          viewport={{ once: true }}
                        >
                          <Input
                            type="text"
                            name="name"
                            placeholder="Your Name *"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="bg-background/50 border-primary/20 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 h-11 md:h-12 text-sm md:text-base"
                          />
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                          viewport={{ once: true }}
                        >
                          <Input
                            type="email"
                            name="email"
                            placeholder="Your Email *"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="bg-background/50 border-primary/20 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 h-11 md:h-12 text-sm md:text-base"
                          />
                        </motion.div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.3 }}
                          viewport={{ once: true }}
                        >
                          <Input
                            type="tel"
                            name="phone"
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={handleChange}
                            className="bg-background/50 border-primary/20 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 h-11 md:h-12 text-sm md:text-base"
                          />
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.4 }}
                          viewport={{ once: true }}
                        >
                          <Input
                            type="text"
                            name="company"
                            placeholder="Company Name"
                            value={formData.company}
                            onChange={handleChange}
                            className="bg-background/50 border-primary/20 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 h-11 md:h-12 text-sm md:text-base"
                          />
                        </motion.div>
                      </div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        viewport={{ once: true }}
                      >
                        <Textarea
                          name="message"
                          placeholder="Tell us about your project *"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows={5}
                          className="bg-background/50 border-primary/20 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 resize-none text-sm md:text-base min-h-[120px] md:min-h-[140px]"
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        viewport={{ once: true }}
                      >
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold py-3 md:py-4 text-sm md:text-base hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 disabled:opacity-50 h-12 md:h-14"
                        >
                          {isSubmitting ? (
                            <motion.div
                              className="flex items-center justify-center"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                            >
                              <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full" />
                            </motion.div>
                          ) : (
                            <>
                              Send Message
                              <Send className="w-4 h-4 md:w-5 md:h-5 ml-2" />
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </form>
                  </div>
                </div>
              </motion.div>

              {/* Contact Info */}
              <motion.div
                className="space-y-6 md:space-y-8 order-1 lg:order-2"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4 md:mb-6">Contact Information</h3>

                  <div className="space-y-3 md:space-y-4">
                    {contactInfo.map((info, index) => (
                      <motion.div
                        key={info.label}
                        className="group"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        {info.href ? (
                          <a
                            href={info.href}
                            target={info.href.startsWith("http") ? "_blank" : undefined}
                            rel={info.href.startsWith("http") ? "noopener noreferrer" : undefined}
                            className="flex items-start space-x-3 md:space-x-4 p-3 md:p-4 bg-secondary/10 backdrop-blur-sm border border-primary/20 rounded-lg hover:border-primary/40 transition-all duration-300 group-hover:scale-102"
                          >
                            <div
                              className={`w-10 h-10 md:w-12 md:h-12 flex-shrink-0 bg-gradient-to-r ${info.gradient} rounded-lg flex items-center justify-center`}
                            >
                              <info.icon className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs md:text-sm text-muted-foreground">{info.label}</p>
                              <p className="text-sm md:text-base text-foreground font-semibold group-hover:text-primary transition-colors break-words">
                                {info.value}
                              </p>
                            </div>
                          </a>
                        ) : (
                          <div className="flex items-start space-x-3 md:space-x-4 p-3 md:p-4 bg-secondary/10 backdrop-blur-sm border border-primary/20 rounded-lg">
                            <div
                              className={`w-10 h-10 md:w-12 md:h-12 flex-shrink-0 bg-gradient-to-r ${info.gradient} rounded-lg flex items-center justify-center`}
                            >
                              <info.icon className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs md:text-sm text-muted-foreground">{info.label}</p>
                              <p className="text-sm md:text-base text-foreground font-semibold">{info.value}</p>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Social Links */}
                <div>
                  <h4 className="text-lg md:text-xl font-bold text-foreground mb-3 md:mb-4">Follow Us</h4>
                  <div className="grid grid-cols-2 gap-3 md:gap-4">
                    {socialLinks.map((social, index) => (
                      <motion.a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative"
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div
                          className={`w-full h-14 md:h-16 bg-gradient-to-r ${social.gradient} rounded-lg flex items-center justify-center transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/25`}
                        >
                          <social.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                        </div>

                        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-popover/90 backdrop-blur-sm text-popover-foreground text-xs px-2 py-1 rounded-lg border border-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none hidden md:block whitespace-nowrap">
                          {social.label}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-popover/90" />
                        </div>
                      </motion.a>
                    ))}
                  </div>
                </div>

                {/* Quick Response */}
                <motion.div
                  className="p-4 md:p-6 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-2xl"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  viewport={{ once: true }}
                >
                  <h4 className="text-lg md:text-xl font-bold text-foreground mb-2">Quick Response Guarantee</h4>
                  <p className="text-sm md:text-base text-muted-foreground mb-3 md:mb-4">
                    We typically respond to all inquiries within 2-4 hours during business hours.
                  </p>
                  <div className="flex items-center gap-2 text-primary">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs md:text-sm font-medium">Average response time: 2 hours</span>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  )
}
