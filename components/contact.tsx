
"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Send } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { db } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { toast } from "sonner"
import { Facebook, Twitter, Instagram, Youtube, Linkedin, Clock } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const contactInfo = [
  {
    icon: Mail,
    title: "Email Us",
    details: "contact@patelpulseventures.com",
    description: "Send us an email anytime",
    color: "from-[#FF0080] to-[#D400FF]",
  },
  {
    icon: Phone,
    title: "Call Us",
    details: "+91 7838130064, +91 9911594905",
    description: "Mon - Fri, 10AM - 7PM IST",
    color: "from-[#D400FF] to-[#FF0055]",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    details: "OC1125, 11th Floor, Gaur city center, sector 4",
    description: "Greator noida west, 201318",
    color: "from-[#FF0055] to-[#FF0080]",
  },
  {
    icon: Clock,
    title: "Working Hours",
    details: "Mon - Fri, 10AM - 7PM IST",
    description: "Weekend Closed",
    color: "from-[#FF0080] to-[#D400FF]",
  },
]

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    subject: "General Inquiry",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

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
        company: "",
        phone: "",
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
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Get in <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Touch</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Ready to transform your ideas into reality? Let&apos;s discuss your project and explore how we can help you
            achieve your goals.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Let&apos;s Start a Conversation</h3>
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-8">
                We&apos;re here to help you bring your vision to life. Whether you have a specific project in mind or just
                want to explore possibilities, we&apos;d love to hear from you.
              </p>
            </div>

            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="p-6 rounded-2xl bg-white/50 dark:bg-primary/30 border border-gray-200 dark:border-accent/20 backdrop-blur-sm hover:border-accent/50 transition-colors shadow-sm dark:shadow-none">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition-colors">
                        <info.icon className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{info.title}</h4>
                        <p className="text-accent font-medium">{info.details}</p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">{info.description}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Follow Us</h3>
              <div className="flex space-x-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a href="https://www.linkedin.com/company/patel-pulse-ventures" target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="icon" className="rounded-full w-12 h-12 border-gray-200 dark:border-accent/20 hover:border-accent hover:text-accent dark:text-white dark:hover:text-accent transition-colors bg-white/50 dark:bg-primary/30 backdrop-blur-sm">
                          <Linkedin className="h-5 w-5" />
                          <span className="sr-only">LinkedIn</span>
                        </Button>
                      </a>
                    </TooltipTrigger>
                    <TooltipContent><p>Follow us on LinkedIn</p></TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a href="https://x.com/patel_puls43877" target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="icon" className="rounded-full w-12 h-12 border-gray-200 dark:border-accent/20 hover:border-accent hover:text-accent dark:text-white dark:hover:text-accent transition-colors bg-white/50 dark:bg-primary/30 backdrop-blur-sm">
                          <Twitter className="h-5 w-5" />
                          <span className="sr-only">Twitter</span>
                        </Button>
                      </a>
                    </TooltipTrigger>
                    <TooltipContent><p>Follow us on Twitter</p></TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a href="https://www.instagram.com/patel_pulse_ventures/?hl=en" target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="icon" className="rounded-full w-12 h-12 border-gray-200 dark:border-accent/20 hover:border-accent hover:text-accent dark:text-white dark:hover:text-accent transition-colors bg-white/50 dark:bg-primary/30 backdrop-blur-sm">
                          <Instagram className="h-5 w-5" />
                          <span className="sr-only">Instagram</span>
                        </Button>
                      </a>
                    </TooltipTrigger>
                    <TooltipContent><p>Follow us on Instagram</p></TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Card className="bg-white/50 dark:bg-primary/30 border-gray-200 dark:border-accent/20 backdrop-blur-sm shadow-sm dark:shadow-none">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Full Name *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="bg-white/50 dark:bg-background/50 border-gray-200 dark:border-accent/10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-accent focus:ring-accent"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="bg-white/50 dark:bg-background/50 border-gray-200 dark:border-accent/10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-accent focus:ring-accent"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Company (Optional)
                      </label>
                      <Input
                        id="company"
                        name="company"
                        type="text"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="bg-white/50 dark:bg-background/50 border-gray-200 dark:border-accent/10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-accent focus:ring-accent"
                        placeholder="Your company name"
                      />
                    </div>
                    <div>
                      <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone (Optional)
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="text"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="bg-white/50 dark:bg-background/50 border-gray-200 dark:border-accent/10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-accent focus:ring-accent"
                        placeholder="Enter your mobile number"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="bg-white/50 dark:bg-background/50 border-gray-200 dark:border-accent/10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-accent focus:ring-accent h-32 resize-none"
                      placeholder="Tell us about your project, goals, and how we can help..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-primary to-accent text-white font-semibold py-4 rounded-xl hover:shadow-lg hover:shadow-accent/25 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin mr-2" />
                        Sending Message...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
