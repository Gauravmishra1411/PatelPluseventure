
"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Send, User, Mail, Phone, Lock, MessageSquare, Image as ImageIcon } from "lucide-react"
import { db, auth } from "@/lib/firebase"
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, setDoc, getDoc } from "firebase/firestore"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface Message {
  id: string
  userId: string
  name: string
  text: string
  timestamp: any
  isAdmin: boolean
}

export default function ChatPage() {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({ name: "", email: "", mobile: "", password: "" })
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)
      if (currentUser) {
        // Check if the user is a client
        const clientDocRef = doc(db, "clients", currentUser.uid);
        const clientDoc = await getDoc(clientDocRef);
        if (clientDoc.exists()) {
          // If they are a client, redirect to the client dashboard chat
          router.replace("/client/chat");
        }
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

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

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
      toast.error(`Failed to upload image`);
      return null;
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, formData.email, formData.password)
        toast.success("Logged in successfully!")
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
        let avatarUrl = "";
        if (avatarFile) {
          avatarUrl = await uploadImage(avatarFile) || "";
        }
        await setDoc(doc(db, "users", userCredential.user.uid), {
          name: formData.name,
          email: formData.email,
          mobile: formData.mobile,
          avatarUrl: avatarUrl,
          createdAt: serverTimestamp(),
        })
        toast.success("Registered successfully!")
      }
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim() === "" || !user) return

    const messageData = {
      userId: user.uid,
      name: user.displayName || user.email || "User",
      text: newMessage,
      timestamp: serverTimestamp(),
      isAdmin: false,
    }

    try {
      await addDoc(collection(db, "chats", user.uid, "messages"), messageData)
      setNewMessage("")
    } catch (error) {
      console.error("Error sending message: ", error)
      toast.error("Failed to send message.")
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-card border-primary/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-foreground text-center">{isLogin ? "Login to Chat" : "Register for Chat"}</CardTitle>
              <CardDescription className="text-muted-foreground text-center">
                {isLogin ? "Welcome back!" : "Create an account to start chatting."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAuth} className="space-y-4">
                {!isLogin && (
                  <>
                    <div className="flex justify-center">
                      <label htmlFor="avatar-upload" className="cursor-pointer">
                        <div className="w-24 h-24 rounded-full bg-secondary/10 flex items-center justify-center border-2 border-dashed border-muted hover:border-primary transition">
                          {avatarPreview ? (
                            <Image src={avatarPreview} alt="Avatar Preview" width={96} height={96} className="rounded-full object-cover" />
                          ) : (
                            <ImageIcon className="w-8 h-8 text-muted-foreground" />
                          )}
                        </div>
                      </label>
                      <Input id="avatar-upload" type="file" className="hidden" onChange={handleAvatarChange} accept="image/*" />
                    </div>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="pl-10 bg-background/50 border-primary/20"
                      />
                    </div>
                  </>
                )}
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="pl-10 bg-background/50 border-primary/20"
                  />
                </div>
                {!isLogin && (
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="tel"
                      placeholder="Mobile Number"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      className="pl-10 bg-background/50 border-primary/20"
                    />
                  </div>
                )}
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    className="pl-10 bg-background/50 border-primary/20"
                  />
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground">
                  {isLogin ? "Login" : "Register"}
                </Button>
              </form>
              <Button variant="link" onClick={() => setIsLogin(!isLogin)} className="w-full mt-4 text-muted-foreground">
                {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <main className="flex-grow flex flex-col items-center justify-center p-4 pb-24 md:pb-4">
        <div className="w-full max-w-2xl h-[calc(100vh-10rem)] flex flex-col">
          <Card className="w-full flex-1 flex flex-col bg-card border-primary/20 backdrop-blur-sm">
            <CardHeader className="flex-shrink-0 flex flex-row items-center justify-between border-b border-primary/20">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-6 h-6 text-primary" />
                <div>
                  <CardTitle className="text-foreground">Live Chat</CardTitle>
                  <CardDescription className="text-muted-foreground">Chat with our support team</CardDescription>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => auth.signOut()}>
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
                          ? "bg-secondary text-foreground rounded-tl-none"
                          : "bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-tr-none"
                        }`}
                    >
                      <p className="text-sm">{message.text}</p>
                    </div>
                    {!message.isAdmin && (
                      <Avatar>
                        <AvatarFallback className="bg-secondary border-2 border-primary/30 text-secondary-foreground">{user?.email?.[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </CardContent>
            <div className="flex-shrink-0">
              <form onSubmit={handleSendMessage} className="p-4 border-t border-primary/20 flex items-center gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-grow bg-background/50 border-primary/20"
                />
                <Button type="submit" className="bg-gradient-to-r from-primary to-accent text-primary-foreground" size="icon">
                  <Send className="w-5 h-5" />
                </Button>
              </form>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
