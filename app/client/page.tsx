
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { db, auth } from "@/lib/firebase"
import { doc, onSnapshot, DocumentData } from "firebase/firestore"
import { onAuthStateChanged, User } from "firebase/auth"
import { BarChart, Clock, Flag, ListChecks, MessageSquare, Target } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

const progressData = [
  { name: 'Week 1', progress: 10 },
  { name: 'Week 2', progress: 25 },
  { name: 'Week 3', progress: 40 },
  { name: 'Week 4', progress: 65 },
  { name: 'Week 5', progress: 80 },
];

export default function ClientDashboardPage() {
    const [clientData, setClientData] = useState<DocumentData | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                router.push("/onboarding");
            }
        });
        return () => unsubscribeAuth();
    }, [router]);

    useEffect(() => {
        if (user) {
            const docRef = doc(db, "clients", user.uid);
            const unsubscribeSnapshot = onSnapshot(docRef, (doc) => {
                if (doc.exists()) {
                    setClientData(doc.data());
                } else {
                    toast.error("Client data not found.");
                }
                setLoading(false);
            }, (error) => {
                console.error("Error fetching client data:", error);
                toast.error("Could not load dashboard data.");
                setLoading(false);
            });
            return () => unsubscribeSnapshot();
        }
    }, [user]);
    
    const overallProgress = clientData?.milestones 
      ? (clientData.milestones.filter((m: any) => m.completed).length / clientData.milestones.length) * 100
      : 0;

    if (loading) {
        return <div className="flex justify-center items-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#81f5fd]"></div></div>
    }

    if (!clientData) {
        return <div className="text-center">No client data found.</div>
    }

    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                 <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-2xl">Welcome, {clientData.fullName}!</CardTitle>
                        <CardDescription>Here&apos;s the current overview of your project: {clientData.projectTitle}</CardDescription>
                    </CardHeader>
                </Card>
            </motion.div>
           
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Project Status</CardTitle>
                        <Flag className="w-4 h-4 text-gray-400"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{clientData.projectStatus || 'N/A'}</div>
                    </CardContent>
                 </Card>
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
                        <Target className="w-4 h-4 text-gray-400"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{overallProgress.toFixed(0)}%</div>
                         <Progress value={overallProgress} className="h-2 mt-1"/>
                    </CardContent>
                 </Card>
                 <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Completion Date</CardTitle>
                        <Clock className="w-4 h-4 text-gray-400"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{clientData.completionDate ? new Date(clientData.completionDate).toLocaleDateString() : 'TBD'}</div>
                    </CardContent>
                 </Card>
                 <Card className="bg-gray-800 border-gray-700">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Completed Milestones</CardTitle>
                        <ListChecks className="w-4 h-4 text-gray-400"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {clientData.milestones?.filter((m:any) => m.completed).length || 0} / {clientData.milestones?.length || 0}
                        </div>
                    </CardContent>
                 </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                        <CardTitle>Progress Over Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={progressData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(182, 245, 0, 0.1)" />
                                <XAxis dataKey="name" stroke="#888888" />
                                <YAxis stroke="#888888" unit="%"/>
                                <Tooltip contentStyle={{ backgroundColor: '#1F1F2E', border: '1px solid #B6F500' }} />
                                <Line type="monotone" dataKey="progress" stroke="#B6F500" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button className="w-full" onClick={() => router.push('/client/progress')}>View Detailed Progress</Button>
                        <Button className="w-full" onClick={() => router.push('/client/designs')}>Manage Designs</Button>
                        <Button className="w-full" onClick={() => router.push('/client/chat')}><MessageSquare className="w-4 h-4 mr-2"/>Contact Support</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
