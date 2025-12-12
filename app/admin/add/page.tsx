
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, FolderOpen, Wrench, MessageSquare, Star, Briefcase } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AddPage() {
  const router = useRouter()

  const addOptions = [
    {
      title: "Add Client",
      description: "Onboard a new client or project",
      icon: Briefcase,
      path: "/admin/add/client",
      color: "bg-cyan-600 hover:bg-cyan-700",
    },
    {
      title: "Add User",
      description: "Create a new user account",
      icon: Users,
      path: "/admin/add/user",
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      title: "Add Project",
      description: "Start a new project",
      icon: FolderOpen,
      path: "/admin/add/project",
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      title: "Add Service",
      description: "Create a new service offering",
      icon: Wrench,
      path: "/admin/add/service",
      color: "bg-purple-600 hover:bg-purple-700",
    },
    {
      title: "Add Testimonial",
      description: "Add a new client testimonial",
      icon: Star,
      path: "/admin/add/testimonial",
      color: "bg-yellow-600 hover:bg-yellow-700",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <CardHeader className="text-center mb-6">
            <CardTitle className="text-3xl font-bold">What would you like to add?</CardTitle>
            <CardDescription className="text-gray-400">Choose from the options below to add new content to your site.</CardDescription>
        </CardHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addOptions.map((option) => {
            const Icon = option.icon
            return (
              <Card
                key={option.path}
                className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-all duration-200 cursor-pointer hover:shadow-lg hover:shadow-cyan-500/10"
                onClick={() => router.push(option.path)}
              >
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${option.color}`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-lg">{option.title}</CardTitle>
                      <CardDescription className="text-gray-400">{option.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}

    