
"use client"
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Youtube, Link as LinkIcon, Plus, Trash2, Wand2, Loader2, Sparkles, Image as ImageIcon, X, Eye, Download, Upload, Move } from "lucide-react"
import { toast } from "sonner";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { generateProductContent } from "@/ai/flows/product-generator";
import type { ProductContentInput, ProductContentOutput } from "@/types/product";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

type FormData = {
  title: string;
  shortDesc: string;
  longDesc: string;
  mainImage: File | null;
  mainImageUrl?: string;
  gallery: File[];
  galleryUrls?: string[];
  youtubeLink: string;
  category: string;
  regularPrice: string;
  salePrice: string;
  livePreviewLink: string;
  features: string;
  techSpecs: string;
  whatsIncluded: string;
  howToUse: string;
  license: string;
  sku: string;
  tags: string;
  status: 'draft' | 'published' | 'archived';
  relatedProducts: string[];
  moreFromCreator: string[];
  exploreCategories: string[];
  coupon?: string;
}

const initialFormData: FormData = {
  title: "",
  shortDesc: "",
  longDesc: "",
  mainImage: null,
  gallery: [],
  youtubeLink: "",
  category: "",
  regularPrice: "",
  salePrice: "",
  livePreviewLink: "",
  features: "",
  techSpecs: "",
  whatsIncluded: "",
  howToUse: "",
  license: "",
  sku: "",
  tags: "",
  status: 'draft',
  relatedProducts: [],
  moreFromCreator: [],
  exploreCategories: [],
  coupon: ""
}

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  title: string;
}

interface Discount {
  id: string;
  code: string;
}

// Enhanced Gallery Image Preview Component
function GalleryImagePreview({
  src,
  index,
  onRemove,
  onPreview,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown
}: {
  src: string;
  index: number;
  onRemove: () => void;
  onPreview: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
}) {
  return (
    <div className="relative group bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300">
      <div className="aspect-square relative">
        <Image
          src={src}
          alt={`Gallery ${index + 1}`}
          fill
          className="object-cover"
        />

        {/* Overlay with actions */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={onPreview}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              <Eye className="w-3 h-3" />
            </Button>
            {onMoveUp && canMoveUp && (
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={onMoveUp}
                className="bg-blue-500/80 hover:bg-blue-500 text-white border-blue-400/30"
              >
                <Move className="w-3 h-3" />
              </Button>
            )}
            {onMoveDown && canMoveDown && (
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={onMoveDown}
                className="bg-blue-500/80 hover:bg-blue-500 text-white border-blue-400/30"
              >
                <Move className="w-3 h-3 rotate-180" />
              </Button>
            )}
          </div>
        </div>

        {/* Remove button */}
        <button
          type="button"
          onClick={onRemove}
          className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Index badge */}
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="bg-black/60 text-white border-white/20 text-xs">
            {index + 1}
          </Badge>
        </div>
      </div>
    </div>
  );
}

