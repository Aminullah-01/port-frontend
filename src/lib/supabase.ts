import { createClient } from "@supabase/supabase-js";
import { ssrStorage } from "./ssr-storage";

export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || "https://lrbgxkkqslsseqtnevtv.supabase.co";

export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY || "";

if (!SUPABASE_ANON_KEY && typeof window !== "undefined") {
  console.warn(
    "[Supabase] VITE_SUPABASE_ANON_KEY is not set. Please set it in your .env file or environment variables."
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: {
      getItem: (key) => ssrStorage.getItem(key),
      setItem: (key, value) => ssrStorage.setItem(key, value),
      removeItem: (key) => ssrStorage.removeItem(key),
    },
  },
});

/**
 * Uploads media securely through Supabase Edge Function to Cloudinary,
 * falling back to Supabase Storage or data URL if needed.
 */
export async function uploadMedia(file: File | Blob, folder = "uploads"): Promise<string> {
  // 1. Try Supabase Edge Function 'cloudinary-upload'
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", folder);

    const { data, error } = await supabase.functions.invoke("cloudinary-upload", {
      body: fd,
      headers: session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {},
    });

    if (!error && data?.secure_url) {
      return data.secure_url;
    }
  } catch (err) {
    console.warn("Cloudinary Edge Function upload error, trying fallbacks:", err);
  }

  // 2. Try Supabase Storage bucket 'portfolio'
  try {
    const ext = file instanceof File ? file.name.split(".").pop() || "png" : "png";
    const path = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error: storageErr } = await supabase.storage.from("portfolio").upload(path, file, {
      upsert: true,
    });
    if (!storageErr) {
      const { data } = supabase.storage.from("portfolio").getPublicUrl(path);
      if (data?.publicUrl) {
        return data.publicUrl;
      }
    }
  } catch {
    // continue to data url fallback
  }

  // 3. Fallback: Base64 Data URL (ensures zero crashes in offline/preview environments)
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Converts a File object to Base64 encoded string
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.includes(",") ? result.split(",")[1] : result;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
