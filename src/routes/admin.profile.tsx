import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useProfile, useUpdateProfile } from "@/hooks/use-profile";

export const Route = createFileRoute("/admin/profile")({
  head: () => ({ meta: [{ title: "Profile — Admin" }] }),
  component: ProfileAdmin,
});

function ProfileAdmin() {
  const { data: profile, isLoading } = useProfile();
  const updateMutation = useUpdateProfile();
  const [f, setF] = useState<((typeof profile) & { avatarFile?: File }) | null>(profile ?? null);

  useEffect(() => {
    if (profile && !f) setF(profile);
  }, [profile, f]);

  if (isLoading || !f) {
    return <div className="flex min-h-[400px] items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  const save = async () => {
    const fd = new FormData();
    const nameParts = f.name.split(" ");
    fd.append("first_name", nameParts[0] || "");
    fd.append("last_name", nameParts.slice(1).join(" ") || "");
    fd.append("email", f.email);
    fd.append("phone", f.phone);
    fd.append("location", f.location);
    fd.append("headline", f.tagline);
    fd.append("bio", f.bio);
    if (f.avatarFile) {
      fd.append("avatar", f.avatarFile);
    } else if (f.avatar) {
      fd.append("avatar", f.avatar);
    }
    if (f.socials.github) fd.append("github_url", f.socials.github);
    if (f.socials.linkedin) fd.append("linkedin_url", f.socials.linkedin);
    if (f.socials.facebook) fd.append("facebook_url", f.socials.facebook);
    if (f.socials.twitter) fd.append("twitter_url", f.socials.twitter);
    if (f.socials.whatsapp) fd.append("whatsapp_url", f.socials.whatsapp);
    try {
      await updateMutation.mutateAsync(fd);
      toast.success("Profile updated");
    } catch (err: any) {
      const msg = err.errors ? Object.values(err.errors).flat()[0] : err.message;
      toast.error(msg || "Failed to update profile");
    }
  };

  return (
    <div>
      <AdminPageHeader title="Profile" description="Manage personal and public information."
        actions={<Button className="gap-2 bg-gradient-primary text-primary-foreground" onClick={save} disabled={updateMutation.isPending}><Save className="h-4 w-4" />{updateMutation.isPending ? "Saving..." : "Save"}</Button>} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border bg-card p-6 shadow-soft">
          <img src={f.avatar} alt="" className="mx-auto h-32 w-32 rounded-full bg-muted object-cover" />
          <div className="mt-4 space-y-2">
            <Label>Profile Picture</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setF({ ...f, avatarFile: file, avatar: URL.createObjectURL(file) });
                }
              }}
            />
            <p className="text-[11px] text-muted-foreground mt-1">Upload a JPG, PNG, or WebP image.</p>
          </div>
        </div>

        <div className="grid gap-4 rounded-2xl border bg-card p-6 shadow-soft lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label>Name</Label><Input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
            <div className="space-y-2"><Label>Email</Label><Input value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></div>
            <div className="space-y-2"><Label>Phone</Label><Input value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></div>
            <div className="space-y-2"><Label>Location</Label><Input value={f.location} onChange={(e) => setF({ ...f, location: e.target.value })} /></div>
          </div>
          <div className="space-y-2"><Label>Tagline</Label><Input value={f.tagline} onChange={(e) => setF({ ...f, tagline: e.target.value })} /></div>
          <div className="space-y-2"><Label>Biography</Label><Textarea rows={4} value={f.bio} onChange={(e) => setF({ ...f, bio: e.target.value })} /></div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2"><Label>GitHub</Label><Input value={f.socials.github} onChange={(e) => setF({ ...f, socials: { ...f.socials, github: e.target.value } })} /></div>
            <div className="space-y-2"><Label>LinkedIn</Label><Input value={f.socials.linkedin} onChange={(e) => setF({ ...f, socials: { ...f.socials, linkedin: e.target.value } })} /></div>
            <div className="space-y-2"><Label>Facebook</Label><Input value={f.socials.facebook} onChange={(e) => setF({ ...f, socials: { ...f.socials, facebook: e.target.value } })} /></div>
            <div className="space-y-2"><Label>Twitter</Label><Input value={f.socials.twitter} onChange={(e) => setF({ ...f, socials: { ...f.socials, twitter: e.target.value } })} /></div>
            <div className="space-y-2"><Label>WhatsApp</Label><Input value={f.socials.whatsapp} onChange={(e) => setF({ ...f, socials: { ...f.socials, whatsapp: e.target.value } })} /></div>
          </div>
        </div>
      </div>
    </div>
  );
}
