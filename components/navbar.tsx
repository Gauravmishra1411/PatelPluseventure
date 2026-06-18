
"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Logo } from "@/components/logo"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { Menu, X, Home, Briefcase, User, Mail, Star, Moon, Sun } from "lucide-react"

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Services", href: "/services", icon: Briefcase },
  { name: "Projects", href: "/projects", icon: Star },
  { name: "Contact", href: "/contact", icon: Mail },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("")
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const navRef = useRef<HTMLElement>(null)

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

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (pathname !== "/") return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [pathname]);

  const isActive = (href: string) => {
    if (pathname === href && pathname !== "/") return true;
    if (pathname === "/") {
      if (href === "/" && (activeSection === "home" || !activeSection)) return true;
      if (href === "/services" && activeSection === "services") return true;
      if (href === "/projects" && activeSection === "projects") return true;
      if (href === "/contact" && activeSection === "contact") return true;
    }
    return false;
  }

  return (
    <motion.nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/90 dark:bg-background/90 backdrop-blur-md border-b border-gray-200 dark:border-accent/20" : "bg-transparent"}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">


          <div className="flex items-center flex-shrink-0">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/" className="flex items-center">
                <Logo size="md" className="h-16 md:h-20" linked={false} />
              </Link>
            </motion.div>
          </div>

          <div className="hidden md:flex flex-1 items-center justify-center">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 relative group ${isActive(item.href) ? "text-accent" : "text-gray-600 dark:text-gray-300 hover:text-accent dark:hover:text-accent"
                      }`}
                  >
                    {item.name}
                    {isActive(item.href) && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent"
                        layoutId="activeTab"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >

            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-full bg-gray-200 dark:bg-primary text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-primary/80 transition-colors relative"
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                <span className="sr-only">Toggle theme</span>
              </button>
            </motion.div>
          </div>


          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:text-accent transition-colors relative"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              <span className="sr-only">Toggle theme</span>
            </button>
            <Link href="/onboarding" className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-400 hover:text-accent hover:bg-gray-100 dark:hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent transition-all duration-300">
              <User className="h-6 w-6" />
            </Link>
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-400 hover:text-accent hover:bg-gray-100 dark:hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent transition-all duration-300"
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

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/95 dark:bg-background/95 backdrop-blur-md border-t border-gray-200 dark:border-accent/20">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-all ${isActive(item.href)
                      ? "text-accent bg-gray-100 dark:bg-primary/20"
                      : "text-gray-600 dark:text-gray-300 hover:text-accent hover:bg-gray-100 dark:hover:bg-primary/20"
                      }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: navItems.length * 0.1 }}
                className="pt-2"
              >

              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
