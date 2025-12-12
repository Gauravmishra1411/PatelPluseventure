
"use client"

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClientOnboardingForm } from "@/components/client-onboarding-form";
import Footer from "@/components/footer";
import MobileBottomNav from "@/components/mobile-bottom-nav";
import Navbar from "@/components/navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast.success("Logged in successfully!");
            router.push("/client");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card className="w-full max-w-md bg-card/50 border-primary/20 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-card-foreground text-center">Client Login</CardTitle>
                <CardDescription className="text-muted-foreground text-center">
                    Welcome back! Please login to your account.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="pl-10 bg-background/50 border-primary/20"
                        />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="pl-10 bg-background/50 border-primary/20"
                        />
                    </div>
                    <Button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground">
                        {isLoading ? "Logging in..." : "Login"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}


export default function OnboardingPage() {
    const [clientType, setClientType] = useState<"new" | "existing" | null>(null);

    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
            <Navbar />
            <main className="pt-24 pb-12 flex items-center justify-center">
                <AnimatePresence mode="wait">
                    {!clientType ? (
                        <motion.div
                            key="selection"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className="w-full max-w-md bg-card/50 border-primary/20 backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-bold text-card-foreground text-center">Welcome to Patel Pulse Ventures</CardTitle>
                                    <CardDescription className="text-muted-foreground text-center">
                                        Are you a new or existing client?
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex flex-col space-y-4">
                                    <Button onClick={() => setClientType("new")} className="bg-gradient-to-r from-primary to-accent text-primary-foreground h-12 text-base">
                                        I&apos;m a New Client
                                    </Button>
                                    <Button onClick={() => setClientType("existing")} variant="outline" className="border-border h-12 text-base">
                                        I&apos;m an Existing Client
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ) : clientType === 'new' ? (
                        <motion.div
                            key="onboarding-form"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.5 }}
                            className="w-full"
                        >
                            <ClientOnboardingForm />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="login-form"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.5 }}
                            className="w-full flex justify-center"
                        >
                            <LoginForm />
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
            <Footer />
            <MobileBottomNav />
        </div>
    )
}
