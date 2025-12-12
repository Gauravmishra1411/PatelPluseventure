
"use client"

import { ClientOnboardingForm } from "@/components/client-onboarding-form";

export default function AddClientPage() {
    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <ClientOnboardingForm isAdmin={true} />
            </div>
        </div>
    )
}

    