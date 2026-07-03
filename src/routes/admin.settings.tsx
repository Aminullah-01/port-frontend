import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/contexts/theme-context";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: "Settings — Admin" }] }),
  component: SettingsAdmin,
});

function SettingsAdmin() {
  const { theme, toggle } = useTheme();
  const [f, setF] = useState({
    primary: "#8b5cf6", accent: "#c084fc", font: "Inter",
    animations: true, darkDefault: theme === "dark",
    heroBg: "gradient", logo: "A", favicon: "/favicon.ico",
  });

  return (
    <div>
      <AdminPageHeader title="Settings" description="Theme, branding, and site preferences."
        actions={<Button className="gap-2 bg-gradient-primary text-primary-foreground" onClick={() => toast.success("Settings saved")}><Save className="h-4 w-4" />Save</Button>} />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border bg-card p-6 shadow-soft">
          <h3 className="font-bold">Theme</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label>Primary color</Label><Input type="color" value={f.primary} onChange={(e) => setF({ ...f, primary: e.target.value })} /></div>
            <div className="space-y-2"><Label>Accent color</Label><Input type="color" value={f.accent} onChange={(e) => setF({ ...f, accent: e.target.value })} /></div>
            <div className="space-y-2"><Label>Font family</Label><Input value={f.font} onChange={(e) => setF({ ...f, font: e.target.value })} /></div>
            <div className="space-y-2"><Label>Hero background</Label><Input value={f.heroBg} onChange={(e) => setF({ ...f, heroBg: e.target.value })} /></div>
          </div>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between"><Label>Animations</Label><Switch checked={f.animations} onCheckedChange={(v) => setF({ ...f, animations: v })} /></div>
            <div className="flex items-center justify-between"><Label>Dark mode default</Label><Switch checked={theme === "dark"} onCheckedChange={toggle} /></div>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-soft">
          <h3 className="font-bold">Branding</h3>
          <div className="mt-4 space-y-4">
            <div className="space-y-2"><Label>Logo (initial or URL)</Label><Input value={f.logo} onChange={(e) => setF({ ...f, logo: e.target.value })} /></div>
            <div className="space-y-2"><Label>Favicon path</Label><Input value={f.favicon} onChange={(e) => setF({ ...f, favicon: e.target.value })} /></div>
          </div>
          <h3 className="mt-6 font-bold">Shortcuts</h3>
          <div className="mt-3 space-y-2 text-sm text-muted-foreground">
            <div className="flex justify-between rounded-lg border p-2"><span>Search</span><kbd className="rounded bg-muted px-2 py-0.5 text-xs">⌘ K</kbd></div>
            <div className="flex justify-between rounded-lg border p-2"><span>New project</span><kbd className="rounded bg-muted px-2 py-0.5 text-xs">N</kbd></div>
            <div className="flex justify-between rounded-lg border p-2"><span>Toggle theme</span><kbd className="rounded bg-muted px-2 py-0.5 text-xs">T</kbd></div>
          </div>
        </div>
      </div>
    </div>
  );
}
