"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Settings2, Search, Cloud, FlaskConical } from 'lucide-react'

// Inline SVG icons — guaranteed to render, no import issues
const AxeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m14 12-8.5 8.5a2.12 2.12 0 1 1-3-3L11 9" />
        <path d="M5.5 16.5 2 13" />
        <path d="m16 2 6 6-1.5 1.5" />
        <path d="M9 9c-1.5-1.5-2-3.5-1.5-5.5L12 2l5.5 5.5-2.5 4.5" />
        <path d="M16 8 9 15" />
    </svg>
)

const PotFoodIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12h20" />
        <path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6" />
        <path d="M6 12V6a6 6 0 0 1 12 0v6" />
        <path d="M9 6h6" />
        <path d="M12 2v4" />
        <path d="M19 4a1 1 0 0 1 2 0v4a1 1 0 0 1-2 0V4z" />
    </svg>
)

const ChairIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3" />
        <path d="M3 11v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H7v-2a2 2 0 0 0-4 0Z" />
        <path d="M5 18v2" />
        <path d="M19 18v2" />
    </svg>
)

const BanParkingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="m4.9 4.9 14.2 14.2" />
        <path d="M9 9h2.5a2 2 0 0 1 0 4H9V9z" />
        <path d="M9 13v4" />
    </svg>
)

export default function DevelopmentStages() {
    return (
        <section className="py-6 md:py-12 lg:py-20 relative overflow-hidden bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl bg-gradient-to-r from-[#1565c0] via-[#81f5fd] to-[#1565c0] bg-clip-text text-transparent">
                        For government and private tenders
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center mx-auto">
                    {/* Left Column */}
                    <div className="flex flex-col gap-8">
                        <StageCard
                            icon={<AxeIcon />}
                            title="Tender Notices"
                            description="Inviting Qualified Vendors & Contractors to Submit Bids"
                        />
                        <StageCard
                            icon={<ChairIcon />}
                            title="About Our Tendering Process"
                            description="We invite eligible contractors, suppliers, and service providers to bid on our construction and infrastructure projects. All tenders are evaluated on technical competence, financial capability, and value for money — ensuring a fair and transparent process for every participant."
                        />
                        <StageCard
                            icon={<BanParkingIcon />}
                            title="Current Open Tenders"
                            description="Tender No. PPV-2026-001
Project: Feild Gun Factory (Scrap Material)
Location: Kanpur
Last Date: 20-12-2026
"
                        />
                    </div>

                    {/* Center Image */}
                    <div className="hidden lg:flex justify-center items-center h-full">
                        <div className="relative w-full aspect-square max-w-[400px]">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl opacity-30 animate-pulse" />
                            <motion.img
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                                alt="Development Lifecycle"
                                src="https://res.cloudinary.com/ddthlutz4/image/upload/v1781172817/yitbu85lx4rovlw11nuj.png"
                                className="w-full h-full object-contain relative z-10 drop-shadow-2xl"
                                loading="lazy"
                            />
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="flex flex-col gap-8">
                        <StageCard
                            icon={<Settings2 className="w-6 h-6" />}
                            title="Eligibility Criteria"
                            description="Bidders must hold valid registrations, demonstrate relevant experience, and maintain satisfactory financial standing to qualify for evaluation."
                        />
                        <StageCard
                            icon={<Search className="w-6 h-6" />}
                            title="How to Apply"
                            description="How to Apply
Download the tender document, attend the pre-bid meeting, and submit your sealed bid before the deadline to be considered."
                        />
                        <StageCard
                            icon={<Cloud className="w-6 h-6" />}
                            title="Tender Fee & EMD"
                            description="Tender Fee & EMD
A non-refundable tender document fee and Earnest Money Deposit (EMD) are required at the time of submission. Payment via DD/NEFT/RTGS."
                        />
                        <StageCard
                            icon={<FlaskConical className="w-6 h-6" />}
                            title="Terms & Conditions"
                            description="PPV reserves the right to accept or reject any bid. Canvassing leads to disqualification. All disputes subject to local jurisdiction"
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}

function StageCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="h-full group">
            <div className="w-full h-full rounded-lg border border-gray-200 dark:border-primary/20 bg-white dark:bg-[#112218] backdrop-blur-sm shadow-sm dark:shadow-none hover:shadow-md hover:shadow-primary/10 dark:hover:shadow-[0_0_30px_rgba(142,217,104,0.1)] hover:border-primary dark:hover:border-accent/50 transition-all duration-300 cursor-pointer p-6">
                <div className="space-y-4">
                    <div className="flex flex-row items-center gap-4">
                        <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20 group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors text-primary dark:text-accent">
                            {icon}
                        </div>
                        <div className="tracking-tight text-foreground dark:text-white font-semibold text-lg group-hover:text-primary dark:group-hover:text-accent transition-colors">
                            {title}
                        </div>
                    </div>
                    <div>
                        <p className="text-muted-foreground dark:text-gray-400 text-sm leading-relaxed">
                            {description}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
