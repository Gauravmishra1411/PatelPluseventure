"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Search,
  Filter,
  MoreHorizontal,
  UserPlus,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Eye,
  Edit,
  Trash2,
  X,
  MessageSquare,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { db } from "@/lib/firebase"
import { collection, onSnapshot, query, orderBy, Timestamp, deleteDoc, doc } from "firebase/firestore"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface User {
  id: string
  name: string
  email: string
  phone?: string
  location?: string
  status: "Active" | "Pending" | "Inactive"
  createdAt: Timestamp
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const q = query(collection(db, "users"), orderBy("createdAt", "desc"))
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const usersData: User[] = []
        querySnapshot.forEach((doc) => {
          const data = doc.data()
          usersData.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt || Timestamp.now(),
            status: data.status || "Pending",
          } as User)
        })
        setUsers(usersData)
        setLoading(false)
      },
      (error) => {
        console.error("Error fetching users:", error)
        toast.error("Failed to load users.")
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      try {
        await deleteDoc(doc(db, "users", userId));
        toast.success("User deleted successfully.");
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("Failed to delete user.");
      }
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-500/20 text-[#81f5fd] border-[#81f5fd]/30"
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "inactive":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
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
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="bg-card/50 border-primary/20 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search users by name, email, or location..."
                  className="pl-10 bg-background/50 border-primary/20 text-foreground placeholder-muted-foreground"
                />
              </div>
              <Button
                variant="outline"
                className="border-primary/30 text-primary hover:bg-primary/10 bg-transparent"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button onClick={() => router.push("/admin/add/user")} className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90">
                <UserPlus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Users Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {users.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="bg-card/50 border-primary/20 backdrop-blur-sm hover:bg-card/70 transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-primary-foreground font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{user.name}</CardTitle>
                      <CardDescription className="text-sm">ID: #{user.id.substring(0, 6)}</CardDescription>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-popover border-primary/20">
                      <DropdownMenuItem className="text-foreground hover:bg-primary/10" onClick={() => setSelectedUser(user)}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-foreground hover:bg-primary/10" onClick={() => router.push(`/admin/users/edit/${user.id}`)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit User
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteUser(user.id)} className="text-destructive hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant={"outline"} className={getStatusVariant(user.status)}>
                    {user.status}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                  {user.location && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{user.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {user.createdAt?.toDate().toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-primary/10">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 border-primary/30 text-primary hover:bg-primary/10 bg-transparent"
                    onClick={() => router.push(`/admin/messages/chat?userId=${user.id}&userName=${encodeURIComponent(user.name)}`)}
                  >
                    <Mail className="w-3 h-3 mr-1" />
                    Message
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90"
                    onClick={() => setSelectedUser(user)}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* User Details Modal */}
      {selectedUser && (
        <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
          <DialogContent className="max-w-md w-[90vw] bg-popover/80 backdrop-blur-xl border-primary/30 text-foreground p-0">
            <ScrollArea className="max-h-[80vh]">
              <div className="p-6">
                <DialogHeader className="mb-6 text-left">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarFallback className="text-2xl font-bold bg-gradient-to-r from-primary to-accent text-primary-foreground">
                        {selectedUser.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <DialogTitle className="text-2xl font-bold text-foreground">{selectedUser.name}</DialogTitle>
                      <DialogDescription className="text-muted-foreground">ID: {selectedUser.id}</DialogDescription>
                    </div>
                  </div>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge variant={"outline"} className={getStatusVariant(selectedUser.status)}>
                      {selectedUser.status}
                    </Badge>
                  </div>

                  <h4 className="text-sm font-semibold text-primary pt-2">Contact Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{selectedUser.email}</span>
                    </div>
                    {selectedUser.phone && (
                      <div className="flex items-center gap-3 text-sm">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{selectedUser.phone}</span>
                      </div>
                    )}
                  </div>

                  <h4 className="text-sm font-semibold text-primary pt-2">Location</h4>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{selectedUser.location || "Not provided"}</span>
                  </div>

                  <h4 className="text-sm font-semibold text-primary pt-2">Account Details</h4>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Joined on {selectedUser.createdAt?.toDate().toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-8 flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={() => {
                      setSelectedUser(null)
                      router.push(`/admin/messages/chat?userId=${selectedUser.id}&userName=${encodeURIComponent(selectedUser.name)}`)
                    }}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Chat
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => setSelectedUser(null)}>
                    Close
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
