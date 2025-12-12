
"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Loader2 } from "lucide-react"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged, User } from "firebase/auth"
import { toast } from "sonner"

interface AdminAuthGuardProps {
  children: React.ReactNode
}

export default function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (loading) return

    const isLoginPage = pathname === "/admin/login"
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL

    if (!user && !isLoginPage) {
      router.push("/admin/login")
      return;
    }

    if (user) {
      if (user.email !== adminEmail) {
        toast.error("You are not authorized to access this page.")
        router.push("/")
        return;
      }

      if (isLoginPage) {
        router.push("/admin")
      }
    }
  }, [user, loading, pathname, router])

  if (loading || (!user && pathname !== "/admin/login") || (user && user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL && pathname !== '/admin/login')) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-green-500 mx-auto mb-4" />
          <p className="text-white">Authenticating...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
