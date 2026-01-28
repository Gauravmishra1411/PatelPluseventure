
"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion, Reorder } from "framer-motion"
import { db } from "@/lib/firebase"
import { collection, doc, getDoc, updateDoc, addDoc, setDoc, onSnapshot, deleteDoc, getDocs, writeBatch, query, orderBy } from "firebase/firestore"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { seedHomeHeroStats, seedHomeAboutStats } from "@/lib/seed-stats"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Target, Zap, Award, Code, Heart, Lightbulb, Rocket, Trash2, Edit, Plus, Save, Check, Star, Percent, GripVertical } from "lucide-react"
import Image from "next/image"

const iconComponents: { [key: string]: React.ElementType } = {
    Users, Target, Zap, Award, Code, Heart, Lightbulb, Rocket, Check, Star, Plus, Percent
}

const suffixOptions = ["none", "+", "%", "★"]

const seedValues = async () => {
    const seedData = [
        {
            title: "Future-Ready",
            description: "We build solutions that scale and adapt to tomorrow's challenges and opportunities.",
            icon: "Code"
        },
        {
            title: "Innovation First",
            description: "We embrace cutting-edge technologies and innovative solutions to stay ahead of the curve.",
            icon: "Code"
        }
    ];

    try {
        const collectionRef = collection(db, "about_values");

        let count = 0;
        for (const data of seedData) {
            await addDoc(collectionRef, data);
            count++;
        }
        toast.success(`Added ${count} core values.`);
    } catch (error) {
        console.error("Error seeding values:", error);
        toast.error("Failed to seed values.");
    }
}

const seedTeam = async () => {
    const teamData = [
        {
            name: "Deepika Rawat",
            role: "Co-Founder - CTO",
            bio: "Co-Founder, empowers Patel Pulse Ventures with visionary tech leadership.",
            skills: ["Leadership", "Tech Strategy", "Architecture"],
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
            order: 0
        },
        {
            name: "Adarsh Deep Sachan",
            role: "Founder",
            bio: "Visionary leader with extensive experience in technology and business growth.",
            skills: ["Leadership", "Business Strategy", "Innovation"],
            image: "https://res.cloudinary.com/djufxsut9/image/upload/v1763812483/team-mem...",
            order: 1
        },
        {
            name: "Anand Patel",
            role: "Director",
            bio: "Technical expert with deep knowledge in software architecture and systems.",
            skills: ["Architecture", "System Design", "Management"],
            image: "https://res.cloudinary.com/djufxsut9/image/upload/v1763812431/team-mem...",
            order: 2
        },
        {
            name: "Rohit Sengar",
            role: "Full Stack Developer",
            bio: "Dynamic sales professional with a proven track record of building strong client relationships.",
            skills: ["React", "Node.js", "Sales"],
            image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=400&q=80",
            order: 3
        },
        {
            name: "Yogesh Sengar",
            role: "Full Stack Developer",
            bio: "Creative UX engineer who bridges the gap between design and development.",
            skills: ["TypeScript", "Tailwind", "UX"],
            image: "https://images.unsplash.com/photo-1600878459138-e1123b37cb30?auto=format&fit=crop&w=400&q=80",
            order: 4
        },
        {
            name: "Shruti Sachan",
            role: "Interaction Designer",
            bio: "Talented interaction designer focused on creating seamless and delightful user experiences.",
            skills: ["Figma", "Prototyping", "User Research"],
            image: "https://alt.tailus.io/images/team/member-five.webp",
            order: 5
        },
        {
            name: "Rishav Chaturvedi",
            role: "Digital Marketer",
            bio: "Creative visual designer with an eye for aesthetics and brand consistency.",
            skills: ["SEO", "Content Marketing", "Visual Design"],
            image: "https://images.unsplash.com/photo-1562788869-4ed32648eb72?auto=format&fit=crop&w=400&q=80",
            order: 6
        }
    ];

    try {
        const collectionRef = collection(db, "about_team");

        // Wipe existing data to prevent duplicates
        const snapshot = await getDocs(collectionRef);
        const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deletePromises);

        // Add new data
        let count = 0;
        for (const data of teamData) {
            await addDoc(collectionRef, data);
            count++;
        }
        toast.success(`Reset and added ${count} team members successfully.`);
    } catch (error) {
        console.error("Error seeding team:", error);
        toast.error("Failed to seed team.");
    }
}

