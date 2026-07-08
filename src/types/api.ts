export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: Record<string, string[]> | null;
}

export interface PaginatedData<T> {
  data: T[];
  meta: {
    current_page: number;
    from: number | null;
    last_page: number;
    per_page: number;
    to: number | null;
    total: number;
  };
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface ProfileData {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone: string | null;
  headline: string | null;
  bio: string | null;
  avatar: string | null;
  resume_url: string | null;
  website: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  facebook_url: string | null;
  whatsapp_url: string | null;
  location: string | null;
  created_at: string;
  updated_at: string;
  projects?: ProjectData[];
  skills?: SkillData[];
  services?: ServiceData[];
  certificates?: CertificateData[];
  blogs?: BlogData[];
}

export interface ProjectData {
  id: number;
  title: string;
  slug: string;
  description: string;
  problem: string | null;
  solution: string | null;
  technologies: string[];
  category: string | null;
  thumbnail: string | null;
  featured: boolean;
  status: 'draft' | 'published' | 'archived';
  github_url: string | null;
  live_url: string | null;
  display_order: number;
  images: ProjectImageData[];
  created_at: string;
  updated_at: string;
}

export interface ProjectImageData {
  id: number;
  image_path: string;
  caption: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface SkillData {
  id: number;
  name: string;
  icon: string | null;
  category: string | null;
  percentage: number;
  color: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface ServiceData {
  id: number;
  title: string;
  icon: string | null;
  description: string | null;
  features: string[] | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface CertificateData {
  id: number;
  title: string;
  organization: string | null;
  issue_date: string | null;
  credential_url: string | null;
  image: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContactMessageData {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface BlogData {
  id: number;
  title: string;
  slug: string;
  cover_image: string | null;
  content: string;
  category: string | null;
  status: 'draft' | 'published';
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface SettingData {
  id: number;
  site_name: string | null;
  logo: string | null;
  favicon: string | null;
  hero_title: string | null;
  hero_subtitle: string | null;
  theme_colors: Record<string, string> | null;
  seo_title: string | null;
  seo_description: string | null;
  social_links: Record<string, string> | null;
  created_at: string;
  updated_at: string;
}

export interface DashboardData {
  total_projects: number;
  total_skills: number;
  total_services: number;
  total_certificates: number;
  total_messages: number;
  total_blogs: number;
  unread_messages: number;
  featured_projects: number;
}
