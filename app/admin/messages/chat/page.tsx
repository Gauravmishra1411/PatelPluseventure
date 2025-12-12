
"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Send, MessageSquare, Plus, Image as ImageIcon, Link as LinkIcon } from "lucide-react"
import { db } from "@/lib/firebase"
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "sonner"
import Image from 'next/image';


interface Message {
  id: string
  userId: string
  name: string
  text?: string
  imageUrl?: string
  linkUrl?: string
  type: 'text' | 'image' | 'link'
  timestamp: any
  isAdmin: boolean
}

export default function AdminChatPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const userId = searchParams.get("userId")
  const userName = searchParams.get("userName") || "User"
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!userId) {
      toast.error("No user specified for chat.")
      router.push("/admin/messages")
      return
    }

    const q = query(collection(db, "chats", userId, "messages"), orderBy("timestamp"))
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const newMessages: Message[] = []
        snapshot.forEach((doc) => {
          newMessages.push({ id: doc.id, ...doc.data() } as Message)
        })
        setMessages(newMessages)
      },
      (error) => {
        console.error("Error fetching messages: ", error)
        toast.error("Failed to load chat history.")
      }
    )

    return () => unsubscribe()
  }, [userId, router])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages]);

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!response.ok) throw new Error('Upload failed');
      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(`Failed to upload ${file.name}`);
      return null;
    }
  };

  const handleSendMessage = async (messageData: Omit<Message, 'id' | 'timestamp'>) => {
    if (!userId) return;
    try {
      await addDoc(collection(db, "chats", userId, "messages"), {
        ...messageData,
        timestamp: serverTimestamp(),
      });
      setNewMessage("")
    } catch (error) {
      console.error("Error sending message: ", error)
      toast.error("Failed to send message.")
    }
  }

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim() === "") return
    handleSendMessage({
      type: 'text',
      text: newMessage,
      userId: userId!,
      name: "Admin",
      isAdmin: true,
    });
  }

  const handleLinkSubmit = () => {
    const url = prompt("Please enter the URL");
    if (url) {
      handleSendMessage({
        type: 'link',
        linkUrl: url,
        userId: userId!,
        name: "Admin",
        isAdmin: true,
      });
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && userId) {
      setIsUploading(true);
      toast.info("Uploading image...");
      const imageUrl = await uploadImage(file);
      setIsUploading(false);
      if (imageUrl) {
        toast.success("Image uploaded!");
        handleSendMessage({
          type: 'image',
          imageUrl,
          userId: userId!,
          name: "Admin",
          isAdmin: true,
        });
      }
    }
  }

  if (!userId) {
    return null
  }

  return (
    <div className="h-full flex flex-col bg-background text-foreground p-4 md:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto h-full flex flex-col">
        <Card className="w-full flex-1 flex flex-col bg-card/50 border-primary/20 backdrop-blur-sm">
          <CardHeader className="flex-shrink-0 flex flex-row items-center justify-between border-b border-primary/20">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-primary" />
              <div>
                <CardTitle className="text-foreground">Chat with {userName}</CardTitle>
                <CardDescription className="text-muted-foreground">User ID: {userId}</CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => router.push("/admin/messages")}>
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex items-start gap-3 ${message.isAdmin ? "justify-start" : "justify-end"}`}
                >
                  {message.isAdmin && (
                    <Avatar>
                      <AvatarFallback className="bg-gradient-to-r from-primary to-accent text-primary-foreground">A</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-xs md:max-w-md p-3 rounded-2xl ${message.isAdmin
                        ? "bg-background/50 rounded-tl-none"
                        : "bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-tr-none"
                      }`}
                  >
                    {message.type === 'text' && <p className="text-sm whitespace-pre-wrap">{message.text}</p>}
                    {message.type === 'image' && message.imageUrl && (
                      <a href={message.imageUrl} target="_blank" rel="noopener noreferrer">
                        <Image src={message.imageUrl} alt="Uploaded image" width={200} height={200} className="rounded-md object-cover" />
                      </a>
                    )}
                    {message.type === 'link' && message.linkUrl && (
                      <a href={message.linkUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-sky-400 hover:underline flex items-center gap-2">
                        <LinkIcon className="w-4 h-4" /> {message.linkUrl}
                      </a>
                    )}
                  </div>
                  {!message.isAdmin && (
                    <Avatar>
                      <AvatarFallback className="bg-popover border-2 border-primary/30">{userName?.[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </CardContent>
          <div className="flex-shrink-0">
            <form onSubmit={handleTextSubmit} className="p-4 border-t border-primary/20 flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button type="button" variant="ghost" size="icon"><Plus /></Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 bg-popover border-border">
                  <div className="grid gap-2">
                    <Button variant="ghost" className="justify-start" onClick={() => fileInputRef.current?.click()}><ImageIcon className="w-4 h-4 mr-2" />Image</Button>
                    <Button variant="ghost" className="justify-start" onClick={handleLinkSubmit}><LinkIcon className="w-4 h-4 mr-2" />Link</Button>
                  </div>
                </PopoverContent>
              </Popover>
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-grow bg-background/50 border-primary/20"
                disabled={isUploading}
              />
              <Button type="submit" className="bg-gradient-to-r from-primary to-accent text-primary-foreground" size="icon" disabled={isUploading}>
                <Send className="w-5 h-5" />
              </Button>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
            </form>
          </div>
        </Card>
      </div>
    </div>
  )
}
