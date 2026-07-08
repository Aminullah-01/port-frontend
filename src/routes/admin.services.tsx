import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2, Pencil, Wrench, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useServices, useCreateService, useUpdateService, useDeleteService } from "@/hooks/use-services";
import type { Service } from "@/data/portfolio";

export const Route = createFileRoute("/admin/services")({
  head: () => ({ meta: [{ title: "Services — Admin" }] }),
  component: ServicesAdmin,
});

const empty: Service = { id: "", title: "", description: "", icon: Wrench, features: [], order: 0 };

function ServicesAdmin() {
  const { data: services = [], isLoading } = useServices();
  const createMutation = useCreateService();
  const updateMutation = useUpdateService();
  const deleteMutation = useDeleteService();
  const [editing, setEditing] = useState<Service | null>(null);

  const save = async (s: Service) => {
    const isNew = !s.id;
    const payload: Record<string, unknown> = {
      title: s.title,
      description: s.description,
      features: s.features,
      display_order: s.order,
      icon: "code2",
    };
    try {
      if (isNew) {
        await createMutation.mutateAsync(payload);
      } else {
        await updateMutation.mutateAsync({ id: Number(s.id), data: payload });
      }
      toast.success("Saved");
      setEditing(null);
    } catch {
      toast.error("Failed to save service");
    }
  };

  const remove = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(Number(id));
      toast.success("Deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  if (isLoading) {
    return <div className="flex min-h-[400px] items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div>
      <AdminPageHeader title="Services" description="Offerings displayed on the site."
        actions={<Button className="gap-2 bg-gradient-primary text-primary-foreground" onClick={() => setEditing({ ...empty })}><Plus className="h-4 w-4" />New service</Button>} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <div key={s.id} className="rounded-2xl border bg-card p-5 shadow-soft">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary text-primary-foreground"><s.icon className="h-5 w-5" /></div>
            <h3 className="mt-3 font-bold">{s.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>
            <div className="mt-3 text-xs text-muted-foreground">{s.features.length} features · order {s.order}</div>
            <div className="mt-3 flex gap-1">
              <Button size="sm" variant="outline" onClick={() => setEditing(s)}><Pencil className="h-3 w-3" /></Button>
              <Button size="sm" variant="ghost" onClick={() => remove(s.id)}><Trash2 className="h-3 w-3" /></Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing?.id ? "Edit service" : "New service"}</DialogTitle></DialogHeader>
          {editing && <Form value={editing} onSave={save} onCancel={() => setEditing(null)} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Form({ value, onSave, onCancel }: { value: Service; onSave: (s: Service) => void; onCancel: () => void }) {
  const [f, setF] = useState(value);
  const [feat, setFeat] = useState(value.features.join("\n"));
  return (
    <div className="grid gap-3">
      <div className="space-y-2"><Label>Title</Label><Input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></div>
      <div className="space-y-2"><Label>Description</Label><Textarea value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></div>
      <div className="space-y-2"><Label>Features (one per line)</Label><Textarea rows={4} value={feat} onChange={(e) => { setFeat(e.target.value); setF({ ...f, features: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) }); }} /></div>
      <div className="space-y-2"><Label>Order</Label><Input type="number" value={f.order} onChange={(e) => setF({ ...f, order: Number(e.target.value) })} /></div>
      <div className="flex justify-end gap-2"><Button variant="ghost" onClick={onCancel}>Cancel</Button><Button className="bg-gradient-primary text-primary-foreground" onClick={() => onSave(f)}>Save</Button></div>
    </div>
  );
}
