import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Plus, Search, Trash2, Pencil, Star, LayoutGrid, List, Github, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useProjects, useCreateProject, useUpdateProject, useDeleteProject } from "@/hooks/use-projects";
import type { Project } from "@/data/portfolio";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/projects")({
  head: () => ({ meta: [{ title: "Projects — Admin" }] }),
  component: ProjectsAdmin,
});

const empty: Project = {
  id: "", title: "", description: "", longDescription: "", image: "",
  tech: [], category: "Web App", github: "", live: "", featured: false,
  status: "published", order: 0, tags: [],
};

function toProjectFormData(p: any): FormData {
  const fd = new FormData();
  fd.append("title", p.title);
  fd.append("description", p.longDescription || p.description);
  fd.append("category", p.category);
  p.tech.forEach((t) => fd.append("technologies[]", t));
  if (p.github) fd.append("github_url", p.github);
  if (p.live) fd.append("live_url", p.live);
  fd.append("featured", p.featured ? "1" : "0");
  fd.append("status", p.status);
  fd.append("display_order", String(p.order));

  if (p.imageFile) {
    fd.append("thumbnail", p.imageFile);
  } else if (p.image) {
    fd.append("thumbnail", p.image);
  }

  fd.append("_method", "PUT");
  return fd;
}

function ProjectsAdmin() {
  const { data: projects = [], isLoading } = useProjects();
  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();
  const deleteMutation = useDeleteProject();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [view, setView] = useState<"table" | "grid">("table");
  const [editing, setEditing] = useState<Project | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const perPage = 6;

  const cats = ["All", ...Array.from(new Set(projects.map((p) => p.category)))];
  const filtered = useMemo(() =>
    projects.filter((p) =>
      (cat === "All" || p.category === cat) &&
      (p.title.toLowerCase().includes(q.toLowerCase()))
    ), [projects, cat, q]);

  const paged = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));

  const save = async (p: Project) => {
    const isNew = !p.id;
    try {
      if (isNew) {
        const fd = toProjectFormData(p);
        fd.delete("_method");
        await createMutation.mutateAsync(fd);
      } else {
        const fd = toProjectFormData(p);
        await updateMutation.mutateAsync({ id: Number(p.id), data: fd });
      }
      toast.success(isNew ? "Project created" : "Project updated");
      setEditing(null);
    } catch {
      toast.error("Failed to save project");
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
  const removeBulk = async () => {
    try {
      await Promise.all(Array.from(selected).map((id) => deleteMutation.mutateAsync(Number(id))));
      toast.success(`${selected.size} deleted`);
      setSelected(new Set());
    } catch {
      toast.error("Failed to delete some items");
    }
  };

  if (isLoading) {
    return <div className="flex min-h-[400px] items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div>
      <AdminPageHeader
        title="Projects"
        description="Manage portfolio projects."
        actions={
          <>
            {selected.size > 0 && (
              <Button variant="destructive" className="gap-2" onClick={removeBulk}>
                <Trash2 className="h-4 w-4" />Delete {selected.size}
              </Button>
            )}
            <Button className="gap-2 bg-gradient-primary text-primary-foreground" onClick={() => setEditing({ ...empty })}>
              <Plus className="h-4 w-4" />New project
            </Button>
          </>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 md:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
        </div>
        <div className="flex flex-wrap gap-1">
          {cats.map((c) => (
            <button key={c} onClick={() => setCat(c)}
              className={cn("rounded-full border px-3 py-1 text-xs",
                cat === c ? "border-transparent bg-gradient-primary text-primary-foreground" : "hover:bg-muted")}>{c}</button>
          ))}
        </div>
        <div className="ml-auto flex rounded-lg border p-0.5 bg-muted/30">
          <Button variant="ghost" size="sm" onClick={() => setView("table")} className={cn("h-7 gap-1.5 px-2.5 text-xs font-medium rounded-md", view === "table" ? "bg-background shadow-sm" : "hover:bg-muted")}>
            <List className="h-3.5 w-3.5" /> List
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setView("grid")} className={cn("h-7 gap-1.5 px-2.5 text-xs font-medium rounded-md", view === "grid" ? "bg-background shadow-sm" : "hover:bg-muted")}>
            <LayoutGrid className="h-3.5 w-3.5" /> Grid
          </Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border bg-card p-16 text-center">
          <p className="text-muted-foreground">No projects match your filters.</p>
        </div>
      ) : view === "table" ? (
        <div className="overflow-hidden rounded-2xl border bg-card shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-3 w-10"></th>
                  <th className="p-3">Project</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Featured</th>
                  <th className="p-3">Order</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((p) => (
                  <tr key={p.id} className="border-t transition-colors hover:bg-muted/30">
                    <td className="p-3">
                      <input type="checkbox" checked={selected.has(p.id)} onChange={(e) => {
                        const n = new Set(selected);
                        e.target.checked ? n.add(p.id) : n.delete(p.id);
                        setSelected(n);
                      }} />
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt="" className="h-10 w-14 rounded object-cover" />
                        <div className="min-w-0">
                          <div className="truncate font-medium">{p.title}</div>
                          <div className="truncate text-xs text-muted-foreground">{p.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3"><Badge variant="secondary">{p.category}</Badge></td>
                    <td className="p-3"><Badge variant={p.status === "published" ? "default" : "outline"}>{p.status}</Badge></td>
                    <td className="p-3">{p.featured && <Star className="h-4 w-4 fill-primary text-primary" />}</td>
                    <td className="p-3">{p.order}</td>
                    <td className="p-3 text-right">
                      <div className="inline-flex gap-1">
                        <Button size="icon" variant="ghost" onClick={() => setEditing(p)}><Pencil className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" onClick={() => setConfirmId(p.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t p-3 text-sm">
            <span className="text-muted-foreground">Page {page} of {totalPages}</span>
            <div className="flex gap-1">
              <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Prev</Button>
              <Button size="sm" variant="outline" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {paged.map((p) => (
            <div key={p.id} className="group relative overflow-hidden rounded-2xl border bg-card shadow-soft transition-all hover:shadow-medium">
              <div className="relative aspect-video w-full overflow-hidden">
                <img src={p.image} alt={p.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                {p.featured && (
                  <div className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-background/90 backdrop-blur-sm shadow-soft text-yellow-500">
                    <Star className="h-4 w-4 fill-current" />
                  </div>
                )}
                <div className="absolute left-3 top-3">
                  <Badge variant={p.status === "published" ? "default" : "outline"} className="backdrop-blur-sm bg-background/80 shadow-sm border text-foreground">
                    {p.status}
                  </Badge>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <Badge variant="secondary" className="font-semibold text-primary">{p.category}</Badge>
                  <span className="font-medium text-xs">Order: {p.order}</span>
                </div>
                <h3 className="mt-2 font-bold text-base line-clamp-1">{p.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{p.description}</p>
                <div className="mt-4 flex gap-1.5">
                  <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setEditing(p)}>
                    <Pencil className="h-3.5 w-3.5" />Edit
                  </Button>
                  <Button size="sm" variant="ghost" className="gap-1.5 text-destructive hover:bg-destructive/10" onClick={() => setConfirmId(p.id)}>
                    <Trash2 className="h-3.5 w-3.5" />Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ProjectDialog open={!!editing} project={editing} onClose={() => setEditing(null)} onSave={save} />

      <AlertDialog open={!!confirmId} onOpenChange={(o) => !o && setConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete project?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { if (confirmId) remove(confirmId); setConfirmId(null); }}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function ProjectDialog({ open, project, onClose, onSave }: { open: boolean; project: Project | null; onClose: () => void; onSave: (p: Project) => void }) {
  const [form, setForm] = useState<Project>(project ?? empty);
  const [techInput, setTechInput] = useState("");

  useMemo(() => { if (project) { setForm(project); setTechInput(project.tech.join(", ")); } }, [project]);

  if (!project) return null;
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader><DialogTitle>{form.id ? "Edit project" : "New project"}</DialogTitle></DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2"><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          <div className="space-y-2 sm:col-span-2"><Label>Short description</Label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div className="space-y-2 sm:col-span-2"><Label>Long description</Label><Textarea rows={3} value={form.longDescription} onChange={(e) => setForm({ ...form, longDescription: e.target.value })} /></div>
          <div className="space-y-2"><Label>Category</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
          <div className="space-y-2">
            <Label>Project Image</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setForm({ ...form, imageFile: file, image: URL.createObjectURL(file) } as any);
                }
              }}
            />
          </div>
          <div className="space-y-2"><Label>GitHub URL</Label><Input value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} /></div>
          <div className="space-y-2"><Label>Live URL</Label><Input value={form.live} onChange={(e) => setForm({ ...form, live: e.target.value })} /></div>
          <div className="space-y-2 sm:col-span-2"><Label>Tech (comma-separated)</Label>
            <Input value={techInput} onChange={(e) => { setTechInput(e.target.value); setForm({ ...form, tech: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) }); }} />
          </div>
          <div className="space-y-2"><Label>Order</Label><Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} /></div>
          <div className="flex items-center gap-3 pt-6"><Switch checked={form.featured} onCheckedChange={(v) => setForm({ ...form, featured: v })} /><Label>Featured</Label></div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button className="bg-gradient-primary text-primary-foreground" onClick={() => onSave(form)}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
