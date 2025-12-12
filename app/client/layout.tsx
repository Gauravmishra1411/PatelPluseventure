
"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { BarChart3, FolderOpen, Home, MessageSquare, Users, Zap, Wrench, Info, Star, Briefcase, User, FileText, BarChart, CreditCard, LogOut, Palette, ListChecks } from "lucide-react"
import Link from "next/link"
import { auth } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { signOut } from "firebase/auth"
import MobileBottomNav from "@/components/mobile-bottom-nav"


export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const router = useRouter()

  const handleLogout = async () => {
    try {
      await signOut(auth)
      toast.success("Logged out successfully")
      router.push("/")
    } catch (error) {
      toast.error("Failed to log out")
    }
  }

  return (
    <div className="dark bg-background min-h-screen">
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-gradient-to-r from-primary to-accent">
                  <Zap className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Patel Pulse Ventures
                </span>
              </Link>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton href="/client" asChild>
                  <Link href="/client">
                    <BarChart />
                    Dashboard
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton href="/client/profile" asChild>
                  <Link href="/client/profile">
                    <User />
                    Profile
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton href="/client/designs" asChild>
                  <Link href="/client/designs">
                    <Palette />
                    Designs
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton href="/client/progress" asChild>
                  <Link href="/client/progress">
                    <ListChecks />
                    Progress
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton href="/client/billing" asChild>
                  <Link href="/client/billing">
                    <CreditCard />
                    Billing
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton href="/client/chat" asChild>
                  <Link href="/client/chat">
                    <MessageSquare />
                    Chat
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} asChild>
                  <Link href="/">
                    <LogOut />
                    Logout
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton href="/" asChild>
                  <Link href="/">
                    <Home />
                    Back to Site
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset>
          <header className="flex h-12 items-center justify-between border-b bg-background/50 backdrop-blur-sm px-4 md:hidden">
            <div className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">Client Dashboard</span>
            </div>
            <SidebarTrigger />
          </header>
          <main className="flex-1 overflow-y-auto bg-background text-foreground p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </SidebarInset>
        <MobileBottomNav />
      </SidebarProvider>
    </div>
  )
}
