import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePortfolio } from "@/contexts/portfolio-context";

export const Route = createFileRoute("/admin/profile")({
  head: () => ({ meta: [{ title: "Profile — Admin" }] }),
  component: ProfileAdmin,
});

function ProfileAdmin() {
  const { profile, setProfile } = usePortfolio();
  const [f, setF] = useState(profile);
  const save = () => { setProfile(f); toast.success("Profile updated"); };

  return (
    <div>
      <AdminPageHeader title="Profile" description="Manage personal and public information."
        actions={<Button className="gap-2 bg-gradient-primary text-primary-foreground" onClick={save}><Save className="h-4 w-4" />Save</Button>} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border bg-card p-6 shadow-soft">
          <img src={f.avatar} alt="" className="mx-auto h-32 w-32 rounded-full bg-muted" />
          <div className="mt-4 space-y-2"><Label>Avatar URL</Label><Input value={f.avatar} onChange={(e) => setF({ ...f, avatar: e.target.value })} /></div>
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
            <div className="space-y-2"><Label>WhatsApp</Label><Input value={f.socials.whatsapp} onChange={(e) => setF({ ...f, socials: { ...f.socials, whatsapp: e.target.value } })} /></div>
          </div>
        </div>
      </div>
    </div>
  );
}
