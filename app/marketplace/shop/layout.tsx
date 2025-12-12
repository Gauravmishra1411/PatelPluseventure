
"use client";

import MarketplaceHeader from "@/components/marketplace-header";
import ShopHeader from "@/components/marketplace/shop-header";
import MobileBottomNav from "@/components/mobile-bottom-nav";
import { ThemeProvider } from "@/components/theme-provider";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
    >
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
          <div className="hidden md:block">
            <MarketplaceHeader />
          </div>
          <div className="md:hidden">
            <ShopHeader />
          </div>
          <main className="pt-20 md:pt-24 pb-24 md:pb-0">
            {children}
          </main>
          <MobileBottomNav />
        </div>
    </ThemeProvider>
  );
}
