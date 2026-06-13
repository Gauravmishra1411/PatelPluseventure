"use client"

import React from 'react'
import { FileText, HelpCircle, Calendar, Send, Eye, Trophy } from 'lucide-react'

export default function KeyDates() {
    const dates = [
        {
            status: "Open",
            statusColor: "text-emerald-700 bg-emerald-100",
            icon: FileText,
            iconColor: "text-blue-600 bg-blue-100",
            title: "Tender Notice Published",
            description: "Official notice of tender released on the procurement portal for eligible contractors to review."
        },
        {
            status: "Open",
            statusColor: "text-emerald-700 bg-emerald-100",
            icon: HelpCircle,
            iconColor: "text-emerald-600 bg-emerald-100",
            title: "Clarification Period",
            description: "Bidders may submit written queries for clarification on scope, terms, or technical specifications."
        },
        {
            status: "Upcoming",
            statusColor: "text-amber-700 bg-amber-100",
            icon: Calendar,
            iconColor: "text-amber-600 bg-amber-100",
            title: "Site Visit & Pre-bid Meeting",
            description: "Mandatory site visit and pre-bid conference for all prospective bidders to assess site conditions."
        },
        {
            status: "Deadline",
            statusColor: "text-red-700 bg-red-100",
            icon: Send,
            iconColor: "text-red-600 bg-red-100",
            title: "Bid Submission Deadline",
            description: "All sealed bids must be submitted to the procurement office before the stipulated closing time."
        },
        {
            status: "Upcoming",
            statusColor: "text-amber-700 bg-amber-100",
            icon: Eye,
            iconColor: "text-amber-600 bg-amber-100",
            title: "Bid Opening",
            description: "Public opening of submitted bids in the presence of bidder representatives and procurement officials."
        },
        {
            status: "Upcoming",
            statusColor: "text-amber-700 bg-amber-100",
            icon: Trophy,
            iconColor: "text-emerald-600 bg-emerald-100",
            title: "Award & Contract Signing",
            description: "Notification of the successful bidder and formal signing of the construction contract."
        }
    ]

    return (
        <section id="key-dates" className="py-20 sm:py-28 bg-gray-50 relative overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                <p className="text-sm font-semibold tracking-widest text-gray-500 uppercase mb-8 ml-2">Key Dates & Deadlines</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {dates.map((item, index) => {
                        const Icon = item.icon
                        return (
                            <div
                                key={index}
                                className="relative flex flex-col items-start justify-start p-6 rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:border-gray-300 hover:shadow-md"
                            >
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold mb-6 ${item.statusColor}`}>
                                    {item.status}
                                </span>
                                
                                <div className={`mb-6 flex items-center justify-center w-12 h-12 rounded-full ${item.iconColor}`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                
                                <div className="text-lg font-bold mb-3 text-gray-900 pr-4">
                                    {item.title}
                                </div>
                                
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
