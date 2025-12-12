
"use client"

import React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ArrowRight, Check, Send, UploadCloud, User, Briefcase, Mail, Phone, Building, FileText, Palette, Link as LinkIcon, Code, Database, Shield, DollarSign, CreditCard, Repeat, Sparkles, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { db } from "@/lib/firebase";
import { collection, doc, serverTimestamp, setDoc, addDoc, updateDoc } from "firebase/firestore";
import Image from "next/image";

const steps = [
  { id: 1, title: "Personal & Business", icon: User },
  { id: 2, title: "Project Info", icon: Briefcase },
  { id: 3, title: "Design & Content", icon: Palette },
  { id: 4, title: "Technical & Payment", icon: Code },
  { id: 5, title: "Review & Submit", icon: Check },
];

const initialFormData = {
  // Step 1
  fullName: "",
  email: "",
  phone: "",
  companyName: "",
  designation: "",
  invoicingAddress: "",
  gstNumber: "",
  communicationMethod: "Email",
  // Step 2
  projectTitle: "",
  projectDescription: "",
  mustHaveFeatures: "",
  optionalFeatures: "",
  targetPlatforms: [] as string[],
  loginTypes: [] as string[],
  adminDashboard: "No",
  logoBranding: "No",
  // Step 3
  existingDesign: "No",
  designFile: null as File | null,
  designFileUrl: "",
  designService: "No",
  colorScheme: "",
  exampleSites: "",
  contentProvider: "Client",
  existingContent: "No",
  // Step 4
  hostingPreference: "",
  domainName: "",
  dataToCollect: "",
  privacyNeeds: "",
  budgetRange: "",
  paymentMethod: "Bank Transfer",
  billingCycle: "Milestone",
  designFile: null as File | null,
};

interface ClientOnboardingFormProps {
  isAdmin?: boolean;
  initialData?: any;
  clientId?: string;
}

