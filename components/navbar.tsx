"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Logo } from "@/components/logo"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { Menu, X, Home, Briefcase, User, Mail, Star, Moon, Sun, FileText, Info } from "lucide-react"
import { useActiveSection } from "@/hooks/use-active-section"

import { navItems, sectionIds, handleNavClick } from "@/lib/navigation"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const navRef = useRef<HTMLElement>(null)

  const activeSection = useActiveSection({
    sectionIds,
    navbarHeight: 80,
    defaultSection: "home",
  })

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const onNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: typeof navItems[0]) => {
    handleNavClick(e, item, pathname, () => setIsOpen(false))
  }

  const isItemActive = (item: typeof navItems[0]) => {
    if (pathname === "/") {
      return activeSection === item.id
    }
    return pathname === item.href || pathname.startsWith(item.href + "/")
  }

  if (pathname.startsWith("/admin")) {
    return null
  }

  return (
    <motion.nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 dark:bg-[#171717]/95 backdrop-blur-md border-b border-amber-100 dark:border-neutral-800 shadow-sm"
          : "bg-white/95 dark:bg-[#171717]/95 backdrop-blur-md border-b border-amber-100/50 dark:border-neutral-800/50"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">

          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/" className="flex items-center" onClick={(e) => onNavClick(e, navItems[0])}>
                <Logo size="md" className="h-[4.5rem] md:h-[5.5rem] translate-y-[12%] drop-shadow-md" linked={false} />
              </Link>
            </motion.div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex flex-1 items-center justify-center">
            <div className="ml-8 flex items-center space-x-2 lg:space-x-4">
              {navItems.map((item) => {
                const active = isItemActive(item)
                return (
                  <div key={item.name} className="relative py-2">
                    <Link
                      href={item.href}
                      onClick={(e) => onNavClick(e, item)}
                      className={`px-3 py-2 text-sm transition-colors duration-300 relative block ${
                        active
                          ? "text-[#F59E0B] font-bold"
                          : "text-[#171717] dark:text-gray-200 font-semibold hover:text-[#F59E0B] dark:hover:text-[#F59E0B]"
                      }`}
                    >
                      {item.name}
                      {active && (
                        <motion.div
                          layoutId="activeNavUnderline"
                          className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#F59E0B] rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 30,
                            duration: 0.3,
                          }}
                        />
                      )}
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Theme Toggle Button */}
          <div className="hidden md:flex items-center gap-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2.5 rounded-full bg-gray-100 dark:bg-primary/20 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-primary/40 transition-colors relative border border-amber-200/40 dark:border-amber-500/20"
                aria-label="Toggle theme"
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-[#F59E0B]" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[#F59E0B]" />
              </button>
            </motion.div>
          </div>

          {/* Mobile menu controls */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:text-accent transition-colors relative"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-[#F59E0B]" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[#F59E0B]" />
            </button>
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-400 hover:text-accent hover:bg-gray-100 dark:hover:bg-primary/20 focus:outline-none transition-all duration-300"
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="block h-6 w-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="block h-6 w-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-3 pt-2 pb-4 space-y-1 bg-white/95 dark:bg-[#171717]/95 backdrop-blur-md border-t border-gray-200 dark:border-neutral-800">
              {navItems.map((item, index) => {
                const active = isItemActive(item)
                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      className={`flex items-center px-4 py-2.5 rounded-xl text-base font-bold transition-all ${
                        active
                          ? "text-[#F59E0B] bg-[#F59E0B]/10 border border-[#F59E0B]/30"
                          : "text-gray-700 dark:text-gray-300 hover:text-[#F59E0B] hover:bg-gray-100 dark:hover:bg-white/5"
                      }`}
                      onClick={(e) => {
                        onNavClick(e, item)
                      }}
                    >
                      <item.icon className="w-5 h-5 mr-3 text-[#F59E0B]" />
                      {item.name}
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