// Image Preview Modal
function ImagePreviewModal({
  isOpen,
  onClose,
  imageSrc,
  imageTitle
}: {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  imageTitle: string;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white">{imageTitle}</DialogTitle>
        </DialogHeader>
        <div className="relative w-full h-[70vh] bg-slate-800 rounded-lg overflow-hidden">
          <Image
            src={imageSrc}
            alt={imageTitle}
            fill
            className="object-contain"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="border-slate-600 text-slate-300 hover:bg-slate-800">
            Close
          </Button>
          <Button
            onClick={() => {
              const link = document.createElement('a');
              link.href = imageSrc;
              link.download = `${imageTitle.replace(/\s+/g, '-')}.png`;
              link.click();
            }}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AiGeneratorDialog({ open, onOpenChange, onGenerate, isGenerating }: {
  open: boolean,
  onOpenChange: (open: boolean) => void,
  onGenerate: (title: string, desc: string) => void,
  isGenerating: boolean
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleGenerateClick = () => {
    if (!title || !description) {
      toast.error("Please enter both a title and description.");
      return;
    }
    onGenerate(title, description);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            Generate with AI
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Provide a title and description, and let AI generate complete product content plus 5 professional images.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-300">Product Title</Label>
            <Input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g., Astra - Portfolio Template"
              className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-300">Short Description</Label>
            <Textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="e.g., A modern and clean Framer template for creatives."
              className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={3}
            />
          </div>
          <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 p-4 rounded-lg border border-purple-700/50">
            <div className="flex items-center gap-2 text-purple-300 mb-2">
              <Sparkles className="w-4 h-4" />
              <span className="font-medium text-sm">What you&apos;ll get:</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-purple-200">
              <div>• 1 Main showcase image</div>
              <div>• 4 Gallery images</div>
              <div>• Product description</div>
              <div>• Features & specs</div>
              <div>• Usage guide</div>
              <div>• SEO tags</div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isGenerating} className="border-slate-600 text-slate-300 hover:bg-slate-800">
            Cancel
          </Button>
          <Button onClick={handleGenerateClick} disabled={isGenerating || !title || !description} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function AdminAddProductPage() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [generationProgress, setGenerationProgress] = useState<string>("");
  const [generationStep, setGenerationStep] = useState<number>(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();

  const [previewModal, setPreviewModal] = useState<{ isOpen: boolean, src: string, title: string }>({
    isOpen: false,
    src: '',
    title: ''
  });

  useEffect(() => {
    const categoriesUnsub = onSnapshot(collection(db, "marketplace_categories"), (snapshot) => {
      setCategories(snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name })));
    });

    const discountsUnsub = onSnapshot(collection(db, "marketplace_discounts"), (snapshot) => {
      setDiscounts(snapshot.docs.map(doc => ({ id: doc.id, code: doc.data().code })));
    });

    const productsUnsub = onSnapshot(collection(db, "marketplace_products"), (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, title: doc.data().title })));
    });


    return () => {
      categoriesUnsub();
      discountsUnsub();
      productsUnsub();
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  const handleMultiSelectChange = (field: keyof FormData, id: string, checked: boolean) => {
    setFormData(prev => {
      const currentValues = prev[field] as string[];
      if (checked) {
        return { ...prev, [field]: [...currentValues, id] };
      } else {
        return { ...prev, [field]: currentValues.filter(val => val !== id) };
      }
    });
  }

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, mainImage: file }));
      setMainImagePreview(URL.createObjectURL(file));
    }
  }

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData(prev => ({ ...prev, gallery: [...prev.gallery, ...files] }));
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setGalleryPreviews(prev => [...prev, ...newPreviews]);
    }
  }

  const removeGalleryImage = (index: number) => {
    URL.revokeObjectURL(galleryPreviews[index]);
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index)
    }));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  }

  const moveGalleryImage = (fromIndex: number, toIndex: number) => {
    setFormData(prev => {
      const newGallery = [...prev.gallery];
      const [movedItem] = newGallery.splice(fromIndex, 1);
      newGallery.splice(toIndex, 0, movedItem);
      return { ...prev, gallery: newGallery };
    });

    setGalleryPreviews(prev => {
      const newPreviews = [...prev];
      const [movedItem] = newPreviews.splice(fromIndex, 1);
      newPreviews.splice(toIndex, 0, movedItem);
      return newPreviews;
    });
  }

  const previewImage = (src: string, title: string) => {
    setPreviewModal({ isOpen: true, src, title });
  }

  const dataURLtoFile = (dataurl: string, filename: string) => {
    try {
      let arr = dataurl.split(',');
      // @ts-ignore
      let mime = arr[0].match(/:(.*?);/)[1];
      let bstr = atob(arr[1]);
      let n = bstr.length;
      let u8arr = new Uint8Array(n);

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    } catch (error) {
      console.error("Error converting dataURL to File:", error);
      throw new Error(`Failed to convert image data: ${error}`);
    }
  }

  const handleAiGenerate = async (title: string, desc: string) => {
    setIsGeneratorOpen(false);
    setIsGenerating(true);
    setGenerationStep(1);
    setGenerationProgress("Generating content and image prompts with Gemini...");

    try {
      const result = await generateProductContent({ title, description: desc });

      if (!result) throw new Error("AI generation returned no result.");

      setGenerationStep(2);
      setGenerationProgress("Generating main and gallery images...");

      setFormData(prev => ({
        ...prev,
        title,
        shortDesc: desc,
        longDesc: result.longDesc,
        features: result.features.join(', '),
        techSpecs: result.techSpecs.join(', '),
        whatsIncluded: result.whatsIncluded.join(', '),
        howToUse: result.howToUse,
        license: result.license,
        tags: result.tags.join(', '),
      }));

      if (mainImagePreview) URL.revokeObjectURL(mainImagePreview);
      galleryPreviews.forEach(URL.revokeObjectURL);

      if (result.imageUrl) {
        const mainImageFile = dataURLtoFile(result.imageUrl, `${title.replace(/\s+/g, '-')}-main.png`);
        setFormData(prev => ({ ...prev, mainImage: mainImageFile }));
        setMainImagePreview(result.imageUrl);
      }

      if (result.galleryImages && result.galleryImages.length > 0) {
        const galleryFiles = result.galleryImages.map((dataUrl, i) => dataURLtoFile(dataUrl, `${title.replace(/\s+/g, '-')}-gallery-${i}.png`));
        setFormData(prev => ({ ...prev, gallery: galleryFiles }));
        setGalleryPreviews(result.galleryImages);
      }

      toast.success("AI Generation Completed!");
    } catch (error) {
      console.error("AI Generation failed:", error);
      toast.error("AI Generation failed. Check console for details.");
    } finally {
      setIsGenerating(false);
      setGenerationProgress("");
      setGenerationStep(0);
    }
  }

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Upload failed');
      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(`Failed to upload ${file.name}`);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent, status: 'draft' | 'published' = 'published') => {
    e.preventDefault();
    setIsPublishing(true);
    toast.info(`Saving product as ${status}...`);

    try {
      let mainImageUrl = "";
      if (formData.mainImage) {
        mainImageUrl = await uploadImage(formData.mainImage) || "";
      }

      let galleryUrls: string[] = [];
      if (formData.gallery.length > 0) {
        galleryUrls = await Promise.all(formData.gallery.map(uploadImage)).then(urls => urls.filter((url): url is string => url !== null));
      }

      const { mainImage, gallery, ...productData } = formData;

      await addDoc(collection(db, "marketplace_products"), {
        ...productData,
        mainImageUrl,
        galleryUrls,
        status,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        // Split comma separated strings into arrays
        features: productData.features.split(',').map(s => s.trim()),
        techSpecs: productData.techSpecs.split(',').map(s => s.trim()),
        whatsIncluded: productData.whatsIncluded.split(',').map(s => s.trim()),
        tags: productData.tags.split(',').map(s => s.trim()),
      });

      toast.success(`Product successfully ${status === 'published' ? 'published' : 'saved as draft'}!`);
      router.push('/admin/marketplace/products');

    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Failed to save product.");
    } finally {
      setIsPublishing(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Add New Product
              </h1>
              <p className="text-slate-400 mt-1">Create and launch your next digital masterpiece</p>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                onClick={() => setIsGeneratorOpen(true)}
                disabled={isGenerating}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {generationProgress || "Generating..."}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate with AI
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          {isGenerating && (
            <div className="mt-4 bg-slate-800/80 backdrop-blur rounded-lg p-4 shadow-sm border border-slate-700">
              <div className="flex items-center gap-3 mb-2">
                <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
                <span className="font-medium text-slate-200">AI Generation in Progress</span>
              </div>
              <Progress value={(generationStep / 2) * 100} className="h-2 mb-2" />
              <p className="text-sm text-slate-400">{generationProgress}</p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Product Details */}
              <Card className="bg-slate-800/80 backdrop-blur border-slate-700/50">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl text-slate-200">Product Details</CardTitle>
                  <CardDescription className="text-slate-400">Basic information about your product</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-300">Title</Label>
                    <Input
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter product title..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-300">Short Description</Label>
                    <Textarea
                      name="shortDesc"
                      value={formData.shortDesc}
                      onChange={handleInputChange}
                      rows={2}
                      className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Brief description of your product..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-300">Long Description</Label>
                    <Textarea
                      name="longDesc"
                      value={formData.longDesc}
                      onChange={handleInputChange}
                      rows={6}
                      className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Detailed product description..."
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Media */}
              <Card className="bg-slate-800/80 backdrop-blur border-slate-700/50">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl text-slate-200">Media Assets</CardTitle>
                  <CardDescription className="text-slate-400">Upload or generate product images and videos</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Main Image */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-slate-300">Main Product Image</Label>
                    <div className="border-2 border-dashed border-slate-600 rounded-xl p-6 hover:border-purple-500/50 transition-colors bg-slate-900/30">
                      <div className="text-center space-y-3">
                        {mainImagePreview ? (
                          <div className="relative">
                            <div className="relative w-fit mx-auto group">
                              <Image
                                src={mainImagePreview}
                                alt="Main preview"
                                width={300}
                                height={300}
                                className="h-48 w-auto object-contain rounded-lg shadow-lg"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                <Button
                                  type="button"
                                  size="sm"
                                  onClick={() => previewImage(mainImagePreview, "Main Product Image")}
                                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 mr-2"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="mt-3 border-slate-600 text-slate-300 hover:bg-slate-700"
                              onClick={() => {
                                if (mainImagePreview) URL.revokeObjectURL(mainImagePreview);
                                setMainImagePreview(null);
                                setFormData(prev => ({ ...prev, mainImage: null }));
                              }}
                            >
                              <X className="w-4 h-4 mr-1" />
                              Remove
                            </Button>
                          </div>
                        ) : (
                          <>
                            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-full flex items-center justify-center border border-purple-700/50">
                              <ImageIcon className="w-8 h-8 text-purple-400" />
                            </div>
                            <div>
                              <label
                                htmlFor="main-image"
                                className="cursor-pointer inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
                              >
                                <Upload className="w-4 h-4 mr-2" />
                                <span>Upload main image</span>
                                <Input
                                  id="main-image"
                                  name="mainImage"
                                  type="file"
                                  className="sr-only"
                                  onChange={handleMainImageChange}
                                  accept="image/*"
                                />
                              </label>
                              <p className="text-xs text-slate-400 mt-2">PNG, JPG up to 10MB</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Gallery */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                      Image Gallery
                      {galleryPreviews.length > 0 && (
                        <Badge variant="secondary" className="bg-purple-900/50 text-purple-300 border-purple-700/50">
                          {galleryPreviews.length} images
                        </Badge>
                      )}
                    </Label>
                    <div className="border-2 border-dashed border-slate-600 rounded-xl p-4 hover:border-purple-500/50 transition-colors bg-slate-900/30">
                      {galleryPreviews.length > 0 ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {galleryPreviews.map((src, idx) => (
                              <GalleryImagePreview
                                key={idx}
                                src={src}
                                index={idx}
                                onRemove={() => removeGalleryImage(idx)}
                                onPreview={() => previewImage(src, `Gallery Image ${idx + 1}`)}
                                onMoveUp={idx > 0 ? () => moveGalleryImage(idx, idx - 1) : undefined}
                                onMoveDown={idx < galleryPreviews.length - 1 ? () => moveGalleryImage(idx, idx + 1) : undefined}
                                canMoveUp={idx > 0}
                                canMoveDown={idx < galleryPreviews.length - 1}
                              />
                            ))}
                          </div>
                          <div className="text-center pt-4 border-t border-slate-700">
                            <label
                              htmlFor="gallery"
                              className="cursor-pointer inline-flex items-center px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add more images
                              <Input
                                id="gallery"
                                name="gallery"
                                type="file"
                                multiple
                                className="sr-only"
                                onChange={handleGalleryChange}
                                accept="image/*"
                              />
                            </label>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center mb-4 border border-slate-600">
                            <ImageIcon className="w-8 h-8 text-slate-400" />
                          </div>
                          <label
                            htmlFor="gallery"
                            className="cursor-pointer inline-flex items-center px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            <span>Upload gallery images</span>
                            <Input
                              id="gallery"
                              name="gallery"
                              type="file"
                              multiple
                              className="sr-only"
                              onChange={handleGalleryChange}
                              accept="image/*"
                            />
                          </label>
                          <p className="text-xs text-slate-400 mt-3">Multiple images supported • PNG, JPG up to 10MB each</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* YouTube Link */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                      <Youtube className="w-4 h-4 text-red-400" />
                      YouTube Video Link
                    </Label>
                    <Input
                      name="youtubeLink"
                      value={formData.youtubeLink}
                      onChange={handleInputChange}
                      placeholder="https://youtube.com/watch?v=..."
                      className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Features & Specs */}
              <Card className="bg-slate-800/80 backdrop-blur border-slate-700/50">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl text-slate-200">Features & Specifications</CardTitle>
                  <CardDescription className="text-slate-400">Highlight key features and technical details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-300">Features (comma-separated)</Label>
                    <Textarea
                      name="features"
                      value={formData.features}
                      onChange={handleInputChange}
                      className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Feature 1, Feature 2, Feature 3..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-300">Technical Specifications (comma-separated)</Label>
                    <Textarea
                      name="techSpecs"
                      value={formData.techSpecs}
                      onChange={handleInputChange}
                      className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="File Format: PNG, Compatibility: Figma, Resolution: 4K..."
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Content & Usage */}
              <Card className="bg-slate-800/80 backdrop-blur border-slate-700/50">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl text-slate-200">Content & Usage</CardTitle>
                  <CardDescription className="text-slate-400">What&apos;s included and how to use the product</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-300">What&apos;s Included (comma-separated)</Label>
                    <Textarea
                      name="whatsIncluded"
                      value={formData.whatsIncluded}
                      onChange={handleInputChange}
                      className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Main files, Documentation, Source files..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-300">How To Use / Installation</Label>
                    <Textarea
                      name="howToUse"
                      value={formData.howToUse}
                      onChange={handleInputChange}
                      className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Step-by-step usage instructions..."
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-300">License</Label>
                    <Textarea
                      name="license"
                      value={formData.license}
                      onChange={handleInputChange}
                      className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="License terms and usage rights..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Recommendation Sections */}
              <Card className="bg-slate-800/80 backdrop-blur border-slate-700/50">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl text-slate-200">Related Content</CardTitle>
                  <CardDescription className="text-slate-400">Select content to recommend to users.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-sm font-medium text-slate-300 mb-2 block">You Might Also Like</Label>
                    <ScrollArea className="h-40 w-full rounded-md border border-slate-600 p-4">
                      {products.map(p => (
                        <div key={p.id} className="flex items-center space-x-2 mb-2">
                          <Checkbox id={`related-${p.id}`} onCheckedChange={c => handleMultiSelectChange('relatedProducts', p.id, c as boolean)} />
                          <Label htmlFor={`related-${p.id}`} className="font-normal text-slate-300">{p.title}</Label>
                        </div>
                      ))}
                    </ScrollArea>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-300 mb-2 block">More from Patel Pulse Ventures Studios</Label>
                    <ScrollArea className="h-40 w-full rounded-md border border-slate-600 p-4">
                      {products.map(p => (
                        <div key={p.id} className="flex items-center space-x-2 mb-2">
                          <Checkbox id={`creator-${p.id}`} onCheckedChange={c => handleMultiSelectChange('moreFromCreator', p.id, c as boolean)} />
                          <Label htmlFor={`creator-${p.id}`} className="font-normal text-slate-300">{p.title}</Label>
                        </div>
                      ))}
                    </ScrollArea>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-300 mb-2 block">More to Explore (Categories)</Label>
                    <ScrollArea className="h-40 w-full rounded-md border border-slate-600 p-4">
                      {categories.map(c => (
                        <div key={c.id} className="flex items-center space-x-2 mb-2">
                          <Checkbox id={`explore-${c.id}`} onCheckedChange={ch => handleMultiSelectChange('exploreCategories', c.id, ch as boolean)} />
                          <Label htmlFor={`explore-${c.id}`} className="font-normal text-slate-300">{c.name}</Label>
                        </div>
                      ))}
                    </ScrollArea>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Pricing */}
              <Card className="bg-slate-800/80 backdrop-blur border-slate-700/50">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg text-slate-200">Pricing</CardTitle>
                  <CardDescription className="text-slate-400">Set your product pricing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-300">Regular Price (₹)</Label>
                    <Input
                      name="regularPrice"
                      value={formData.regularPrice}
                      onChange={handleInputChange}
                      type="number"
                      className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="999"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-300">Discounted Price (₹)</Label>
                    <Input
                      name="salePrice"
                      value={formData.salePrice}
                      onChange={handleInputChange}
                      type="number"
                      className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="799"
                    />
                  </div>
                  {formData.regularPrice && formData.salePrice && (
                    <div className="bg-emerald-900/30 p-3 rounded-lg border border-emerald-700/50">
                      <p className="text-sm text-emerald-300 font-medium">
                        {Math.round(((Number(formData.regularPrice) - Number(formData.salePrice)) / Number(formData.regularPrice)) * 100)}% discount
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Organization */}
              <Card className="bg-slate-800/80 backdrop-blur border-slate-700/50">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg text-slate-200">Organization</CardTitle>
                  <CardDescription className="text-slate-400">Categorize and organize your product</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-300">Category</Label>
                    <Select name="category" value={formData.category} onValueChange={v => handleSelectChange('category', v)} required>
                      <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        {categories.map(cat => (
                          <SelectItem key={cat.id} value={cat.id} className="text-slate-200 focus:bg-slate-700">{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-300">Coupon (Optional)</Label>
                    <Select name="coupon" value={formData.coupon} onValueChange={v => handleSelectChange('coupon', v)}>
                      <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                        <SelectValue placeholder="Select a coupon" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        {discounts.map(d => (
                          <SelectItem key={d.id} value={d.id} className="text-slate-200 focus:bg-slate-700">{d.code}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-300">Tags (comma-separated)</Label>
                    <Input
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="design, template, modern, clean..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-300">SKU</Label>
                    <Input
                      name="sku"
                      value={formData.sku}
                      onChange={handleInputChange}
                      className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="PROD-001"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-300">Status</Label>
                    <Select name="status" value={formData.status} onValueChange={v => handleSelectChange('status', v)}>
                      <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem value="draft" className="text-slate-200 focus:bg-slate-700">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            Draft
                          </div>
                        </SelectItem>
                        <SelectItem value="published" className="text-slate-200 focus:bg-slate-700">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            Published
                          </div>
                        </SelectItem>
                        <SelectItem value="archived" className="text-slate-200 focus:bg-slate-700">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                            Archived
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Links */}
              <Card className="bg-slate-800/80 backdrop-blur border-slate-700/50">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg text-slate-200">Links</CardTitle>
                  <CardDescription className="text-slate-400">External links and previews</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                      <LinkIcon className="w-4 h-4 text-blue-400" />
                      Live Preview Link
                    </Label>
                    <Input
                      name="livePreviewLink"
                      value={formData.livePreviewLink}
                      onChange={handleInputChange}
                      placeholder="https://preview.example.com"
                      className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* AI Generation Stats */}
              {(mainImagePreview || galleryPreviews.length > 0) && (
                <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur border-purple-700/50">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg text-purple-200 flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      AI Generated Content
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-white/10 p-3 rounded-lg text-center border border-white/20">
                        <div className="font-semibold text-purple-200">
                          {mainImagePreview ? 1 : 0}
                        </div>
                        <div className="text-purple-300 text-xs">Main Image</div>
                      </div>
                      <div className="bg-white/10 p-3 rounded-lg text-center border border-white/20">
                        <div className="font-semibold text-purple-200">
                          {galleryPreviews.length}
                        </div>
                        <div className="text-purple-300 text-xs">Gallery Images</div>
                      </div>
                    </div>
                    <div className="text-xs text-purple-300 text-center bg-white/5 p-2 rounded border border-white/10">
                      Content generated with Gemini AI
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-slate-700">
            <Button
              variant="outline"
              type="button"
              onClick={(e) => handleSubmit(e, 'draft')}
              disabled={isPublishing}
              className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              Save as Draft
            </Button>
            <Button
              type="submit"
              disabled={isPublishing}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isPublishing ? 'Publishing...' : 'Publish Product'}
            </Button>
          </div>
        </form>

        {/* AI Generator Dialog */}
        <AiGeneratorDialog
          open={isGeneratorOpen}
          onOpenChange={setIsGeneratorOpen}
          onGenerate={handleAiGenerate}
          isGenerating={isGenerating}
        />

        {/* Image Preview Modal */}
        <ImagePreviewModal
          isOpen={previewModal.isOpen}
          onClose={() => setPreviewModal(prev => ({ ...prev, isOpen: false }))}
          imageSrc={previewModal.src}
          imageTitle={previewModal.title}
        />
      </div>
    </div>
  )
}
