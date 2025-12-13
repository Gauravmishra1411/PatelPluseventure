
import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import SmoothScroll from "@/components/smooth-scroll"
import GoogleAnalytics from "@/components/GoogleAnalytics"
import { ThemeProvider } from "@/components/theme-provider"
import ThemeCustomizer from "@/components/theme-customizer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Patel Pulse Ventures - Transforming Ideas into Digital Reality",
  description:
    "We craft cutting-edge digital experiences with AI-powered solutions, modern web technologies, and innovative design that drive business growth and user engagement.",
  keywords: "web development, mobile apps, AI solutions, digital transformation, patel pulse ventures",
  authors: [{ name: "Patel Pulse Ventures" }],
  creator: "Patel Pulse Ventures",
  publisher: "Patel Pulse Ventures",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://patelpulseventures.com",
    title: "Patel Pulse Ventures - Transforming Ideas into Digital Reality",
    description:
      "We craft cutting-edge digital experiences with AI-powered solutions, modern web technologies, and innovative design.",
    siteName: "Patel Pulse Ventures",
  },
  twitter: {
    card: "summary_large_image",
    title: "Patel Pulse Ventures - Transforming Ideas into Digital Reality",
    description:
      "We craft cutting-edge digital experiences with AI-powered solutions, modern web technologies, and innovative design.",
    creator: "@patelpulseventures",
  },
  generator: 'v0.dev'
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <GoogleAnalytics />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ThemeCustomizer />
          <SmoothScroll>
            {children}
            <Toaster position="top-center" richColors />
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  )
}
