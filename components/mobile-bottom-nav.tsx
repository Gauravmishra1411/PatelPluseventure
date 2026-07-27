
"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Briefcase, User, Store, Package, HelpCircle, Tag, Download, ShoppingCart, Mail, Users, MessageSquare, BarChart3, Plus, Star, FileText, CreditCard, FolderOpen, BarChart, Palette, ListChecks, ShoppingBag, Menu, AppWindow, Component, Shapes, Settings, Info, Wrench, Percent, LayoutGrid } from "lucide-react"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Button } from "./ui/button"

const mainNavItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Services", href: "/services", icon: Briefcase },
  { name: "Projects", href: "/projects", icon: FolderOpen },
  { name: "About Us", href: "/about", icon: Info },
  { name: "Contact", href: "/contact", icon: Mail },
]

const adminNavItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Dashboard", href: "/admin", icon: BarChart3 },
  { name: "Clients", href: "/admin/clients", icon: Briefcase },
  { name: "Messages", href: "/admin/messages", icon: MessageSquare },
  { name: "Menu", href: "#", icon: Menu, isMenu: true },
]

const adminMenuItems = [
  { name: "Add Content", href: "/admin/add", icon: Plus },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Projects", href: "/admin/projects", icon: FolderOpen },
  { name: "Services", href: "/admin/services", icon: Wrench },
  { name: "Testimonials", href: "/admin/testimonials", icon: Star },
  { name: "About Page", href: "/admin/about", icon: Info },
  { name: "Settings", href: "/admin/settings", icon: Settings },
  // Marketplace Links
  { name: "Orders", href: "/admin/marketplace/orders", icon: ShoppingCart },
  { name: "Customers", href: "/admin/marketplace/customers", icon: Users },
  { name: "Products", href: "/admin/marketplace/products", icon: Package },
  { name: "Categories", href: "/admin/marketplace/categories", icon: LayoutGrid },
  { name: "Discounts", href: "/admin/marketplace/discounts", icon: Percent },
  { name: "Reviews", href: "/admin/marketplace/reviews", icon: Star },
  { name: "Customize", href: "/admin/marketplace/customize", icon: Palette },
]


const clientNavItems = [
  { name: "Dashboard", href: "/client", icon: BarChart },
  { name: "Designs", href: "/client/designs", icon: Palette },
  { name: "Progress", href: "/client/progress", icon: ListChecks },
  { name: "Chat", href: "/client/chat", icon: MessageSquare },
]

const marketplaceNavItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Home", href: "/marketplace", icon: Store },
  { name: "Shop", href: "/marketplace/shop", icon: ShoppingCart },
  { name: "Profile", href: "/marketplace/profile", icon: User },
  { name: "Menu", href: "#", icon: Menu, isMenu: true },
];

const marketplaceMenuItems = [
  { name: "Categories", href: "/marketplace/categories", icon: AppWindow },
  { name: "Wishlist", href: "/marketplace/wishlist", icon: Star },
  { name: "Orders", href: "/marketplace/orders", icon: Package },
  { name: "Help Center", href: "/marketplace/help", icon: HelpCircle },
]


