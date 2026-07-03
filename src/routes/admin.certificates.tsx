import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2, Pencil, Upload } from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { usePortfolio } from "@/contexts/portfolio-context";
import type { Certificate } from "@/data/portfolio";

export const Route = createFileRoute("/admin/certificates")({
  head: () => ({ meta: [{ title: "Certificates — Admin" }] }),
  component: CertsAdmin,
});

const empty: Certificate = { id: "", title: "", organization: "", date: "", credentialUrl: "", image: "" };

function CertsAdmin() {
  const { certificates, setCertificates } = usePortfolio();
  const [editing, setEditing] = useState<Certificate | null>(null);

  const save = (c: Certificate) => {
    const isNew = !c.id;
    const item = isNew ? { ...c, id: String(Date.now()) } : c;
    setCertificates((prev) => isNew ? [...prev, item] : prev.map((x) => x.id === c.id ? item : x));
    toast.success("Saved"); setEditing(null);
  };

  return (
    <div>
      <AdminPageHeader title="Certificates" description="Upload and manage certificates."
        actions={<Button className="gap-2 bg-gradient-primary text-primary-foreground" onClick={() => setEditing({ ...empty })}><Upload className="h-4 w-4" />Upload</Button>} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {certificates.map((c) => (
          <div key={c.id} className="overflow-hidden rounded-2xl border bg-card shadow-soft">
            <img src={c.image} alt={c.title} className="aspect-video w-full object-cover" />
            <div className="p-4">
              <div className="text-xs text-primary">{c.date}</div>
              <h3 className="mt-1 font-bold">{c.title}</h3>
              <p className="text-sm text-muted-foreground">{c.organization}</p>
              <div className="mt-3 flex gap-1">
                <Button size="sm" variant="outline" onClick={() => setEditing(c)}><Pencil className="h-3 w-3" /></Button>
                <Button size="sm" variant="ghost" onClick={() => { setCertificates((p) => p.filter((x) => x.id !== c.id)); toast.success("Deleted"); }}><Trash2 className="h-3 w-3" /></Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing?.id ? "Edit" : "Upload"} certificate</DialogTitle></DialogHeader>
          {editing && <Form value={editing} onSave={save} onCancel={() => setEditing(null)} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Form({ value, onSave, onCancel }: { value: Certificate; onSave: (c: Certificate) => void; onCancel: () => void }) {
  const [f, setF] = useState(value);
  return (
    <div className="grid gap-3">
      <div className="space-y-2"><Label>Title</Label><Input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></div>
      <div className="space-y-2"><Label>Organization</Label><Input value={f.organization} onChange={(e) => setF({ ...f, organization: e.target.value })} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2"><Label>Date</Label><Input value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} /></div>
        <div className="space-y-2"><Label>Credential URL</Label><Input value={f.credentialUrl} onChange={(e) => setF({ ...f, credentialUrl: e.target.value })} /></div>
      </div>
      <div className="space-y-2"><Label>Image URL</Label><Input value={f.image} onChange={(e) => setF({ ...f, image: e.target.value })} /></div>
      {f.image && <img src={f.image} alt="" className="aspect-video w-full rounded-lg object-cover" />}
      <div className="flex justify-end gap-2"><Button variant="ghost" onClick={onCancel}>Cancel</Button><Button className="bg-gradient-primary text-primary-foreground" onClick={() => onSave(f)}>Save</Button></div>
    </div>
  );
}

export { CertsAdmin };
