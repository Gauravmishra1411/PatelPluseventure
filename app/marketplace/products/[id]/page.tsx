
"use client";

import { useState, useEffect } from 'react';

import { Star, ShoppingCart, Heart, Eye, CheckCircle, FileText, MessageSquare, Layers, Shield, Wrench, Info, UserCircle, ChevronLeft, RefreshCw, HelpCircle, Code, ShoppingBag, ArrowRight, X, Youtube as YoutubeIcon, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from "next/image";
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductCard from '@/components/marketplace/product-card';
import MarketplaceHeader from '@/components/marketplace-header';
import ShopHeader from '@/components/marketplace/shop-header';
import MobileBottomNav from '@/components/mobile-bottom-nav';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { db, auth } from '@/lib/firebase';
import { doc, getDoc, collection, getDocs, query, where, documentId, updateDoc, arrayUnion, arrayRemove, onSnapshot, addDoc, serverTimestamp, setDoc, orderBy, deleteDoc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { onAuthStateChanged, User, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose, DialogHeader } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface ProductData {
    id: string;
    title: string;
    shortDesc: string;
    longDesc: string;
    mainImageUrl: string;
    galleryUrls: string[];
    youtubeLink: string;
    category: string;
    regularPrice: string;
    salePrice: string;
    livePreviewLink: string;
    features: string[];
    techSpecs: string[];
    whatsIncluded: string[];
    howToUse: string;
    license: string;
    sku: string;
    tags: string[];
    status: 'draft' | 'published' | 'archived';
    relatedProducts: string[];
    moreFromCreator: string[];
    exploreCategories: string[];
}

interface ProductCardInfo {
    id: string;
    name: string;
    price: string;
    image: string;
    dataAiHint: string;
}

interface CategoryInfo {
    id: string;
    name: string;
}

interface Review {
    id: string;
    userId: string;
    userName: string;
    rating: number;
    comment: string;
    createdAt: any;
    status: 'pending' | 'approved' | 'rejected';
}

interface CartItem {
    id: string;
    productId: string;
    title: string;
    price: string;
    imageUrl: string;
    quantity: number;
}


function AuthModal({ open, onOpenChange, onAuthSuccess }: { open: boolean, onOpenChange: (open: boolean) => void, onAuthSuccess: (user: User) => void }) {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', mobile: '', password: '', confirmPassword: '' });

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            let userCredential;
            if (isLogin) {
                userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
                toast.success("Logged in successfully!");
            } else {
                if (formData.password !== formData.confirmPassword) {
                    toast.error("Passwords do not match.");
                    return;
                }
                userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
                await setDoc(doc(db, "users", userCredential.user.uid), {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.mobile,
                    createdAt: serverTimestamp(),
                });
                toast.success("Registered successfully!");
            }
            onAuthSuccess(userCredential.user);
            onOpenChange(false);
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{isLogin ? 'Login to Continue' : 'Create an Account'}</DialogTitle>
                    <DialogDescription>
                        {isLogin ? 'Please login to add items to your cart.' : 'Join to start shopping.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAuth} className="space-y-4">
                    {!isLogin && (
                        <>
                            <div className="space-y-2"><Label>Full Name</Label><Input name="name" value={formData.name} onChange={handleInputChange} required /></div>
                            <div className="space-y-2"><Label>Mobile Number</Label><Input name="mobile" value={formData.mobile} onChange={handleInputChange} /></div>
                        </>
                    )}
                    <div className="space-y-2"><Label>Email</Label><Input type="email" name="email" value={formData.email} onChange={handleInputChange} required /></div>
                    <div className="space-y-2"><Label>Password</Label><Input type="password" name="password" value={formData.password} onChange={handleInputChange} required /></div>
                    {!isLogin && <div className="space-y-2"><Label>Confirm Password</Label><Input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} required /></div>}
                    <Button type="submit" className="w-full">{isLogin ? 'Login' : 'Register'}</Button>
                </form>
                <Button variant="link" onClick={() => setIsLogin(!isLogin)} className="w-full mt-2">
                    {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
                </Button>
            </DialogContent>
        </Dialog>
    )
}


export default function ProductDetailPage() {
    const params = useParams();
    const { id } = params;
    const [user, setUser] = useState<User | null>(null);
    const [product, setProduct] = useState<ProductData | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<{ id: number, src: string, dataAiHint: string } | null>(null);
    const [isLiked, setIsLiked] = useState(false);

    const [relatedProductsData, setRelatedProductsData] = useState<ProductCardInfo[]>([]);
    const [moreFromCreatorData, setMoreFromCreatorData] = useState<ProductCardInfo[]>([]);
    const [exploreCategoriesData, setExploreCategoriesData] = useState<CategoryInfo[]>([]);

    const [reviews, setReviews] = useState<Review[]>([]);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);

    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    const cartSubtotal = cartItems.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0);


    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                const cartQuery = query(collection(db, "users", currentUser.uid, "cart"));
                const unsubCart = onSnapshot(cartQuery, (snapshot) => {
                    const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CartItem));
                    setCartItems(items);
                });
                return () => unsubCart();
            }
        });
        return () => unsubscribeAuth();
    }, []);

    useEffect(() => {
        if (user && product) {
            const userRef = doc(db, "users", user.uid);
            const unsub = onSnapshot(userRef, (docSnap) => {
                if (docSnap.exists()) {
                    const wishlist = docSnap.data().wishlist || [];
                    setIsLiked(wishlist.includes(product.id));
                }
            });
            return () => unsub();
        }
    }, [user, product]);

    useEffect(() => {
        if (!id) return;
        const fetchProduct = async () => {
            setLoading(true);
            const docRef = doc(db, "marketplace_products", id as string);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data() as Omit<ProductData, 'id'>;
                const fetchedProduct = { id: docSnap.id, ...data };
                setProduct(fetchedProduct);
                if (data.mainImageUrl) {
                    setSelectedImage({ id: 0, src: data.mainImageUrl, dataAiHint: data.title });
                }

                // Fetch related content in parallel
                if (fetchedProduct.relatedProducts?.length) {
                    const relatedQuery = query(collection(db, 'marketplace_products'), where(documentId(), 'in', fetchedProduct.relatedProducts));
                    const relatedSnapshot = await getDocs(relatedQuery);
                    setRelatedProductsData(relatedSnapshot.docs.map(doc => ({
                        id: doc.id,
                        name: doc.data().title,
                        price: doc.data().salePrice || doc.data().regularPrice,
                        image: doc.data().mainImageUrl,
                        dataAiHint: doc.data().title
                    })));
                }
                if (fetchedProduct.moreFromCreator?.length) {
                    const creatorQuery = query(collection(db, 'marketplace_products'), where(documentId(), 'in', fetchedProduct.moreFromCreator));
                    const creatorSnapshot = await getDocs(creatorQuery);
                    setMoreFromCreatorData(creatorSnapshot.docs.map(doc => ({
                        id: doc.id,
                        name: doc.data().title,
                        price: doc.data().salePrice || doc.data().regularPrice,
                        image: doc.data().mainImageUrl,
                        dataAiHint: doc.data().title
                    })));
                }
                if (fetchedProduct.exploreCategories?.length) {
                    const categoryQuery = query(collection(db, 'marketplace_categories'), where(documentId(), 'in', fetchedProduct.exploreCategories));
                    const categorySnapshot = await getDocs(categoryQuery);
                    setExploreCategoriesData(categorySnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name })));
                }

            } else {
                console.error("No such product!");
            }
            setLoading(false);
        };
        fetchProduct();

        const reviewsQuery = query(collection(db, "marketplace_products", id as string, "reviews"), orderBy("createdAt", "desc"));
        const unsubscribeReviews = onSnapshot(reviewsQuery, (snapshot) => {
            const fetchedReviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
            setReviews(fetchedReviews);
            setReviewsLoading(false);
        });

        return () => unsubscribeReviews();

    }, [id]);

    const handleWishlistToggle = async () => {
        if (!user || !product) {
            setIsAuthModalOpen(true);
            return;
        }
        const userRef = doc(db, "users", user.uid);
        try {
            await setDoc(userRef, {}, { merge: true }); // Ensure user doc exists
            if (isLiked) {
                await updateDoc(userRef, { wishlist: arrayRemove(product.id) });
                toast.success("Removed from wishlist.");
            } else {
                await updateDoc(userRef, { wishlist: arrayUnion(product.id) });
                toast.success("Added to wishlist!");
            }
        } catch (error) {
            toast.error("Failed to update wishlist.");
        }
    };

    const handleAddToCart = async (authedUser?: User) => {
        const targetUser = user || authedUser;
        if (!targetUser || !product) {
            setIsAuthModalOpen(true);
            return;
        }

        const cartRef = collection(db, "users", targetUser.uid, "cart");
        await addDoc(cartRef, {
            productId: product.id,
            title: product.title,
            price: product.salePrice || product.regularPrice,
            imageUrl: product.mainImageUrl,
            quantity: 1,
            addedAt: serverTimestamp(),
        });
        toast.success(`${product.title} added to cart!`);
        setIsCartOpen(true);
    }

    const handleRemoveFromCart = async (cartItemId: string) => {
        if (!user) return;
        const cartItemRef = doc(db, "users", user.uid, "cart", cartItemId);
        await deleteDoc(cartItemRef);
        toast.success("Item removed from cart.");
    };


    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !product) {
            setIsAuthModalOpen(true);
            return;
        }
        if (newReview.comment.trim().length < 10) {
            toast.error("Review must be at least 10 characters long.");
            return;
        }

        setIsSubmittingReview(true);
        try {
            const reviewData = {
                userId: user.uid,
                userName: user.displayName || user.email || "Anonymous",
                rating: newReview.rating,
                comment: newReview.comment,
                createdAt: serverTimestamp(),
                status: 'pending' as const,
                productName: product.title,
            };
            const reviewDocRef = await addDoc(collection(db, "marketplace_products", product.id, "reviews"), reviewData);

            await addDoc(collection(db, "notifications"), {
                type: 'new_review',
                message: `New review for ${product.title} from ${reviewData.userName}`,
                link: `/admin/marketplace/reviews`,
                isRead: false,
                createdAt: serverTimestamp(),
                senderInfo: {
                    name: reviewData.userName,
                    email: user.email,
                }
            });

            toast.success("Thank you for your review!");
            setNewReview({ rating: 5, comment: '' });
        } catch (error) {
            toast.error("Failed to submit review.");
            console.error(error);
        } finally {
            setIsSubmittingReview(false);
        }
    };

    const getYoutubeEmbedUrl = (url: string) => {
        let videoId;
        const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = url.match(youtubeRegex);
        if (match) {
            videoId = match[1];
        }
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }

    const approvedReviews = reviews.filter(r => r.status === 'approved');
    const averageRating = approvedReviews.length > 0 ? approvedReviews.reduce((acc, r) => acc + r.rating, 0) / approvedReviews.length : 0;

    if (loading || !product) {
        return (
            <div className="bg-background text-foreground">
                <div className="hidden md:block"><MarketplaceHeader /></div>

                <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:pt-16 md:pt-0">
                    <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-12">
                        <div className="space-y-4">
                            <Skeleton className="aspect-square w-full rounded-2xl" />
                            <div className="grid grid-cols-4 gap-2">
                                <Skeleton className="aspect-square w-full rounded-lg" />
                                <Skeleton className="aspect-square w-full rounded-lg" />
                                <Skeleton className="aspect-square w-full rounded-lg" />
                                <Skeleton className="aspect-square w-full rounded-lg" />
                            </div>
                        </div>
                        <div className="space-y-6">
                            <Skeleton className="h-6 w-24 rounded-md" />
                            <Skeleton className="h-12 w-3/4 rounded-md" />
                            <Skeleton className="h-5 w-1/2 rounded-md" />
                            <Skeleton className="h-10 w-1/3 rounded-md" />
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Skeleton className="h-12 w-full rounded-md" />
                                <Skeleton className="h-12 w-full rounded-md" />
                            </div>
                            <Skeleton className="h-20 w-full rounded-md" />
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    const galleryImages = [
        { id: 0, src: product.mainImageUrl, dataAiHint: product.title },
        ...(product.galleryUrls?.map((url, i) => ({ id: i + 1, src: url, dataAiHint: `${product.title} gallery ${i + 1}` })) || [])
    ]

    const embedUrl = product.youtubeLink ? getYoutubeEmbedUrl(product.youtubeLink) : null;


    return (
        <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
            <div className="bg-background text-foreground">
                <div className="hidden md:block">
                    <MarketplaceHeader />
                </div>

                <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:pt-16 md:pt-0 pb-24 md:pb-0">
                    <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-12">
                        {/* Image Gallery */}
                        <div className="space-y-4">
                            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg border">
                                {selectedImage && <Image src={selectedImage.src} alt={product.title} fill className="object-cover" data-ai-hint={selectedImage.dataAiHint} />}
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="absolute top-4 right-4 bg-background/50 backdrop-blur-sm hover:bg-background/80"
                                    onClick={handleWishlistToggle}
                                >
                                    <Heart className={`w-6 h-6 transition-colors ${isLiked ? 'text-red-500 fill-current' : 'text-foreground'}`} />
                                </Button>
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                                {galleryImages.map(image => (
                                    <button
                                        key={image.id}
                                        onClick={() => setSelectedImage(image)}
                                        className={`relative aspect-square rounded-lg overflow-hidden border-2 ${selectedImage?.id === image.id ? 'border-primary' : 'border-transparent'}`}
                                    >
                                        <Image src={image.src} alt={`Thumbnail ${image.id}`} fill className="object-cover" data-ai-hint={image.dataAiHint} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="space-y-4">
                            <Badge variant="outline">{product.category || 'Uncategorized'}</Badge>
                            <h1 className="text-3xl lg:text-4xl font-bold">{product.title}</h1>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                                <span>By <a href="#" className="text-primary hover:underline">Patel Pulse Ventures Studios</a></span>
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <span>{averageRating.toFixed(1)} ({approvedReviews.length} reviews)</span>
                                </div>
                            </div>
                            <p className="text-4xl font-extrabold text-primary">₹{product.salePrice || product.regularPrice}</p>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <Button
                                    size="lg"
                                    className="flex-1 w-full sm:w-auto bg-primary text-primary-foreground 
             hover:bg-primary/90 transform transition-all duration-300 
             rounded-2xl shadow-md hover:shadow-xl active:scale-95 
             px-6 py-4 sm:px-8 sm:py-3"
                                    onClick={() => handleAddToCart()}
                                >
                                    <ShoppingCart className="w-5 h-5 mr-2" />Add to Cart
                                </Button>

                                {product.livePreviewLink && (
                                    <Button
                                        asChild
                                        size="lg"
                                        variant="outline"
                                        className="flex-1 w-full sm:w-auto rounded-2xl shadow-md hover:shadow-xl 
               hover:bg-accent hover:text-accent-foreground 
               transform transition-all duration-300 active:scale-95 
               px-6 py-4 sm:px-8 sm:py-3"
                                    >
                                        <a href={product.livePreviewLink} target="_blank" rel="noopener noreferrer">
                                            <Eye className="w-5 h-5 mr-2" />Live Preview
                                        </a>
                                    </Button>
                                )}


                            </div>
                            <p className="text-muted-foreground pt-4">{product.shortDesc}</p>
                        </div>
                    </div>

                    {/* YouTube Video */}
                    {embedUrl && (
                        <section className="py-12">
                            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><YoutubeIcon className="text-red-500" /> Product Video</h2>
                            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg border">
                                <iframe
                                    src={embedUrl}
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                    className="w-full h-full"
                                ></iframe>
                            </div>
                        </section>
                    )}

                    {/* Tabs Section */}
                    <Tabs defaultValue="description" className="w-full">
                        <ScrollArea className="w-full pb-4">
                            <TabsList>
                                <TabsTrigger value="description">Description</TabsTrigger>
                                <TabsTrigger value="features">Features</TabsTrigger>
                                <TabsTrigger value="technical">Tech Specs</TabsTrigger>
                                <TabsTrigger value="included">What&apos;s Included</TabsTrigger>
                                <TabsTrigger value="usage">Usage Guide</TabsTrigger>
                                <TabsTrigger value="license">License</TabsTrigger>
                                <TabsTrigger value="reviews">Reviews ({approvedReviews.length})</TabsTrigger>
                            </TabsList>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                        <TabsContent value="description" className="py-4 prose prose-invert max-w-none">
                            <p>{product.longDesc}</p>
                        </TabsContent>
                        <TabsContent value="features" className="py-4">
                            <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2">
                                {product.features.map(feature => (
                                    <li key={feature} className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#81f5fd]" />{feature}</li>
                                ))}
                            </ul>
                        </TabsContent>
                        <TabsContent value="technical" className="py-4">
                            <h3 className="text-lg font-semibold mb-2">Technical Specifications</h3>
                            <ul className="space-y-1 text-muted-foreground">
                                {product.techSpecs.map(spec => <li key={spec}>{spec}</li>)}
                            </ul>
                        </TabsContent>
                        <TabsContent value="included" className="py-4">
                            <h3 className="text-lg font-semibold mb-2">What’s Included</h3>
                            <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2">
                                {product.whatsIncluded.map(item => (
                                    <li key={item} className="flex items-center gap-2"><FileText className="w-4 h-4 text-primary" />{item}</li>
                                ))}
                            </ul>
                        </TabsContent>
                        <TabsContent value="usage" className="py-4">
                            <h3 className="text-lg font-semibold mb-2">How to Use</h3>
                            <p className="text-muted-foreground">{product.howToUse}</p>
                        </TabsContent>
                        <TabsContent value="license" className="py-4">
                            <h3 className="text-lg font-semibold mb-2">License Details</h3>
                            <p className="text-muted-foreground">{product.license}</p>
                        </TabsContent>
                        <TabsContent value="reviews" className="py-4 space-y-8">
                            <div>
                                <h3 className="text-xl font-bold mb-4">{approvedReviews.length} Reviews</h3>
                                {reviewsLoading ? <p>Loading reviews...</p> :
                                    approvedReviews.length > 0 ? (
                                        <div className="space-y-6">
                                            {approvedReviews.map(review => (
                                                <div key={review.id} className="flex gap-4 border-b pb-4 last:border-b-0">
                                                    <UserCircle className="w-10 h-10 text-muted-foreground" />
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-semibold">{review.userName}</p>
                                                            <div className="flex items-center gap-0.5">
                                                                {Array.from({ length: 5 }).map((_, i) => (
                                                                    <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} />
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground mt-2">{review.comment}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p>Be the first to review this product!</p>
                                    )
                                }
                            </div>

                            {user && (
                                <div>
                                    <h3 className="text-xl font-bold mb-4">Write a Review</h3>
                                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                                        <div>
                                            <Label>Rating</Label>
                                            <div className="flex gap-1 mt-1">
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <Star
                                                        key={star}
                                                        className={`w-6 h-6 cursor-pointer ${star <= newReview.rating ? 'text-yellow-400 fill-current' : 'text-gray-500'}`}
                                                        onClick={() => setNewReview({ ...newReview, rating: star })}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <Label htmlFor="comment">Comment</Label>
                                            <Textarea
                                                id="comment"
                                                value={newReview.comment}
                                                onChange={e => setNewReview({ ...newReview, comment: e.target.value })}
                                                placeholder="Tell us what you think..."
                                                required
                                            />
                                        </div>
                                        <Button type="submit" disabled={isSubmittingReview}>
                                            {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                                        </Button>
                                    </form>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>

                    <section className="py-12 space-y-8">
                        {/* You Might Also Like */}
                        {relatedProductsData.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-bold mb-4">You Might Also Like</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {relatedProductsData.map(p => <ProductCard key={p.id} product={p} />)}
                                </div>
                            </div>
                        )}
                        {/* More from Creator */}
                        {moreFromCreatorData.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-bold mb-4">More from Patel Pulse Ventures Studios</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {moreFromCreatorData.map(p => <ProductCard key={p.id} product={p} />)}
                                </div>
                            </div>
                        )}
                        {/* More to Explore */}
                        {exploreCategoriesData.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-bold mb-4">More to Explore</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {exploreCategoriesData.map(category => (
                                        <Link href={`/marketplace/categories/${category.id}`} key={category.id}>
                                            <Card className="hover:bg-muted/50 transition-colors">
                                                <CardContent className="p-6 flex justify-between items-center">
                                                    <h3 className="font-semibold">{category.name}</h3>
                                                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>
                </main>
                <MobileBottomNav />
                <AuthModal open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} onAuthSuccess={(authedUser) => handleAddToCart(authedUser)} />
            </div>
            <SheetContent className="flex flex-col w-full sm:w-[380px] md:w-[400px] bg-white text-black border-l border-gray-200">
                <SheetHeader className="p-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <SheetClose asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <ChevronLeft className="w-5 h-5 text-black" />
                            </Button>
                        </SheetClose>
                        <SheetTitle className="text-lg font-semibold text-black">Cart</SheetTitle>
                    </div>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                    {cartItems.length > 0 ? cartItems.map(item => (
                        <div key={item.id} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-b-0">
                            <div className="relative">
                                <Image
                                    src={item.imageUrl}
                                    alt={item.title}
                                    width={60}
                                    height={60}
                                    className="rounded-lg object-cover bg-gray-50"
                                />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleRemoveFromCart(item.id)}
                                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gray-200 hover:bg-gray-300 p-0"
                                >
                                    <X className="w-3 h-3 text-gray-600" />
                                </Button>
                            </div>

                            <div className="flex-1 space-y-2">
                                <h4 className="font-medium text-sm text-black leading-tight uppercase tracking-wide">
                                    {item.title}
                                </h4>
                                <p className="text-lg font-semibold text-black">
                                    ${item.price}
                                </p>


                            </div>
                        </div>
                    )) : (
                        <div className="flex flex-col items-center justify-center text-center py-20 space-y-4">
                            <ShoppingBag className="w-12 h-12 text-gray-400" />
                            <p className="text-gray-500">Your cart is empty</p>
                        </div>
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="border-t border-gray-100 p-4 bg-gray-50/50">
                        <div className="space-y-3 mb-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Tax</span>
                                <span className="font-medium text-black">$10</span>
                            </div>
                            <div className="border-t border-gray-200 pt-2">
                                <div className="flex justify-between text-base font-semibold">
                                    <span className="text-black">Total</span>
                                    <span className="text-black">${(cartSubtotal + 10).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <Link href="/marketplace/checkout" className="w-full">
                            <Button
                                className="w-full h-12 bg-black text-white hover:bg-black/90 rounded-full font-medium text-base"
                                disabled={cartItems.length === 0}
                            >
                                CHECKOUT
                            </Button>
                        </Link>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    )
}
