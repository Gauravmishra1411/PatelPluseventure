"use client"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Search, Edit, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  title: string;
  salePrice: string;
  regularPrice: string;
  status: 'draft' | 'published' | 'archived';
  mainImageUrl: string;
  stock: number;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "marketplace_products"), (snapshot) => {
      const prods = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(prods);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleDelete = async (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteDoc(doc(db, "marketplace_products", productId));
        toast.success("Product deleted successfully.");
      } catch (error) {
        toast.error("Failed to delete product.");
        console.error(error);
      }
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-500/20 text-[#81f5fd]';
      case 'draft': return 'bg-yellow-500/20 text-yellow-400';
      case 'archived': return 'bg-gray-500/20 text-gray-400';
      default: return 'secondary';
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage your digital products.</p>
        </div>
        <Link href="/admin/marketplace/products/add">
          <Button><Plus className="w-4 h-4 mr-2" />Add Product</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input placeholder="Search products..." className="pl-10 w-full bg-background border border-input h-10 rounded-md px-3 text-foreground placeholder-muted-foreground" />
            </div>
            <Select>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Sort by: Newest" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Sort by: Newest</SelectItem>
                <SelectItem value="oldest">Sort by: Oldest</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? <p>Loading products...</p> :
            <div className="space-y-4">
              {products.map(product => (
                <Card key={product.id} className="flex flex-col sm:flex-row items-center p-4 gap-4 hover:bg-secondary/20">
                  <Image src={product.mainImageUrl || "https://placehold.co/100x100.png"} alt={product.title} width={64} height={64} className="rounded-md w-16 h-16 sm:w-16 sm:h-16 object-cover" />
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-semibold">{product.title}</h3>
                    <p className="text-sm text-primary font-bold">₹{product.salePrice || product.regularPrice}</p>
                    <p className="text-xs text-muted-foreground">{product.stock || 0} in stock</p>
                  </div>
                  <Badge variant={'outline'} className={`w-24 justify-center ${getStatusVariant(product.status)}`}>{product.status}</Badge>
                  <div className="flex gap-2">
                    <Link href={`/admin/marketplace/products/${product.id}`}>
                      <Button size="icon" variant="ghost"><Edit className="w-4 h-4" /></Button>
                    </Link>
                    <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-400" onClick={() => handleDelete(product.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </Card>
              ))}
            </div>
          }
        </CardContent>
      </Card>
    </div>
  )
}
