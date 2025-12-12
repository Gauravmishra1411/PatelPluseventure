
"use client";

import MarketplaceHeader from "@/components/marketplace-header";
import MobileBottomNav from "@/components/mobile-bottom-nav";
import { ThemeProvider } from "@/components/theme-provider";
import { usePathname } from "next/navigation";

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isShopPage = pathname.startsWith('/marketplace/shop');

  return (
    <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
    >
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
          {!isShopPage && <MarketplaceHeader />}
          <main className={!isShopPage ? "pt-20" : ""}>
            {children}
          </main>
          <MobileBottomNav />
        </div>
    </ThemeProvider>
  );
}
