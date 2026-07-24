"use client"

import { useState, useEffect } from "react"

interface UseActiveSectionOptions {
  sectionIds: string[]
  navbarHeight?: number
  defaultSection?: string
}

export function useActiveSection({
  sectionIds,
  navbarHeight = 80,
  defaultSection = "home",
}: UseActiveSectionOptions) {
  const [activeSection, setActiveSection] = useState<string>(defaultSection)

  useEffect(() => {
    if (typeof window === "undefined") return

    const calculateActiveSection = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollY = window.scrollY

      // 1. Top of page edge case -> "home"
      if (scrollY < 80) {
        setActiveSection("home")
        return
      }

      // 2. Bottom of page edge case -> "contact"
      if (scrollY + windowHeight >= documentHeight - 50) {
        const lastSection = sectionIds[sectionIds.length - 1] || "contact"
        setActiveSection(lastSection)
        return
      }

      // 3. Middle viewport section detection
      let bestSection = ""
      let maxVisiblePercentage = 0

      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (el) {
          const rect = el.getBoundingClientRect()
          const visibleTop = Math.max(navbarHeight, rect.top)
          const visibleBottom = Math.min(windowHeight, rect.bottom)
          const visibleHeight = Math.max(0, visibleBottom - visibleTop)

          if (visibleHeight > 0) {
            const percentage = visibleHeight / windowHeight
            if (percentage > maxVisiblePercentage) {
              maxVisiblePercentage = percentage
              bestSection = id
            }
          }
        }
      }

      if (bestSection) {
        setActiveSection(bestSection)
      }
    }

    // High-precision IntersectionObserver
    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: `-${navbarHeight}px 0px -20% 0px`,
      threshold: [0.1, 0.25, 0.5, 0.75, 1.0],
    }

    const observer = new IntersectionObserver(() => {
      calculateActiveSection()
    }, observerOptions)

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) {
        observer.observe(el)
      }
    })

    window.addEventListener("scroll", calculateActiveSection, { passive: true })
    window.addEventListener("resize", calculateActiveSection, { passive: true })

    calculateActiveSection()

    return () => {
      observer.disconnect()
      window.removeEventListener("scroll", calculateActiveSection)
      window.removeEventListener("resize", calculateActiveSection)
    }
  }, [sectionIds, navbarHeight])

  return activeSection
}
