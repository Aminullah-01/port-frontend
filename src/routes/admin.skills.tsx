import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2, Pencil, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSkills, useCreateSkill, useUpdateSkill, useDeleteSkill } from "@/hooks/use-skills";
import type { Skill } from "@/data/portfolio";

export const Route = createFileRoute("/admin/skills")({
  head: () => ({ meta: [{ title: "Skills — Admin" }] }),
  component: SkillsAdmin,
});

const empty: Skill = { id: "", name: "", category: "Frontend", percentage: 80, color: "#8b5cf6", order: 0 };

function SkillsAdmin() {
  const { data: skills = [], isLoading } = useSkills();
  const createMutation = useCreateSkill();
  const updateMutation = useUpdateSkill();
  const deleteMutation = useDeleteSkill();
  const [editing, setEditing] = useState<Skill | null>(null);

  const save = async (s: Skill) => {
    const isNew = !s.id;
    const payload: Record<string, unknown> = {
      name: s.name,
      category: s.category,
      percentage: s.percentage,
      color: s.color,
      display_order: s.order,
    };
    try {
      if (isNew) {
        await createMutation.mutateAsync(payload);
      } else {
        await updateMutation.mutateAsync({ id: Number(s.id), data: payload });
      }
      toast.success(isNew ? "Skill added" : "Skill updated");
      setEditing(null);
    } catch {
      toast.error("Failed to save skill");
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
      <AdminPageHeader title="Skills" description="Add, edit, and organize skills."
        actions={<Button className="gap-2 bg-gradient-primary text-primary-foreground" onClick={() => setEditing({ ...empty })}><Plus className="h-4 w-4" />New skill</Button>} />

      <div className="overflow-hidden rounded-2xl border bg-card shadow-soft">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
            <tr><th className="p-3">Name</th><th className="p-3">Category</th><th className="p-3">Level</th><th className="p-3">Color</th><th className="p-3 text-right">Actions</th></tr>
          </thead>
          <tbody>
            {skills.map((s) => (
              <tr key={s.id} className="border-t hover:bg-muted/30">
                <td className="p-3 font-medium">{s.name}</td>
                <td className="p-3">{s.category}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
                      <div className="h-full bg-gradient-primary" style={{ width: `${s.percentage}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground">{s.percentage}%</span>
                  </div>
                </td>
                <td className="p-3"><div className="h-6 w-6 rounded border" style={{ background: s.color }} /></td>
                <td className="p-3 text-right">
                  <Button size="icon" variant="ghost" onClick={() => setEditing(s)}><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => remove(s.id)}><Trash2 className="h-4 w-4" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing?.id ? "Edit skill" : "New skill"}</DialogTitle></DialogHeader>
          {editing && <SkillForm value={editing} onSave={save} onCancel={() => setEditing(null)} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SkillForm({ value, onSave, onCancel }: { value: Skill; onSave: (s: Skill) => void; onCancel: () => void }) {
  const [f, setF] = useState(value);
  return (
    <div className="grid gap-3">
      <div className="space-y-2"><Label>Name</Label><Input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
      <div className="space-y-2"><Label>Category</Label><Input value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })} /></div>
      <div className="space-y-2"><Label>Percentage: {f.percentage}%</Label><Input type="range" min={0} max={100} value={f.percentage} onChange={(e) => setF({ ...f, percentage: Number(e.target.value) })} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2"><Label>Color</Label><Input type="color" value={f.color} onChange={(e) => setF({ ...f, color: e.target.value })} /></div>
        <div className="space-y-2"><Label>Order</Label><Input type="number" value={f.order} onChange={(e) => setF({ ...f, order: Number(e.target.value) })} /></div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button className="bg-gradient-primary text-primary-foreground" onClick={() => onSave(f)}>Save</Button>
      </div>
    </div>
  );
}
