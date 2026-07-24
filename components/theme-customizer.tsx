"use client"

import { useEffect } from "react"
import { doc, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useTheme } from "next-themes"

function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
        ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}`
        : "0 0 0"
}

export default function ThemeCustomizer() {
    const { resolvedTheme } = useTheme()

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, "settings", "theme"), (doc: any) => {
            if (doc.exists()) {
                const data = doc.data()
                const themeConfig = data[resolvedTheme === "dark" ? "dark" : "light"] || data.dark

                if (themeConfig) {
                    const root = document.documentElement

                    // Set RGB variables for Tailwind opacity support
                    root.style.setProperty("--primary-rgb", hexToRgb(themeConfig.primary))
                    root.style.setProperty("--accent-rgb", hexToRgb(themeConfig.accent))
                    root.style.setProperty("--background-rgb", hexToRgb(themeConfig.background))
                    root.style.setProperty("--secondary-bg-rgb", hexToRgb(themeConfig.secondaryBackground || themeConfig.primary))

                    // Set Hex variables for direct usage
                    root.style.setProperty("--primary", themeConfig.primary)
                    root.style.setProperty("--accent", themeConfig.accent)
                    root.style.setProperty("--background", themeConfig.background)
                }
            }
        })

        return () => unsubscribe()
    }, [resolvedTheme])

    return null
}
