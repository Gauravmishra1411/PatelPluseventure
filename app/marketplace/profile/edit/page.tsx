
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { db } from "@/lib/firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { UploadCloud } from "lucide-react";
import Image from "next/image";

export default function EditProfilePage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [userData, setUserData] = useState<{ name: string; email: string; avatarUrl?: string }>({ name: '', email: '' });
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!user && !authLoading) {
            router.push('/chat');
            return;
        }
        if (user) {
            const userRef = doc(db, "users", user.uid);
            const unsubscribe = onSnapshot(userRef, (docSnap) => {
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setUserData({
                        name: data.name || '',
                        email: data.email || '',
                        avatarUrl: data.avatarUrl || ''
                    });
                    setAvatarPreview(data.avatarUrl);
                }
                setLoading(false);
            });
            return () => unsubscribe();
        }
    }, [user, authLoading, router]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          toast.error(`Failed to upload image`);
          return null;
        }
    };

    const handleSaveChanges = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setIsSaving(true);
        
        let newAvatarUrl = userData.avatarUrl;
        if (avatarFile) {
            const uploadedUrl = await uploadImage(avatarFile);
            if (uploadedUrl) {
                newAvatarUrl = uploadedUrl;
            }
        }

        try {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
                name: userData.name,
                avatarUrl: newAvatarUrl
            });
            toast.success("Profile updated successfully!");
        } catch (error) {
            toast.error("Failed to update profile.");
        } finally {
            setIsSaving(false);
        }
    };

    if (loading || authLoading) {
        return <Skeleton className="h-96 w-full"/>
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Edit Profile</CardTitle>
                    <CardDescription>Update your personal information.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSaveChanges} className="space-y-6">
                        <div className="flex flex-col items-center space-y-4">
                            <Avatar className="w-24 h-24">
                                <AvatarImage src={avatarPreview || userData.avatarUrl} />
                                <AvatarFallback className="text-3xl">{userData.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="w-full mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md">
                               <div className="space-y-1 text-center">
                                   <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                                   <div className="flex text-sm text-gray-400">
                                     <label htmlFor="file-upload" className="relative cursor-pointer bg-muted rounded-md font-medium text-primary hover:text-primary/90 px-2 py-1">
                                        <span>Upload a file</span>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange}/>
                                     </label>
                                   </div>
                               </div>
                           </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" value={userData.name} onChange={(e) => setUserData({...userData, name: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" value={userData.email} disabled />
                        </div>
                        <Button type="submit" disabled={isSaving} className="w-full">
                            {isSaving ? "Saving..." : "Save Changes"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
