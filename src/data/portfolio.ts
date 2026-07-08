import type { ComponentType } from "react";
import {
  Code2, Palette, Brain, Wrench, Sparkles, Layers,
  Github, Linkedin, Mail, MessageCircle, Facebook, MapPin,
} from "lucide-react";

export type Project = {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  image: string;
  tech: string[];
  category: string;
  github: string;
  live: string;
  featured: boolean;
  status: "published" | "draft";
  order: number;
  tags: string[];
};

export type Skill = {
  id: string;
  name: string;
  category: string;
  percentage: number;
  color: string;
  order: number;
};

export type Service = {
  id: string;
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  features: string[];
  order: number;
};

export type Certificate = {
  id: string;
  title: string;
  organization: string;
  date: string;
  credentialUrl: string;
  image: string;
};

export type Message = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
  archived: boolean;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  category: string;
  tags: string[];
  cover: string;
  excerpt: string;
  content: string;
  published: boolean;
  date: string;
};

export const profile = {
  name: "Aminu Gambo Abubakar",
  titles: ["Frontend Developer", "Backend Developer", "Creative Problem Solver"],
  tagline: "Computer Science student crafting premium digital experiences.",
  bio: "I design and build modern, accessible, and delightful web products. My work spans frontend and backend engineering, and applied AI — bridging craft, code, and creativity.",
  email: "aminugamboabubakar33@gmail.com",
  phone: "+234 913 264 7360",
  location: "Gombe, Nigeria",
  avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Aminu&backgroundColor=b6e3f4",
  socials: {
    github: "https://github.com/Aminullah-01",
    linkedin: "https://linkedin.com/in/aminu-gambo-abubakar-073139340",
    facebook: "https://www.facebook.com/ameenu.gabubakar.7/",
    twitter: "https://x.com/Aminullah7360",
    whatsapp: "https://wa.me/2349132647360",
    email: "mailto:aminugamboabubakar33@gmail.com",
  },
  stats: [
    { label: "Projects", value: 42 },
    { label: "Clients", value: 18 },
    { label: "Years", value: 4 },
    { label: "Awards", value: 6 },
  ],
};

export const education = [
  { year: "2023 — Present", title: "B.Sc. Computer Science", org: "Gombe State University" },
  //{ year: "2020 — 2022", title: "Diploma, Software Engineering", org: "SkillHub Academy" },
];

export const experience = [
  { year: "2025 — Present", title: "Freelance Frontend and Backend Developer", org: "Remote", detail: "Building premium SaaS interfaces for global clients." },
 // { year: "2023 — 2024", title: "UI/UX Designer", org: "Nova Studio", detail: "Led design systems and product design for fintech clients." },
 // { year: "2022 — 2023", title: "Graphic Designer", org: "Freelance", detail: "Brand identity and marketing collateral for startups." },
];

export const skills: Skill[] = [
  { id: "1", name: "React", category: "Frontend", percentage: 95, color: "#61dafb", order: 1 },
  { id: "2", name: "TypeScript", category: "Frontend", percentage: 90, color: "#3178c6", order: 2 },
  { id: "3", name: "Next.js", category: "Frontend", percentage: 88, color: "#000", order: 3 },
  { id: "4", name: "Tailwind CSS", category: "Frontend", percentage: 96, color: "#06b6d4", order: 4 },
  //{ id: "5", name: "Python", category: "Programming", percentage: 85, color: "#3776ab", order: 5 },
  { id: "6", name: "JavaScript", category: "Programming", percentage: 94, color: "#f7df1e", order: 6 },
  //{ id: "7", name: "Figma", category: "UI/UX", percentage: 92, color: "#f24e1e", order: 7 },
  //{ id: "8", name: "Adobe XD", category: "UI/UX", percentage: 85, color: "#ff61f6", order: 8 },
  //{ id: "9", name: "Photoshop", category: "Graphic Design", percentage: 88, color: "#31a8ff", order: 9 },
  //{ id: "10", name: "Illustrator", category: "Graphic Design", percentage: 82, color: "#ff9a00", order: 10 },
  //{ id: "11", name: "TensorFlow", category: "AI", percentage: 78, color: "#ff6f00", order: 11 },
  //{ id: "12", name: "PyTorch", category: "AI", percentage: 75, color: "#ee4c2c", order: 12 },
  { id: "13", name: "Git", category: "Developer Tools", percentage: 90, color: "#f05032", order: 13 },
  { id: "14", name: "VS Code", category: "Developer Tools", percentage: 95, color: "#007acc", order: 14 },
];

