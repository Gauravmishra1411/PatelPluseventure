
"use client"

import NextImage from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { Logo } from "@/components/logo";
import FilterDrawer from "./filter-drawer";

export default function ShopHeader() {
  return (
    <header className="md:hidden sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16 gap-2">
                <Logo size="sm" href="/marketplace" />
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full h-10 pl-10 pr-4 rounded-full bg-muted border-none text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                </div>
                <FilterDrawer />
                 <Link href="/marketplace/profile">
                    <NextImage
                        src="https://placehold.co/40x40.png"
                        alt="User profile"
                        width={32}
                        height={32}
                        className="rounded-full"
                        data-ai-hint="person face"
                    />
                 </Link>
            </div>
        </div>
    </header>
  )
}
