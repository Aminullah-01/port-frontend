import { supabase, uploadMedia, fileToBase64 } from "@/lib/supabase";
import { ApiError } from "@/lib/api-client";
import type {
  BlogData,
  CertificateData,
  ContactMessageData,
  DashboardData,
  LoginResponse,
  ProfileData,
  ProjectData,
  ServiceData,
  SettingData,
  SkillData,
  User,
} from "@/types/api";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/* =========================================================================
   AUTH API (Supabase Auth)
   ========================================================================= */
export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error || !data.user || !data.session) {
      throw new ApiError(error?.message || "Invalid credentials", 401);
    }

    const user: User = {
      id: 1,
      email: data.user.email || email,
      name:
        (data.user.user_metadata?.name as string) ||
        data.user.email?.split("@")[0] ||
        "Admin",
    };

    return {
      user,
      token: data.session.access_token,
    };
  },

  logout: async (): Promise<null> => {
    await supabase.auth.signOut();
    return null;
  },

  user: async (): Promise<User> => {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      throw new ApiError("Unauthorized", 401);
    }

    return {
      id: 1,
      email: user.email || "",
      name:
        (user.user_metadata?.name as string) ||
        user.email?.split("@")[0] ||
        "Admin",
    };
  },

  changePassword: async (data: {
    current_password: string;
    password: string;
    password_confirmation: string;
  }): Promise<null> => {
    if (data.password !== data.password_confirmation) {
      throw new ApiError("Passwords do not match", 422, {
        password: ["Passwords do not match."],
      });
    }

    const { error } = await supabase.auth.updateUser({
      password: data.password,
    });

    if (error) {
      throw new ApiError(error.message, 400);
    }

    return null;
  },

  forgotPassword: async (email: string): Promise<{ email: string; reset_code?: string }> => {
    const redirectTo =
      typeof window !== "undefined" ? `${window.location.origin}/login` : undefined;

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo,
    });

    if (error) {
      throw new ApiError(error.message, 400);
    }

    return { email: email.trim() };
  },

  resetPassword: async (data: {
    email: string;
    code: string;
    password: string;
    password_confirmation: string;
  }): Promise<LoginResponse> => {
    if (data.password !== data.password_confirmation) {
      throw new ApiError("Passwords do not match", 422, {
        password: ["Passwords do not match."],
      });
    }

    const { data: otpData, error: otpError } = await supabase.auth.verifyOtp({
      email: data.email.trim(),
      token: data.code.trim(),
      type: "recovery",
    });

    if (otpError) {
      throw new ApiError(otpError.message || "Invalid or expired reset code", 400);
    }

    const { data: updateData, error: updateError } = await supabase.auth.updateUser({
      password: data.password,
    });

    if (updateError || !updateData.user) {
      throw new ApiError(updateError?.message || "Failed to update password", 400);
    }

    const user: User = {
      id: 1,
      email: updateData.user.email || data.email,
      name:
        (updateData.user.user_metadata?.name as string) ||
        updateData.user.email?.split("@")[0] ||
        "Admin",
    };

    return {
      user,
      token: otpData.session?.access_token || "",
    };
  },
};

/* =========================================================================
   PROFILE API
   ========================================================================= */
