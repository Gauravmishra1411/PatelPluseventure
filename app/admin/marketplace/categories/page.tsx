"use client"

import { useState, useEffect } from "react"
import { generateCategoryImage } from "@/ai/flows/category-icon-generator";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LayoutGrid, Plus, UploadCloud, Edit, Trash2, Sparkles, Loader2 } from "lucide-react"
import { db } from "@/lib/firebase"
import { collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore"
import { toast } from "sonner"
import Image from "next/image"
import { Textarea } from "@/components/ui/textarea";

interface Category {
  id: string;
  name: string;
  iconUrl: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryIcon, setNewCategoryIcon] = useState<File | null>(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "marketplace_categories"), (snapshot) => {
        const cats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
        setCategories(cats);
        setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewCategoryIcon(file);
      setIconPreview(URL.createObjectURL(file));
    }
  };
  
  const dataURLtoFile = (dataurl: string, filename: string): File => {
      const arr = dataurl.split(',');
      const mimeMatch = arr[0].match(/:(.*?);/);
      if (!mimeMatch) throw new Error('Invalid data URL');
      
      const mime = mimeMatch[1];
      const bstr = atob(arr[1]); 
      const n = bstr.length; 
      const u8arr = new Uint8Array(n);
          
      for(let i = 0; i < n; i++){
          u8arr[i] = bstr.charCodeAt(i);
      }
      return new File([u8arr], filename, {type: mime});
  }

  const handleAiGenerate = async () => {
    if (!newCategoryName) {
        toast.error("Please enter a category name to generate an icon.");
        return;
    }
    setIsGenerating(true);
    try {
        const result = await generateCategoryImage({ 
          categoryName: newCategoryName,
          prompt: customPrompt || undefined
        });
        if (result.imageDataUri) {
            setIconPreview(result.imageDataUri);
            setNewCategoryIcon(dataURLtoFile(result.imageDataUri, `${newCategoryName.replace(/\s+/g, '-')}-icon.png`));
            toast.success("Icon generated successfully!");
        } else {
            toast.error("AI failed to generate an image.");
        }
    } catch (error) {
        console.error("AI Icon Generation Error: ", error);
        toast.error("Failed to generate AI icon.");
    } finally {
        setIsGenerating(false);
    }
  }

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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName || (!newCategoryIcon && !editingCategory)) {
        toast.error("Please provide a category name and an icon.");
        return;
    }
    setIsSubmitting(true);

    try {
        let iconUrl = editingCategory?.iconUrl || "";
        if (newCategoryIcon) {
            const uploadedUrl = await uploadImage(newCategoryIcon);
            if (!uploadedUrl) {
                setIsSubmitting(false);
                return;
            }
            iconUrl = uploadedUrl;
        }

        const categoryData = {
            name: newCategoryName,
            iconUrl,
            updatedAt: serverTimestamp()
        };

        if (editingCategory) {
            const docRef = doc(db, "marketplace_categories", editingCategory.id);
            await updateDoc(docRef, categoryData);
            toast.success("Category updated successfully!");
        } else {
            await addDoc(collection(db, "marketplace_categories"), {
                ...categoryData,
                createdAt: serverTimestamp(),
            });
            toast.success("Category added successfully!");
        }
        
        // Reset form
        setNewCategoryName("");
        setNewCategoryIcon(null);
        setIconPreview(null);
        setEditingCategory(null);
        setCustomPrompt("");

    } catch (error) {
        toast.error(`Failed to ${editingCategory ? 'update' : 'add'} category.`);
        console.error(error);
    } finally {
        setIsSubmitting(false);
    }
  };
  
  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setNewCategoryName(category.name);
    setIconPreview(category.iconUrl);
    setNewCategoryIcon(null);
    setCustomPrompt("");
  };
  
  const handleCancelEdit = () => {
     setEditingCategory(null);
     setNewCategoryName("");
     setIconPreview(null);
     setNewCategoryIcon(null);
     setCustomPrompt("");
  }

  const handleDelete = async (categoryId: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
        try {
            await deleteDoc(doc(db, "marketplace_categories", categoryId));
            toast.success("Category deleted.");
        } catch (error) {
            toast.error("Failed to delete category.");
        }
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><LayoutGrid/> Marketplace Categories</CardTitle>
          <CardDescription>Manage your product categories.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
                <div>
                     <h3 className="font-semibold mb-4 text-lg">{editingCategory ? "Edit Category" : "Add New Category"}</h3>
                     <form onSubmit={handleFormSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="cat-name">Category Name</Label>
                            <Input id="cat-name" placeholder="e.g. Templates" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cat-prompt">AI Icon Prompt (Optional)</Label>
                             <Textarea id="cat-prompt" placeholder="A minimal, soft 3D clay-style icon..." value={customPrompt} onChange={e => setCustomPrompt(e.target.value)} rows={3}/>
                        </div>

                        <Button type="button" onClick={handleAiGenerate} disabled={isGenerating} className="w-full">
                            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin"/> : <Sparkles className="w-4 h-4 mr-2"/>}
                            {isGenerating ? "Generating..." : "Generate Icon with AI"}
                        </Button>

                        <div className="space-y-2">
                            <Label>Or Upload Icon Manually</Label>
                             <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    {iconPreview ? <Image src={iconPreview} alt="Icon Preview" width={64} height={64} className="mx-auto h-16 w-16 object-contain rounded-md"/> : <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />}
                                    <div className="flex text-sm text-gray-400"><label htmlFor="icon-upload" className="relative cursor-pointer bg-gray-700 rounded-md font-medium text-[#81f5fd] hover:text-[#81f5fd] px-2 py-1"><span>Upload icon</span><Input id="icon-upload" type="file" className="sr-only" onChange={handleIconChange} accept="image/*"/></label></div>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : (editingCategory ? 'Save Changes' : 'Add Category')}</Button>
                            {editingCategory && <Button variant="ghost" type="button" onClick={handleCancelEdit}>Cancel</Button>}
                        </div>
                     </form>
                </div>
                 <div>
                    <h3 className="font-semibold mb-4 text-lg">Existing Categories</h3>
                    {loading ? <p>Loading...</p> : 
                    <div className="space-y-2">
                        {categories.map(cat => (
                            <div key={cat.id} className="flex items-center justify-between p-2 bg-gray-700 rounded-md">
                                <div className="flex items-center gap-3">
                                    <Image src={cat.iconUrl} alt={cat.name} width={32} height={32} className="rounded-md"/>
                                    <span>{cat.name}</span>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="icon" variant="ghost" onClick={() => handleEdit(cat)}><Edit className="w-4 h-4"/></Button>
                                    <Button size="icon" variant="destructive" onClick={() => handleDelete(cat.id)}><Trash2 className="w-4 h-4"/></Button>
                                </div>
                            </div>
                        ))}
                    </div>
                    }
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  )
}
