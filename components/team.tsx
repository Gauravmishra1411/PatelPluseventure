"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { collection, onSnapshot, query, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import Image from "next/image"

interface TeamMember {
    id: string
    name: string
    role: string
    bio: string
    image: string
    skills?: string[]
    order?: number
}

export default function Team() {
    const [team, setTeam] = useState<TeamMember[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "about_team"), (snapshot: any) => {
            const loadedTeam = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as TeamMember));
            // Sort by order, putting items without order at the end
            loadedTeam.sort((a: any, b: any) => (a.order ?? 999) - (b.order ?? 999));
            setTeam(loadedTeam);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) return null

    return (
        <></>
    )
}