export const profileApi = {
  get: async (): Promise<ProfileData> => {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .is("deleted_at", null)
      .order("id", { ascending: false })
      .limit(1)
      .single();

    if (error || !profile) {
      throw new ApiError(error?.message || "Profile not found", 404);
    }

    // Populate relations for stats & portfolio views in parallel
    const [projRes, skillRes, servRes, certRes, blogRes] = await Promise.all([
      supabase
        .from("projects")
        .select("*, images:project_images(*)")
        .is("deleted_at", null)
        .eq("status", "published")
        .order("display_order", { ascending: true }),
      supabase
        .from("skills")
        .select("*")
        .is("deleted_at", null)
        .order("display_order", { ascending: true }),
      supabase
        .from("services")
        .select("*")
        .is("deleted_at", null)
        .order("display_order", { ascending: true }),
      supabase
        .from("certificates")
        .select("*")
        .is("deleted_at", null)
        .order("display_order", { ascending: true }),
      supabase
        .from("blog_posts")
        .select("*")
        .is("deleted_at", null)
        .eq("status", "published")
        .order("created_at", { ascending: false }),
    ]);

    const fullName =
      profile.full_name ||
      [profile.first_name, profile.last_name].filter(Boolean).join(" ") ||
      "Aminu Gambo Abubakar";

    // Clean expired backend urls (e.g. railway links)
    let resumeUrl = profile.resume_url;
    if (resumeUrl && resumeUrl.includes(".up.railway.app")) {
      resumeUrl = "/resume";
    }

    return {
      ...profile,
      full_name: fullName,
      resume_url: resumeUrl,
      resume_view_url: resumeUrl,
      projects: projRes.data || [],
      skills: skillRes.data || [],
      services: servRes.data || [],
      certificates: certRes.data || [],
      blogs: blogRes.data || [],
    };
  },

  update: async (data: FormData): Promise<ProfileData> => {
    // 1. Get current profile ID
    const { data: current } = await supabase
      .from("profiles")
      .select("id, avatar, resume_url")
      .is("deleted_at", null)
      .order("id", { ascending: false })
      .limit(1)
      .single();

    const profileId = current?.id || 13;
    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    // Text fields
    const fields = [
      "first_name",
      "last_name",
      "email",
      "phone",
      "headline",
      "bio",
      "location",
      "website",
      "github_url",
      "linkedin_url",
      "facebook_url",
      "twitter_url",
      "whatsapp_url",
    ];

    fields.forEach((f) => {
      if (data.has(f)) {
        updates[f] = data.get(f);
      }
    });

    // Avatar upload
    if (data.has("avatar")) {
      const avatarVal = data.get("avatar");
      if (avatarVal instanceof File && avatarVal.size > 0) {
        updates.avatar = await uploadMedia(avatarVal, "avatars");
      } else if (typeof avatarVal === "string" && avatarVal) {
        updates.avatar = avatarVal;
      }
    }

    // Resume file upload
    if (data.has("resume")) {
      const resumeVal = data.get("resume");
      if (resumeVal instanceof File && resumeVal.size > 0) {
        const base64 = await fileToBase64(resumeVal);
        updates.resume_filename = resumeVal.name;
        updates.resume_mime = resumeVal.type || "application/pdf";
        updates.resume_size = resumeVal.size;
        updates.resume_data = base64;
        updates.resume_url = "/resume";
      } else if (typeof resumeVal === "string" && resumeVal) {
        updates.resume_url = resumeVal;
      }
    }

    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", profileId);

    if (error) {
      throw new ApiError(error.message, 400);
    }

    return profileApi.get();
  },
};

/* =========================================================================
   SETTINGS API
   ========================================================================= */
export const settingsApi = {
  get: async (): Promise<SettingData> => {
    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .order("id", { ascending: true })
      .limit(1)
      .single();

    if (error || !data) {
      throw new ApiError(error?.message || "Settings not found", 404);
    }

    return data;
  },

  update: async (data: FormData | Record<string, unknown>): Promise<SettingData> => {
    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (data instanceof FormData) {
      for (const [key, val] of data.entries()) {
        if (val instanceof File && val.size > 0) {
          updates[key] = await uploadMedia(val, "settings");
        } else if (typeof val === "string") {
          try {
            updates[key] = JSON.parse(val);
          } catch {
            updates[key] = val;
          }
        }
      }
    } else {
      Object.assign(updates, data);
    }

    const { data: updated, error } = await supabase
      .from("settings")
      .update(updates)
      .eq("id", 1)
      .select()
      .single();

    if (error || !updated) {
      throw new ApiError(error?.message || "Failed to update settings", 400);
    }

    return updated;
  },
};

/* =========================================================================
   DASHBOARD API (Stored Procedure RPC)
   ========================================================================= */
export const dashboardApi = {
  get: async (): Promise<DashboardData> => {
    const { data, error } = await supabase.rpc("get_dashboard_metrics");

    if (error || !data) {
      throw new ApiError(error?.message || "Failed to fetch dashboard metrics", 500);
    }

    return data as DashboardData;
  },
};

