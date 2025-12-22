import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

const projects = [
    {
        title: "Maeorganics",
        tagline: "Premium Cosmetics & Skincare",
        description: "A comprehensive e-commerce platform for cosmetics and organic skincare products, focusing on natural beauty and wellness.",
        category: "E-commerce",
        tags: ["E-commerce", "Web Development", "React", "Next.js"],
        demoUrl: "https://maeorganics.vercel.app/",
        features: ["Product Catalog", "Shopping Cart", "User Reviews", "Organic Product Filtering"],
        techStack: ["Next.js", "Tailwind CSS", "Firebase", "Stripe"],
        role: "Fullstack Developer",
        timeline: "2 Months",
        learnings: ["E-commerce flow", "Payment integration", "Performance optimization"],
        mainImage: "https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?auto=format&fit=crop&q=80&w=800",
        link: "https://maeorganics.vercel.app/"
    },
    {
        title: "Splityfy",
        tagline: "Smart Group Expense Tracker",
        description: "An advanced expense tracker and bill splitter that helps groups manage shared costs effortlessly.",
        category: "Web Application",
        tags: ["Web Application", "Fintech", "Fullstack", "Next.js"],
        demoUrl: "https://splitlyfi.vercel.app/",
        features: ["Group Splitting", "Real-time Tracking", "Expense Categorization", "Balance Reports"],
        techStack: ["Next.js", "Firebase Auth", "Firestore", "Tailwind CSS"],
        role: "Lead Developer",
        timeline: "1 Month",
        learnings: ["Real-time database sync", "Complex state management", "UX for financial data"],
        mainImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800",
        link: "https://splitlyfi.vercel.app/"
    },
    {
        title: "Civic Connect",
        tagline: "Empowering Citizen Communication",
        description: "A platform for citizens to anonymously report damaged infrastructure like roads and lights, allowing district authorities to track and resolve issues.",
        category: "Web Application",
        tags: ["Web Application", "Social Impact", "Public Service", "Fullstack"],
        demoUrl: "https://civicconnects.vercel.app/",
        features: ["Anonymous Reporting", "Geo-tagging", "DM Admin Panel", "Issue Status Tracking"],
        techStack: ["React", "Node.js", "PostgreSQL", "Google Maps API"],
        role: "Fullstack Developer",
        timeline: "3 Months",
        learnings: ["GIS integration", "Anonymous authentication", "Admin dashboard design"],
        mainImage: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800",
        link: "https://civicconnects.vercel.app/"
    },
    {
        title: "Maya Institute",
        tagline: "Modern Educational Platform",
        description: "A professional college website for Maya Institute, providing information about courses, campus life, and admissions.",
        category: "Web Development",
        tags: ["Web Development", "Education", "Next.js", "Tailwind CSS"],
        demoUrl: "https://mayainstitude.vercel.app/",
        features: ["Course Management", "Online Admissions", "Campus Gallery", "Faculty Directory"],
        techStack: ["Next.js", "Framer Motion", "Sanity CMS", "Tailwind CSS"],
        role: "Frontend Developer",
        timeline: "1.5 Months",
        learnings: ["SEO for education", "Accessibility", "CMS integration"],
        mainImage: "https://images.unsplash.com/photo-1523050338692-7b835a01bb1e?auto=format&fit=crop&q=80&w=800",
        link: "https://mayainstitude.vercel.app/"
    },
    {
        title: "Neurofitness",
        tagline: "Mind & Body Fitness App",
        description: "A fitness application designed to track physical activity and cognitive wellness, bridging the gap between mind and body fitness.",
        category: "Web Application",
        tags: ["Web Application", "Health & Fitness", "AI", "Mobile Development"],
        demoUrl: "https://neurofitness.vercel.app/",
        features: ["Workout Tracking", "Cognitive Exercises", "Progress Analytics", "Personalized Goals"],
        techStack: ["React Native", "Firebase", "TensorFlow.js", "Redux"],
        role: "Mobile Developer",
        timeline: "4 Months",
        learnings: ["Integration of AI in Health", "Cross-platform development", "User retention strategies"],
        mainImage: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800",
        link: "https://neurofitness.vercel.app/"
    },
    {
        title: "Dream Deploy",
        tagline: "End-to-End Project Solutions",
        description: "A platform dedicated to helping college students complete their projects from 0 to 100%, offering resources, guidance, and ready-to-use solutions.",
        category: "Services",
        tags: ["Web Development", "Education", "Project Management", "Fullstack"],
        demoUrl: "https://dreamdeploy.vercel.app/",
        features: ["Project Repository", "Step-by-step Guidance", "Student Resources", "Solution Marketplace"],
        techStack: ["Next.js", "MongoDB", "Express", "Tailwind"],
        role: "Project Lead",
        timeline: "2 Months",
        learnings: ["Resource management", "Educational UX", "Platform scaling"],
        mainImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
        link: "https://dreamdeploy.vercel.app/"
    },
    {
        title: "CourseHUB",
        tagline: "AI-Powered Online Learning",
        description: "A platform to create and manage unlimited courses with the help of AI, including automated quiz generation and interactive learning content.",
        category: "AI Development",
        tags: ["AI Development", "EdTech", "Next.js", "AI Integrations"],
        demoUrl: "https://courseehubb.vercel.app/",
        features: ["AI Course Creation", "Automated Quizzes", "Dynamic Content", "Student Dashboard"],
        techStack: ["Next.js", "OpenAI API", "HuggingFace", "PostgreSQL"],
        role: "AI Engineer",
        timeline: "3 Months",
        learnings: ["Prompt engineering", "Vector databases", "AI-driven UX"],
        mainImage: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=800",
        link: "https://courseehubb.vercel.app/"
    },
    {
        title: "Fitness Tracker",
        tagline: "Full Body Motion Tracking",
        description: "An advanced fitness tracking tool that monitors full body movements, counts pushups accurately, and provides real-time training feedback.",
        category: "Web Application",
        tags: ["Web Application", "Health & Fitness", "Motion Tracking", "AI"],
        demoUrl: "https://fitnesstracker-mu.vercel.app/",
        features: ["Pushup Counter", "Motion Analysis", "Full Body Tracking", "Training Insights"],
        techStack: ["React", "MediaPipe", "TensorFlow.js", "Chart.js"],
        role: "Frontend Developer",
        timeline: "2 Months",
        learnings: ["Computer vision on the web", "Real-time data visualization", "Performance tuning for AI"],
        mainImage: "https://images.unsplash.com/photo-1510076857177-7470076d4098?auto=format&fit=crop&q=80&w=800",
        link: "https://fitnesstracker-mu.vercel.app/"
    }
]

export async function GET() {
    try {
        console.log('🌱 Starting to seed projects...')
        const projectsRef = collection(db, 'projects')

        for (const project of projects) {
            await addDoc(projectsRef, {
                ...project,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            })
        }

        return NextResponse.json({
            success: true,
            message: `Successfully seeded ${projects.length} projects!`,
        })
    } catch (error) {
        console.error('Error seeding projects:', error)
        return NextResponse.json({
            success: false,
            error: 'Failed to seed projects',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}
