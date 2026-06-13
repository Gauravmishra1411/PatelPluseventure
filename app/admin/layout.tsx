
"use client"

import { useState, useEffect } from "react"
import AdminAuthGuard from "@/components/admin-auth-guard"
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
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import { BarChart3, FolderOpen, Home, MessageSquare, Users, Wrench, Info, Star, Briefcase, ShoppingBag, Settings, LayoutDashboard, FileBarChart, ShoppingCart, LogOut, Package, Percent, Palette, LayoutGrid, Bell, FileText } from "lucide-react"
import Link from "next/link"
import { Logo } from "@/components/logo"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { signOut } from "firebase/auth"
import { auth, db } from "@/lib/firebase"
import MobileBottomNav from "@/components/mobile-bottom-nav"
import { collection, onSnapshot, query, where } from "firebase/firestore"
import { Badge } from "@/components/ui/badge"


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    const q = query(collection(db, "notifications"), where("isRead", "==", false));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUnreadNotifications(snapshot.size);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth)
      toast.success("Logged out successfully")
      router.push("/admin/login")
    } catch (error) {
      toast.error("Failed to log out")
    }
  }

  return (
    <AdminAuthGuard>
      <div className="dark bg-background min-h-screen">
        <SidebarProvider>
          <Sidebar className="border-r border-border bg-card">
            <SidebarHeader className="border-b border-border p-6">
              <div className="flex items-center gap-3">
                <Logo size="xl" priority />
              </div>
            </SidebarHeader>

            <SidebarContent className="bg-card px-4 py-6">
              <SidebarMenu className="space-y-2">
                <SidebarMenuItem>
                  <SidebarMenuButton
                    href="/admin"
                    asChild
                    className="w-full justify-start text-foreground hover:bg-secondary hover:text-foreground transition-all duration-200 rounded-lg px-4 py-3 group"
                  >
                    <Link href="/admin" className="flex items-center gap-3">
                      <LayoutDashboard className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      <span className="font-medium">Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    href="/admin/notifications"
                    asChild
                    className="w-full justify-start text-foreground hover:bg-secondary hover:text-foreground transition-all duration-200 rounded-lg px-4 py-3 group"
                  >
                    <Link href="/admin/notifications" className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <Bell className="h-5 w-5 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">Notifications</span>
                      </div>
                      {unreadNotifications > 0 && (
                        <Badge className="bg-destructive text-destructive-foreground">{unreadNotifications}</Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarGroup className="mt-8">
                  <SidebarGroupLabel className="text-muted-foreground font-semibold text-sm uppercase tracking-wider mb-4 px-4">
                    Patel Pulse Ventures Site
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        href="/admin/clients"
                        asChild
                        className="w-full justify-start text-foreground hover:bg-secondary hover:text-foreground transition-all duration-200 rounded-lg px-4 py-3 group"
                      >
                        <Link href="/admin/clients" className="flex items-center gap-3">
                          <Briefcase className="h-5 w-5 group-hover:scale-110 transition-transform" />
                          <span className="font-medium">Clients</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                      <SidebarMenuButton
                        href="/admin/pages"
                        asChild
                        className="w-full justify-start text-foreground hover:bg-secondary hover:text-foreground transition-all duration-200 rounded-lg px-4 py-3 group"
                      >
                        <Link href="/admin/pages" className="flex items-center gap-3">
                          <FileText className="h-5 w-5 group-hover:scale-110 transition-transform" />
                          <span className="font-medium">Pages</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                      <SidebarMenuButton
                        href="/admin/about"
                        asChild
                        className="w-full justify-start text-foreground hover:bg-secondary hover:text-foreground transition-all duration-200 rounded-lg px-4 py-3 group"
                      >
                        <Link href="/admin/about" className="flex items-center gap-3">
                          <Info className="h-5 w-5 group-hover:scale-110 transition-transform" />
                          <span className="font-medium">About</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                      <SidebarMenuButton
                        href="/admin/users"
                        asChild
                        className="w-full justify-start text-foreground hover:bg-secondary hover:text-foreground transition-all duration-200 rounded-lg px-4 py-3 group"
                      >
                        <Link href="/admin/users" className="flex items-center gap-3">
                          <Users className="h-5 w-5 group-hover:scale-110 transition-transform" />
                          <span className="font-medium">Users</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                      <SidebarMenuButton
                        href="/admin/projects"
                        asChild
                        className="w-full justify-start text-foreground hover:bg-secondary hover:text-foreground transition-all duration-200 rounded-lg px-4 py-3 group"
                      >
                        <Link href="/admin/projects" className="flex items-center gap-3">
                          <FolderOpen className="h-5 w-5 group-hover:scale-110 transition-transform" />
                          <span className="font-medium">Projects</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                      <SidebarMenuButton
                        href="/admin/services"
                        asChild
                        className="w-full justify-start text-foreground hover:bg-secondary hover:text-foreground transition-all duration-200 rounded-lg px-4 py-3 group"
                      >
                        <Link href="/admin/services" className="flex items-center gap-3">
                          <Wrench className="h-5 w-5 group-hover:scale-110 transition-transform" />
                          <span className="font-medium">Services</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                      <SidebarMenuButton
                        href="/admin/testimonials"
                        asChild
                        className="w-full justify-start text-foreground hover:bg-secondary hover:text-foreground transition-all duration-200 rounded-lg px-4 py-3 group"
                      >
                        <Link href="/admin/testimonials" className="flex items-center gap-3">
                          <Star className="h-5 w-5 group-hover:scale-110 transition-transform" />
                          <span className="font-medium">Testimonials</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                      <SidebarMenuButton
                        href="/admin/messages"
                        asChild
                        className="w-full justify-start text-foreground hover:bg-secondary hover:text-foreground transition-all duration-200 rounded-lg px-4 py-3 group"
                      >
                        <Link href="/admin/messages" className="flex items-center gap-3">
                          <MessageSquare className="h-5 w-5 group-hover:scale-110 transition-transform" />
                          <span className="font-medium">Messages</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup className="mt-8">
                  <SidebarGroupLabel className="text-muted-foreground font-semibold text-sm uppercase tracking-wider mb-4 px-4">
                    Marketplace
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenuItem>
                      <SidebarMenuButton href="/admin/marketplace/orders" asChild className="w-full justify-start text-foreground hover:bg-secondary hover:text-foreground transition-all duration-200 rounded-lg px-4 py-3 group">
                        <Link href="/admin/marketplace/orders" className="flex items-center gap-3"><ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform" /><span className="font-medium">Orders</span></Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton href="/admin/marketplace/customers" asChild className="w-full justify-start text-foreground hover:bg-secondary hover:text-foreground transition-all duration-200 rounded-lg px-4 py-3 group">
                        <Link href="/admin/marketplace/customers" className="flex items-center gap-3"><Users className="h-5 w-5 group-hover:scale-110 transition-transform" /><span className="font-medium">Customers</span></Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton href="/admin/marketplace/reviews" asChild className="w-full justify-start text-foreground hover:bg-secondary hover:text-foreground transition-all duration-200 rounded-lg px-4 py-3 group">
                        <Link href="/admin/marketplace/reviews" className="flex items-center gap-3"><Star className="h-5 w-5 group-hover:scale-110 transition-transform" /><span className="font-medium">Reviews</span></Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton href="/admin/marketplace/products" asChild className="w-full justify-start text-foreground hover:bg-secondary hover:text-foreground transition-all duration-200 rounded-lg px-4 py-3 group">
                        <Link href="/admin/marketplace/products" className="flex items-center gap-3"><Package className="h-5 w-5 group-hover:scale-110 transition-transform" /><span className="font-medium">Products</span></Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton href="/admin/marketplace/categories" asChild className="w-full justify-start text-foreground hover:bg-secondary hover:text-foreground transition-all duration-200 rounded-lg px-4 py-3 group">
                        <Link href="/admin/marketplace/categories" className="flex items-center gap-3"><LayoutGrid className="h-5 w-5 group-hover:scale-110 transition-transform" /><span className="font-medium">Categories</span></Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton href="/admin/marketplace/discounts" asChild className="w-full justify-start text-foreground hover:bg-secondary hover:text-foreground transition-all duration-200 rounded-lg px-4 py-3 group">
                        <Link href="/admin/marketplace/discounts" className="flex items-center gap-3"><Percent className="h-5 w-5 group-hover:scale-110 transition-transform" /><span className="font-medium">Discounts</span></Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton href="/admin/marketplace/customize" asChild className="w-full justify-start text-foreground hover:bg-secondary hover:text-foreground transition-all duration-200 rounded-lg px-4 py-3 group">
                        <Link href="/admin/marketplace/customize" className="flex items-center gap-3"><Settings className="h-5 w-5 group-hover:scale-110 transition-transform" /><span className="font-medium">Customize</span></Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton href="/admin/analytics" asChild className="w-full justify-start text-foreground hover:bg-secondary hover:text-foreground transition-all duration-200 rounded-lg px-4 py-3 group">
                        <Link href="/admin/analytics" className="flex items-center gap-3"><BarChart3 className="h-5 w-5 group-hover:scale-110 transition-transform" /><span className="font-medium">Analytics</span></Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarGroupContent>
                </SidebarGroup>

                <SidebarMenuItem className="mt-8">
                  <SidebarMenuButton
                    href="/admin/settings"
                    asChild
                    className="w-full justify-start text-foreground hover:bg-secondary hover:text-foreground transition-all duration-200 rounded-lg px-4 py-3 group"
                  >
                    <Link href="/admin/settings" className="flex items-center gap-3">
                      <Settings className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      <span className="font-medium">Settings</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>

            <SidebarFooter className="border-t border-border p-4 bg-card">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={handleLogout}
                    asChild
                    className="w-full justify-start text-foreground hover:bg-secondary hover:text-foreground transition-all duration-200 rounded-lg px-4 py-3 group"
                  >
                    <button className="flex items-center gap-3 w-full">
                      <LogOut className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    href="/"
                    asChild
                    className="w-full justify-start text-foreground hover:bg-secondary hover:text-foreground transition-all duration-200 rounded-lg px-4 py-3 group"
                  >
                    <Link href="/" className="flex items-center gap-3">
                      <Home className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      <span className="font-medium">Back to Site</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </Sidebar>

          <SidebarInset className="bg-background">
            <header className="flex h-20 items-center justify-between border-b border-border bg-background/80 backdrop-blur-lg px-6 md:hidden">
              <div className="flex items-center gap-3">
                <Logo size="md" priority />
              </div>
              <SidebarTrigger className="text-foreground hover:text-foreground" />
            </header>
            <main className="flex-1 overflow-y-auto bg-background text-foreground">
              {children}
            </main>
            <MobileBottomNav />
          </SidebarInset>
        </SidebarProvider>
      </div>
    </AdminAuthGuard>
  )
}