/* =========================================================================
   PROJECTS API
   ========================================================================= */
export const projectsApi = {
  list: async (params?: {
    per_page?: number;
    category?: string;
    featured?: boolean;
    status?: string;
  }): Promise<ProjectData[]> => {
    let query = supabase
      .from("projects")
      .select("*, images:project_images(*)")
      .is("deleted_at", null)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (params?.category && params.category !== "All") {
      query = query.eq("category", params.category);
    }

    if (params?.featured !== undefined) {
      query = query.eq("featured", params.featured);
    }

    if (params?.status) {
      query = query.eq("status", params.status);
    }

    if (params?.per_page) {
      query = query.limit(params.per_page);
    }

    const { data, error } = await query;
    if (error) throw new ApiError(error.message, 400);
    return (data || []) as ProjectData[];
  },

  get: async (slugOrId: string | number): Promise<ProjectData> => {
    const isNum = typeof slugOrId === "number" || /^\d+$/.test(String(slugOrId));
    let query = supabase
      .from("projects")
      .select("*, images:project_images(*)")
      .is("deleted_at", null);

    if (isNum) {
      query = query.eq("id", Number(slugOrId));
    } else {
      query = query.eq("slug", slugOrId);
    }

    const { data, error } = await query.single();
    if (error || !data) throw new ApiError(error?.message || "Project not found", 404);
    return data as ProjectData;
  },

  create: async (data: FormData): Promise<ProjectData> => {
    const title = (data.get("title") as string) || "Untitled Project";
    const slug = (data.get("slug") as string) || slugify(title);
    const description = (data.get("description") as string) || "";
    const category = (data.get("category") as string) || null;
    const github_url = (data.get("github_url") as string) || null;
    const live_url = (data.get("live_url") as string) || null;
    const featured = data.get("featured") === "1" || data.get("featured") === "true";
    const status = (data.get("status") as "draft" | "published" | "archived") || "published";
    const display_order = Number(data.get("display_order") || 0);

    // Extract technologies
    const technologies: string[] = [];
    data.forEach((val, key) => {
      if (key === "technologies[]" || key === "technologies") {
        technologies.push(String(val));
      }
    });

    let thumbnail: string | null = null;
    const thumbVal = data.get("thumbnail");
    if (thumbVal instanceof File && thumbVal.size > 0) {
      thumbnail = await uploadMedia(thumbVal, "projects");
    } else if (typeof thumbVal === "string" && thumbVal) {
      thumbnail = thumbVal;
    }

    const { data: created, error } = await supabase
      .from("projects")
      .insert({
        title,
        slug,
        description,
        category,
        technologies,
        thumbnail,
        featured,
        status,
        github_url,
        live_url,
        display_order,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select("*, images:project_images(*)")
      .single();

    if (error || !created) {
      throw new ApiError(error?.message || "Failed to create project", 400);
    }

    return created as ProjectData;
  },

  update: async (id: number, data: FormData): Promise<ProjectData> => {
    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (data.has("title")) {
      const title = data.get("title") as string;
      updates.title = title;
      if (!data.has("slug")) updates.slug = slugify(title);
    }
    if (data.has("slug")) updates.slug = data.get("slug");
    if (data.has("description")) updates.description = data.get("description");
    if (data.has("category")) updates.category = data.get("category");
    if (data.has("github_url")) updates.github_url = data.get("github_url");
    if (data.has("live_url")) updates.live_url = data.get("live_url");
    if (data.has("featured")) updates.featured = data.get("featured") === "1" || data.get("featured") === "true";
    if (data.has("status")) updates.status = data.get("status");
    if (data.has("display_order")) updates.display_order = Number(data.get("display_order"));

    // Extract technologies
    const technologies: string[] = [];
    data.forEach((val, key) => {
      if (key === "technologies[]" || key === "technologies") {
        technologies.push(String(val));
      }
    });
    if (technologies.length > 0) {
      updates.technologies = technologies;
    }

    if (data.has("thumbnail")) {
      const thumbVal = data.get("thumbnail");
      if (thumbVal instanceof File && thumbVal.size > 0) {
        updates.thumbnail = await uploadMedia(thumbVal, "projects");
      } else if (typeof thumbVal === "string" && thumbVal) {
        updates.thumbnail = thumbVal;
      }
    }

    const { data: updated, error } = await supabase
      .from("projects")
      .update(updates)
      .eq("id", id)
      .select("*, images:project_images(*)")
      .single();

    if (error || !updated) {
      throw new ApiError(error?.message || "Failed to update project", 400);
    }

    return updated as ProjectData;
  },

  delete: async (id: number): Promise<null> => {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) throw new ApiError(error.message, 400);
    return null;
  },
};

/* =========================================================================
   BLOGS API
   ========================================================================= */
export const blogsApi = {
  list: async (params?: {
    per_page?: number;
    category?: string;
    status?: string;
  }): Promise<BlogData[]> => {
    let query = supabase
      .from("blog_posts")
      .select("*")
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    if (params?.category) query = query.eq("category", params.category);
    if (params?.status) query = query.eq("status", params.status);
    if (params?.per_page) query = query.limit(params.per_page);

    const { data, error } = await query;
    if (error) throw new ApiError(error.message, 400);
    return (data || []) as BlogData[];
  },

  get: async (idOrSlug: string | number): Promise<BlogData> => {
    const isNum = typeof idOrSlug === "number" || /^\d+$/.test(String(idOrSlug));
    let query = supabase.from("blog_posts").select("*").is("deleted_at", null);

    if (isNum) {
      query = query.eq("id", Number(idOrSlug));
    } else {
      query = query.eq("slug", idOrSlug);
    }

    const { data, error } = await query.single();
    if (error || !data) throw new ApiError(error?.message || "Blog post not found", 404);
    return data as BlogData;
  },

  create: async (data: FormData): Promise<BlogData> => {
    const title = (data.get("title") as string) || "Untitled Post";
    const slug = (data.get("slug") as string) || slugify(title);
    const content = (data.get("content") as string) || "";
    const category = (data.get("category") as string) || null;
    const status = (data.get("status") as "draft" | "published") || "published";

    const tags: string[] = [];
    data.forEach((val, key) => {
      if (key === "tags[]" || key === "tags") tags.push(String(val));
    });

    let cover_image: string | null = null;
    const coverVal = data.get("cover_image");
    if (coverVal instanceof File && coverVal.size > 0) {
      cover_image = await uploadMedia(coverVal, "blogs");
    } else if (typeof coverVal === "string" && coverVal) {
      cover_image = coverVal;
    }

    const { data: created, error } = await supabase
      .from("blog_posts")
      .insert({
        title,
        slug,
        content,
        category,
        tags,
        status,
        cover_image,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error || !created) {
      throw new ApiError(error?.message || "Failed to create blog post", 400);
    }

    return created as BlogData;
  },

  update: async (id: number, data: FormData): Promise<BlogData> => {
    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (data.has("title")) updates.title = data.get("title");
    if (data.has("slug")) updates.slug = data.get("slug");
    if (data.has("content")) updates.content = data.get("content");
    if (data.has("category")) updates.category = data.get("category");
    if (data.has("status")) updates.status = data.get("status");

    const tags: string[] = [];
    data.forEach((val, key) => {
      if (key === "tags[]" || key === "tags") tags.push(String(val));
    });
    if (tags.length > 0) updates.tags = tags;

    if (data.has("cover_image")) {
      const coverVal = data.get("cover_image");
      if (coverVal instanceof File && coverVal.size > 0) {
        updates.cover_image = await uploadMedia(coverVal, "blogs");
      } else if (typeof coverVal === "string" && coverVal) {
        updates.cover_image = coverVal;
      }
    }

    const { data: updated, error } = await supabase
      .from("blog_posts")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error || !updated) {
      throw new ApiError(error?.message || "Failed to update blog post", 400);
    }

    return updated as BlogData;
  },

  delete: async (id: number): Promise<null> => {
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) throw new ApiError(error.message, 400);
    return null;
  },
};

