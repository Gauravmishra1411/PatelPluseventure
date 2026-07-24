import type React from "react"
import { Home, Briefcase, Star, FileText, Info, Mail } from "lucide-react"

export const navItems = [
  { name: "Home", href: "/", id: "home", icon: Home },
  { name: "Services", href: "/services", id: "services", icon: Briefcase },
  { name: "Projects", href: "/projects", id: "projects", icon: Star },
  { name: "Tenders", href: "/tenders", id: "tenders", icon: FileText },
  { name: "About Us", href: "/about", id: "about", icon: Info },
  { name: "Contact", href: "/contact", id: "contact", icon: Mail },
]

export const sectionIds = ["home", "services", "projects", "tenders", "about", "contact"]

export const handleNavClick = (
  e: React.MouseEvent<HTMLAnchorElement>,
  item: typeof navItems[0],
  pathname: string,
  onNavComplete?: () => void
) => {
  if (onNavComplete) {
    onNavComplete()
  }
  
  if (pathname === "/") {
    const targetElement = document.getElementById(item.id)
    if (targetElement) {
      e.preventDefault()
      const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY
      const offsetPosition = item.id === "home" ? 0 : elementPosition - 80
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  }
}
