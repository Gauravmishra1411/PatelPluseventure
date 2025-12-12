
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Filter, Plus, Wrench, Edit, Trash2, MoreHorizontal } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { db } from "@/lib/firebase"
import { collection, onSnapshot, query, orderBy, Timestamp, deleteDoc, doc } from "firebase/firestore"
import { toast } from "sonner"
import Image from "next/image"

interface Service {
  id: string
  title: string
  description: string
  icon?: string
  gradient?: string
  createdAt: Timestamp
}

export default function ServicesAdminPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const q = query(collection(db, "services"), orderBy("createdAt", "desc"))
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const servicesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service))
        setServices(servicesData)
        setLoading(false)
      },
      (error) => {
        console.error("Error fetching services:", error)
        toast.error("Failed to load services.")
        setLoading(false)
      }
    )
    return () => unsubscribe()
  }, [])

  const handleDelete = async (serviceId: string) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;

    try {
      await deleteDoc(doc(db, "services", serviceId));
      toast.success("Service deleted successfully.");
    } catch (error) {
      console.error("Error deleting service: ", error);
      toast.error("Failed to delete service.");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground p-4 md:p-6 lg:p-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6 lg:p-8">
      {/* Search and Filter */}
      <motion.div className="mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <Card className="bg-card/50 border-primary/20 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input placeholder="Search services..." className="pl-10 bg-background/50 border-primary/20 text-foreground placeholder-muted-foreground" />
              </div>
              <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 bg-transparent">
                <Filter className="w-4 h-4 mr-2" /> Filter
              </Button>
              <Button onClick={() => router.push('/admin/add/service')} className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90">
                <Plus className="w-4 h-4 mr-2" /> New Service
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Services Grid */}
      <motion.div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        {services.map((service, index) => (
          <motion.div key={service.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: index * 0.1 }}>
            <Card className="bg-card/50 border-primary/20 backdrop-blur-sm hover:bg-card/70 transition-all duration-300 flex flex-col h-full">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    {service.icon && (
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-background">
                        <Image src={service.icon} alt={service.title} fill className="object-contain p-1" />
                      </div>
                    )}
                    <CardTitle className="text-xl text-foreground">{service.title}</CardTitle>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-popover border-primary/20">
                      <DropdownMenuItem className="text-foreground hover:bg-primary/10" onClick={() => router.push(`/admin/services/edit/${service.id}`)}><Edit className="w-4 h-4 mr-2" />Edit Service</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(service.id)} className="text-destructive hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive"><Trash2 className="w-4 h-4 mr-2" />Delete Service</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 flex-grow flex flex-col">
                <p className="text-sm text-muted-foreground line-clamp-3 flex-grow">{service.description}</p>
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="text-xs text-muted-foreground">Created: {service.createdAt.toDate().toLocaleDateString()}</span>
                  <Button size="sm" variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 bg-transparent" onClick={() => router.push(`/admin/services/edit/${service.id}`)}>
                    <Edit className="w-3 h-3 mr-1" /> Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        {services.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            <Wrench className="mx-auto h-12 w-12 mb-4" />
            <p className="text-lg">No services found.</p>
            <p className="text-sm">Click &quot;New Service&quot; to add one.</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}
