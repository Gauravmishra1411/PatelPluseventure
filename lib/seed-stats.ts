"use client"

import { db } from "@/lib/firebase"
import { collection, addDoc, getDocs, deleteDoc } from "firebase/firestore"
import { toast } from "sonner"

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

export async function seedHomeHeroStats() {
    try {
        const collectionRef = collection(db, "home_hero_stats")

        // Clear existing data
        const snapshot = await getDocs(collectionRef)
        const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref))
        await Promise.all(deletePromises)

        // Add new data
        let count = 0
        for (const stat of heroStats) {
            await addDoc(collectionRef, stat)
            count++
        }

        toast.success(`Added ${count} hero stats successfully! 🎉`)
        return count
    } catch (error) {
        console.error("Error seeding hero stats:", error)
        toast.error("Failed to seed hero stats.")
        throw error
    }
}

export async function seedHomeAboutStats() {
    try {
        const collectionRef = collection(db, "home_about_stats")

        // Clear existing data
        const snapshot = await getDocs(collectionRef)
        const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref))
        await Promise.all(deletePromises)

        // Add new data
        let count = 0
        for (const stat of aboutStats) {
            await addDoc(collectionRef, stat)
            count++
        }

        toast.success(`Added ${count} about stats successfully! 🎉`)
        return count
    } catch (error) {
        console.error("Error seeding about stats:", error)
        toast.error("Failed to seed about stats.")
        throw error
    }
}

export async function seedAllHomeStats() {
    try {
        toast.info("Starting to seed all stats...")

        const heroCount = await seedHomeHeroStats()
        const aboutCount = await seedHomeAboutStats()

        toast.success(`✨ Successfully seeded ${heroCount} hero stats and ${aboutCount} about stats!`)
    } catch (error) {
        console.error("Error seeding all stats:", error)
        toast.error("Failed to seed stats.")
    }
}
