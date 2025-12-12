"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ClientOnboardingForm } from "@/components/client-onboarding-form"
import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function EditClientPage() {
    const [clientData, setClientData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const params = useParams()
    const router = useRouter()
    const { id } = params

    useEffect(() => {
        if (id) {
            const fetchClient = async () => {
                const docRef = doc(db, "clients", id as string)
                const docSnap = await getDoc(docRef)
                if (docSnap.exists()) {
                    setClientData(docSnap.data())
                }
                setLoading(false)
            }
            fetchClient()
        }
    }, [id])

    if (loading) {
        return <div className="min-h-screen flex justify-center items-center bg-background"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>
    }

    if (!clientData) {
        return <div className="text-center py-10">Client not found.</div>
    }

    return (
        <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <Button variant="ghost" onClick={() => router.back()} className="mb-4 pl-0 hover:bg-transparent text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <ClientOnboardingForm isAdmin={true} initialData={clientData} clientId={id as string} />
            </div>
        </div>
    )
}
