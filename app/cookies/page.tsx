"use client"

import { motion } from "framer-motion"
import { Cookie, Shield, Settings, ListChecks, XCircle, Info } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import MobileBottomNav from "@/components/mobile-bottom-nav"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"

export default function CookiePolicy() {
  const [necessaryCookies, setNecessaryCookies] = useState(true)
  const [analyticsCookies, setAnalyticsCookies] = useState(false)
  const [marketingCookies, setMarketingCookies] = useState(false)

  const handleSavePreferences = () => {
    // In a real implementation, you would save these preferences
    alert('Your cookie preferences have been saved.')
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-16 relative overflow-hidden">
          <div className="container mx-auto px-6">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex justify-center mb-6">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-primary to-accent text-primary-foreground">
                  <Cookie className="h-8 w-8" />
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Cookie Policy
                </span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Last Updated: September 2, 2024
              </p>
            </motion.div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12 bg-secondary/5 relative">
          <div className="container mx-auto px-6 max-w-4xl">
            <motion.div
              className="prose prose-invert max-w-none"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="space-y-8">
                <div className="bg-secondary/10 p-6 rounded-xl border border-primary/20">
                  <h2 className="text-2xl font-bold mb-4 flex items-center text-foreground">
                    <Info className="mr-2 h-6 w-6 text-primary" />
                    About Cookies
                  </h2>
                  <p className="text-muted-foreground">
                    Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and enabling certain functionality.
                  </p>
                </div>

                <div className="bg-secondary/10 p-6 rounded-xl border border-primary/20">
                  <h2 className="text-2xl font-bold mb-6 text-foreground">Cookie Preferences</h2>

                  <div className="space-y-6">
                    {/* Necessary Cookies */}
                    <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border/50">
                      <div>
                        <h3 className="font-medium flex items-center text-foreground">
                          <Shield className="h-5 w-5 text-primary mr-2" />
                          Necessary Cookies
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">Essential for the website to function properly</p>
                      </div>
                      <Switch
                        checked={necessaryCookies}
                        onCheckedChange={setNecessaryCookies}
                        disabled
                        className="data-[state=checked]:bg-primary"
                      />
                    </div>

                    {/* Analytics Cookies */}
                    <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border/50">
                      <div>
                        <h3 className="font-medium flex items-center text-foreground">
                          <ListChecks className="h-5 w-5 text-sky-500 mr-2" />
                          Analytics Cookies
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">Help us understand how visitors interact with our website</p>
                      </div>
                      <Switch
                        checked={analyticsCookies}
                        onCheckedChange={setAnalyticsCookies}
                        className="data-[state=checked]:bg-sky-500"
                      />
                    </div>

                    {/* Marketing Cookies */}
                    <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border/50">
                      <div>
                        <h3 className="font-medium flex items-center text-foreground">
                          <Settings className="h-5 w-5 text-pink-500 mr-2" />
                          Marketing Cookies
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">Used to track visitors across websites for advertising purposes</p>
                      </div>
                      <Switch
                        checked={marketingCookies}
                        onCheckedChange={setMarketingCookies}
                        className="data-[state=checked]:bg-pink-500"
                      />
                    </div>

                    <button
                      onClick={handleSavePreferences}
                      className="w-full py-3 px-6 bg-gradient-to-r from-primary to-accent text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Save Preferences
                    </button>
                  </div>
                </div>

                <div className="bg-secondary/10 p-6 rounded-xl border border-primary/20">
                  <h2 className="text-2xl font-bold mb-4 flex items-center text-foreground">
                    <XCircle className="mr-2 h-6 w-6 text-primary" />
                    Managing Cookies
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    You can manage your cookie preferences at any time using the controls above. Additionally, most web browsers allow you to control cookies through their settings preferences. However, if you limit the ability of websites to set cookies, you may worsen your overall user experience.
                  </p>
                </div>

                <div className="text-center text-muted-foreground text-sm mt-8">
                  <p>For more information about our privacy practices, please see our <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  )
}