export default function MobileBottomNav() {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname()

  const isAdminRoute = pathname.startsWith("/admin")
  const isClientRoute = pathname.startsWith("/client")
  const isMarketplaceRoute = pathname.startsWith("/marketplace")

  let navItems;
  if (isAdminRoute) {
    navItems = adminNavItems;
  } else if (isClientRoute) {
    navItems = clientNavItems;
  } else if (isMarketplaceRoute) {
    navItems = marketplaceNavItems;
  }
  else {
    navItems = mainNavItems;
  }


  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  const isActive = (href: string) => {
    // Exact match for root pages
    if (href === "/" && pathname === "/") return true;
    if (href === "/admin" && pathname === "/admin") return true;
    if (href === "/client" && pathname === "/client") return true;
    if (href === "/marketplace" && pathname === "/marketplace") return true;
    if (href === "/marketplace/shop" && pathname === "/marketplace/shop") return true;

    // Prefix match for other pages, but not for the root pages
    if (href !== "/" && href !== "/admin" && href !== "/client" && href !== "/marketplace" && pathname.startsWith(href)) return true;

    return false;
  }

  const navClassName = isMarketplaceRoute ?
    "bg-background/95 backdrop-blur-lg border-t border-border/40 shadow-[0_-4px_20px_rgba(0,0,0,0.12)]" :
    "bg-white/95 dark:bg-[#171717]/95 backdrop-blur-lg border-t border-gray-200/80 dark:border-neutral-800/80 shadow-[0_-4px_20px_rgba(0,0,0,0.12)]";

  const activeTextColor = isMarketplaceRoute 
    ? "text-primary dark:text-primary font-semibold" 
    : "text-[#FFA800] dark:text-[#FFA800] font-semibold";
  const inactiveTextColor = isMarketplaceRoute 
    ? "text-muted-foreground group-hover:text-primary font-medium" 
    : "text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white font-medium";
  const activeBg = isMarketplaceRoute 
    ? "bg-primary/15 dark:bg-primary/20 border border-primary/30" 
    : "bg-[#FFA800]/15 dark:bg-[#FFA800]/20 border border-[#FFA800]/40 shadow-sm shadow-[#FFA800]/10";


  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        >
          <div className={navClassName}>
            <div className="flex items-center justify-around py-1.5 px-2 max-w-md mx-auto">
              {navItems.map((item, index) => {
                const active = isActive(item.href)

                if ((item as any).isMenu) {
                  const menuItems = isAdminRoute ? adminMenuItems : marketplaceMenuItems;
                  return (
                    <Drawer key={item.name} open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                      <DrawerTrigger asChild>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="flex-1 flex justify-center"
                        >
                          <button
                            type="button"
                            className="flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all duration-200 w-full max-w-[72px] relative group"
                          >
                            <div className="relative z-10 flex flex-col items-center justify-center w-full">
                              <motion.div
                                whileTap={{ scale: 0.9 }}
                                className={`transition-colors duration-200 ${inactiveTextColor}`}
                              >
                                <item.icon className="w-5 h-5 mb-1" />
                              </motion.div>
                              <span
                                className={`text-[11px] leading-none transition-colors duration-200 truncate ${inactiveTextColor}`}
                              >
                                {item.name}
                              </span>
                            </div>
                          </button>
                        </motion.div>
                      </DrawerTrigger>
                      <DrawerContent className={isAdminRoute ? "bg-black text-white border-gray-800" : "bg-white dark:bg-background text-gray-900 dark:text-white border-gray-200 dark:border-gray-800"}>
                        <DrawerHeader>
                          <DrawerTitle>Menu</DrawerTitle>
                        </DrawerHeader>
                        <div className="p-4 flex flex-col gap-2">
                          {menuItems.map(menuItem => (
                            <Button key={menuItem.name} asChild variant="ghost" className="justify-start text-lg" onClick={() => setIsMenuOpen(false)}>
                              <Link href={menuItem.href}>
                                <menuItem.icon className="w-5 h-5 mr-3" />
                                {menuItem.name}
                              </Link>
                            </Button>
                          ))}
                          {!isAdminRoute && (
                            <Button asChild variant="ghost" className="justify-start text-lg" onClick={() => setIsMenuOpen(false)}>
                              <Link href="/">
                                <Home className="w-5 h-5 mr-3" />
                                Patel Pulse Ventures Home
                              </Link>
                            </Button>
                          )}
                        </div>
                      </DrawerContent>
                    </Drawer>
                  )
                }

                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex-1 flex justify-center"
                  >
                    <Link
                      href={item.href}
                      className="flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all duration-200 w-full max-w-[72px] relative group"
                    >
                      <div className="relative z-10 flex flex-col items-center justify-center w-full">
                        <motion.div
                          whileTap={{ scale: 0.9 }}
                          className={`transition-colors duration-200 ${active ? activeTextColor : inactiveTextColor}`}
                        >
                          <item.icon className="w-5 h-5 mb-1" />
                        </motion.div>
                        <span
                          className={`text-[11px] leading-none transition-colors duration-200 truncate ${
                            active ? activeTextColor : inactiveTextColor
                          }`}
                        >
                          {item.name}
                        </span>
                      </div>

                      {active && (
                        <motion.div
                          layoutId="activeMobileIndicator"
                          className={`absolute inset-0 ${activeBg} rounded-xl`}
                          initial={{ opacity: 0, scale: 0.85 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                        />
                      )}
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  )
}