const seedStory = async () => {
    const storyData = {
        paragraphs: [
            "Founded with a vision to bridge the gap between imagination and execution, Patel Pulse Ventures has grown from a small team of passionate developers into a leading digital innovation agency.",
            "Our journey is defined by a relentless pursuit of excellence and a deep commitment to our clients' success. We believe that technology should not just solve problems but create new opportunities for growth.",
            "Today, we are proud to be a trusted partner for businesses worldwide, helping them navigate the digital landscape with confidence and creativity."
        ],
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
    };

    try {
        await setDoc(doc(db, "about_story", "main"), storyData);
        toast.success("Story content seeded successfully.");
    } catch (error) {
        console.error("Error seeding story:", error);
        toast.error("Failed to seed story.");
    }
}

export default function AdminAboutPage() {
    const [loading, setLoading] = useState(true)

    // Stats State
    const [stats, setStats] = useState<any[]>([])
    const [currentStat, setCurrentStat] = useState({ id: null, icon: 'Users', title: '', number: '', suffix: 'none' })
    const [isEditingStat, setIsEditingStat] = useState(false)

    // Home Hero Stats State
    const [homeHeroStats, setHomeHeroStats] = useState<any[]>([])
    const [currentHomeHeroStat, setCurrentHomeHeroStat] = useState({ id: null, icon: 'Users', title: '', number: '', suffix: 'none' })
    const [isEditingHomeHeroStat, setIsEditingHomeHeroStat] = useState(false)

    // Home About Stats State
    const [homeAboutStats, setHomeAboutStats] = useState<any[]>([])
    const [currentHomeAboutStat, setCurrentHomeAboutStat] = useState({ id: null, icon: 'Users', title: '', number: '', suffix: 'none' })
    const [isEditingHomeAboutStat, setIsEditingHomeAboutStat] = useState(false)

    // Story State
    const [story, setStory] = useState({ paragraphs: [""], image: "" })
    const [storyImageFile, setStoryImageFile] = useState<File | null>(null)
    const [storyImagePreview, setStoryImagePreview] = useState<string | null>(null)

    // Values State
    const [values, setValues] = useState<any[]>([])
    const [currentValue, setCurrentValue] = useState({ id: null, icon: 'Code', title: '', description: '' })
    const [isEditingValue, setIsEditingValue] = useState(false)

    // Team State
    const [team, setTeam] = useState<any[]>([])
    const [currentMember, setCurrentMember] = useState<{
        id: string | null;
        name: string;
        role: string;
        bio: string;
        skills: string | string[];
        image: string;
    }>({ id: null, name: '', role: '', bio: '', skills: '', image: '' })
    const [memberImageFile, setMemberImageFile] = useState<File | null>(null)
    const [memberImagePreview, setMemberImagePreview] = useState<string | null>(null)
    const [isEditingMember, setIsEditingMember] = useState(false)

    // Fetch all data
    useEffect(() => {
        setLoading(true);
        const unsubscribers: (() => void)[] = [];

        const fetchAndSubscribe = async () => {
            try {
                // Subscribe to Stats
                const statsUnsub = onSnapshot(collection(db, "about_stats"), (snapshot) => {
                    setStats(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                });
                unsubscribers.push(statsUnsub);

                // Subscribe to Home Hero Stats
                const homeHeroStatsUnsub = onSnapshot(collection(db, "home_hero_stats"), (snapshot) => {
                    setHomeHeroStats(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                });
                unsubscribers.push(homeHeroStatsUnsub);

                // Subscribe to Home About Stats
                const homeAboutStatsUnsub = onSnapshot(collection(db, "home_about_stats"), (snapshot) => {
                    setHomeAboutStats(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                });
                unsubscribers.push(homeAboutStatsUnsub);

                // Fetch Story
                const storyDoc = await getDoc(doc(db, "about_story", "main"));
                if (storyDoc.exists()) {
                    const data = storyDoc.data();
                    setStory(data as any);
                    setStoryImagePreview(data.image);
                }

                // Subscribe to Values
                const valuesUnsub = onSnapshot(collection(db, "about_values"), (snapshot) => {
                    setValues(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                });
                unsubscribers.push(valuesUnsub);

                // Subscribe to Team
                const teamUnsub = onSnapshot(collection(db, "about_team"), (snapshot) => {
                    const loadedTeam = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
                    // Sort by order, putting items without order at the end
                    loadedTeam.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
                    setTeam(loadedTeam);
                });
                unsubscribers.push(teamUnsub);

            } catch (error) {
                console.error("Error fetching about page data:", error);
                toast.error("Failed to load about page data.");
            } finally {
                setLoading(false);
            }
        };

        fetchAndSubscribe();

        return () => {
            unsubscribers.forEach(unsub => unsub());
        };
    }, []);

    const uploadImage = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await fetch('/api/upload', { method: 'POST', body: formData });
            if (!response.ok) throw new Error('Upload failed');
            const data = await response.json();
            return data.url;
        } catch (error) {
            console.error("Error uploading image:", error);
            toast.error(`Failed to upload ${file.name}`);
            return null;
        }
    };


    // --- Handlers ---
    const handleStatSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const statDataToSave = {
            ...currentStat,
            suffix: currentStat.suffix === 'none' ? '' : currentStat.suffix
        };
        const { id, ...statData } = statDataToSave;

        try {
            if (isEditingStat && id) {
                await updateDoc(doc(db, "about_stats", id), statData);
                toast.success("Stat updated successfully!");
            } else {
                await addDoc(collection(db, "about_stats"), statData);
                toast.success("Stat added successfully!");
            }
            setCurrentStat({ id: null, icon: 'Users', title: '', number: '', suffix: 'none' });
            setIsEditingStat(false);
        } catch (error) {
            toast.error(`Failed to ${isEditingStat ? 'update' : 'add'} stat.`);
        }
    };

    const handleEditStat = (stat: any) => {
        setCurrentStat({ ...stat, suffix: stat.suffix || 'none' });
        setIsEditingStat(true);
    };
    const handleDeleteStat = async (id: string) => {
        if (window.confirm("Are you sure?")) {
            await deleteDoc(doc(db, "about_stats", id));
            toast.success("Stat deleted.");
        }
    };

    const handleHomeHeroStatSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const statDataToSave = {
            ...currentHomeHeroStat,
            suffix: currentHomeHeroStat.suffix === 'none' ? '' : currentHomeHeroStat.suffix
        };
        const { id, ...statData } = statDataToSave;

        try {
            if (isEditingHomeHeroStat && id) {
                await updateDoc(doc(db, "home_hero_stats", id), statData);
                toast.success("Home Hero Stat updated successfully!");
            } else {
                await addDoc(collection(db, "home_hero_stats"), statData);
                toast.success("Home Hero Stat added successfully!");
            }
            setCurrentHomeHeroStat({ id: null, icon: 'Users', title: '', number: '', suffix: 'none' });
            setIsEditingHomeHeroStat(false);
        } catch (error) {
            toast.error(`Failed to ${isEditingHomeHeroStat ? 'update' : 'add'} home hero stat.`);
        }
    };
    const handleEditHomeHeroStat = (stat: any) => {
        setCurrentHomeHeroStat({ ...stat, suffix: stat.suffix || 'none' });
        setIsEditingHomeHeroStat(true);
    };
    const handleDeleteHomeHeroStat = async (id: string) => {
        if (window.confirm("Are you sure?")) {
            await deleteDoc(doc(db, "home_hero_stats", id));
            toast.success("Home Hero Stat deleted.");
        }
    };

    const handleHomeAboutStatSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const statDataToSave = {
            ...currentHomeAboutStat,
            suffix: currentHomeAboutStat.suffix === 'none' ? '' : currentHomeAboutStat.suffix
        };
        const { id, ...statData } = statDataToSave;

        try {
            if (isEditingHomeAboutStat && id) {
                await updateDoc(doc(db, "home_about_stats", id), statData);
                toast.success("Home About Stat updated successfully!");
            } else {
                await addDoc(collection(db, "home_about_stats"), statData);
                toast.success("Home About Stat added successfully!");
            }
            setCurrentHomeAboutStat({ id: null, icon: 'Users', title: '', number: '', suffix: 'none' });
            setIsEditingHomeAboutStat(false);
        } catch (error) {
            toast.error(`Failed to ${isEditingHomeAboutStat ? 'update' : 'add'} home about stat.`);
        }
    };
    const handleEditHomeAboutStat = (stat: any) => {
        setCurrentHomeAboutStat({ ...stat, suffix: stat.suffix || 'none' });
        setIsEditingHomeAboutStat(true);
    };
    const handleDeleteHomeAboutStat = async (id: string) => {
        if (window.confirm("Are you sure?")) {
            await deleteDoc(doc(db, "home_about_stats", id));
            toast.success("Home About Stat deleted.");
        }
    };

    const handleStoryParagraphChange = (index: number, value: string) => {
        const newParagraphs = [...story.paragraphs];
        newParagraphs[index] = value;
        setStory(prev => ({ ...prev, paragraphs: newParagraphs }));
    };

    const addStoryParagraph = () => setStory(prev => ({ ...prev, paragraphs: [...prev.paragraphs, ""] }));
    const removeStoryParagraph = (index: number) => setStory(prev => ({ ...prev, paragraphs: prev.paragraphs.filter((_, i) => i !== index) }));

    const handleStoryImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setStoryImageFile(file);
            setStoryImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSaveStory = async () => {
        try {
            let imageUrl = story.image;
            if (storyImageFile) {
                imageUrl = await uploadImage(storyImageFile) || story.image;
            }
            await updateDoc(doc(db, "about_story", "main"), { ...story, image: imageUrl });
            toast.success("Story updated successfully!");
        } catch (error) {
            toast.error("Failed to update story.");
        }
    };

    const handleValueSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { id, ...valueData } = currentValue;
        try {
            if (isEditingValue && id) {
                await updateDoc(doc(db, "about_values", id), valueData);
                toast.success("Value updated successfully!");
            } else {
                await addDoc(collection(db, "about_values"), valueData);
                toast.success("Value added successfully!");
            }
            setCurrentValue({ id: null, icon: 'Code', title: '', description: '' });
            setIsEditingValue(false);
        } catch (error) {
            toast.error(`Failed to ${isEditingValue ? 'update' : 'add'} value.`);
        }
    };

    const handleEditValue = (value: any) => {
        setCurrentValue(value);
        setIsEditingValue(true);
    };
    const handleDeleteValue = async (id: string) => {
        if (window.confirm("Are you sure?")) {
            await deleteDoc(doc(db, "about_values", id));
            toast.success("Value deleted.");
        }
    };

    const handleMemberSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            let imageUrl = currentMember.image;
            if (memberImageFile) {
                imageUrl = await uploadImage(memberImageFile) || currentMember.image;
            }

            const skillsArray = typeof currentMember.skills === 'string'
                ? currentMember.skills.split(',').map(s => s.trim())
                : currentMember.skills;

            if (isEditingMember && currentMember.id) {
                const { id, ...memberData } = { ...currentMember, image: imageUrl, skills: skillsArray };
                await updateDoc(doc(db, "about_team", id as string), memberData);
                toast.success("Team member updated successfully!");
            } else {
                // For new members, calculate the next order
                const nextOrder = team.length > 0
                    ? Math.max(...team.map(m => m.order ?? 0)) + 1
                    : 0;

                const { id, ...memberData } = {
                    ...currentMember,
                    image: imageUrl,
                    skills: skillsArray,
                    order: nextOrder
                };
                await addDoc(collection(db, "about_team"), memberData);
                toast.success("Team member added successfully!");
            }

            setCurrentMember({ id: null, name: '', role: '', bio: '', skills: '', image: '' });
            setMemberImageFile(null);
            setMemberImagePreview(null);
            setIsEditingMember(false);
        } catch (error) {
            console.error("Error saving team member:", error);
            toast.error(`Failed to ${isEditingMember ? 'update' : 'add'} team member.`);
        }
    };

    const handleEditMember = (member: any) => {
        setCurrentMember({ ...member, skills: member.skills.join(', ') });
        setMemberImagePreview(member.image);
        setIsEditingMember(true);
    };

    const handleDeleteMember = async (id: string) => {
        if (window.confirm("Are you sure?")) {
            await deleteDoc(doc(db, "about_team", id));
            toast.success("Member deleted.");
        }
    };

    const handleMemberImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setMemberImageFile(file);
            setMemberImagePreview(URL.createObjectURL(file));
        }
    };

    const handleReorderTeam = async (newOrder: any[]) => {
        setTeam(newOrder); // Update local state immediately for smooth UI
        try {
            const batch = writeBatch(db);
            newOrder.forEach((item, index) => {
                const docRef = doc(db, "about_team", item.id);
                batch.update(docRef, { order: index });
            });
            await batch.commit();
        } catch (error) {
            console.error("Error reordering team:", error);
            toast.error("Failed to save team order.");
        }
    };

    if (loading) {
        return <div className="min-h-screen bg-background flex items-center justify-center text-foreground">Loading About Page Content...</div>
    }

    return (
        <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <h1 className="text-3xl font-bold text-center">Manage About & Home Page Content</h1>

                {/* About Page Stats Section */}
                <Card className="bg-card border-border">
                    <CardHeader><CardTitle>About Page Stats</CardTitle></CardHeader>
                    <CardContent className="grid lg:grid-cols-2 gap-8">
                        <div>
                            <h3 className="font-semibold mb-4">{isEditingStat ? 'Edit' : 'Add'} Stat</h3>
                            <form onSubmit={handleStatSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="stat-icon" className="text-foreground">Icon</Label>
                                        <Select value={currentStat.icon} onValueChange={(val) => setCurrentStat(p => ({ ...p, icon: val }))}>
                                            <SelectTrigger className="bg-input border-input text-foreground"><SelectValue /></SelectTrigger>
                                            <SelectContent className="bg-popover border-border">
                                                {Object.keys(iconComponents).map(name => {
                                                    const Icon = iconComponents[name];
                                                    return <SelectItem key={name} value={name} className="text-foreground hover:bg-secondary focus:bg-secondary">
                                                        <div className="flex items-center gap-2"><Icon className="w-4 h-4" /> {name}</div>
                                                    </SelectItem>
                                                })}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2"><Label htmlFor="stat-title" className="text-foreground">Title</Label><Input id="stat-title" value={currentStat.title} onChange={e => setCurrentStat(p => ({ ...p, title: e.target.value }))} required className="bg-input border-input text-foreground" /></div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2"><Label htmlFor="stat-number" className="text-foreground">Number</Label><Input id="stat-number" type="text" value={currentStat.number} onChange={e => setCurrentStat(p => ({ ...p, number: e.target.value }))} required className="bg-input border-input text-foreground" /></div>
                                    <div className="space-y-2">
                                        <Label htmlFor="stat-suffix" className="text-foreground">Suffix</Label>
                                        <Select value={currentStat.suffix} onValueChange={(val) => setCurrentStat(p => ({ ...p, suffix: val }))}>
                                            <SelectTrigger className="bg-input border-input text-foreground"><SelectValue placeholder="None" /></SelectTrigger>
                                            <SelectContent className="bg-popover border-border">
                                                {suffixOptions.map(name => (
                                                    <SelectItem key={name} value={name} className="text-foreground hover:bg-secondary focus:bg-secondary">
                                                        {name === 'none' ? "None" : name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">{isEditingStat ? 'Update' : 'Add'} Stat</Button>
                                {isEditingStat && <Button variant="ghost" className="text-muted-foreground hover:text-foreground" onClick={() => { setIsEditingStat(false); setCurrentStat({ id: null, icon: 'Users', title: '', number: '', suffix: 'none' }); }}>Cancel</Button>}
                            </form>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">Existing Stats</h3>
                            <div className="space-y-2">
                                {stats.map(s => {
                                    const Icon = iconComponents[s.icon];
                                    return <div key={s.id} className="flex justify-between items-center p-2 bg-secondary/50 rounded-md">
                                        <div className="flex items-center gap-3">
                                            {Icon && <Icon className="w-5 h-5 text-primary" />}
                                            <div>
                                                <p className="font-bold text-foreground">{s.title}</p>
                                                <p className="text-sm text-muted-foreground">{s.number}{s.suffix}</p>
                                            </div>
                                        </div>
                                        <div className="space-x-2">
                                            <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-foreground" onClick={() => handleEditStat(s)}><Edit className="w-4 h-4" /></Button>
                                            <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive/90" onClick={() => handleDeleteStat(s.id)}><Trash2 className="w-4 h-4" /></Button>
                                        </div>
                                    </div>
                                })}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Home Page Hero Stats Section */}
                <Card className="bg-card border-border">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Home Page Hero Stats</CardTitle>
                        <Button onClick={seedHomeHeroStats} variant="outline" size="sm" className="ml-auto">
                            <Plus className="w-4 h-4 mr-2" /> Auto Fill
                        </Button>
                    </CardHeader>
                    <CardContent className="grid lg:grid-cols-2 gap-8">
                        <div>
                            <h3 className="font-semibold mb-4">{isEditingHomeHeroStat ? 'Edit' : 'Add'} Stat</h3>
                            <form onSubmit={handleHomeHeroStatSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="home-hero-stat-icon" className="text-foreground">Icon</Label>
                                        <Select value={currentHomeHeroStat.icon} onValueChange={(val) => setCurrentHomeHeroStat(p => ({ ...p, icon: val }))}>
                                            <SelectTrigger className="bg-input border-input text-foreground"><SelectValue /></SelectTrigger>
                                            <SelectContent className="bg-popover border-border">
                                                {Object.keys(iconComponents).map(name => {
                                                    const Icon = iconComponents[name];
                                                    return <SelectItem key={name} value={name} className="text-foreground hover:bg-secondary focus:bg-secondary">
                                                        <div className="flex items-center gap-2"><Icon className="w-4 h-4" /> {name}</div>
                                                    </SelectItem>
                                                })}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2"><Label htmlFor="home-hero-stat-title" className="text-foreground">Title</Label><Input id="home-hero-stat-title" value={currentHomeHeroStat.title} onChange={e => setCurrentHomeHeroStat(p => ({ ...p, title: e.target.value }))} required className="bg-input border-input text-foreground" /></div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2"><Label htmlFor="home-hero-stat-number" className="text-foreground">Number</Label><Input id="home-hero-stat-number" type="text" value={currentHomeHeroStat.number} onChange={e => setCurrentHomeHeroStat(p => ({ ...p, number: e.target.value }))} required className="bg-input border-input text-foreground" /></div>
                                    <div className="space-y-2">
                                        <Label htmlFor="home-hero-stat-suffix" className="text-foreground">Suffix</Label>
                                        <Select value={currentHomeHeroStat.suffix} onValueChange={(val) => setCurrentHomeHeroStat(p => ({ ...p, suffix: val }))}>
                                            <SelectTrigger className="bg-input border-input text-foreground"><SelectValue placeholder="None" /></SelectTrigger>
                                            <SelectContent className="bg-popover border-border">
                                                {suffixOptions.map(name => (
                                                    <SelectItem key={name} value={name} className="text-foreground hover:bg-secondary focus:bg-secondary">
                                                        {name === 'none' ? "None" : name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">{isEditingHomeHeroStat ? 'Update' : 'Add'} Stat</Button>
                                {isEditingHomeHeroStat && <Button variant="ghost" className="text-muted-foreground hover:text-foreground" onClick={() => { setIsEditingHomeHeroStat(false); setCurrentHomeHeroStat({ id: null, icon: 'Users', title: '', number: '', suffix: 'none' }); }}>Cancel</Button>}
                            </form>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">Existing Home Hero Stats</h3>
                            <div className="space-y-2">
                                {homeHeroStats.map(s => {
                                    const Icon = iconComponents[s.icon];
                                    return <div key={s.id} className="flex justify-between items-center p-2 bg-secondary/50 rounded-md">
                                        <div className="flex items-center gap-3">
                                            {Icon && <Icon className="w-5 h-5 text-primary" />}
                                            <div>
                                                <p className="font-bold text-foreground">{s.title}</p>
                                                <p className="text-sm text-muted-foreground">{s.number}{s.suffix}</p>
                                            </div>
                                        </div>
                                        <div className="space-x-2">
                                            <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-foreground" onClick={() => handleEditHomeHeroStat(s)}><Edit className="w-4 h-4" /></Button>
                                            <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive/90" onClick={() => handleDeleteHomeHeroStat(s.id)}><Trash2 className="w-4 h-4" /></Button>
                                        </div>
                                    </div>
                                })}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Home Page About Section Stats */}
                <Card className="bg-card border-border">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Home Page &apos;About&apos; Section Stats</CardTitle>
                        <Button onClick={seedHomeAboutStats} variant="outline" size="sm" className="ml-auto">
                            <Plus className="w-4 h-4 mr-2" /> Auto Fill
                        </Button>
                    </CardHeader>
                    <CardContent className="grid lg:grid-cols-2 gap-8">
                        <div>
                            <h3 className="font-semibold mb-4">{isEditingHomeAboutStat ? 'Edit' : 'Add'} Stat</h3>
                            <form onSubmit={handleHomeAboutStatSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="home-about-stat-icon" className="text-foreground">Icon</Label>
                                        <Select value={currentHomeAboutStat.icon} onValueChange={(val) => setCurrentHomeAboutStat(p => ({ ...p, icon: val }))}>
                                            <SelectTrigger className="bg-input border-input text-foreground"><SelectValue /></SelectTrigger>
                                            <SelectContent className="bg-gray-800 border-gray-700">
                                                {Object.keys(iconComponents).map(name => {
                                                    const Icon = iconComponents[name];
                                                    return <SelectItem key={name} value={name} className="text-foreground hover:bg-secondary focus:bg-secondary">
                                                        <div className="flex items-center gap-2"><Icon className="w-4 h-4" /> {name}</div>
                                                    </SelectItem>
                                                })}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2"><Label htmlFor="home-about-stat-title" className="text-foreground">Title</Label><Input id="home-about-stat-title" value={currentHomeAboutStat.title} onChange={e => setCurrentHomeAboutStat(p => ({ ...p, title: e.target.value }))} required className="bg-input border-input text-foreground" /></div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2"><Label htmlFor="home-about-stat-number" className="text-foreground">Number</Label><Input id="home-about-stat-number" type="text" value={currentHomeAboutStat.number} onChange={e => setCurrentHomeAboutStat(p => ({ ...p, number: e.target.value }))} required className="bg-input border-input text-foreground" /></div>
                                    <div className="space-y-2">
                                        <Label htmlFor="home-about-stat-suffix" className="text-foreground">Suffix</Label>
                                        <Select value={currentHomeAboutStat.suffix} onValueChange={(val) => setCurrentHomeAboutStat(p => ({ ...p, suffix: val }))}>
                                            <SelectTrigger className="bg-input border-input text-foreground"><SelectValue placeholder="None" /></SelectTrigger>
                                            <SelectContent className="bg-gray-800 border-gray-700">
                                                {suffixOptions.map(name => (
                                                    <SelectItem key={name} value={name} className="text-foreground hover:bg-secondary focus:bg-secondary">
                                                        {name === 'none' ? "None" : name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">{isEditingHomeAboutStat ? 'Update' : 'Add'} Stat</Button>
                                {isEditingHomeAboutStat && <Button variant="ghost" className="text-muted-foreground hover:text-foreground" onClick={() => { setIsEditingHomeAboutStat(false); setCurrentHomeAboutStat({ id: null, icon: 'Users', title: '', number: '', suffix: 'none' }); }}>Cancel</Button>}
                            </form>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">Existing Home &apos;About&apos; Stats</h3>
                            <div className="space-y-2">
                                {homeAboutStats.map(s => {
                                    const Icon = iconComponents[s.icon];
                                    return <div key={s.id} className="flex justify-between items-center p-2 bg-secondary/50 rounded-md">
                                        <div className="flex items-center gap-3">
                                            {Icon && <Icon className="w-5 h-5 text-primary" />}
                                            <div>
                                                <p className="font-bold text-foreground">{s.title}</p>
                                                <p className="text-sm text-muted-foreground">{s.number}{s.suffix}</p>
                                            </div>
                                        </div>
                                        <div className="space-x-2">
                                            <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-foreground" onClick={() => handleEditHomeAboutStat(s)}><Edit className="w-4 h-4" /></Button>
                                            <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive/90" onClick={() => handleDeleteHomeAboutStat(s.id)}><Trash2 className="w-4 h-4" /></Button>
                                        </div>
                                    </div>
                                })}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Story Section */}
                <Card className="bg-card border-border">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Our Story</CardTitle>
                            <CardDescription className="text-muted-foreground">Manage the story section content.</CardDescription>
                        </div>
                        <Button onClick={seedStory} variant="outline" size="sm">
                            <Plus className="w-4 h-4 mr-2" /> Auto Fill
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label className="text-foreground">Story Paragraphs</Label>
                            {story.paragraphs.map((p, i) => (
                                <div key={i} className="flex items-center gap-2 mb-2">
                                    <Textarea value={p} onChange={(e) => handleStoryParagraphChange(i, e.target.value)} rows={3} className="bg-input border-input text-foreground" />
                                    <Button variant="destructive" size="icon" onClick={() => removeStoryParagraph(i)}><Trash2 className="w-4 h-4" /></Button>
                                </div>
                            ))}
                            <Button onClick={addStoryParagraph} variant="outline" className="mt-2 border-primary/30 text-primary hover:bg-primary/10 bg-transparent"><Plus className="w-4 h-4 mr-2" />Add Paragraph</Button>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="storyImage" className="text-foreground">Main Image</Label>
                            <Input id="storyImage" type="file" onChange={handleStoryImageChange} className="bg-input border-input text-foreground" />
                            {storyImagePreview && <Image src={storyImagePreview} alt="Story preview" width={200} height={150} className="mt-2 rounded-md" />}
                        </div>
                        <Button onClick={handleSaveStory} className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground"><Save className="w-4 h-4 mr-2" />Save Story</Button>
                    </CardContent>
                </Card>

                {/* Values Section */}
                <div className="grid lg:grid-cols-2 gap-8">
                    <Card className="bg-card border-border">
                        <CardHeader><CardTitle>{isEditingValue ? 'Edit' : 'Add'} Core Value</CardTitle></CardHeader>
                        <CardContent>
                            <form onSubmit={handleValueSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="value-icon" className="text-foreground">Icon</Label>
                                    <Select value={currentValue.icon} onValueChange={(val) => setCurrentValue(p => ({ ...p, icon: val }))}>
                                        <SelectTrigger className="bg-input border-input text-foreground"><SelectValue /></SelectTrigger>
                                        <SelectContent className="bg-popover border-border">
                                            {Object.keys(iconComponents).map(name => {
                                                const Icon = iconComponents[name];
                                                return <SelectItem key={name} value={name} className="text-foreground hover:bg-secondary focus:bg-secondary">
                                                    <div className="flex items-center gap-2"><Icon className="w-4 h-4" /> {name}</div>
                                                </SelectItem>
                                            })}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2"><Label htmlFor="value-title" className="text-foreground">Title</Label><Input id="value-title" value={currentValue.title} onChange={e => setCurrentValue(p => ({ ...p, title: e.target.value }))} required className="bg-input border-input text-foreground" /></div>
                                <div className="space-y-2"><Label htmlFor="value-desc" className="text-foreground">Description</Label><Textarea id="value-desc" value={currentValue.description} onChange={e => setCurrentValue(p => ({ ...p, description: e.target.value }))} required className="bg-input border-input text-foreground" /></div>
                                <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">{isEditingValue ? 'Update' : 'Add'} Value</Button>
                                {isEditingValue && <Button variant="ghost" className="text-muted-foreground hover:text-foreground" onClick={() => { setIsEditingValue(false); setCurrentValue({ id: null, icon: 'Code', title: '', description: '' }); }}>Cancel</Button>}
                            </form>
                        </CardContent>
                    </Card>
                    <Card className="bg-card border-border">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Existing Values</CardTitle>
                            <Button onClick={seedValues} variant="outline" size="sm" className="ml-auto">
                                <Plus className="w-4 h-4 mr-2" /> Auto Fill
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {values.map(v => {
                                const Icon = iconComponents[v.icon];
                                return <div key={v.id} className="flex justify-between items-center p-2 bg-secondary/50 rounded-md">
                                    <div className="flex items-center gap-2 text-foreground">{Icon && <Icon className="w-5 h-5 text-primary" />}{v.title}</div>
                                    <div className="space-x-2">
                                        <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-foreground" onClick={() => handleEditValue(v)}><Edit className="w-4 h-4" /></Button>
                                        <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive/90" onClick={() => handleDeleteValue(v.id)}><Trash2 className="w-4 h-4" /></Button>
                                    </div>
                                </div>
                            })}
                        </CardContent>
                    </Card>
                </div>

                {/* Team Section */}
                <div className="grid lg:grid-cols-2 gap-8">
                    <Card className="bg-card border-border">
                        <CardHeader><CardTitle>{isEditingMember ? 'Edit' : 'Add'} Team Member</CardTitle></CardHeader>
                        <CardContent>
                            <form onSubmit={handleMemberSubmit} className="space-y-4">
                                <div className="space-y-2"><Label className="text-foreground">Name</Label><Input value={currentMember.name} onChange={e => setCurrentMember(p => ({ ...p, name: e.target.value }))} required className="bg-input border-input text-foreground" /></div>
                                <div className="space-y-2"><Label className="text-foreground">Role</Label><Input value={currentMember.role} onChange={e => setCurrentMember(p => ({ ...p, role: e.target.value }))} required className="bg-input border-input text-foreground" /></div>
                                <div className="space-y-2"><Label className="text-foreground">Bio</Label><Textarea value={currentMember.bio} onChange={e => setCurrentMember(p => ({ ...p, bio: e.target.value }))} required className="bg-input border-input text-foreground" /></div>
                                <div className="space-y-2"><Label className="text-foreground">Skills (comma-separated)</Label><Input value={currentMember.skills} onChange={e => setCurrentMember(p => ({ ...p, skills: e.target.value }))} required className="bg-input border-input text-foreground" /></div>
                                <div className="space-y-2">
                                    <Label className="text-foreground">Image</Label><Input type="file" onChange={handleMemberImageChange} className="bg-input border-input text-foreground" />
                                    {memberImagePreview && <Image src={memberImagePreview} alt="Member preview" width={100} height={100} className="mt-2 rounded-full" />}
                                </div>
                                <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">{isEditingMember ? 'Update' : 'Add'} Member</Button>
                                {isEditingMember && <Button variant="ghost" className="text-muted-foreground hover:text-foreground" onClick={() => { setIsEditingMember(false); setCurrentMember({ id: null, name: '', role: '', bio: '', skills: '', image: '' }); setMemberImagePreview(null); }}>Cancel</Button>}
                            </form>
                        </CardContent>
                    </Card>
                    <Card className="bg-card border-border">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Current Team</CardTitle>
                            <Button onClick={seedTeam} variant="outline" size="sm" className="ml-auto">
                                <Plus className="w-4 h-4 mr-2" /> Auto Fill
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Reorder.Group axis="y" values={team} onReorder={handleReorderTeam}>
                                {team.map(m => (
                                    <Reorder.Item key={m.id} value={m}>
                                        <div className="flex justify-between items-center p-2 bg-secondary/50 rounded-md mb-2 cursor-grab active:cursor-grabbing border border-transparent hover:border-primary/20 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <GripVertical className="w-4 h-4 text-muted-foreground" />
                                                <Image src={m.image || '/placeholder.svg'} alt={m.name} width={40} height={40} className="rounded-full object-cover w-10 h-10" />
                                                <div>
                                                    <p className="font-bold text-foreground">{m.name}</p>
                                                    <p className="text-sm text-muted-foreground">{m.role}</p>
                                                </div>
                                            </div>
                                            <div className="space-x-2 flex items-center">
                                                <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-foreground" onClick={(e) => { e.stopPropagation(); handleEditMember(m); }} onPointerDown={(e) => e.stopPropagation()}><Edit className="w-4 h-4" /></Button>
                                                <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive/90" onClick={(e) => { e.stopPropagation(); handleDeleteMember(m.id); }} onPointerDown={(e) => e.stopPropagation()}><Trash2 className="w-4 h-4" /></Button>
                                            </div>
                                        </div>
                                    </Reorder.Item>
                                ))}
                            </Reorder.Group>
                        </CardContent>
                    </Card>
                </div>


            </div>
        </div>
    )
}
