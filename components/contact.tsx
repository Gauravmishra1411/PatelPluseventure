"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Send, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { db } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { toast } from "sonner"

const contactInfo = [
  {
    icon: Mail,
    title: "Email Us",
    details: "contact@patelpulseventures.com",
    description: "Send us an email anytime",
  },
  {
    icon: Phone,
    title: "Call Us",
    details: "+91 7838130064, +91 1205106926",
    description: "Mon - Fri, 10AM - 7PM IST",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    details: "OC1125, 11th Floor, Gaur city center, sector 4",
    description: "Greater Noida West, 201318",
  },
  {
    icon: Clock,
    title: "Working Hours",
    details: "Mon - Fri, 10AM - 7PM IST",
    description: "Weekend Closed",
  },
]

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    service: "",
    subject: "General Inquiry",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
        service: "",
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
    <section
      id="contact"
      className="py-12 md:py-20 relative overflow-hidden border-t border-[#FDE68A]"
      style={{
        background: "linear-gradient(135deg, #FFF8E1 0%, #FEF3C7 35%, #FDE68A 70%, #FFFFFF 100%)"
      }}
    >
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#FBBF24]/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-[#F59E0B]/15 rounded-full blur-3xl" />
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
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#111827] mb-4 tracking-tight">
            Get in <span className="text-[#F59E0B]">Touch</span>
          </h2>
          <p className="text-lg sm:text-xl text-[#4B5563] max-w-3xl mx-auto leading-relaxed">
            Ready to transform your ideas into reality? Let&apos;s discuss your project and explore how we can help you
            achieve your goals.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* Left Column: Contact Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#111827] mb-4">
                Let&apos;s Start a <span className="text-[#F59E0B]">Conversation</span>
              </h3>
              <p className="text-[#4B5563] text-base sm:text-lg leading-relaxed mb-6">
                We&apos;re here to help you bring your vision to life. Whether you have a specific project in mind or just
                want to explore possibilities, we&apos;d love to hear from you.
              </p>
            </div>

            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="p-5 sm:p-6 rounded-2xl bg-white/90 border border-[#FDE68A] shadow-sm hover:shadow-md hover:border-[#F59E0B]/50 transition-all duration-300">
                    <div className="flex items-start space-x-4">
                      {/* Icon Background */}
                      <div className="w-12 h-12 rounded-2xl bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center flex-shrink-0 shadow-sm">
                        <info.icon className="w-6 h-6 text-[#F59E0B]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        {/* Card Heading */}
                        <h4 className="text-lg font-bold text-[#111827]">{info.title}</h4>
                        {/* Email & Phone / Details */}
                        <p className="text-[#F59E0B] font-semibold text-sm sm:text-base break-words mt-0.5">{info.details}</p>
                        <p className="text-[#4B5563] text-xs sm:text-sm mt-1">{info.description}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Card className="bg-white/95 border border-[#FDE68A] shadow-xl rounded-3xl overflow-hidden backdrop-blur-md">
              <CardContent className="p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* Name & Email Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-[#374151] mb-1.5">
                        Full Name *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="bg-white border-[#FDE68A] text-[#111827] placeholder-[#9CA3AF] focus:border-[#F59E0B] focus:ring-[#F59E0B] h-11 text-sm rounded-xl"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-[#374151] mb-1.5">
                        Email Address *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="bg-white border-[#FDE68A] text-[#111827] placeholder-[#9CA3AF] focus:border-[#F59E0B] focus:ring-[#F59E0B] h-11 text-sm rounded-xl"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  {/* Company & Phone Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="company" className="block text-xs sm:text-sm font-medium text-[#374151] mb-1.5">
                        Company (Optional)
                      </label>
                      <Input
                        id="company"
                        name="company"
                        type="text"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="bg-white border-[#FDE68A] text-[#111827] placeholder-[#9CA3AF] focus:border-[#F59E0B] focus:ring-[#F59E0B] h-11 text-sm rounded-xl"
                        placeholder="Your company name"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-xs sm:text-sm font-medium text-[#374151] mb-1.5">
                        Phone (Optional)
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="text"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="bg-white border-[#FDE68A] text-[#111827] placeholder-[#9CA3AF] focus:border-[#F59E0B] focus:ring-[#F59E0B] h-11 text-sm rounded-xl"
                        placeholder="Enter your mobile number"
                      />
                    </div>
                  </div>

                  {/* Service Needed Dropdown */}
                  <div>
                    <label htmlFor="service" className="block text-xs sm:text-sm font-medium text-[#374151] mb-1.5">
                      Service Needed
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-[#FDE68A] text-[#111827] focus:border-[#F59E0B] focus:ring-[#F59E0B] h-11 text-sm rounded-xl px-3.5 py-2 outline-none transition-colors"
                    >
                      <option value="" disabled className="text-[#9CA3AF]">Select Service Needed</option>
                      <option value="Manpower Supply">Manpower Supply & Management</option>
                      <option value="Horticulture">Horticulture & Landscaping</option>
                      <option value="Housekeeping">Housekeeping & Cleaning</option>
                      <option value="Canteen & Catering">Canteen & Catering Services</option>
                      <option value="Facility Management">Facility Management</option>
                      <option value="Maintenance Services">Operations & Maintenance</option>
                      <option value="Tenders & Bidding">Government & Private Tenders</option>
                      <option value="IT & Software Development">IT & Software Development</option>
                      <option value="Mobile App Development">Mobile App Development</option>
                      <option value="Cloud & Cybersecurity">Cloud & Cybersecurity</option>
                      <option value="Other">Other Service</option>
                    </select>
                  </div>

                  {/* Message Field */}
                  <div>
                    <label htmlFor="message" className="block text-xs sm:text-sm font-medium text-[#374151] mb-1.5">
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="bg-white border-[#FDE68A] text-[#111827] placeholder-[#9CA3AF] focus:border-[#F59E0B] focus:ring-[#F59E0B] h-28 resize-none text-sm rounded-xl"
                      placeholder="Tell us about your project, goals, and how we can help..."
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#F59E0B] hover:bg-[#D97706] text-white font-bold py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed h-12 text-base mt-2"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Sending Message...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center font-bold">
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
