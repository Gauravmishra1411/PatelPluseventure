import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore'

// Hero Stats Data - Shows in Hero section
const heroStats = [
    {
        icon: "Award",
        title: "Projects Completed",
        number: "40",
        suffix: "+"
    },
    {
        icon: "Star",
        title: "Average Rating",
        number: "5",
        suffix: "★"
    },
    {
        icon: "Check",
        title: "Client Satisfaction",
        number: "99",
        suffix: "%"
    },
    {
        icon: "Clock",
        title: "Support Available",
        number: "24",
        suffix: "/7"
    }
]

// About Section Stats Data - Shows in Counters section
const aboutStats = [
    {
        icon: "Award",
        title: "Projects Completed",
        number: "50",
        suffix: "+"
    },
    {
        icon: "Star",
        title: "Client Satisfaction",
        number: "100",
        suffix: "%"
    },
    {
        icon: "Clock",
        title: "Support Available",
        number: "24",
        suffix: "/7"
    },
    {
        icon: "Target",
        title: "Awards Won",
        number: "10",
        suffix: "+"
    }
]

export async function GET() {
    try {
        console.log('🌱 Starting to seed stats data...')

        // Seed Hero Stats
        const heroStatsRef = collection(db, 'home_hero_stats')
        const heroSnapshot = await getDocs(heroStatsRef)
        const heroDeletePromises = heroSnapshot.docs.map(doc => deleteDoc(doc.ref))
        await Promise.all(heroDeletePromises)

        for (const stat of heroStats) {
            await addDoc(heroStatsRef, stat)
        }

        // Seed About Stats
        const aboutStatsRef = collection(db, 'home_about_stats')
        const aboutSnapshot = await getDocs(aboutStatsRef)
        const aboutDeletePromises = aboutSnapshot.docs.map(doc => deleteDoc(doc.ref))
        await Promise.all(aboutDeletePromises)

        for (const stat of aboutStats) {
            await addDoc(aboutStatsRef, stat)
        }

        return NextResponse.json({
            success: true,
            message: `Successfully seeded ${heroStats.length} hero stats and ${aboutStats.length} about stats!`,
            heroStats: heroStats.length,
            aboutStats: aboutStats.length
        })
    } catch (error) {
        console.error('Error seeding stats:', error)
        return NextResponse.json({
            success: false,
            error: 'Failed to seed stats',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}