export function ClientOnboardingForm({ isAdmin = false, initialData, clientId }: ClientOnboardingFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(() => {
    if (initialData) {
      // Merge initial data, ensuring default values for missing fields to avoid uncontrolled/controlled errors
      // Also handle array conversion if necessary? Firestore stores arrays as arrays, so it should be fine.
      // 'designFile' is not stored in Firestore (url is), so it remains null.
      return { ...initialFormData, ...initialData, designFile: null };
    }
    return initialFormData;
  });
  const [designFilePreview, setDesignFilePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, steps.length));
  const handlePrev = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  const handleCheckboxChange = (name: keyof typeof initialFormData, checked: boolean, value: string) => {
    setFormData(prev => {
      const field = prev[name] as string[];
      if (checked) {
        return { ...prev, [name]: [...field, value] };
      } else {
        return { ...prev, [name]: field.filter(item => item !== value) };
      }
    });
  }

  const handleDesignFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, designFile: file }));
      setDesignFilePreview(URL.createObjectURL(file));
    }
  }

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

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      let fileUrl = "";
      // Handle file upload
      if (formData.designFile) {
        // Assume uploadImage is defined/imported or handled. Wait, uploadImage is NOT defined in this file?
        // Ah, in previous tool output (view_file of AddProject), uploadImage was there. 
        // In client-onboarding-form, verify if uploadImage exists. If it relies on external helper, OK.
        // But the previous snippet showed `fileUrl = await uploadImage(formData.designFile) || "";`
        // I need to make sure `uploadImage` is available.
        // Looking at previous view_file of this file (lines 100-140), there is NO uploadImage function definition shown?
        // Wait, line 128 in previous view_file was `fileUrl = await uploadImage(formData.designFile) || "";`
        // So it must be defined or imported. Let's assume it is there (maybe I missed it or it's outside).
        // Actually, I should check if I broke the file where `uploadImage` was defined?
        // If it was inside the component, it might be fine.
        // But if I can't find it, I'll need to add it or fixing it.
        // Let's assume for now it is available in scope (maybe defined above handle submit).

        const formDataObj = new FormData();
        formDataObj.append('file', formData.designFile);
        const response = await fetch('/api/upload', { method: 'POST', body: formDataObj });
        if (response.ok) {
          const data = await response.json();
          fileUrl = data.url;
        }
      } else if (initialData?.designFileUrl) {
        fileUrl = initialData.designFileUrl;
      }

      const { designFile, ...clientData } = formData;

      if (clientId) {
        // Update Mode
        const clientRef = doc(db, "clients", clientId);
        await updateDoc(clientRef, {
          ...clientData,
          designFileUrl: fileUrl,
          updatedAt: serverTimestamp(),
        });

        try {
          // Attempt to update users collection if it exists
          const userRef = doc(db, "users", clientId);
          // We use updateDoc which fails if doc doesn't exist, which is fine here (ignore if not found)
          // Or check existence first? updateDoc is safe enough in try/catch
          await updateDoc(userRef, {
            name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            location: formData.invoicingAddress,
            updatedAt: serverTimestamp(),
          });
        } catch (e) {
          // Ignore update error for user doc
        }

        toast.success("Client updated successfully!");
        if (isAdmin) {
          router.push("/admin/clients");
        }
      } else {
        // Create Mode
        const newClientRef = doc(collection(db, "clients"));

        const dataToSave = {
          ...clientData,
          userId: newClientRef.id,
          designFileUrl: fileUrl,
          status: 'New',
          createdAt: serverTimestamp(),
        };

        await setDoc(newClientRef, dataToSave);

        await setDoc(doc(db, "users", newClientRef.id), {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          location: formData.invoicingAddress,
          status: 'active',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        await addDoc(collection(db, "notifications"), {
          type: 'new_client',
          message: `New client signed up: ${formData.fullName}`,
          link: `/admin/clients/${newClientRef.id}`,
          isRead: false,
          createdAt: serverTimestamp(),
          senderInfo: {
            name: formData.fullName,
            email: formData.email,
            avatar: "",
          }
        });

        toast.success("Onboarding form submitted! We will be in touch shortly.");
        if (isAdmin) {
          router.push("/admin/clients");
        } else {
          // Reset or redirect for public user
          router.push("/");
        }
      }

    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error(error.message || "Failed to submit form.");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="max-w-4xl mx-auto text-foreground">
      {!isAdmin && (
        <CardHeader className="text-center mb-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Client Onboarding</h1>
            <p className="text-xl text-muted-foreground">Let&apos;s get your project started. Please fill out the form below.</p>
          </motion.div>
        </CardHeader>
      )}

      {/* Stepper */}
      <div className="w-full overflow-hidden mb-8">
        <div className="flex md:justify-center">
          <motion.div
            className="flex transition-transform duration-500 ease-in-out"
            animate={{ x: `calc(-${(currentStep - 1) * 100}% - ${(currentStep - 1) * 1}rem + 50% - 2.5rem)` }}
            style={{
              width: `${steps.length * 5}rem`,
            }}
          >
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center w-20">
                <div className="flex flex-col items-center w-full">
                  <motion.div
                    animate={{
                      scale: currentStep === step.id ? 1.1 : 1,
                      backgroundColor: currentStep >= step.id ? "hsl(var(--primary))" : "hsl(var(--muted))",
                      color: currentStep >= step.id ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))"
                    }}
                    transition={{ duration: 0.3 }}
                    className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-primary/50"
                  >
                    <step.icon className="w-5 h-5" />
                  </motion.div>
                  <p className={`text-xs mt-2 text-center transition-colors ${currentStep >= step.id ? 'text-primary' : 'text-muted-foreground'}`}>{step.title}</p>
                </div>
                {index < steps.length - 1 && (
                  <motion.div
                    className="w-full h-1 bg-muted"
                    animate={{
                      backgroundColor: currentStep > step.id ? "hsl(var(--primary))" : "hsl(var(--muted))"
                    }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </div>


      <Card className="bg-card/80 backdrop-blur border-border/50">
        <CardContent className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-primary flex items-center gap-2"><User />Personal & Business Details</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2"><Label className="text-foreground">Full Name*</Label><Input name="fullName" value={formData.fullName} onChange={handleInputChange} required className="bg-background/50 border-input text-foreground" /></div>
                    <div className="space-y-2"><Label className="text-foreground">Email*</Label><Input name="email" type="email" value={formData.email} onChange={handleInputChange} required className="bg-background/50 border-input text-foreground" /></div>
                    <div className="space-y-2"><Label className="text-foreground">Phone</Label><Input name="phone" type="tel" value={formData.phone} onChange={handleInputChange} className="bg-background/50 border-input text-foreground" /></div>
                    <div className="space-y-2"><Label className="text-foreground">Company Name</Label><Input name="companyName" value={formData.companyName} onChange={handleInputChange} className="bg-background/50 border-input text-foreground" /></div>
                    <div className="space-y-2"><Label className="text-foreground">Designation / Role</Label><Input name="designation" value={formData.designation} onChange={handleInputChange} className="bg-background/50 border-input text-foreground" /></div>
                    <div className="space-y-2"><Label className="text-foreground">Invoicing Address</Label><Input name="invoicingAddress" value={formData.invoicingAddress} onChange={handleInputChange} className="bg-background/50 border-input text-foreground" /></div>
                    <div className="space-y-2"><Label className="text-foreground">GST Number</Label><Input name="gstNumber" value={formData.gstNumber} onChange={handleInputChange} className="bg-background/50 border-input text-foreground" /></div>
                    <div className="space-y-2"><Label className="text-foreground">Preferred Communication Method</Label>
                      <Select name="communicationMethod" value={formData.communicationMethod} onValueChange={v => handleSelectChange("communicationMethod", v)}>
                        <SelectTrigger className="bg-background/50 border-input text-foreground"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-popover border-border"><SelectItem value="Email" className="text-popover-foreground">Email</SelectItem><SelectItem value="WhatsApp" className="text-popover-foreground">WhatsApp</SelectItem><SelectItem value="Slack" className="text-popover-foreground">Slack</SelectItem></SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-primary flex items-center gap-2"><Briefcase />Project Information</h3>
                  <div className="space-y-2"><Label className="text-foreground">Project Title*</Label><Input name="projectTitle" value={formData.projectTitle} onChange={handleInputChange} required className="bg-background/50 border-input text-foreground" /></div>
                  <div className="space-y-2"><Label className="text-foreground">Describe your project*</Label><Textarea name="projectDescription" value={formData.projectDescription} onChange={handleInputChange} required className="bg-background/50 border-input text-foreground" rows={4} /></div>
                  <div className="space-y-2"><Label className="text-foreground">Must-have features (comma-separated)</Label><Textarea name="mustHaveFeatures" value={formData.mustHaveFeatures} onChange={handleInputChange} className="bg-background/50 border-input text-foreground" /></div>
                  <div className="space-y-2"><Label className="text-foreground">Optional/nice-to-have features</Label><Textarea name="optionalFeatures" value={formData.optionalFeatures} onChange={handleInputChange} className="bg-background/50 border-input text-foreground" /></div>
                  <div className="space-y-2"><Label className="text-foreground">Target devices/platforms</Label>
                    <div className="flex flex-wrap gap-4 text-foreground">
                      {['Mobile', 'Web', 'Tablet'].map(p => <div key={p} className="flex items-center gap-2"><Checkbox id={`platform-${p}`} onCheckedChange={c => handleCheckboxChange("targetPlatforms", c as boolean, p)} className="border-border" /><Label htmlFor={`platform-${p}`} className="text-foreground">{p}</Label></div>)}
                    </div>
                  </div>
                  <div className="space-y-2"><Label className="text-foreground">Login types</Label>
                    <div className="flex flex-wrap gap-4 text-foreground">
                      {['Email', 'Google', 'Phone', 'Social'].map(p => <div key={p} className="flex items-center gap-2"><Checkbox id={`login-${p}`} onCheckedChange={c => handleCheckboxChange("loginTypes", c as boolean, p)} className="border-border" /><Label htmlFor={`login-${p}`} className="text-foreground">{p}</Label></div>)}
                    </div>
                  </div>
                  <div className="space-y-2"><Label className="text-foreground">Admin dashboard required?</Label><RadioGroup name="adminDashboard" value={formData.adminDashboard} onValueChange={v => handleSelectChange("adminDashboard", v)} className="flex gap-4"><div className="flex items-center gap-2"><RadioGroupItem value="Yes" id="admin-yes" className="border-border text-primary" /><Label htmlFor="admin-yes" className="text-foreground">Yes</Label></div><div className="flex items-center gap-2"><RadioGroupItem value="No" id="admin-no" className="border-border" /><Label htmlFor="admin-no" className="text-foreground">No</Label></div></RadioGroup></div>
                  <div className="space-y-2"><Label className="text-foreground">Do you need a logo/branding?</Label><RadioGroup name="logoBranding" value={formData.logoBranding} onValueChange={v => handleSelectChange("logoBranding", v)} className="flex gap-4"><div className="flex items-center gap-2"><RadioGroupItem value="Yes" id="logo-yes" className="border-border text-primary" /><Label htmlFor="logo-yes" className="text-foreground">Yes</Label></div><div className="flex items-center gap-2"><RadioGroupItem value="No" id="logo-no" className="border-border" /><Label htmlFor="logo-no" className="text-foreground">No</Label></div></RadioGroup></div>
                </div>
              )}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-primary flex items-center gap-2"><Palette />Design & Content</h3>
                  <div className="space-y-2"><Label className="text-foreground">Do you have a design (Figma, XD, etc.)?</Label><RadioGroup name="existingDesign" value={formData.existingDesign} onValueChange={v => handleSelectChange("existingDesign", v)} className="flex gap-4"><div className="flex items-center gap-2"><RadioGroupItem value="Yes" id="design-yes" className="border-border text-primary" /><Label htmlFor="design-yes" className="text-foreground">Yes</Label></div><div className="flex items-center gap-2"><RadioGroupItem value="No" id="design-no" className="border-border" /><Label htmlFor="design-no" className="text-foreground">No</Label></div></RadioGroup></div>
                  {formData.existingDesign === 'Yes' && <div className="space-y-2"><Label className="text-foreground">Upload it</Label><Input type="file" onChange={handleDesignFileChange} className="bg-background/50 border-input text-foreground file:text-foreground" />{designFilePreview && <Image src={designFilePreview} alt="Design preview" width={100} height={100} className="mt-2 rounded-md" />}</div>}
                  <div className="space-y-2"><Label className="text-foreground">Do you want us to design it?</Label><RadioGroup name="designService" value={formData.designService} onValueChange={v => handleSelectChange("designService", v)} className="flex gap-4"><div className="flex items-center gap-2"><RadioGroupItem value="Yes" id="design-service-yes" className="border-border text-primary" /><Label htmlFor="design-service-yes" className="text-foreground">Yes</Label></div><div className="flex items-center gap-2"><RadioGroupItem value="No" id="design-service-no" className="border-border" /><Label htmlFor="design-service-no" className="text-foreground">No</Label></div></RadioGroup></div>
                  <div className="space-y-2"><Label className="text-foreground">Preferred color scheme/design style</Label><Input name="colorScheme" value={formData.colorScheme} onChange={handleInputChange} className="bg-background/50 border-input text-foreground" /></div>
                  <div className="space-y-2"><Label className="text-foreground">Example sites you like (comma-separated)</Label><Input name="exampleSites" value={formData.exampleSites} onChange={handleInputChange} className="bg-background/50 border-input text-foreground" /></div>
                  <div className="space-y-2"><Label className="text-foreground">Who will provide content (text/images)?</Label><RadioGroup name="contentProvider" value={formData.contentProvider} onValueChange={v => handleSelectChange("contentProvider", v)} className="flex gap-4"><div className="flex items-center gap-2"><RadioGroupItem value="Client" id="content-client" className="border-border text-primary" /><Label htmlFor="content-client" className="text-foreground">I will (Client)</Label></div><div className="flex items-center gap-2"><RadioGroupItem value="Patel Pulse Ventures" id="content-patelpulseventures" className="border-border" /><Label htmlFor="content-patelpulseventures" className="text-foreground">You will (Patel Pulse Ventures)</Label></div></RadioGroup></div>
                  <div className="space-y-2"><Label className="text-foreground">Do you have existing content to use?</Label><RadioGroup name="existingContent" value={formData.existingContent} onValueChange={v => handleSelectChange("existingContent", v)} className="flex gap-4"><div className="flex items-center gap-2"><RadioGroupItem value="Yes" id="exist-content-yes" className="border-border text-primary" /><Label htmlFor="exist-content-yes" className="text-foreground">Yes</Label></div><div className="flex items-center gap-2"><RadioGroupItem value="No" id="exist-content-no" className="border-border" /><Label htmlFor="exist-content-no" className="text-foreground">No</Label></div></RadioGroup></div>
                </div>
              )}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-primary flex items-center gap-2"><Code />Technical & Payment</h3>
                  <div className="space-y-2"><Label className="text-foreground">Hosting preference (e.g. AWS, Vercel, Firebase)</Label><Input name="hostingPreference" value={formData.hostingPreference} onChange={handleInputChange} className="bg-background/50 border-input text-foreground" /></div>
                  <div className="space-y-2"><Label className="text-foreground">Do you have a domain name?</Label><Input name="domainName" value={formData.domainName} onChange={handleInputChange} placeholder="Yes, example.com" className="bg-background/50 border-input text-foreground" /></div>
                  <div className="space-y-2"><Label className="text-foreground">What data needs to be collected/stored?</Label><Textarea name="dataToCollect" value={formData.dataToCollect} onChange={handleInputChange} className="bg-background/50 border-input text-foreground" /></div>
                  <div className="space-y-2"><Label className="text-foreground">Any privacy or compliance needs?</Label><Input name="privacyNeeds" value={formData.privacyNeeds} onChange={handleInputChange} className="bg-background/50 border-input text-foreground" /></div>
                  <div className="space-y-2"><Label className="text-foreground">Budget Range*</Label>
                    <Select name="budgetRange" value={formData.budgetRange} onValueChange={v => handleSelectChange("budgetRange", v)} required>
                      <SelectTrigger className="bg-background/50 border-input text-foreground"><SelectValue placeholder="Select your budget" /></SelectTrigger>
                      <SelectContent className="bg-popover border-border text-foreground"><SelectItem value="< $5k" className="text-popover-foreground">Under $5,000</SelectItem><SelectItem value="$5k-$10k" className="text-popover-foreground">$5,000 - $10,000</SelectItem><SelectItem value="$10k-$25k" className="text-popover-foreground">$10,000 - $25,000</SelectItem><SelectItem value="$25k+" className="text-popover-foreground">$25,000+</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2"><Label className="text-foreground">Preferred payment method</Label>
                    <Select name="paymentMethod" value={formData.paymentMethod} onValueChange={v => handleSelectChange("paymentMethod", v)}>
                      <SelectTrigger className="bg-background/50 border-input text-foreground"><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-popover border-border text-foreground"><SelectItem value="UPI" className="text-popover-foreground">UPI</SelectItem><SelectItem value="Bank Transfer" className="text-popover-foreground">Bank Transfer</SelectItem><SelectItem value="Credit Card" className="text-popover-foreground">Credit Card</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2"><Label className="text-foreground">Billing cycle</Label>
                    <Select name="billingCycle" value={formData.billingCycle} onValueChange={v => handleSelectChange("billingCycle", v)}>
                      <SelectTrigger className="bg-background/50 border-input text-foreground"><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-popover border-border text-foreground"><SelectItem value="Milestone" className="text-popover-foreground">Milestone Based</SelectItem><SelectItem value="Monthly" className="text-popover-foreground">Monthly Retainer</SelectItem></SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-primary flex items-center gap-2"><Check />Review & Submit</h3>
                  <p className="text-muted-foreground">Please review all the information below before submitting.</p>
                  <div className="space-y-4 p-4 border border-border rounded-lg max-h-96 overflow-y-auto">
                    {Object.entries(formData).map(([key, value]) => {
                      if (key === 'designFile' || !value || (Array.isArray(value) && value.length === 0)) return null;
                      const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
                      const formattedValue = Array.isArray(value) ? value.join(', ') : String(value);

                      return (
                        <div key={key} className="grid grid-cols-1 md:grid-cols-2 text-sm">
                          <dt className="font-medium text-muted-foreground">{formattedKey}</dt>
                          <dd className="text-foreground">{formattedValue}</dd>
                        </div>
                      )
                    })}
                    {designFilePreview && <div className="grid grid-cols-2 text-sm"><dt className="font-medium text-muted-foreground">Design File</dt><dd><Image src={designFilePreview} alt="Preview" width={80} height={80} className="rounded" /></dd></div>}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>

      <div className="mt-8 flex justify-between">
        <Button onClick={handlePrev} disabled={currentStep === 1} variant="outline" className="border-border text-foreground hover:bg-secondary">
          <ArrowLeft className="w-4 h-4 mr-2" /> Previous
        </Button>
        {currentStep < steps.length ? (
          <Button onClick={handleNext} className="bg-primary text-primary-foreground hover:bg-primary/90">
            Next <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={isLoading} className="bg-primary text-primary-foreground hover:bg-primary/90">
            {isLoading ? "Submitting..." : (<><Send className="w-4 h-4 mr-2" /> Submit Onboarding Form</>)}
          </Button>
        )}
      </div>
    </div>
  )
}