/* =========================================================================
   SKILLS API
   ========================================================================= */
export const skillsApi = {
  list: async (params?: { per_page?: number }): Promise<SkillData[]> => {
    let query = supabase
      .from("skills")
      .select("*")
      .is("deleted_at", null)
      .order("display_order", { ascending: true })
      .order("name", { ascending: true });

    if (params?.per_page) query = query.limit(params.per_page);

    const { data, error } = await query;
    if (error) throw new ApiError(error.message, 400);
    return (data || []) as SkillData[];
  },

  get: async (id: number): Promise<SkillData> => {
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .eq("id", id)
      .single();
    if (error || !data) throw new ApiError(error?.message || "Skill not found", 404);
    return data as SkillData;
  },

  create: async (data: Record<string, unknown>): Promise<SkillData> => {
    const { data: created, error } = await supabase
      .from("skills")
      .insert({
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error || !created) {
      throw new ApiError(error?.message || "Failed to create skill", 400);
    }

    return created as SkillData;
  },

  update: async (id: number, data: Record<string, unknown>): Promise<SkillData> => {
    const { data: updated, error } = await supabase
      .from("skills")
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error || !updated) {
      throw new ApiError(error?.message || "Failed to update skill", 400);
    }

    return updated as SkillData;
  },

  delete: async (id: number): Promise<null> => {
    const { error } = await supabase.from("skills").delete().eq("id", id);
    if (error) throw new ApiError(error.message, 400);
    return null;
  },
};

