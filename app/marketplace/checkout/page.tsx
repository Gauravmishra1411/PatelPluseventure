
"use client"

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CreditCard, Lock, Shield, ShoppingBag, MapPin, Tag, Check, CheckCircle, PartyPopper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, doc, addDoc, serverTimestamp, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { useRouter } from 'next/navigation';

interface CartItem {
    id: string;
    productId: string;
    title: string;
    price: string;
    imageUrl: string;
    quantity: number;
}

interface Address {
    id: string;
    line1: string;
    city: string;
    state: string;
    zip: string;
    country: string;
}

interface Discount {
    id: string;
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
}

const steps = [
    { id: 1, name: 'Address', icon: MapPin },
    { id: 2, name: 'Payment', icon: CreditCard },
];

export default function CheckoutPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loadingCart, setLoadingCart] = useState(true);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
    const [discounts, setDiscounts] = useState<Discount[]>([]);
    const [appliedDiscount, setAppliedDiscount] = useState<Discount | null>(null);
    const [showCongrats, setShowCongrats] = useState(false);
    
    useEffect(() => {
        if (user) {
            const cartQuery = collection(db, "users", user.uid, "cart");
            const unsubCart = onSnapshot(cartQuery, (snapshot) => {
                const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CartItem));
                setCartItems(items);
                setLoadingCart(false);
            });

            const addressQuery = collection(db, "users", user.uid, "addresses");
            const unsubAddresses = onSnapshot(addressQuery, (snapshot) => {
                const fetchedAddresses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Address));
                setAddresses(fetchedAddresses);
                if (!selectedAddress && fetchedAddresses.length > 0) {
                    setSelectedAddress(fetchedAddresses[0].id);
                }
            });
            
            const discountQuery = query(collection(db, "marketplace_discounts"));
            const unsubDiscounts = onSnapshot(discountQuery, (snapshot) => {
                const fetchedDiscounts = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()} as Discount));
                setDiscounts(fetchedDiscounts);
            })

            return () => {
                unsubCart();
                unsubAddresses();
                unsubDiscounts();
            };
        } else if (!authLoading) {
            router.push('/marketplace/shop');
            toast.error("Please login to proceed to checkout.");
        }
    }, [user, authLoading, router, selectedAddress]);

    const nextStep = () => setCurrentStep(prev => prev < steps.length ? prev + 1 : prev);
    const prevStep = () => setCurrentStep(prev => prev > 1 ? prev - 1 : prev);

    const subtotal = cartItems.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0);
    let total = subtotal + 10; // 10 for taxes/shipping
    
    if (appliedDiscount) {
        if (appliedDiscount.type === 'percentage') {
            total -= (subtotal * (appliedDiscount.value / 100));
        } else {
            total -= appliedDiscount.value;
        }
    }
    
    const handleApplyDiscount = (discount: Discount) => {
        setAppliedDiscount(discount);
        setShowCongrats(true);
        setTimeout(() => setShowCongrats(false), 3000);
    }

    const placeOrder = async () => {
        if (!user || !selectedAddress) {
            toast.error("Please select a shipping address.");
            return;
        }

        const orderData = {
            userId: user.uid,
            userName: user.displayName || user.email,
            userEmail: user.email,
            items: cartItems,
            total: total,
            subtotal: subtotal,
            discount: appliedDiscount,
            shippingAddress: addresses.find(a => a.id === selectedAddress),
            status: "Pending",
            createdAt: serverTimestamp(),
            hasUnreadAdminMessage: true,
        };

        try {
            const orderDocRef = await addDoc(collection(db, "marketplace_orders"), orderData);
            await addDoc(collection(db, "users", user.uid, "orders"), orderData);
            
            // Create notification for admin
            await addDoc(collection(db, "notifications"), {
                type: 'new_order',
                message: `New order #${orderDocRef.id.slice(0, 7)} for ₹${total.toFixed(2)}`,
                link: `/admin/marketplace/orders/${orderDocRef.id}`,
                isRead: false,
                createdAt: serverTimestamp(),
                senderInfo: {
                    name: user.displayName || 'N/A',
                    email: user.email || 'N/A',
                }
            });
            
            // Clear cart
            const cartQuery = query(collection(db, 'users', user.uid, 'cart'));
            const cartSnapshot = await getDocs(cartQuery);
            cartSnapshot.forEach(docSnapshot => {
              // Note: This is not batched for simplicity, but in a real app, batch delete would be better
              deleteDoc(doc(db, 'users', user.uid, 'cart', docSnapshot.id));
            });

            toast.success("Order placed successfully!");
            router.push("/marketplace/thank-you"); // Create this page
        } catch (error) {
            toast.error("Failed to place order.");
            console.error(error);
        }
    };
    
    const CongratulationPopup = () => (
         <AnimatePresence>
            {showCongrats && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 50 }}
                    className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
                >
                    <Card className="text-center p-8">
                        <PartyPopper className="w-16 h-16 mx-auto text-[#81f5fd] mb-4" />
                        <CardTitle>Congratulations!</CardTitle>
                        <CardDescription>Coupon &apos;{appliedDiscount?.code}&apos; applied successfully.</CardDescription>
                    </Card>
                </motion.div>
            )}
        </AnimatePresence>
    )


    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <CongratulationPopup/>
            <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold">Checkout</h1>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {currentStep > 1 && (
                                    <Button variant="ghost" size="icon" onClick={prevStep} className="mr-2">
                                        <ArrowLeft className="w-4 h-4"/>
                                    </Button>
                                )}
                                Step {currentStep}: {steps[currentStep - 1].name}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentStep}
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {currentStep === 1 && <AddressStep addresses={addresses} selectedAddress={selectedAddress} setSelectedAddress={setSelectedAddress} />}
                                    {currentStep === 2 && <PaymentStep />}
                                </motion.div>
                            </AnimatePresence>
                        </CardContent>
                    </Card>
                    <div className="mt-6 flex justify-end">
                        {currentStep < steps.length ? (
                            <Button onClick={nextStep} disabled={!selectedAddress}>Continue</Button>
                        ) : (
                            <Button className="bg-green-600 hover:bg-green-700" onClick={placeOrder}>
                                <Lock className="w-4 h-4 mr-2" /> Place Order
                            </Button>
                        )}
                    </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {loadingCart ? <Skeleton className="h-20 w-full" /> : 
                            cartItems.map(item => (
                                <div key={item.id} className="flex items-center gap-4">
                                    <Image src={item.imageUrl} alt={item.title} width={64} height={64} className="rounded-md border"/>
                                    <div>
                                        <h4 className="font-semibold text-sm">{item.title}</h4>
                                        <p className="text-muted-foreground text-sm">{item.quantity} x ₹{item.price}</p>
                                    </div>
                                </div>
                            ))}
                            <Separator/>
                             <Drawer>
                                <DrawerTrigger asChild>
                                    <Button variant="outline" className="w-full"><Tag className="w-4 h-4 mr-2"/>Apply Discount</Button>
                                </DrawerTrigger>
                                <DrawerContent>
                                    <DrawerHeader><DrawerTitle>Available Discounts</DrawerTitle></DrawerHeader>
                                    <div className="p-4 space-y-2">
                                        {discounts.map(d => (
                                            <Card key={d.id} className="p-4 flex justify-between items-center">
                                                <div>
                                                    <p className="font-bold text-primary">{d.code}</p>
                                                    <p className="text-sm">{d.type === 'percentage' ? `${d.value}% off` : `₹${d.value} off`}</p>
                                                </div>
                                                <Button onClick={() => handleApplyDiscount(d)}>Apply</Button>
                                            </Card>
                                        ))}
                                    </div>
                                </DrawerContent>
                            </Drawer>
                            <Separator/>
                            <div className="space-y-2">
                                <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
                                <div className="flex justify-between"><span>Taxes</span><span>₹10.00</span></div>
                                {appliedDiscount && (
                                    <div className="flex justify-between text-[#81f5fd]">
                                        <span>Discount ({appliedDiscount.code})</span>
                                        <span>- ₹{(subtotal + 10 - total).toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-lg font-bold"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}


function AddressStep({ addresses, selectedAddress, setSelectedAddress }: { addresses: Address[], selectedAddress: string | null, setSelectedAddress: (id: string) => void }) {
    const { user } = useAuth();
    const [isAdding, setIsAdding] = useState(false);
    const [newAddress, setNewAddress] = useState({ line1: '', city: '', state: '', zip: '', country: 'India' });

    const handleSaveAddress = async () => {
        if (!user) return;
        try {
            await addDoc(collection(db, 'users', user.uid, 'addresses'), newAddress);
            toast.success("Address saved!");
            setIsAdding(false);
            setNewAddress({ line1: '', city: '', state: '', zip: '', country: 'India' });
        } catch (e) {
            toast.error("Failed to save address.");
        }
    };
    
    return (
        <div>
             <h3 className="text-lg font-semibold mb-4">Select Shipping Address</h3>
             <RadioGroup value={selectedAddress || ''} onValueChange={setSelectedAddress}>
                {addresses.map(address => (
                    <Label key={address.id} htmlFor={address.id} className="flex items-center gap-4 border rounded-lg p-4 cursor-pointer hover:bg-muted/50 has-[:checked]:bg-muted has-[:checked]:border-primary">
                        <RadioGroupItem value={address.id} id={address.id} />
                        <p>{address.line1}, {address.city}, {address.state} - {address.zip}, {address.country}</p>
                    </Label>
                ))}
             </RadioGroup>
             
             <Button variant="link" onClick={() => setIsAdding(!isAdding)} className="mt-4">{isAdding ? 'Cancel' : 'Add New Address'}</Button>
             
             <AnimatePresence>
             {isAdding && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4 overflow-hidden pt-4">
                     <div className="space-y-2"><Label>Address Line 1</Label><Input value={newAddress.line1} onChange={(e) => setNewAddress({...newAddress, line1: e.target.value})} /></div>
                     <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2"><Label>City</Label><Input value={newAddress.city} onChange={(e) => setNewAddress({...newAddress, city: e.target.value})} /></div>
                        <div className="space-y-2"><Label>State</Label><Input value={newAddress.state} onChange={(e) => setNewAddress({...newAddress, state: e.target.value})} /></div>
                        <div className="space-y-2"><Label>ZIP Code</Label><Input value={newAddress.zip} onChange={(e) => setNewAddress({...newAddress, zip: e.target.value})} /></div>
                     </div>
                     <Button onClick={handleSaveAddress}>Save Address</Button>
                </motion.div>
             )}
             </AnimatePresence>
        </div>
    )
}

function PaymentStep() {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Select Payment Method</h3>
            <RadioGroup defaultValue="cod">
                <Label htmlFor="cod" className="flex items-center gap-4 border rounded-lg p-4 cursor-pointer hover:bg-muted/50 has-[:checked]:bg-muted has-[:checked]:border-primary">
                    <RadioGroupItem value="cod" id="cod" />
                    <div>
                        <p className="font-semibold">Cash on Delivery</p>
                        <p className="text-sm text-muted-foreground">Pay when your order arrives.</p>
                    </div>
                </Label>
                 <Label htmlFor="paytm" className="flex items-center gap-4 border rounded-lg p-4 cursor-pointer hover:bg-muted/50 has-[:checked]:bg-muted has-[:checked]:border-primary">
                    <RadioGroupItem value="paytm" id="paytm" />
                    <div>
                        <p className="font-semibold">Paytm / UPI</p>
                         <p className="text-sm text-muted-foreground">Pay with wallet, UPI, or cards.</p>
                    </div>
                </Label>
            </RadioGroup>
        </div>
    )
}


    