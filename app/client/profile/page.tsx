
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { db, auth } from "@/lib/firebase"
import { doc, onSnapshot, DocumentData, collection, query } from "firebase/firestore"
import { onAuthStateChanged, User } from "firebase/auth"
import { toast } from "sonner"
import { User as UserIcon, Briefcase, Mail, Phone, Building, MessageSquare, AtSign, MapPin, Hash, ShoppingCart, DollarSign, Image as ImageIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Order {
  id: string;
  total: number;
}

const InfoItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value?: string }) => {
    if (!value) return null
    return (
        <div className="flex items-start gap-3 rounded-lg bg-gray-700/50 p-3">
            <Icon className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
            <div>
                <p className="text-sm text-gray-400">{label}</p>
                <p className="font-medium text-white break-words">{value}</p>
            </div>
        </div>
    )
}

export default function ClientProfilePage() {
    const [clientData, setClientData] = useState<DocumentData | null>(null)
    const [user, setUser] = useState<User | null>(null)
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser)
            } else {
                setLoading(false)
            }
        });
        return () => unsubscribeAuth();
    }, [])

    useEffect(() => {
        if (user) {
            const clientDocRef = doc(db, "clients", user.uid);
            const unsubClient = onSnapshot(clientDocRef, (clientDocSnap) => {
                if (clientDocSnap.exists()) {
                    setClientData(clientDocSnap.data())
                    setLoading(false)
                } else {
                    const userDocRef = doc(db, "users", user.uid);
                    const unsubUser = onSnapshot(userDocRef, (userDoc) => {
                        if (userDoc.exists()) {
                            setClientData(userDoc.data());
                        } else {
                            toast.error("Could not find client data.")
                        }
                         setLoading(false)
                    });
                    return () => unsubUser();
                }
            }, (error) => {
                console.error("Error fetching client data:", error)
                toast.error("Could not load profile data.")
                setLoading(false)
            });

            const ordersQuery = query(collection(db, "users", user.uid, "orders"));
            const unsubOrders = onSnapshot(ordersQuery, (snapshot) => {
                setOrders(snapshot.docs.map(doc => ({id: doc.id, ...doc.data() as Order})));
            });

            return () => {
                unsubClient();
                unsubOrders();
            }
        }
    }, [user])

    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);

    if (loading) {
        return <div className="flex justify-center items-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div></div>
    }

    if (!clientData) {
        return <div className="text-center">No profile data found. Please complete the onboarding process.</div>
    }

    return (
        <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
             <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <Avatar className="w-16 h-16">
                           <AvatarImage src={clientData.avatarUrl} />
                           <AvatarFallback className="text-2xl">{clientData.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="flex items-center gap-2 text-2xl"><UserIcon /> {clientData.name || clientData.fullName}</CardTitle>
                            <CardDescription>This is your personal and business information.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            <div className="grid lg:grid-cols-2 gap-6">
                 <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg"><UserIcon/> Personal Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <InfoItem icon={UserIcon} label="Full Name" value={clientData.fullName || clientData.name} />
                        <InfoItem icon={Mail} label="Email Address" value={clientData.email} />
                        <InfoItem icon={Phone} label="Phone Number" value={clientData.phone || clientData.mobile} />
                    </CardContent>
                </Card>
                
                 <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg"><Briefcase/> Business Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                         <InfoItem icon={Building} label="Company Name" value={clientData.companyName} />
                         <InfoItem icon={Briefcase} label="Designation / Role" value={clientData.designation} />
                         <InfoItem icon={MapPin} label="Invoicing Address" value={clientData.invoicingAddress} />
                         <InfoItem icon={Hash} label="GST Number" value={clientData.gstNumber} />
                         <InfoItem icon={MessageSquare} label="Preferred Communication" value={clientData.communicationMethod} />
                    </CardContent>
                </Card>
                
                <Card className="bg-gray-800 border-gray-700 lg:col-span-2">
                    <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><ShoppingCart/> Marketplace Activity</CardTitle></CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                           <span className="font-medium">Total Orders</span>
                           <span className="text-2xl font-bold text-green-400">{orders.length}</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                           <span className="font-medium">Total Spent</span>
                           <span className="text-2xl font-bold text-green-400">₹{totalSpent.toFixed(2)}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </motion.div>
    )
}
