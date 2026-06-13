
"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, Sparkles, Loader2, Image as ImageIcon, ArrowLeft } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";
import { toast } from "sonner";
import { generateHeroBanner } from "@/ai/flows/hero-banner-generator";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

interface Banner {
  id: string;
  title: string;
  description: string;
  link: string;
  imageUrl: string;
}

export default function HeroCustomizationPage() {
  const router = useRouter();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentBanner, setCurrentBanner] = useState<Partial<Banner>>({});
  const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);
  const [bannerImagePreview, setBannerImagePreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "marketplace_hero_banners"), (snapshot) => {
      const bannerData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Banner));
      setBanners(bannerData);
    });
    return () => unsub();
  }, []);
  
  const dataURLtoFile = (dataurl: string, filename: string): File => {
      const arr = dataurl.split(',');
      const mimeMatch = arr[0].match(/:(.*?);/);
      if (!mimeMatch) throw new Error('Invalid data URL');
      const mime = mimeMatch[1];
      const bstr = atob(arr[1]); 
      let n = bstr.length; 
      const u8arr = new Uint8Array(n);
      while(n--){
          u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, {type: mime});
  }

  const handleAiGenerate = async () => {
    if (!aiPrompt) {
      toast.error("Please provide a description for the AI.");
      return;
    }
    setIsGenerating(true);
    try {
      const result = await generateHeroBanner({ description: aiPrompt });
      setCurrentBanner(prev => ({
        ...prev,
        title: result.title,
        description: result.subtitle,
        imageUrl: result.imageUrl,
      }));
      setBannerImagePreview(result.imageUrl);
      setBannerImageFile(dataURLtoFile(result.imageUrl, 'ai-generated-banner.png'));
      toast.success("AI content generated successfully!");
    } catch (error) {
      console.error("AI Generation Error:", error);
      toast.error("Failed to generate content with AI.");
    } finally {
      setIsGenerating(false);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
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

  const resetForm = () => {
    setCurrentBanner({});
    setBannerImageFile(null);
    setBannerImagePreview(null);
    setAiPrompt("");
  };

  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentBanner.title || !currentBanner.description || (!bannerImageFile && !currentBanner.imageUrl)) {
        toast.error("Please fill all fields and provide an image.");
        return;
    }
    setIsSaving(true);
    
    let imageUrl = currentBanner.imageUrl || "";
    if (bannerImageFile) {
        const uploadedUrl = await uploadImage(bannerImageFile);
        if(!uploadedUrl) {
            setIsSaving(false);
            return;
        }
        imageUrl = uploadedUrl;
    }

    const bannerData = {
        title: currentBanner.title,
        description: currentBanner.description,
        link: currentBanner.link || '',
        imageUrl,
        updatedAt: serverTimestamp(),
    };

    try {
        if (currentBanner.id) {
            await updateDoc(doc(db, "marketplace_hero_banners", currentBanner.id), bannerData);
            toast.success("Banner updated!");
        } else {
            await addDoc(collection(db, "marketplace_hero_banners"), {
                ...bannerData,
                createdAt: serverTimestamp(),
            });
            toast.success("Banner added!");
        }
        resetForm();
        setIsDialogOpen(false);
    } catch (error) {
        console.error("Error saving banner:", error);
        toast.error("Failed to save banner.");
    } finally {
        setIsSaving(false);
    }
  };

  const handleEdit = (banner: Banner) => {
    setCurrentBanner(banner);
    setBannerImagePreview(banner.imageUrl);
    setIsDialogOpen(true);
  };
  
  const handleDelete = async (id: string) => {
    if(window.confirm("Are you sure?")) {
        await deleteDoc(doc(db, "marketplace_hero_banners", id));
        toast.success("Banner deleted.");
    }
  }

  const renderForm = () => (
    <form onSubmit={handleSaveBanner} className="space-y-4">
        <div className="space-y-2">
            <Label>AI Prompt</Label>
            <Textarea placeholder="e.g., A minimalist dark-themed UI kit for SaaS applications" value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} />
            <Button type="button" onClick={handleAiGenerate} disabled={isGenerating} className="w-full">
                {isGenerating ? <Loader2 className="animate-spin w-4 h-4 mr-2"/> : <Sparkles className="w-4 h-4 mr-2"/>}
                {isGenerating ? "Generating..." : "Generate with AI"}
            </Button>
        </div>

        <div className="space-y-2">
            <Label>Banner Image</Label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                    {bannerImagePreview ? <Image src={bannerImagePreview} alt="Banner Preview" width={200} height={100} className="mx-auto h-24 w-auto object-contain rounded-md"/> : <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />}
                    <div className="flex text-sm text-gray-400"><label htmlFor="image-upload" className="relative cursor-pointer bg-gray-700 rounded-md font-medium text-[#81f5fd] hover:text-[#81f5fd] px-2 py-1"><span>Upload image</span><Input id="image-upload" type="file" className="sr-only" onChange={(e) => { const file = e.target.files?.[0]; if(file) { setBannerImageFile(file); setBannerImagePreview(URL.createObjectURL(file));}}} accept="image/*"/></label></div>
                </div>
            </div>
        </div>

        <div className="space-y-2"><Label>Title</Label><Input value={currentBanner.title || ''} onChange={e => setCurrentBanner({...currentBanner, title: e.target.value})} className="bg-gray-700" /></div>
        <div className="space-y-2"><Label>Description</Label><Textarea value={currentBanner.description || ''} onChange={e => setCurrentBanner({...currentBanner, description: e.target.value})} className="bg-gray-700" /></div>
        <div className="space-y-2"><Label>Link URL</Label><Input value={currentBanner.link || ''} onChange={e => setCurrentBanner({...currentBanner, link: e.target.value})} className="bg-gray-700" /></div>

        <div className="flex gap-2 justify-end">
            <DialogTrigger asChild><Button type="button" variant="ghost" onClick={resetForm}>Cancel</Button></DialogTrigger>
            <Button type="submit" disabled={isSaving}>{isSaving ? "Saving..." : "Save Changes"}</Button>
        </div>
    </form>
  )

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4"/>
            </Button>
            <h1 className="text-3xl font-bold">Hero Section Banners</h1>
          </div>
           <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}><Plus className="w-4 h-4 mr-2"/>Add New Banner</Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 border-gray-700 text-white sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader><DialogTitle>{currentBanner.id ? 'Edit' : 'Add'} Banner</DialogTitle></DialogHeader>
                <div className="p-1">
                    {renderForm()}
                </div>
              </DialogContent>
            </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {banners.map(banner => (
              <Card key={banner.id} className="bg-gray-800 border-gray-700 group">
                <CardContent className="p-4 flex flex-col items-center gap-4 h-full">
                  <div className="relative w-full aspect-video rounded-md overflow-hidden">
                    <Image src={banner.imageUrl} alt={banner.title} fill className="object-cover"/>
                  </div>
                  <div className="flex-1 w-full text-center md:text-left">
                    <h4 className="font-semibold">{banner.title}</h4>
                    <p className="text-sm text-gray-400 truncate">{banner.description}</p>
                  </div>
                  <div className="flex gap-2 self-center md:self-end">
                    <Button size="icon" variant="ghost" onClick={() => handleEdit(banner)}><Edit className="w-4 h-4"/></Button>
                    <Button size="icon" variant="destructive" onClick={() => handleDelete(banner.id)}><Trash2 className="w-4 h-4"/></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
}
