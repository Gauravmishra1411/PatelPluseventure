
import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import SmoothScroll from "@/components/smooth-scroll"
import GoogleAnalytics from "@/components/GoogleAnalytics"
import { ThemeProvider } from "@/components/theme-provider"
import ThemeCustomizer from "@/components/theme-customizer"
import Navbar from "@/components/navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Patel Pulse Ventures - Transforming Ideas into Digital Reality",
  description:
    "We invite eligible contractors, suppliers, and service providers to bid on our construction and infrastructure projects. All tenders are evaluated on technical competence, financial capability, and value for money — ensuring a fair and transparent process for every participant.",
  keywords: "construction tenders, infrastructure projects, allied sectors, contracting, patel pulse ventures",
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
      "We invite eligible contractors, suppliers, and service providers to bid on our construction and infrastructure projects. All tenders are evaluated on technical competence, financial capability, and value for money — ensuring a fair and transparent process for every participant.",
    siteName: "Patel Pulse Ventures",
    images: ["/logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Patel Pulse Ventures - Transforming Ideas into Digital Reality",
    description:
      "We invite eligible contractors, suppliers, and service providers to bid on our construction and infrastructure projects. All tenders are evaluated on technical competence, financial capability, and value for money — ensuring a fair and transparent process for every participant",
    creator: "@patelpulseventures",
    images: ["/logo.png"],
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  generator: 'v0.dev',
  verification: {
    other: {
      "facebook-domain-verification": "cjypvn3mhrf5svx1c89nudills5ndu",
    },
  },
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
      <body className={`${inter.className} overflow-y-auto`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {/* <ThemeCustomizer /> */}
          <SmoothScroll>
        <Navbar />
        {children}
        <Toaster position="top-center" richColors />
      </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  )
}
