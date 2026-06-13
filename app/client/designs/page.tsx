
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { db, auth } from "@/lib/firebase"
import { doc, onSnapshot, updateDoc, arrayUnion, collection, addDoc, serverTimestamp } from "firebase/firestore"
import { onAuthStateChanged, User } from "firebase/auth"
import { UploadCloud, Link as LinkIcon, Image as ImageIcon, Trash2, Palette } from "lucide-react"
import Image from "next/image"

interface DesignAsset {
    type: 'link' | 'image';
    url: string;
    description: string;
    uploadedAt: string;
}

export default function ClientDesignsPage() {
    const [user, setUser] = useState<User | null>(null);
    const [designAssets, setDesignAssets] = useState<DesignAsset[]>([]);
    const [newLink, setNewLink] = useState('');
    const [newFile, setNewFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                setLoading(false);
            }
        });
        return () => unsubscribeAuth();
    }, []);

    useEffect(() => {
        if (user) {
            const docRef = doc(db, "clients", user.uid);
            const unsubscribeSnapshot = onSnapshot(docRef, (doc) => {
                if (doc.exists()) {
                    setDesignAssets(doc.data().designAssets || []);
                }
                setLoading(false);
            });
            return () => unsubscribeSnapshot();
        }
    }, [user]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setNewFile(file);
            setFilePreview(URL.createObjectURL(file));
        }
    }
    
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


    const handleSubmitAsset = async () => {
        if (!user || (!newLink && !newFile)) {
            toast.error("Please provide a link or upload a file.");
            return;
        }
        setUploading(true);

        let asset: DesignAsset | null = null;

        if (newFile) {
            const imageUrl = await uploadImage(newFile);
            if (imageUrl) {
                asset = { type: 'image', url: imageUrl, description, uploadedAt: new Date().toISOString() };
            }
        } else if (newLink) {
            asset = { type: 'link', url: newLink, description, uploadedAt: new Date().toISOString() };
        }

        if (asset) {
            try {
                const clientRef = doc(db, "clients", user.uid);
                await updateDoc(clientRef, {
                    designAssets: arrayUnion(asset)
                });
                
                // Create notification for admin
                await addDoc(collection(db, "notifications"), {
                    type: 'new_asset',
                    message: `New design asset uploaded by ${user.displayName || user.email}`,
                    link: `/admin/clients/${user.uid}`,
                    isRead: false,
                    createdAt: serverTimestamp(),
                    senderInfo: {
                        name: user.displayName || 'N/A',
                        email: user.email || 'N/A',
                    }
                });


                toast.success("Design asset added successfully!");
                setNewFile(null);
                setNewLink('');
                setDescription('');
                setFilePreview(null);
            } catch (error) {
                toast.error("Failed to add asset.");
                console.error(error);
            }
        }
        
        setUploading(false);
    };
    
    // Function to remove an asset, you might want to add proper security for this
    const handleRemoveAsset = async (assetToRemove: DesignAsset) => {
        if (!user || !window.confirm("Are you sure you want to delete this asset?")) return;
        
        const updatedAssets = designAssets.filter(asset => asset.url !== assetToRemove.url);
        try {
            const clientRef = doc(db, "clients", user.uid);
            await updateDoc(clientRef, { designAssets: updatedAssets });
            toast.success("Asset removed.");
        } catch (error) {
            toast.error("Failed to remove asset.");
            console.error(error);
        }
    }


    return (
        <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Palette/> Manage Your Designs</CardTitle>
                    <CardDescription>Upload design files or add links to inspiration (Figma, Dribbble, etc.)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <Label>Upload Image</Label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                {filePreview ? <Image src={filePreview} alt="Preview" width={100} height={80} className="mx-auto h-24 w-auto object-contain rounded-md"/> : <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />}
                                <div className="flex text-sm text-gray-400"><label htmlFor="file-upload" className="relative cursor-pointer bg-gray-700 rounded-md font-medium text-[#81f5fd] hover:text-[#81f5fd] px-2 py-1"><span>Upload a file</span><Input id="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" disabled={!!newLink}/></label></div>
                                </div>
                            </div>
                         </div>
                          <div className="space-y-2">
                            <Label>Or Add Link</Label>
                            <Input placeholder="https://figma.com/..." value={newLink} onChange={e => setNewLink(e.target.value)} className="bg-gray-700" disabled={!!newFile}/>
                         </div>
                    </div>
                     <div className="space-y-2">
                        <Label>Description (optional)</Label>
                        <Input placeholder="e.g. Main logo design" value={description} onChange={e => setDescription(e.target.value)} className="bg-gray-700"/>
                    </div>
                    <Button onClick={handleSubmitAsset} disabled={uploading}>
                        {uploading ? 'Uploading...' : 'Add Asset'}
                    </Button>
                </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                    <CardTitle>Your Submitted Assets</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? <p>Loading assets...</p> : 
                    designAssets.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {designAssets.map((asset, index) => (
                                <Card key={index} className="bg-gray-700 p-4 relative group">
                                    <Button size="icon" variant="destructive" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10" onClick={() => handleRemoveAsset(asset)}><Trash2 className="w-4 h-4"/></Button>
                                    {asset.type === 'image' ? (
                                        <Image src={asset.url} alt={asset.description} width={200} height={150} className="w-full h-40 object-contain rounded-md"/>
                                    ) : (
                                        <div className="w-full h-40 flex items-center justify-center bg-gray-600 rounded-md">
                                            <LinkIcon className="w-12 h-12 text-gray-400"/>
                                        </div>
                                    )}
                                    <p className="text-sm mt-2 truncate">{asset.description || (asset.type === 'link' ? asset.url : 'Image')}</p>
                                    {asset.type === 'link' && <a href={asset.url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#81f5fd] hover:underline">View Link</a>}
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400">You haven&apos;t submitted any design assets yet.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
