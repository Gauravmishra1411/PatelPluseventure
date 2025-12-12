
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { db, auth } from "@/lib/firebase"
import { doc, onSnapshot, DocumentData } from "firebase/firestore"
import { onAuthStateChanged, User } from "firebase/auth"
import { toast } from "sonner"
import { ListChecks, CheckCircle, Clock, Flag, Target } from "lucide-react"

interface Milestone {
  text: string
  completed: boolean
}

interface ProgressHistoryItem {
    status: string;
    message: string;
    date: string;
}

export default function ClientProgressPage() {
    const [clientData, setClientData] = useState<DocumentData | null>(null)
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                setLoading(false);
            }
        });
        return () => unsubscribeAuth();
    }, [])

    useEffect(() => {
        if (user) {
            const docRef = doc(db, "clients", user.uid);
            const unsubscribeSnapshot = onSnapshot(docRef, (doc) => {
                if (doc.exists()) {
                    setClientData(doc.data());
                }
                setLoading(false);
            }, (error) => {
                console.error("Error fetching client data:", error);
                toast.error("Could not load progress data.");
                setLoading(false);
            });
            return () => unsubscribeSnapshot();
        }
    }, [user])

    const milestones: Milestone[] = clientData?.milestones || [];
    const overallProgress = milestones.length > 0
      ? (milestones.filter(m => m.completed).length / milestones.length) * 100
      : 0;
      
    const progressHistory: ProgressHistoryItem[] = clientData?.progressHistory || [];

    if (loading) {
        return <div className="flex justify-center items-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div></div>
    }

    if (!clientData) {
        return <div className="text-center">No project data found.</div>
    }
    
    return (
        <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><ListChecks /> Project Progress Tracker</CardTitle>
                    <CardDescription>Follow along with the development of {clientData.projectTitle}.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2 mb-6">
                        <div className="flex justify-between items-center text-lg">
                           <span className="font-medium text-white">Overall Progress</span>
                           <span className="font-bold text-green-400">{overallProgress.toFixed(0)}%</span>
                        </div>
                        <Progress value={overallProgress} />
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <div className="p-4 bg-gray-700/50 rounded-lg">
                            <Flag className="mx-auto w-6 h-6 mb-2 text-blue-400"/>
                            <p className="text-sm text-gray-400">Status</p>
                            <p className="font-semibold">{clientData.projectStatus || 'N/A'}</p>
                        </div>
                         <div className="p-4 bg-gray-700/50 rounded-lg">
                            <Target className="mx-auto w-6 h-6 mb-2 text-purple-400"/>
                            <p className="text-sm text-gray-400">Milestones</p>
                            <p className="font-semibold">{milestones.filter(m => m.completed).length} / {milestones.length}</p>
                        </div>
                         <div className="p-4 bg-gray-700/50 rounded-lg">
                            <Clock className="mx-auto w-6 h-6 mb-2 text-yellow-400"/>
                            <p className="text-sm text-gray-400">Target Date</p>
                            <p className="font-semibold">{clientData.completionDate ? new Date(clientData.completionDate).toLocaleDateString() : 'TBD'}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid lg:grid-cols-2 gap-6">
                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                        <CardTitle>Milestones</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {milestones.length > 0 ? (
                            milestones.map((milestone, index) => (
                                <motion.div 
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`flex items-center gap-3 p-3 rounded-md ${milestone.completed ? 'bg-green-500/10' : 'bg-gray-700/50'}`}
                                >
                                    <Checkbox checked={milestone.completed} disabled className="cursor-not-allowed"/>
                                    <label className={`flex-1 ${milestone.completed ? 'line-through text-gray-400' : 'text-white'}`}>
                                        {milestone.text}
                                    </label>
                                </motion.div>
                            ))
                        ) : (
                             <p className="text-gray-400">No milestones defined yet.</p>
                        )}
                    </CardContent>
                </Card>
                 <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                        <CardTitle>Progress History</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="relative pl-6">
                             <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-700"></div>
                             {progressHistory.slice().reverse().map((item, index) => (
                                 <motion.div 
                                     key={index}
                                     initial={{ opacity: 0, y: 20 }}
                                     animate={{ opacity: 1, y: 0 }}
                                     transition={{ delay: index * 0.1 }}
                                     className="relative mb-6"
                                 >
                                    <div className="absolute -left-[29px] top-1.5 w-4 h-4 bg-green-500 rounded-full border-4 border-gray-800"></div>
                                    <p className="text-sm text-gray-400">{new Date(item.date).toLocaleString()}</p>
                                    <p className="font-semibold text-white">{item.message}</p>
                                </motion.div>
                             ))}
                              {progressHistory.length === 0 && <p className="text-gray-400">No history yet.</p>}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

    