
"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail, Phone, Lock, ImageIcon, LogIn, UserPlus } from "lucide-react"
import { db, auth } from "@/lib/firebase"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function MarketplaceAuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ 
      name: "", 
      email: "", 
      mobile: "", 
      password: "",
      confirmPassword: ""
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({...prev, [e.target.name]: e.target.value}));
  }

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
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
        toast.success("Logged in successfully!");
        router.push("/marketplace/profile");
      } else {
        if(formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match.");
            setIsLoading(false);
            return;
        }
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        let avatarUrl = "";
        if (avatarFile) {
            avatarUrl = await uploadImage(avatarFile) || "";
        }
        await setDoc(doc(db, "users", userCredential.user.uid), {
          name: formData.name,
          email: formData.email,
          phone: formData.mobile,
          avatarUrl: avatarUrl,
          createdAt: serverTimestamp(),
        });
        toast.success("Registered successfully!");
        router.push("/marketplace/profile");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">{isLogin ? "Welcome Back" : "Create Account"}</CardTitle>
          <CardDescription className="text-center">
            {isLogin ? "Login to access your marketplace account." : "Join our marketplace today."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <>
                <div className="flex justify-center">
                    <label htmlFor="avatar-upload" className="cursor-pointer">
                    <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-border hover:border-primary transition">
                        {avatarPreview ? (
                            <Image src={avatarPreview} alt="Avatar Preview" width={96} height={96} className="rounded-full object-cover"/>
                        ) : (
                            <ImageIcon className="w-8 h-8 text-muted-foreground"/>
                        )}
                    </div>
                    </label>
                    <Input id="avatar-upload" type="file" className="hidden" onChange={handleAvatarChange} accept="image/*"/>
                </div>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input name="name" placeholder="Full Name" value={formData.name} onChange={handleInputChange} required className="pl-10"/>
                </div>
                 <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input name="mobile" placeholder="Mobile Number" value={formData.mobile} onChange={handleInputChange} className="pl-10"/>
                </div>
              </>
            )}
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleInputChange} required className="pl-10"/>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleInputChange} required className="pl-10"/>
            </div>
            {!isLogin && (
                <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input name="confirmPassword" type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleInputChange} required className="pl-10"/>
                </div>
            )}
            <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Processing..." : (isLogin ? "Login" : "Register")}
            </Button>
          </form>
          <Button variant="link" onClick={() => setIsLogin(!isLogin)} className="w-full mt-4">
            {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
