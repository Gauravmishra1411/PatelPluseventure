"use client"

import React from 'react'
import { Building, Route, MapPin, Zap, Hammer, ShieldCheck } from 'lucide-react'

export default function InnovationLab() {
    const innovations = [
        {
            icon: Building,
            title: "Bridge & Structural Works",
            description: "Design, fabrication, and installation of structural components including bridges, overpasses, and load-bearing frames."
        },
        {
            icon: Route,
            title: "Road & Pavement Works",
            description: "Grading, laying, and finishing of roads, pavements, and drainage systems per approved engineering specifications."
        },
        {
            icon: MapPin,
            title: "Site Preparation",
            description: "Land clearing, excavation, soil testing, and levelling to prepare sites for construction commencement."
        },
        {
            icon: Zap,
            title: "Utility Infrastructure",
            description: "Installation of underground utilities including water mains, sewer lines, electrical conduits, and telecom ducting."
        },
        {
            icon: Hammer,
            title: "Heavy Civil Works",
            description: "Retaining walls, embankments, tunnels, and other large-scale civil construction activities."
        },
        {
            icon: ShieldCheck,
            title: "Quality & Compliance",
            description: "Adherence to national building codes, safety standards, and third-party inspection and testing requirements."
        }
    ]

    return (
        <section id="scope-of-work" className="py-20 sm:py-28 bg-white relative overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <p className="text-sm font-semibold tracking-widest text-gray-500 uppercase text-center mb-2">Scope of Work</p>
                <h2 className="text-3xl font-bold tracking-tight text-center font-headline sm:text-4xl text-gray-900">
                    Comprehensive Construction Services
                </h2>
                <p className="mt-4 text-lg text-center text-gray-600 max-w-2xl mx-auto">
                    We deliver end-to-end infrastructure solutions, ensuring quality, safety, and precision in every phase of the project lifecycle.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 mx-auto gap-4">
                    {innovations.map((item, index) => {
                        const Icon = item.icon
                        return (
                            <div
                                key={index}
                                className="relative flex flex-col items-start justify-start py-8 px-6 rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm"
                            >
                                <div className="mb-5 flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-[#81f5fd]">
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div className="text-lg font-bold mb-3 text-gray-900">
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
