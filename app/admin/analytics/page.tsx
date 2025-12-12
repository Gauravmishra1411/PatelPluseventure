
"use client"

import { motion } from "framer-motion"
import {
  TrendingUp,
  Users,
  Eye,
  MousePointer,
  Globe,
  Smartphone,
  Monitor,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const analyticsData = [
  {
    title: "Total Visitors",
    value: "45,892",
    change: "+12.5%",
    trend: "up",
    icon: Users,
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Page Views",
    value: "128,492",
    change: "+8.2%",
    trend: "up",
    icon: Eye,
    color: "from-green-500 to-emerald-500",
  },
  {
    title: "Bounce Rate",
    value: "32.4%",
    change: "-5.1%",
    trend: "down",
    icon: MousePointer,
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "Conversion Rate",
    value: "4.8%",
    change: "+2.3%",
    trend: "up",
    icon: TrendingUp,
    color: "from-orange-500 to-red-500",
  },
]

const trafficSources = [
  { source: "Organic Search", visitors: 18500, percentage: 42, color: "bg-blue-500" },
  { source: "Direct", visitors: 12800, percentage: 29, color: "bg-green-500" },
  { source: "Social Media", visitors: 8900, percentage: 20, color: "bg-purple-500" },
  { source: "Referral", visitors: 3200, percentage: 7, color: "bg-orange-500" },
  { source: "Email", visitors: 890, percentage: 2, color: "bg-pink-500" },
]

const topPages = [
  { page: "/", title: "Home Page", views: 25680, percentage: 20 },
  { page: "/services", title: "Services", views: 18920, percentage: 15 },
  { page: "/about", title: "About Us", views: 15340, percentage: 12 },
  { page: "/contact", title: "Contact", views: 12890, percentage: 10 },
  { page: "/projects", title: "Projects", views: 9870, percentage: 8 },
]

const deviceBreakdown = [
  { device: "Desktop", percentage: 65, icon: Monitor, sessions: 29830 },
  { device: "Mobile", percentage: 28, icon: Smartphone, sessions: 12850 },
  { device: "Tablet", percentage: 7, icon: Globe, sessions: 3212 },
]

const recentActivity = [
  { action: "New user registration", user: "john@example.com", time: "2 minutes ago", type: "user" },
  { action: "Contact form submission", user: "sarah@company.com", time: "5 minutes ago", type: "contact" },
  { action: "Project inquiry", user: "mike@startup.io", time: "12 minutes ago", type: "project" },
  { action: "Newsletter subscription", user: "emily@design.co", time: "18 minutes ago", type: "newsletter" },
  { action: "Service page viewed", user: "Anonymous", time: "25 minutes ago", type: "view" },
]

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6 lg:p-8">
      {/* Analytics Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {analyticsData.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="bg-card/50 border-primary/20 backdrop-blur-sm hover:bg-card/70 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <p className="text-2xl md:text-3xl font-bold">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      {stat.trend === "up" ? (
                        <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
                      )}
                      <span className={`text-sm ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-full bg-gradient-to-r ${stat.color} bg-opacity-20`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Traffic Sources */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-card/50 border-primary/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-primary" />
                Traffic Sources
              </CardTitle>
              <CardDescription>Where your visitors are coming from</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trafficSources.map((source, index) => (
                  <motion.div
                    key={source.source}
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{source.source}</span>
                      <div className="text-right">
                        <span className="text-sm text-muted-foreground">{source.visitors.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground/80 ml-2">{source.percentage}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <motion.div
                        className={`h-2 rounded-full ${source.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${source.percentage}%` }}
                        transition={{ duration: 1, delay: 0.4 + index * 0.2 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Device Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-card/50 border-primary/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="w-5 h-5 text-primary" />
                Device Usage
              </CardTitle>
              <CardDescription>Traffic breakdown by device type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deviceBreakdown.map((device, index) => (
                  <motion.div
                    key={device.device}
                    className="flex items-center justify-between p-3 rounded-lg bg-background/50"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                  >
                    <div className="flex items-center gap-3">
                      <device.icon className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{device.device}</p>
                        <p className="text-sm text-muted-foreground">{device.sessions.toLocaleString()} sessions</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{device.percentage}%</p>
                      <div className="w-16 bg-secondary rounded-full h-2 mt-1">
                        <motion.div
                          className="h-2 rounded-full bg-gradient-to-r from-primary to-accent"
                          initial={{ width: 0 }}
                          animate={{ width: `${device.percentage}%` }}
                          transition={{ duration: 1, delay: 0.5 + index * 0.2 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="bg-card/50 border-primary/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Top Pages
              </CardTitle>
              <CardDescription>Most visited pages on your website</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPages.map((page, index) => (
                  <motion.div
                    key={page.page}
                    className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-background/70 transition-colors"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                  >
                    <div>
                      <p className="font-medium">{page.title}</p>
                      <p className="text-sm text-muted-foreground">{page.page}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{page.views.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">{page.percentage}%</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="bg-card/50 border-primary/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest user interactions and events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg bg-background/50"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${activity.type === "user"
                          ? "bg-green-500"
                          : activity.type === "contact"
                            ? "bg-blue-500"
                            : activity.type === "project"
                              ? "bg-purple-500"
                              : activity.type === "newsletter"
                                ? "bg-yellow-500"
                                : "bg-gray-500"
                        }`}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.user}</p>
                      <p className="text-xs text-muted-foreground/80 mt-1">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
