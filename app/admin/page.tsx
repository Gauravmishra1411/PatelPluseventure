
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, MessageSquare, FolderOpen, TrendingUp, DollarSign, LogOut, Plus, BarChart2, ShoppingBag, ShoppingCart, Package, Star, Eye, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { db, auth } from "@/lib/firebase"
import { collection, getDocs, onSnapshot, query, orderBy, where, Timestamp } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { signOut } from "firebase/auth"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';

interface DashboardStats {
  totalUsers: number
  totalProjects: number
  totalMessages: number
  totalRevenue: number
  activeProjects: number
  unreadMessages: number
  totalProducts: number
  totalOrders: number
  totalCustomers: number
  monthlyRevenue: number
}

interface Order {
  id: string;
  customer: string;
  product: string;
  amount: number;
  status: string;
  createdAt: Timestamp;
}

interface Product {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  rating: number;
}

const initialStats: DashboardStats = {
  totalUsers: 0,
  totalProjects: 0,
  totalMessages: 0,
  totalRevenue: 0,
  activeProjects: 0,
  unreadMessages: 0,
  totalProducts: 0,
  totalOrders: 0,
  totalCustomers: 0,
  monthlyRevenue: 0,
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>(initialStats)
  const [recentUsers, setRecentUsers] = useState<any[]>([])
  const [recentMessages, setRecentMessages] = useState<any[]>([])
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [topProducts, setTopProducts] = useState<any[]>([])
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true)
  const [adminEmail, setAdminEmail] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setAdminEmail(user.email)
      } else {
        router.push("/admin/login")
      }
    })
    return () => unsubscribe()
  }, [router])

  useEffect(() => {

    const fetchDashboardData = async () => {
      try {
        // General Stats
        const usersSnapshot = await getDocs(collection(db, "users"));
        const projectsSnapshot = await getDocs(collection(db, "projects"));
        const messagesSnapshot = await getDocs(collection(db, "contactMessages"));
        const productsSnapshot = await getDocs(collection(db, "marketplace_products"));
        const ordersSnapshot = await getDocs(collection(db, "marketplace_orders"));

        const totalRevenue = ordersSnapshot.docs
          .filter(doc => doc.data().status === 'Fulfilled' || doc.data().status === 'Delivered')
          .reduce((sum, doc) => sum + doc.data().total, 0);

        setStats({
          totalUsers: usersSnapshot.size,
          totalProjects: projectsSnapshot.size,
          totalMessages: messagesSnapshot.size,
          totalRevenue: totalRevenue,
          activeProjects: projectsSnapshot.docs.filter((p: any) => p.status === "in_progress").length,
          unreadMessages: messagesSnapshot.docs.filter((m: any) => m.status === "unread").length,
          totalProducts: productsSnapshot.size,
          totalOrders: ordersSnapshot.size,
          totalCustomers: usersSnapshot.size,
          monthlyRevenue: totalRevenue, // Replace with actual monthly calculation if needed
        });

        // Recent Orders
        const ordersQuery = query(collection(db, "marketplace_orders"), orderBy("createdAt", "desc"), where("status", "in", ["Pending", "Processing", "Fulfilled", "Delivered"]), where("createdAt", "!=", null));
        const ordersUnsub = onSnapshot(ordersQuery, (snapshot) => {
          setRecentOrders(snapshot.docs.map(doc => ({
            id: doc.id,
            customer: doc.data().userName,
            amount: doc.data().total,
            status: doc.data().status,
          })));
        });

        // Top Products
        const productsQuery = query(collection(db, "marketplace_products"), orderBy("createdAt", "desc"));
        const productsUnsub = onSnapshot(productsQuery, (snapshot) => {
          setTopProducts(snapshot.docs.map(doc => ({
            id: doc.id,
            name: doc.data().title,
            revenue: doc.data().salePrice || doc.data().regularPrice, // Simplified
            sales: doc.data().salesCount || 0, // Assuming salesCount field
            rating: doc.data().rating || 0
          })));
        });

        // Chart Data
        const salesByDay: { [key: string]: { sales: number, orders: number } } = {};
        ordersSnapshot.docs.forEach(doc => {
          const order = doc.data();
          const date = order.createdAt.toDate().toLocaleDateString('en-US', { weekday: 'short' });
          if (!salesByDay[date]) {
            salesByDay[date] = { sales: 0, orders: 0 };
          }
          salesByDay[date].sales += order.total;
          salesByDay[date].orders += 1;
        });

        const formattedChartData = Object.entries(salesByDay).map(([name, data]) => ({ name, ...data }));
        setChartData(formattedChartData);

        setLoading(false);

        return () => {
          ordersUnsub();
          productsUnsub();
        };
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        toast.error("Failed to load dashboard data");
        setLoading(false);
      }
    };

    fetchDashboardData();

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "completed":
      case "Fulfilled":
      case "Delivered":
        return "bg-gradient-to-r from-green-500 to-emerald-500"
      case "pending":
      case "processing":
      case "Pending":
      case "Processing":
        return "bg-gradient-to-r from-yellow-500 to-orange-500"
      case "inactive":
        return "bg-gradient-to-r from-red-500 to-rose-500"
      case "unread":
        return "bg-gradient-to-r from-blue-500 to-cyan-500"
      case "read":
        return "bg-gradient-to-r from-gray-500 to-slate-500"
      case "high":
        return "bg-gradient-to-r from-red-500 to-pink-500"
      case "medium":
        return "bg-gradient-to-r from-yellow-500 to-amber-500"
      case "low":
        return "bg-gradient-to-r from-green-500 to-teal-500"
      default:
        return "bg-gradient-to-r from-gray-500 to-slate-500"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-primary border-r-accent mx-auto mb-6"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-b-primary border-l-accent mx-auto animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <p className="text-foreground text-lg font-medium">Loading dashboard...</p>
          <p className="text-muted-foreground text-sm mt-2">Preparing your admin experience</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
      {/* Header with Gradient Background */}
      <div className="relative bg-card border border-primary/20 px-8 py-6 rounded-2xl mb-8 backdrop-blur-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5"></div>
        <div className="relative flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent mb-2">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground text-lg">Welcome back, <span className="text-primary font-medium">{adminEmail}</span>!</p>
          </div>
          <div className="items-center space-x-4">


          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-6 mb-8">
        {/* Business Stats */}
        <Card className="relative bg-card/80 border-primary/20 backdrop-blur-lg hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 transform hover:-translate-y-1 col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-2 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent"></div>
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-cyan-500/20">
              <Users className="h-5 w-5 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-foreground mb-1">{stats.totalUsers}</div>
            <div className="flex items-center text-xs">
              <ArrowUpRight className="w-3 h-3 text-green-400 mr-1" />
              <span className="text-green-400">+12%</span>
              <span className="text-gray-400 ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative bg-card/80 border-primary/20 backdrop-blur-lg hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 transform hover:-translate-y-1 col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-2 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent"></div>
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Projects</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-violet-500/20">
              <FolderOpen className="h-5 w-5 text-purple-400" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-foreground mb-1">{stats.activeProjects}</div>
            <p className="text-xs text-gray-400">{stats.totalProjects} total projects</p>
          </CardContent>
        </Card>

        <Card className="relative bg-card/80 border-primary/20 backdrop-blur-lg hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 transform hover:-translate-y-1 col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-2 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent"></div>
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Messages</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-r from-yellow-500/20 to-orange-500/20">
              <MessageSquare className="h-5 w-5 text-yellow-400" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-foreground mb-1">{stats.unreadMessages}</div>
            <p className="text-xs text-gray-400">{stats.totalMessages} total messages</p>
          </CardContent>
        </Card>

        <Card className="relative bg-card/80 border-primary/20 backdrop-blur-lg hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 transform hover:-translate-y-1 col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-2 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent"></div>
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Project Revenue</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20">
              <DollarSign className="h-5 w-5 text-green-400" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-foreground mb-1">₹{stats.totalRevenue.toLocaleString()}</div>
            <div className="flex items-center text-xs">
              <ArrowUpRight className="w-3 h-3 text-green-400 mr-1" />
              <span className="text-green-400">+8%</span>
              <span className="text-gray-400 ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ecommerce Stats Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-gradient-to-r from-[#B6F500]/20 to-[#00FF88]/20">
            <ShoppingBag className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-white">Ecommerce Overview</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="relative bg-card/80 border-accent/20 backdrop-blur-lg hover:shadow-lg hover:shadow-accent/10 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent"></div>
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
              <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20">
                <Package className="h-5 w-5 text-cyan-400" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold text-foreground mb-1">{stats.totalProducts}</div>
              <div className="flex items-center text-xs">
                <ArrowUpRight className="w-3 h-3 text-green-400 mr-1" />
                <span className="text-green-400">+5%</span>
                <span className="text-gray-400 ml-1">new this month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="relative bg-card/80 border-accent/20 backdrop-blur-lg hover:shadow-lg hover:shadow-accent/10 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent"></div>
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
              <div className="p-2 rounded-lg bg-gradient-to-r from-pink-500/20 to-rose-500/20">
                <ShoppingCart className="h-5 w-5 text-pink-400" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold text-foreground mb-1">{stats.totalOrders}</div>
              <div className="flex items-center text-xs">
                <ArrowUpRight className="w-3 h-3 text-green-400 mr-1" />
                <span className="text-green-400">+18%</span>
                <span className="text-gray-400 ml-1">from last week</span>
              </div>
            </CardContent>
          </Card>

          <Card className="relative bg-card/80 border-accent/20 backdrop-blur-lg hover:shadow-lg hover:shadow-accent/10 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent"></div>
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Customers</CardTitle>
              <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500/20 to-purple-500/20">
                <Users className="h-5 w-5 text-indigo-400" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold text-foreground mb-1">{stats.totalCustomers.toLocaleString()}</div>
              <div className="flex items-center text-xs">
                <ArrowUpRight className="w-3 h-3 text-green-400 mr-1" />
                <span className="text-green-400">+23%</span>
                <span className="text-gray-400 ml-1">growth rate</span>
              </div>
            </CardContent>
          </Card>

          <Card className="relative bg-card/80 border-accent/20 backdrop-blur-lg hover:shadow-lg hover:shadow-accent/10 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent"></div>
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Revenue</CardTitle>
              <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500/20 to-green-500/20">
                <TrendingUp className="h-5 w-5 text-emerald-400" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold text-white mb-1">₹{stats.monthlyRevenue.toLocaleString()}</div>
              <div className="flex items-center text-xs">
                <ArrowUpRight className="w-3 h-3 text-green-400 mr-1" />
                <span className="text-green-400">+15%</span>
                <span className="text-gray-400 ml-1">vs last month</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Enhanced Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card className="bg-card/80 border-primary/20 backdrop-blur-lg hover:shadow-xl hover:shadow-primary/10 transition-all duration-500">
          <CardHeader>
            <CardTitle className="text-foreground text-xl font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              User Growth & Revenue
            </CardTitle>
            <CardDescription className="text-muted-foreground">Monthly performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#888888" />
                <YAxis stroke="#888888" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(31, 31, 46, 0.95)',
                    border: '1px solid #B6F500',
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)'
                  }}
                />
                <Area type="monotone" dataKey="users" stackId="1" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorUsers)" strokeWidth={3} />
                <Area type="monotone" dataKey="revenue" stackId="2" stroke="hsl(var(--accent))" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card/80 border-primary/20 backdrop-blur-lg hover:shadow-xl hover:shadow-primary/10 transition-all duration-500">
          <CardHeader>
            <CardTitle className="text-foreground text-xl font-semibold flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-[#00FF88]" />
              Weekly Sales Performance
            </CardTitle>
            <CardDescription className="text-muted-foreground">Orders and sales by day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#888888" />
                <YAxis stroke="#888888" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(31, 31, 46, 0.95)',
                    border: '1px solid #00FF88',
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)'
                  }}
                />
                <Bar dataKey="orders" fill="url(#colorOrders)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="sales" fill="url(#colorSales)" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.6} />
                  </linearGradient>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Activity Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Recent Users */}
        <Card className="bg-card/80 border-primary/20 backdrop-blur-lg hover:shadow-xl hover:shadow-primary/10 transition-all duration-500">
          <CardHeader>
            <CardTitle className="text-foreground text-xl font-semibold flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-400" />
              Recent Users
            </CardTitle>
            <CardDescription className="text-muted-foreground">Latest user registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.map((user, index) => (
                <div key={user.id || index} className="flex items-center justify-between p-3 rounded-lg bg-secondary/20 hover:bg-secondary/30 border-border">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-[#B6F500] to-[#00FF88] rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-sm font-bold text-black">{user.name?.charAt(0) || "U"}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(user.status)} text-white text-xs border-0 shadow-sm`}>
                    {user.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Messages */}
        <Card className="bg-card/80 border-primary/20 backdrop-blur-lg hover:shadow-xl hover:shadow-primary/10 transition-all duration-500">
          <CardHeader>
            <CardTitle className="text-foreground text-xl font-semibold flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-yellow-400" />
              Recent Messages
            </CardTitle>
            <CardDescription className="text-muted-foreground">Latest customer inquiries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMessages.map((message, index) => (
                <div key={message.id || index} className="flex items-center justify-between p-3 rounded-lg bg-secondary/20 hover:bg-secondary/30 border-border">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-yellow-500/20 to-orange-500/20">
                      <MessageSquare className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{message.name}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[150px]">{message.subject}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {message.priority && (
                      <Badge className={`${getStatusColor(message.priority)} text-white text-xs border-0 shadow-sm`}>
                        {message.priority}
                      </Badge>
                    )}
                    <Badge className={`${getStatusColor(message.status)} text-white text-xs border-0 shadow-sm`}>
                      {message.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="bg-gradient-to-br from-[#1F1F2E]/80 to-[#2A2A3E]/80 border-[#00FF88]/20 backdrop-blur-lg hover:shadow-xl hover:shadow-[#00FF88]/10 transition-all duration-500">
          <CardHeader>
            <CardTitle className="text-foreground text-xl font-semibold flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-green-400" />
              Recent Orders
            </CardTitle>
            <CardDescription className="text-muted-foreground">Latest ecommerce transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/20 hover:bg-secondary/30 border-border">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{order.customer}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-white">₹{order.amount.toFixed(2)}</p>
                    <Badge className={`${getStatusColor(order.status)} text-white text-xs border-0 shadow-sm mt-1`}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Products Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-card/80 border-accent/20 backdrop-blur-lg hover:shadow-xl hover:shadow-accent/10 transition-all duration-500">
          <CardHeader>
            <CardTitle className="text-foreground text-xl font-semibold flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-400" />
              Top Products
            </CardTitle>
            <CardDescription className="text-muted-foreground">Best performing products this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.slice(0, 5).map((product, index) => (
                <div key={product.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/20 hover:bg-secondary/30 border-border">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#B6F500]/20 to-[#00FF88]/20 rounded-lg flex items-center justify-center">
                      <span className="text-lg font-bold text-primary">{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{product.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">{product.sales} sales</span>
                        <div className="flex items-center">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-muted-foreground ml-1">{product.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-accent">₹{product.revenue.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-card/80 border-primary/20 backdrop-blur-lg hover:shadow-xl hover:shadow-primary/10 transition-all duration-500">
          <CardHeader>
            <CardTitle className="text-foreground text-xl font-semibold flex items-center gap-2">
              <Eye className="h-5 w-5 text-purple-400" />
              Quick Actions
            </CardTitle>
            <CardDescription className="text-muted-foreground">Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <Button
                onClick={() => router.push("/admin/products")}
                className="w-full justify-start bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 text-muted-foreground hover:from-blue-600/30 hover:to-cyan-600/30 hover:border-blue-500/50 transition-all duration-300 p-4 h-auto"
              >
                <Package className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <p className="font-semibold">Manage Products</p>
                  <p className="text-xs opacity-70">Add, edit, or remove products</p>
                </div>
              </Button>

              <Button
                onClick={() => router.push("/admin/orders")}
                className="w-full justify-start bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 text-muted-foreground hover:from-green-600/30 hover:to-emerald-600/30 hover:border-green-500/50 transition-all duration-300 p-4 h-auto"
              >
                <ShoppingCart className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <p className="font-semibold">Process Orders</p>
                  <p className="text-xs opacity-70">Review and fulfill orders</p>
                </div>
              </Button>

              <Button
                onClick={() => router.push("/admin/customers")}
                className="w-full justify-start bg-gradient-to-r from-purple-600/20 to-violet-600/20 border border-purple-500/30 text-muted-foreground hover:from-purple-600/30 hover:to-violet-600/30 hover:border-purple-500/50 transition-all duration-300 p-4 h-auto"
              >
                <Users className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <p className="font-semibold">Customer Support</p>
                  <p className="text-xs opacity-70">Handle customer inquiries</p>
                </div>
              </Button>

              <Button
                onClick={() => router.push("/admin/analytics")}
                className="w-full justify-start bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 text-muted-foreground hover:from-yellow-600/30 hover:to-orange-600/30 hover:border-yellow-500/50 transition-all duration-300 p-4 h-auto"
              >
                <TrendingUp className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <p className="font-semibold">View Analytics</p>
                  <p className="text-xs opacity-70">Detailed performance reports</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
