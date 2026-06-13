"use client"

import React from 'react'
import Link from 'next/link'

export default function Integrations() {
    return (
        <section className="py-24 overflow-hidden bg-background">
            <div className="relative container mx-auto px-6 text-center">
                <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-[#81f5fd] dark:text-[#81f5fd] max-w-4xl mx-auto leading-tight">
                    Tenders & procurement <br className="hidden md:block" /> at Patel Pulse Ventures
                </h2>
                <p className="mt-6 text-lg text-muted-foreground dark:text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
                    We invite eligible contractors, suppliers, and service providers to bid on our construction and infrastructure projects. All tenders are evaluated on technical competence, financial capability, and value for money.
                </p>
                <Link 
                    href="/projects" 
                    className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-[#81f5fd] hover:bg-[#1565c0] rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
                >
                    View open tenders
                </Link>
            </div>
        </section>
    )
}