export const skillCategories = [
  { name: "Frontend", icon: Code2 },
  { name: "Programming", icon: Layers },
  //{ name: "UI/UX", icon: Palette },
  //{ name: "Graphic Design", icon: Sparkles },
  { name: "AI", icon: Brain },
  { name: "Developer Tools", icon: Wrench },
];

export const projects: Project[] = [
  {
    id: "1",
    title: "Nebula Analytics",
    description: "Real-time SaaS analytics dashboard with predictive AI insights.",
    longDescription: "A production-grade analytics platform built with React and TypeScript, featuring live charts, cohort analysis, and AI-powered forecasting.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
    tech: ["React", "TypeScript", "D3.js", "TensorFlow.js"],
    category: "Web App",
    github: "https://github.com",
    live: "https://example.com",
    featured: true,
    status: "published",
    order: 1,
    tags: ["saas", "analytics"],
  },
  {
    id: "2",
    title: "Prism Design System",
    description: "Component library with 120+ accessible React primitives.",
    longDescription: "A fully-typed, tokenized design system used across multiple product lines.",
    image: "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?w=1200&q=80",
    tech: ["React", "Tailwind", "Radix UI", "Storybook"],
    category: "Design System",
    github: "https://github.com",
    live: "https://example.com",
    featured: true,
    status: "published",
    order: 2,
    tags: ["design", "ui"],
  },
  {
    id: "3",
    title: "Orbit Banking",
    description: "Mobile-first neobank app with animated onboarding.",
    longDescription: "Complete UX flow, motion design, and prototype for a modern neobank.",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&q=80",
    tech: ["Figma", "React Native", "Framer"],
    category: "Mobile",
    github: "https://github.com",
    live: "https://example.com",
    featured: false,
    status: "published",
    order: 3,
    tags: ["fintech", "mobile"],
  },
  {
    id: "4",
    title: "Loom AI Assistant",
    description: "Chat interface powered by fine-tuned LLM for research.",
    longDescription: "Streaming chat UI with citations, tool calls, and prompt management.",
    image: "https://images.unsplash.com/photo-1677756119517-756a188d2d94?w=1200&q=80",
    tech: ["Next.js", "Python", "OpenAI", "Postgres"],
    category: "AI",
    github: "https://github.com",
    live: "https://example.com",
    featured: true,
    status: "published",
    order: 4,
    tags: ["ai", "llm"],
  },
  {
    id: "5",
    title: "Verse Landing Kit",
    description: "20+ high-conversion landing page templates.",
    longDescription: "A curated library of premium landing pages with animations built-in.",
    image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1200&q=80",
    tech: ["Astro", "Tailwind", "Framer Motion"],
    category: "Templates",
    github: "https://github.com",
    live: "https://example.com",
    featured: false,
    status: "published",
    order: 5,
    tags: ["marketing"],
  },
  {
    id: "6",
    title: "Mono Brand Identity",
    description: "Visual identity system for an architecture studio.",
    longDescription: "Logo, typography, guidelines, and web presence for Mono Studio.",
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1200&q=80",
    tech: ["Illustrator", "Figma", "InDesign"],
    category: "Branding",
    github: "https://github.com",
    live: "https://example.com",
    featured: false,
    status: "published",
    order: 6,
    tags: ["branding", "identity"],
  },
];

export const services: Service[] = [
  { id: "1", title: "Frontend Development", description: "Production-ready React & TypeScript apps.", icon: Code2, features: ["Component architecture", "Performance tuning", "Accessibility", "Testing"], order: 1 },
  { id: "2", title: "Responsive Web Design", description: "Mobile-first sites that feel great everywhere.", icon: Layers, features: ["Fluid layouts", "Design tokens", "Cross-browser", "Motion"], order: 2 },
  { id: "3", title: "UI/UX Design", description: "End-to-end product design in Figma.", icon: Palette, features: ["Research", "Wireframes", "Prototypes", "Design systems"], order: 3 },
  { id: "4", title: "Landing Pages", description: "High-conversion pages that ship fast.", icon: Sparkles, features: ["Copy structure", "A/B testing", "SEO", "Analytics"], order: 4 },
  { id: "5", title: "Graphic Design", description: "Brand identity and marketing collateral.", icon: Palette, features: ["Logos", "Guidelines", "Social kits", "Print"], order: 5 },
  { id: "6", title: "Portfolio Websites", description: "Personal brands that make an impression.", icon: Brain, features: ["Story-driven", "CMS ready", "Fast", "SEO"], order: 6 },
];

