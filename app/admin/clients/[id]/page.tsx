
"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { db } from "@/lib/firebase"
import { doc, getDoc, DocumentData } from "firebase/firestore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, User, Briefcase, Mail, Phone, Building, FileText, Palette, Link as LinkIcon, Code, Database, Shield, DollarSign, CreditCard, Repeat, Sparkles, Check, MessageSquare, Image as ImageIcon } from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

const Section = ({ icon, title, children, gridCols = 2 }: { icon: React.ElementType, title: string, children: React.ReactNode, gridCols?: number }) => {
    const Icon = icon;
    return (
        <Card className="bg-gray-800 border-gray-700">
            <CardHeader><CardTitle className="flex items-center gap-2 text-lg text-[#81f5fd]"><Icon className="w-5 h-5"/>{title}</CardTitle></CardHeader>
            <CardContent className={`grid md:grid-cols-${gridCols} gap-x-8 gap-y-4 text-sm`}>{children}</CardContent>
        </Card>
    )
}

const InfoItem = ({ label, value }: { label: string, value: any }) => {
    if (!value || (Array.isArray(value) && value.length === 0)) return null;
    
    const displayValue = Array.isArray(value) ? value.join(', ') : String(value);

    return (
        <div className="flex flex-col">
            <span className="text-gray-400">{label}</span>
            <span className="font-medium text-white">{displayValue}</span>
        </div>
    )
}


export default function ClientDetailPage() {
    const [client, setClient] = useState<DocumentData | null>(null)
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
                    setClient(docSnap.data())
                }
                setLoading(false)
            }
            fetchClient()
        }
    }, [id])

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#81f5fd]"></div></div>
    }

    if (!client) {
        return <div className="text-center py-10">Client not found.</div>
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <Button variant="outline" onClick={() => router.back()} className="mb-6"><ArrowLeft className="w-4 h-4 mr-2" />Back to Clients</Button>
            </motion.div>
             <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
                <Card className="bg-gray-800 border-gray-700 mb-8">
                    <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <CardTitle className="text-2xl text-white">{client.fullName}</CardTitle>
                            <CardDescription>{client.email}</CardDescription>
                        </div>
                        <div className="flex gap-2">
                             <Button onClick={() => router.push(`/admin/messages/chat?userId=${id}&userName=${encodeURIComponent(client.fullName)}`)}><MessageSquare className="w-4 h-4 mr-2"/>Chat</Button>
                             <Button variant="secondary">Edit Client</Button>
                        </div>
                    </CardHeader>
                </Card>
            </motion.div>

            <div className="space-y-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <Section icon={User} title="Personal & Business Details">
                        <InfoItem label="Full Name" value={client.fullName} />
                        <InfoItem label="Email" value={client.email} />
                        <InfoItem label="Phone" value={client.phone} />
                        <InfoItem label="Company Name" value={client.companyName} />
                        <InfoItem label="Designation / Role" value={client.designation} />
                        <InfoItem label="Invoicing Address" value={client.invoicingAddress} />
                        <InfoItem label="GST Number" value={client.gstNumber} />
                        <InfoItem label="Communication Method" value={client.communicationMethod} />
                    </Section>
                </motion.div>
                
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <Section icon={Briefcase} title="Project Information">
                        <InfoItem label="Project Title" value={client.projectTitle} />
                        <InfoItem label="Project Description" value={client.projectDescription} />
                        <InfoItem label="Must-have Features" value={client.mustHaveFeatures} />
                        <InfoItem label="Optional Features" value={client.optionalFeatures} />
                        <InfoItem label="Target Platforms" value={client.targetPlatforms} />
                        <InfoItem label="Login Types" value={client.loginTypes} />
                        <InfoItem label="Admin Dashboard Required" value={client.adminDashboard} />
                        <InfoItem label="Logo/Branding Needed" value={client.logoBranding} />
                    </Section>
                </motion.div>
                
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    <Section icon={Palette} title="Design & Content">
                        <InfoItem label="Has Existing Design" value={client.existingDesign} />
                        {client.designFileUrl && (
                             <div>
                                <span className="text-gray-400">Design File</span>
                                <a href={client.designFileUrl} target="_blank" rel="noopener noreferrer" className="text-[#81f5fd] hover:underline block mt-1">View Uploaded File</a>
                             </div>
                        )}
                        <InfoItem label="Wants Design Service" value={client.designService} />
                        <InfoItem label="Color Scheme" value={client.colorScheme} />
                        <InfoItem label="Example Sites" value={client.exampleSites} />
                        <InfoItem label="Content Provider" value={client.contentProvider} />
                        <InfoItem label="Has Existing Content" value={client.existingContent} />
                    </Section>
                </motion.div>
                
                {client.designAssets && client.designAssets.length > 0 && (
                     <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                        <Section icon={ImageIcon} title="Client Design Assets" gridCols={3}>
                            {client.designAssets.map((asset: any, index: number) => (
                                <Card key={index} className="bg-gray-700 p-3 group">
                                     {asset.type === 'image' ? (
                                        <a href={asset.url} target="_blank" rel="noopener noreferrer">
                                            <Image src={asset.url} alt={asset.description} width={200} height={150} className="w-full h-32 object-contain rounded-md"/>
                                        </a>
                                    ) : (
                                        <a href={asset.url} target="_blank" rel="noopener noreferrer" className="w-full h-32 flex items-center justify-center bg-gray-600 rounded-md hover:bg-gray-500">
                                            <LinkIcon className="w-10 h-10 text-gray-400"/>
                                        </a>
                                    )}
                                    <p className="text-sm mt-2 text-white truncate" title={asset.description}>{asset.description || (asset.type === 'link' ? asset.url : 'Image')}</p>
                                </Card>
                            ))}
                        </Section>
                    </motion.div>
                )}

                 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                    <Section icon={Code} title="Technical & Payment">
                        <InfoItem label="Hosting Preference" value={client.hostingPreference} />
                        <InfoItem label="Domain Name" value={client.domainName} />
                        <InfoItem label="Data To Collect" value={client.dataToCollect} />
                        <InfoItem label="Privacy/Compliance Needs" value={client.privacyNeeds} />
                        <InfoItem label="Budget Range" value={client.budgetRange} />
                        <InfoItem label="Payment Method" value={client.paymentMethod} />
                        <InfoItem label="Billing Cycle" value={client.billingCycle} />
                    </Section>
                 </motion.div>
            </div>
        </div>
    )
}
