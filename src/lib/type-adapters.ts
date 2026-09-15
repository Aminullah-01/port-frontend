import type { ComponentType } from 'react';
import type {
  ProjectData,
  SkillData,
  ServiceData,
  CertificateData,
  ContactMessageData,
  BlogData,
  ProfileData,
} from '@/types/api';
import type { Project, Skill, Service, Certificate, Message, BlogPost } from '@/data/portfolio';

import {
  Code2, Palette, Brain, Wrench, Sparkles, Layers,
  Server, Database, Cloud, Globe, Smartphone, Figma,
} from 'lucide-react';

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  code2: Code2,
  palette: Palette,
  brain: Brain,
  wrench: Wrench,
  sparkles: Sparkles,
  layers: Layers,
  server: Server,
  database: Database,
  cloud: Cloud,
  globe: Globe,
  smartphone: Smartphone,
  figma: Figma,
};

function resolveIcon(icon: string | null | undefined): ComponentType<{ className?: string }> {
  if (!icon) return Code2;
  const key = icon.toLowerCase().replace(/[^a-z0-9]/g, '');
  return iconMap[key] || Code2;
}

export function adaptProject(p: ProjectData): Project {
  return {
    id: String(p.id),
    title: p.title,
    description: p.description,
    longDescription: [p.description, p.problem, p.solution].filter(Boolean).join('\n\n'),
    image: p.thumbnail || '/placeholder.svg',
    tech: p.technologies || [],
    category: p.category || '',
    github: p.github_url || '',
    live: p.live_url || '',
    featured: p.featured,
    status: p.status === 'published' ? 'published' : 'draft',
    order: p.display_order,
    tags: [...(p.technologies || [])],
  };
}

export function adaptSkill(s: SkillData): Skill {
  return {
    id: String(s.id),
    name: s.name,
    category: s.category || '',
    percentage: s.percentage,
    color: s.color || '#6366f1',
    order: s.display_order,
  };
}

export function adaptService(s: ServiceData): Service {
  return {
    id: String(s.id),
    title: s.title,
    description: s.description || '',
    icon: resolveIcon(s.icon),
    features: s.features || [],
    order: s.display_order,
  };
}

export function adaptCertificate(c: CertificateData): Certificate {
  return {
    id: String(c.id),
    title: c.title,
    organization: c.organization || '',
    date: c.issue_date || '',
    credentialUrl: c.credential_url || '',
    image: c.image || '/placeholder.svg',
  };
}

export function adaptMessage(m: ContactMessageData): Message {
  return {
    id: String(m.id),
    name: m.name,
    email: m.email,
    subject: m.subject,
    message: m.message,
    date: m.created_at ? m.created_at.slice(0, 10) : '',
    read: m.is_read,
    archived: false,
  };
}

export function adaptBlog(b: BlogData): BlogPost {
  return {
    id: String(b.id),
    title: b.title,
    slug: b.slug,
    category: b.category || '',
    tags: b.tags || [],
    cover: b.cover_image || '/placeholder.svg',
    excerpt: b.content ? b.content.slice(0, 150).replace(/<[^>]*>/g, '') + '...' : '',
    content: b.content,
    published: b.status === 'published',
    date: b.created_at ? b.created_at.slice(0, 10) : '',
  };
}

export function adaptProfile(p: ProfileData) {
  return {
    name: p.full_name,
    titles: [p.headline || 'Developer'],
    tagline: p.headline || '',
    bio: p.bio || '',
    email: p.email,
    phone: p.phone || '',
    location: p.location || '',
    avatar: p.avatar || 'https://api.dicebear.com/9.x/avataaars/svg?seed=default',
    resume_url: p.resume_url || '',
    resume_view_url: p.resume_view_url || p.resume_url || '',
    resume_filename: p.resume_filename || '',
    resume_mime: p.resume_mime || '',
    resume_size: p.resume_size || null,
    socials: {
      github: p.github_url || 'https://github.com',
      linkedin: p.linkedin_url || 'https://linkedin.com',
      facebook: p.facebook_url || '',
      twitter: p.twitter_url || '',
      whatsapp: p.whatsapp_url || '',
      email: `mailto:${p.email}`,
    },
    stats: [
      { label: 'Projects', value: p.projects?.length || 0 },
      { label: 'Skills', value: p.skills?.length || 0 },
      { label: 'Certificates', value: p.certificates?.length || 0 },
    ],
  };
}
