
"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Send, MessageSquare, Plus, Image as ImageIcon, Link as LinkIcon } from "lucide-react"
import { db, auth } from "@/lib/firebase"
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, getDoc, doc } from "firebase/firestore"
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Image from 'next/image'

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


export default function ClientChatPage() {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [userName, setUserName] = useState("User")
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        const clientDocRef = doc(db, "clients", currentUser.uid);
        const clientDoc = await getDoc(clientDocRef);
        if (clientDoc.exists()) {
          setUserName(clientDoc.data().fullName || "User");
        } else {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setUserName(userDoc.data().name || "User");
          }
        }
      } else {
        router.push('/chat');
      }
    })
    return () => unsubscribe()
  }, [router])

  useEffect(() => {
    if (user) {
      const q = query(collection(db, "chats", user.uid, "messages"), orderBy("timestamp"))
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
          toast.error("Could not load chat history.")
        }
      )

      return () => unsubscribe()
    }
  }, [user])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

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
    if (!user) return;
    try {
      await addDoc(collection(db, "chats", user.uid, "messages"), {
        ...messageData,
        timestamp: serverTimestamp(),
      });

      if (!messageData.isAdmin) {
        await addDoc(collection(db, "notifications"), {
          type: 'new_message',
          message: `New message from ${userName}`,
          link: `/admin/messages/chat?userId=${user.uid}&userName=${encodeURIComponent(userName)}`,
          isRead: false,
          createdAt: serverTimestamp(),
          senderInfo: {
            name: userName,
            email: user.email || 'N/A',
          }
        });
      }
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
      userId: user!.uid,
      name: userName,
      isAdmin: false,
    });
  }

  const handleLinkSubmit = () => {
    const url = prompt("Please enter the URL");
    if (url) {
      handleSendMessage({
        type: 'link',
        linkUrl: url,
        userId: user!.uid,
        name: userName,
        isAdmin: false,
      });
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      setIsUploading(true);
      toast.info("Uploading image...");
      const imageUrl = await uploadImage(file);
      setIsUploading(false);
      if (imageUrl) {
        toast.success("Image uploaded!");
        handleSendMessage({
          type: 'image',
          imageUrl,
          userId: user.uid,
          name: userName,
          isAdmin: false,
        });
      }
    }
  }

  if (!user) {
    return null;
  }

  return (
    <div className="w-full h-full flex flex-col pb-24 md:pb-0">
      <Card className="w-full max-w-4xl mx-auto flex-1 flex flex-col bg-card/50 border-primary/20 backdrop-blur-sm">
        <CardHeader className="flex-shrink-0 flex flex-row items-center justify-between border-b border-primary/20">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-primary" />
            <div>
              <CardTitle className="text-card-foreground">Live Chat</CardTitle>
              <CardDescription className="text-muted-foreground">Chat with our support team</CardDescription>
            </div>
          </div>
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
                      ? "bg-muted rounded-tl-none text-foreground"
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
                    <a href={message.linkUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-sky-600 dark:text-sky-300 hover:underline flex items-center gap-2">
                      <LinkIcon className="w-4 h-4" /> {message.linkUrl}
                    </a>
                  )}
                </div>
                {!message.isAdmin && (
                  <Avatar>
                    <AvatarFallback className="bg-secondary border-2 border-primary/30 text-secondary-foreground">{userName?.[0].toUpperCase()}</AvatarFallback>
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
                  <Button variant="ghost" className="justify-start text-popover-foreground" onClick={() => fileInputRef.current?.click()}><ImageIcon className="w-4 h-4 mr-2" />Image</Button>
                  <Button variant="ghost" className="justify-start text-popover-foreground" onClick={handleLinkSubmit}><LinkIcon className="w-4 h-4 mr-2" />Link</Button>
                </div>
              </PopoverContent>
            </Popover>
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow bg-background/50 border-primary/20 text-foreground"
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
  )
}
