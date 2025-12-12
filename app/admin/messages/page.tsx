
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Filter, Reply, Archive, Trash2, Star, Clock, Mail, Phone, MessageSquare } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { db } from "@/lib/firebase"
import { collection, onSnapshot, orderBy, query, Timestamp } from "firebase/firestore"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export interface ContactMessage {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  subject: string
  message: string
  priority: "low" | "medium" | "high"
  status: "unread" | "read" | "replied"
  starred: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
  userId?: string // Added to link to a user account
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const q = query(collection(db, "contactMessages"), orderBy("createdAt", "desc"))
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const messagesData: ContactMessage[] = []
        querySnapshot.forEach((doc) => {
          messagesData.push({ id: doc.id, ...doc.data() } as ContactMessage)
        })
        setMessages(messagesData)
        setLoading(false)
      },
      (error) => {
        console.error("Error fetching messages:", error)
        toast.error("Failed to load messages.")
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  const handleLiveChat = (message: ContactMessage) => {
    // We need a userId to initiate a chat. This could come from the message if the user was logged in
    // when they sent it, or we could try to find a user by email. For now, let's assume
    // the contact message might have a userId if they were logged in.
    const userId = message.userId || message.email; // Fallback to email if no userId
    if (!userId) {
      toast.error("Cannot initiate chat. User ID is not available.");
      return;
    }
    router.push(`/admin/messages/chat?userId=${userId}&userName=${encodeURIComponent(message.name)}`);
  };

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
                  placeholder="Search messages by name, email, or subject..."
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
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Messages List */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {messages.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <MessageSquare className="mx-auto h-12 w-12 mb-4" />
            <p className="text-lg">No messages yet.</p>
            <p className="text-sm">New contact messages will appear here.</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card
                className={`bg-card/50 border-primary/20 backdrop-blur-sm hover:bg-card/70 transition-all duration-300 ${message.status === "unread" ? "border-l-4 border-l-primary" : ""
                  }`}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                    {/* Message Info */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold text-sm">
                            {message.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{message.name}</h3>
                            <p className="text-sm text-muted-foreground">{message.subject}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {message.starred && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                          <Badge
                            variant="outline"
                            className={
                              message.priority === "high"
                                ? "border-red-500 text-red-400"
                                : message.priority === "medium"
                                  ? "border-yellow-500 text-yellow-400"
                                  : "border-gray-500 text-gray-400"
                            }
                          >
                            {message.priority}
                          </Badge>
                          <Badge
                            variant={message.status === "unread" ? "default" : "secondary"}
                            className={
                              message.status === "unread"
                                ? "bg-primary/20 text-primary border-primary/30"
                                : message.status === "replied"
                                  ? "bg-green-500/20 text-green-400 border-green-500/30"
                                  : "bg-secondary/20 text-muted-foreground border-secondary/30"
                            }
                          >
                            {message.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            <span>{message.email}</span>
                          </div>
                          {message.phone && <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            <span>{message.phone}</span>
                          </div>}
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{message.createdAt?.toDate().toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-background/50 rounded-lg p-4">
                        <p className="text-muted-foreground leading-relaxed">{message.message}</p>
                      </div>

                      {/* Quick Reply & Actions */}
                      <div className="space-y-3">
                        <Textarea
                          placeholder="Type your reply..."
                          className="bg-background/50 border-primary/20 text-foreground placeholder-muted-foreground resize-none"
                          rows={3}
                        />
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90"
                          >
                            <Reply className="w-3 h-3 mr-1" />
                            Reply
                          </Button>
                          <Button
                            size="sm"
                            className="bg-blue-500/80 text-white hover:bg-blue-500"
                            onClick={() => handleLiveChat(message)}
                          >
                            <MessageSquare className="w-3 h-3 mr-1" />
                            Live Chat
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-primary/30 text-primary hover:bg-primary/10 bg-transparent"
                          >
                            <Star className="w-3 h-3 mr-1" />
                            Star
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-secondary/30 text-muted-foreground hover:bg-secondary/10 bg-transparent"
                          >
                            <Archive className="w-3 h-3 mr-1" />
                            Archive
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-destructive/30 text-destructive hover:bg-destructive/10 bg-transparent"
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  )
}
