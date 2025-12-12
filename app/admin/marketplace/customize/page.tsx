
"use client"

import { useState, useEffect } from "react"
import { Reorder } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GripVertical, Plus, Edit, Trash2, LayoutDashboard } from "lucide-react"
import { useRouter } from "next/navigation"
import { db } from "@/lib/firebase"
import { collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc, writeBatch, serverTimestamp, orderBy, query } from "firebase/firestore"
import { toast } from "sonner"

interface Section {
  id: string;
  title: string;
  order: number;
}

export default function AdminCustomizePage() {
  const router = useRouter();
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "marketplace_sections"), orderBy("order"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedSections = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Section));
      setSections(fetchedSections);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAddSection = async () => {
    try {
      await addDoc(collection(db, "marketplace_sections"), {
        title: `New Section ${sections.length + 1}`,
        order: sections.length,
        layout: 'slider',
        loop: true,
        autoplay: false,
        products: [],
        createdAt: serverTimestamp(),
      });
      toast.success("New section added!");
    } catch (error) {
      toast.error("Failed to add section.");
    }
  }
  
  const handleDeleteSection = async (id: string) => {
    if(window.confirm("Are you sure you want to delete this section?")) {
        await deleteDoc(doc(db, "marketplace_sections", id));
        toast.success("Section deleted.");
    }
  }
  
  const handleReorder = async (newOrder: Section[]) => {
    setSections(newOrder);
    const batch = writeBatch(db);
    newOrder.forEach((section, index) => {
      const docRef = doc(db, "marketplace_sections", section.id);
      batch.update(docRef, { order: index });
    });
    try {
      await batch.commit();
      toast.success("Section order saved!");
    } catch (error) {
      toast.error("Failed to save order.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Homepage Customization</h1>
          <Button onClick={handleAddSection} className="bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Section
          </Button>
        </div>

        <div className="space-y-8">
          {/* Core Sections */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle>Core Sections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-lg bg-gray-700/50 border border-gray-600 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <LayoutDashboard className="w-5 h-5 text-gray-400" />
                  <div>
                    <h4 className="font-semibold">Hero Section</h4>
                    <p className="text-sm text-gray-400">Manage banners and cards.</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => router.push('/admin/marketplace/customize/hero')}>
                  <Edit className="w-5 h-5" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Content Sections */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle>Content Sections</CardTitle>
              <CardDescription>Add and manage your homepage content sections.</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? <p>Loading sections...</p> :
              <Reorder.Group axis="y" values={sections} onReorder={handleReorder} className="space-y-3">
                {sections.map((section) => (
                  <Reorder.Item key={section.id} value={section} className="p-4 rounded-lg bg-gray-700/50 border border-gray-600 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <GripVertical className="cursor-grab text-gray-400" />
                       <span className="font-medium">{section.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <Button variant="ghost" size="icon" onClick={() => router.push(`/admin/marketplace/customize/sections/${section.id}`)}>
                        <Edit className="w-5 h-5" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDeleteSection(section.id)}>
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
              }
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