/* =========================================================================
   SERVICES API
   ========================================================================= */
export const servicesApi = {
  list: async (params?: { per_page?: number }): Promise<ServiceData[]> => {
    let query = supabase
      .from("services")
      .select("*")
      .is("deleted_at", null)
      .order("display_order", { ascending: true })
      .order("title", { ascending: true });

    if (params?.per_page) query = query.limit(params.per_page);

    const { data, error } = await query;
    if (error) throw new ApiError(error.message, 400);
    return (data || []) as ServiceData[];
  },

  get: async (id: number): Promise<ServiceData> => {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("id", id)
      .single();
    if (error || !data) throw new ApiError(error?.message || "Service not found", 404);
    return data as ServiceData;
  },

  create: async (data: Record<string, unknown>): Promise<ServiceData> => {
    const { data: created, error } = await supabase
      .from("services")
      .insert({
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error || !created) {
      throw new ApiError(error?.message || "Failed to create service", 400);
    }

    return created as ServiceData;
  },

  update: async (id: number, data: Record<string, unknown>): Promise<ServiceData> => {
    const { data: updated, error } = await supabase
      .from("services")
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error || !updated) {
      throw new ApiError(error?.message || "Failed to update service", 400);
    }

    return updated as ServiceData;
  },

  delete: async (id: number): Promise<null> => {
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) throw new ApiError(error.message, 400);
    return null;
  },
};

/* =========================================================================
   CERTIFICATES API
   ========================================================================= */
