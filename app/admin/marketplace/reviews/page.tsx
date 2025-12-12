
"use client"

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, ThumbsUp, ThumbsDown, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { db } from "@/lib/firebase";
import { collectionGroup, getDocs, onSnapshot, query, updateDoc, doc } from "firebase/firestore";

interface Review {
  id: string; // doc id
  productId: string;
  productName: string;
  userId: string;
  userName: string;
  customerAvatar?: string;
  rating: number;
  comment: string;
  createdAt: any;
  status: 'pending' | 'approved' | 'rejected';
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const reviewsQuery = query(collectionGroup(db, 'reviews'));
    const unsubscribe = onSnapshot(reviewsQuery, (snapshot) => {
      const fetchedReviews = snapshot.docs.map(doc => {
        const path = doc.ref.path.split('/');
        const productId = path[path.length - 3];
        return {
          id: doc.id,
          productId,
          ...doc.data()
        } as Review;
      });
      setReviews(fetchedReviews);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleUpdateStatus = async (review: Review, newStatus: 'approved' | 'rejected') => {
    const reviewRef = doc(db, "marketplace_products", review.productId, "reviews", review.id);
    try {
      await updateDoc(reviewRef, { status: newStatus });
      toast.success(`Review has been ${newStatus}.`);
    } catch (error) {
      toast.error("Failed to update review status.");
      console.error(error);
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500/20 text-green-400';
      case 'rejected': return 'bg-red-500/20 text-red-400';
      default: return 'bg-yellow-500/20 text-yellow-400';
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Marketplace Reviews</CardTitle>
          <CardDescription>Moderate and manage product reviews.</CardDescription>
          <div className="flex justify-end">
            <Button variant="outline"><Filter className="w-4 h-4 mr-2" />Filter Reviews</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? <p>Loading reviews...</p> :
            reviews.map(review => (
              <Card key={review.id} className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={review.customerAvatar} />
                        <AvatarFallback>{review.userName?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{review.userName}</p>
                        <p className="text-sm text-muted-foreground">Product: <a href={`/marketplace/products/${review.productId}`} className="text-primary hover:underline">{review.productName}</a></p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: review.rating }).map((_, i) => <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />)}
                    </div>
                    <p className="text-muted-foreground italic">&quot;{review.comment}&quot;</p>
                  </div>
                  <div className="flex md:flex-col items-center justify-between md:justify-start gap-2">
                    <Badge variant="outline" className={getStatusVariant(review.status)}>{review.status}</Badge>
                    <div className="flex gap-2">
                      <Button size="icon" variant="outline" className="text-green-500 border-green-500/50 hover:bg-green-500/10 hover:text-green-400" onClick={() => handleUpdateStatus(review, 'approved')}><ThumbsUp className="w-4 h-4" /></Button>
                      <Button size="icon" variant="outline" className="text-red-500 border-red-500/50 hover:bg-red-500/10 hover:text-red-400" onClick={() => handleUpdateStatus(review, 'rejected')}><ThumbsDown className="w-4 h-4" /></Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
        </CardContent>
      </Card>
    </div>
  )
}