export const certificates: Certificate[] = [
  { id: "1", title: "Meta Frontend Developer", organization: "Meta / Coursera", date: "2024", credentialUrl: "#", image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80" },
  { id: "2", title: "Google UX Design", organization: "Google", date: "2023", credentialUrl: "#", image: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&q=80" },
  { id: "3", title: "Deep Learning Specialization", organization: "DeepLearning.AI", date: "2024", credentialUrl: "#", image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80" },
  { id: "4", title: "AWS Cloud Practitioner", organization: "Amazon Web Services", date: "2023", credentialUrl: "#", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80" },
  { id: "5", title: "Advanced React Patterns", organization: "Epic React", date: "2024", credentialUrl: "#", image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80" },
  { id: "6", title: "Figma Master Certification", organization: "Figma Academy", date: "2023", credentialUrl: "#", image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&q=80" },
];

export const messages: Message[] = [
  { id: "1", name: "Sarah Chen", email: "sarah@acme.com", subject: "Freelance project inquiry", message: "Hi Aminu, I'd love to discuss a new SaaS product...", date: "2025-06-28", read: false, archived: false },
  { id: "2", name: "Marcus Rivera", email: "marcus@studio.io", subject: "Design system collaboration", message: "We're building a design system and would love your help.", date: "2025-06-25", read: true, archived: false },
  { id: "3", name: "Priya Patel", email: "priya@fintech.co", subject: "UI review", message: "Could you review our onboarding flow?", date: "2025-06-20", read: true, archived: false },
  { id: "4", name: "Jonas Weber", email: "jonas@nova.ai", subject: "AI product consultation", message: "Interested in your take on our chat UX.", date: "2025-06-18", read: false, archived: false },
  { id: "5", name: "Amina Yusuf", email: "amina@brand.ng", subject: "Brand identity", message: "Need help refreshing our brand.", date: "2025-06-14", read: true, archived: true },
];

export const blogPosts: BlogPost[] = [
  { id: "1", title: "Designing for AI: 7 principles", slug: "designing-for-ai", category: "Design", tags: ["ai", "ux"], cover: "https://images.unsplash.com/photo-1677756119517-756a188d2d94?w=1200&q=80", excerpt: "How to design interfaces that make AI feel trustworthy and useful.", content: "Full article coming soon.", published: true, date: "2025-06-01" },
  { id: "2", title: "Type-safe forms with React Hook Form", slug: "type-safe-forms", category: "Engineering", tags: ["react", "typescript"], cover: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&q=80", excerpt: "A pragmatic guide to bulletproof forms.", content: "Full article coming soon.", published: true, date: "2025-05-14" },
  { id: "3", title: "Motion in product design", slug: "motion-in-product-design", category: "Design", tags: ["motion", "framer"], cover: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80", excerpt: "Motion isn't decoration — it's communication.", content: "Full article coming soon.", published: false, date: "2025-04-22" },
];

export const socialLinks = [
  { name: "GitHub", url: profile.socials.github, icon: Github },
  { name: "LinkedIn", url: profile.socials.linkedin, icon: Linkedin },
  { name: "Facebook", url: profile.socials.facebook, icon: Facebook },
  { name: "WhatsApp", url: profile.socials.whatsapp, icon: MessageCircle },
  { name: "Email", url: profile.socials.email, icon: Mail },
];

export const contactInfo = [
  { icon: Mail, label: "Email", value: profile.email },
  { icon: MapPin, label: "Location", value: profile.location },
];

export const navLinks = [
  { name: "Home", to: "/" },
  { name: "About", to: "/about" },
  { name: "Skills", to: "/skills" },
  { name: "Projects", to: "/projects" },
  { name: "Services", to: "/services" },
  { name: "Certificates", to: "/certificates" },
  { name: "Resume", to: "/resume" },
  { name: "Contact", to: "/contact" },
] as const;
