"use client"
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import MobileBottomNav from "@/components/mobile-bottom-nav";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Logo from "@/components/logo";

interface Project {
  id: string;
  title: string;
  tagline?: string;
  description?: string;
  mainImage?: string;
  category?: string;
  tags?: string[];
  link?: string;
  createdAt?: any;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const docRef = doc(db, "projects", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProject({ id: docSnap.id, ...docSnap.data() } as Project);
        } else {
          router.push("/projects");
        }
      } catch (error) {
        console.error("Error fetching project:", error);
        router.push("/projects");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProject();
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <main className="flex-grow pt-24 container mx-auto px-6">
          <Skeleton className="h-12 w-3/4 mb-8" />
          <Skeleton className="h-96 w-full rounded-2xl mb-8" />
          <div className="grid md:grid-cols-2 gap-8">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </main>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-6">
          <Button variant="ghost" onClick={() => router.back()} className="mb-8 pl-0 hover:bg-transparent text-muted-foreground hover:text-foreground group">
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
            Back to Projects
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative p-8 md:p-12 rounded-3xl overflow-hidden mb-12"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${project?.category ? "from-primary/10 to-accent/10" : "from-primary/10 to-accent/10"}`} style={{ opacity: 0.1 }} />
            <div className="absolute inset-0 backdrop-blur-3xl" />
            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div>
                {project.mainImage && (
                  <Image src={project.mainImage} alt={project.title} width={500} height={300} className="rounded-xl shadow-lg" />
                )}
                <h1 className="text-4xl md:text-5xl font-bold mb-6 mt-6">{project.title}</h1>
                {project.tagline && <p className="text-xl text-muted-foreground mb-4">{project.tagline}</p>}
                {project.description && <p className="text-lg text-muted-foreground mb-6">{project.description}</p>}
                <div className="flex items-center gap-4 mb-6">
                  {project.link && (
                    <Link href={project.link} target="_blank" rel="noopener noreferrer">
                      <Button size="lg" className="bg-gradient-to-r from-[#1565c0] via-[#81f5fd] to-[#81f5fd] text-primary-foreground">
                        Visit Site
                      </Button>
                    </Link>
                  )}
                </div>
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, i) => (
                      <Badge key={i} variant="secondary" className="px-4 py-2 text-sm bg-secondary/10 hover:bg-secondary/20 border-border/50">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
