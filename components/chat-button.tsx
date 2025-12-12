"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { MessageSquare } from "lucide-react"

export default function ChatButton() {
  return (
    <Link href="/chat" passHref>
      <motion.div
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <div className="w-16 h-16 bg-gradient-to-r from-[#B6F500] to-[#00FF88] rounded-full flex items-center justify-center shadow-lg cursor-pointer">
          <MessageSquare className="w-8 h-8 text-black" />
        </div>
      </motion.div>
    </Link>
  )
}
