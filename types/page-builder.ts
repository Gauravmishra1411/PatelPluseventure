export type ComponentType = 'hero' | 'heading' | 'paragraph' | 'gallery' | 'image-text' | 'features' | 'cta' | 'faq' | 'video' | 'pricing' | 'stats' | 'spacer' | 'divider' | 'testimonials';

export interface Section {
    id: string;
    type: ComponentType;
    content: any; // Flexible content structure depending on type
}

export interface Page {
    id: string;
    slug: string; // e.g., 'about-us', 'services/marketing'
    title: string;
    sections: Section[];
    isPublished: boolean;
    createdAt: any;
    updatedAt: any;
}

export const initialComponentData: Record<ComponentType, any> = {
    hero: {
        heading: "Your Heading Here",
        subheading: "Your subheading goes here",
        buttonText: "Get Started",
        buttonLink: "#",
        backgroundImage: "",
    },
    heading: {
        text: "Your Heading Here",
        level: "h2",
        alignment: "center",
    },
    paragraph: {
        text: "Your paragraph text goes here. Write engaging content that connects with your audience.",
        alignment: "left",
    },
    gallery: {
        images: [],
        columns: 3,
    },
    "image-text": {
        heading: "Engaging Title",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        image: "",
        imagePosition: "left", // 'left' | 'right'
    },
    features: {
        heading: "Our Features",
        items: [
            { title: "Feature 1", description: "Description for feature 1" },
            { title: "Feature 2", description: "Description for feature 2" },
            { title: "Feature 3", description: "Description for feature 3" },
        ]
    },
    cta: {
        heading: "Ready to get started?",
        subheading: "Join us today and transform your business.",
        buttonText: "Sign Up Now",
        buttonLink: "#",
        backgroundColor: "bg-primary",
    },
    faq: {
        heading: "Frequently Asked Questions",
        items: [
            { question: "What is your return policy?", answer: "We offer a 30-day return policy for all items." },
            { question: "Do you ship internationally?", answer: "Yes, we ship to over 100 countries worldwide." },
        ]
    },
    video: {
        url: "",
        caption: "Watch our introduction video",
    },
    pricing: {
        heading: "Simple Pricing",
        plans: [
            { name: "Basic", price: "$9", features: ["Feature A", "Feature B"], buttonText: "Choose Basic" },
            { name: "Pro", price: "$29", features: ["Everything in Basic", "Feature C", "Feature D"], buttonText: "Choose Pro" },
            { name: "Enterprise", price: "$99", features: ["Everything in Pro", "Unlimited Access", "Priority Support"], buttonText: "Contact Us" },
        ]
    },
    stats: {
        items: [
            { value: "100+", label: "Clients" },
            { value: "500", label: "Projects" },
            { value: "24/7", label: "Support" },
        ]
    },
    spacer: {
        height: 50,
    },
    divider: {
        style: "solid", // 'solid' | 'dashed' | 'dotted'
    },
    testimonials: {
        heading: "What our Clients Say",
        items: [
            { name: "John Doe", role: "CEO, Tech Inc", quote: "This service changed my life. Highly recommended!", avatar: "" },
            { name: "Jane Smith", role: "Marketing Director", quote: "Incredible results and amazing support.", avatar: "" },
        ]
    }
};
