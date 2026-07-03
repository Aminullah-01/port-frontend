import { createContext, useContext, useState, type ReactNode } from "react";
import {
  projects as seedProjects, skills as seedSkills, services as seedServices,
  certificates as seedCertificates, messages as seedMessages, blogPosts as seedBlog,
  profile as seedProfile,
  type Project, type Skill, type Service, type Certificate, type Message, type BlogPost,
} from "@/data/portfolio";

type Ctx = {
  projects: Project[]; setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  skills: Skill[]; setSkills: React.Dispatch<React.SetStateAction<Skill[]>>;
  services: Service[]; setServices: React.Dispatch<React.SetStateAction<Service[]>>;
  certificates: Certificate[]; setCertificates: React.Dispatch<React.SetStateAction<Certificate[]>>;
  messages: Message[]; setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  blog: BlogPost[]; setBlog: React.Dispatch<React.SetStateAction<BlogPost[]>>;
  profile: typeof seedProfile; setProfile: React.Dispatch<React.SetStateAction<typeof seedProfile>>;
};

const PortfolioContext = createContext<Ctx | null>(null);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(seedProjects);
  const [skills, setSkills] = useState<Skill[]>(seedSkills);
  const [services, setServices] = useState<Service[]>(seedServices);
  const [certificates, setCertificates] = useState<Certificate[]>(seedCertificates);
  const [messages, setMessages] = useState<Message[]>(seedMessages);
  const [blog, setBlog] = useState<BlogPost[]>(seedBlog);
  const [profile, setProfile] = useState(seedProfile);

  return (
    <PortfolioContext.Provider
      value={{ projects, setProjects, skills, setSkills, services, setServices, certificates, setCertificates, messages, setMessages, blog, setBlog, profile, setProfile }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error("usePortfolio must be used within PortfolioProvider");
  return ctx;
}