export const certificatesApi = {
  list: async (params?: { per_page?: number }): Promise<CertificateData[]> => {
    let query = supabase
      .from("certificates")
      .select("*")
      .is("deleted_at", null)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (params?.per_page) query = query.limit(params.per_page);

    const { data, error } = await query;
    if (error) throw new ApiError(error.message, 400);
    return (data || []) as CertificateData[];
  },

  get: async (id: number): Promise<CertificateData> => {
    const { data, error } = await supabase
      .from("certificates")
      .select("*")
      .eq("id", id)
      .single();
    if (error || !data) throw new ApiError(error?.message || "Certificate not found", 404);
    return data as CertificateData;
  },

  create: async (data: FormData): Promise<CertificateData> => {
    const title = (data.get("title") as string) || "Certificate";
    const organization = (data.get("organization") as string) || "";
    const issue_date = (data.get("issue_date") as string) || "";
    const credential_url = (data.get("credential_url") as string) || "";
    const display_order = Number(data.get("display_order") || 0);

    let image: string | null = null;
    const imageVal = data.get("image");
    if (imageVal instanceof File && imageVal.size > 0) {
      image = await uploadMedia(imageVal, "certificates");
    } else if (typeof imageVal === "string" && imageVal) {
      image = imageVal;
    }

    const { data: created, error } = await supabase
      .from("certificates")
      .insert({
        title,
        organization,
        issue_date,
        credential_url,
        image,
        display_order,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error || !created) {
      throw new ApiError(error?.message || "Failed to create certificate", 400);
    }

    return created as CertificateData;
  },

  update: async (id: number, data: FormData): Promise<CertificateData> => {
    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (data.has("title")) updates.title = data.get("title");
    if (data.has("organization")) updates.organization = data.get("organization");
    if (data.has("issue_date")) updates.issue_date = data.get("issue_date");
    if (data.has("credential_url")) updates.credential_url = data.get("credential_url");
    if (data.has("display_order")) updates.display_order = Number(data.get("display_order"));

    if (data.has("image")) {
      const imageVal = data.get("image");
      if (imageVal instanceof File && imageVal.size > 0) {
        updates.image = await uploadMedia(imageVal, "certificates");
      } else if (typeof imageVal === "string" && imageVal) {
        updates.image = imageVal;
      }
    }

    const { data: updated, error } = await supabase
      .from("certificates")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error || !updated) {
      throw new ApiError(error?.message || "Failed to update certificate", 400);
    }

    return updated as CertificateData;
  },

  delete: async (id: number): Promise<null> => {
    const { error } = await supabase.from("certificates").delete().eq("id", id);
    if (error) throw new ApiError(error.message, 400);
    return null;
  },
};

/* =========================================================================
   CONTACT API (Public Secure RPC + Admin RLS queries)
   ========================================================================= */
export const contactApi = {
  send: async (data: {
    name: string;
    email: string;
    subject: string;
    message: string;
    phone?: string;
  }): Promise<ContactMessageData> => {
    const { data: result, error } = await supabase.rpc("submit_contact_message", {
      p_name: data.name,
      p_email: data.email,
      p_subject: data.subject || "General Inquiry",
      p_message: data.message,
      p_phone: data.phone || null,
    });

    if (error || !result) {
      throw new ApiError(error?.message || "Failed to submit message", 400);
    }

    return result as ContactMessageData;
  },

  list: async (params?: {
    per_page?: number;
    is_read?: boolean;
  }): Promise<ContactMessageData[]> => {
    let query = supabase
      .from("contact_messages")
      .select("*")
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    if (params?.is_read !== undefined) {
      query = query.eq("is_read", params.is_read);
    }

    if (params?.per_page) {
      query = query.limit(params.per_page);
    }

    const { data, error } = await query;
    if (error) throw new ApiError(error.message, 400);
    return (data || []) as ContactMessageData[];
  },

  get: async (id: number): Promise<ContactMessageData> => {
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) throw new ApiError(error?.message || "Message not found", 404);
    return data as ContactMessageData;
  },

  markAsRead: async (id: number): Promise<ContactMessageData> => {
    const { data, error } = await supabase
      .from("contact_messages")
      .update({
        is_read: true,
        read_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error || !data) throw new ApiError(error?.message || "Failed to mark message as read", 400);
    return data as ContactMessageData;
  },

  delete: async (id: number): Promise<null> => {
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) throw new ApiError(error.message, 400);
    return null;
  },
};

/* =========================================================================
   ANALYTICS API (Visit & CV Tracking RPC)
   ========================================================================= */
export const analyticsApi = {
  trackVisit: async (page_url?: string): Promise<null> => {
    try {
      const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : "";
      await supabase.rpc("track_portfolio_event", {
        p_event_type: "visit",
        p_page_url: page_url || "/",
        p_user_agent: userAgent,
      });
    } catch {
      // analytics tracking fails silently
    }
    return null;
  },

  trackCvDownload: async (page_url?: string): Promise<null> => {
    try {
      const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : "";
      await supabase.rpc("track_portfolio_event", {
        p_event_type: "cv_download",
        p_page_url: page_url || "/resume",
        p_user_agent: userAgent,
      });
    } catch {
      // analytics tracking fails silently
    }
    return null;
  },
};
