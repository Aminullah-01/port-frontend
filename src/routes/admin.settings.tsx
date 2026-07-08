import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { settingsApi } from "@/api/endpoints";
import type { SettingData } from "@/types/api";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: "Settings — Admin" }] }),
  component: SettingsAdmin,
});

function SettingsAdmin() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    site_name: "",
    hero_title: "",
    hero_subtitle: "",
    seo_title: "",
    seo_description: "",
    social_links: JSON.stringify({ github: "", linkedin: "", twitter: "" }, null, 2),
  });

  useEffect(() => {
    settingsApi.get()
      .then((data: SettingData) => {
        setForm({
          site_name: data.site_name || "",
          hero_title: data.hero_title || "",
          hero_subtitle: data.hero_subtitle || "",
          seo_title: data.seo_title || "",
          seo_description: data.seo_description || "",
          social_links: JSON.stringify(data.social_links || {}, null, 2),
        });
      })
      .catch(() => toast.error("Failed to load settings"))
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      let social_links: Record<string, string> = {};
      try { social_links = JSON.parse(form.social_links); } catch { social_links = {}; }
      await settingsApi.update({
        site_name: form.site_name,
        hero_title: form.hero_title,
        hero_subtitle: form.hero_subtitle,
        seo_title: form.seo_title,
        seo_description: form.seo_description,
        social_links,
      });
      toast.success("Settings saved");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex min-h-[400px] items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div>
      <AdminPageHeader title="Settings" description="Site name, SEO, and social links."
        actions={<Button disabled={saving} className="gap-2 bg-gradient-primary text-primary-foreground" onClick={save}>{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}Save</Button>} />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border bg-card p-6 shadow-soft">
          <h3 className="font-bold">General</h3>
          <div className="mt-4 space-y-4">
            <div className="space-y-2"><Label>Site name</Label><Input value={form.site_name} onChange={(e) => setForm({ ...form, site_name: e.target.value })} /></div>
            <div className="space-y-2"><Label>Hero title</Label><Input value={form.hero_title} onChange={(e) => setForm({ ...form, hero_title: e.target.value })} /></div>
            <div className="space-y-2"><Label>Hero subtitle</Label><Textarea rows={2} value={form.hero_subtitle} onChange={(e) => setForm({ ...form, hero_subtitle: e.target.value })} /></div>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-soft">
          <h3 className="font-bold">SEO</h3>
          <div className="mt-4 space-y-4">
            <div className="space-y-2"><Label>SEO title</Label><Input value={form.seo_title} onChange={(e) => setForm({ ...form, seo_title: e.target.value })} /></div>
            <div className="space-y-2"><Label>SEO description</Label><Textarea rows={2} value={form.seo_description} onChange={(e) => setForm({ ...form, seo_description: e.target.value })} /></div>
          </div>
          <h3 className="mt-6 font-bold">Social links (JSON)</h3>
          <div className="mt-4 space-y-2">
            <Textarea rows={4} value={form.social_links} onChange={(e) => setForm({ ...form, social_links: e.target.value })} />
          </div>
        </div>
      </div>
    </div>
  );
}
