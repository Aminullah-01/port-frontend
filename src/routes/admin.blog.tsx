import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2, Pencil, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useBlogPosts, useCreateBlogPost, useUpdateBlogPost, useDeleteBlogPost } from "@/hooks/use-blog";
import type { BlogPost } from "@/data/portfolio";

export const Route = createFileRoute("/admin/blog")({
  head: () => ({ meta: [{ title: "Blog — Admin" }] }),
  component: BlogAdmin,
});

const empty: BlogPost = { id: "", title: "", slug: "", category: "General", tags: [], cover: "", excerpt: "", content: "", published: false, date: new Date().toISOString().slice(0, 10) };

function toBlogFormData(b: BlogPost & { coverFile?: File }): FormData {
  const fd = new FormData();
  fd.append("title", b.title);
  fd.append("slug", b.slug);
  fd.append("category", b.category);
  fd.append("content", b.content);
  if (b.coverFile) {
    fd.append("cover_image", b.coverFile);
  } else if (b.cover) {
    fd.append("cover_image", b.cover);
  }
  fd.append("status", b.published ? "published" : "draft");
  b.tags.forEach((t) => fd.append("tags[]", t));
  return fd;
}

function BlogAdmin() {
  const { data: blog = [], isLoading } = useBlogPosts();
  const createMutation = useCreateBlogPost();
  const updateMutation = useUpdateBlogPost();
  const deleteMutation = useDeleteBlogPost();
  const [editing, setEditing] = useState<BlogPost | null>(null);

  const save = async (b: BlogPost & { coverFile?: File }) => {
    const isNew = !b.id;
    try {
      if (isNew) {
        const fd = toBlogFormData(b);
        await createMutation.mutateAsync(fd);
      } else {
        const fd = toBlogFormData(b);
        await updateMutation.mutateAsync({ id: Number(b.id), data: fd });
      }
      toast.success("Saved");
      setEditing(null);
    } catch {
      toast.error("Failed to save");
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
      <AdminPageHeader title="Blog" description="Write and publish articles."
        actions={<Button className="gap-2 bg-gradient-primary text-primary-foreground" onClick={() => setEditing({ ...empty })}><Plus className="h-4 w-4" />New post</Button>} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {blog.map((b) => (
          <div key={b.id} className="overflow-hidden rounded-2xl border bg-card shadow-soft">
            {b.cover && <img src={b.cover} alt="" className="aspect-video w-full object-cover" />}
            <div className="p-4">
              <div className="flex items-center gap-2 text-xs">
                <Badge variant={b.published ? "default" : "outline"}>{b.published ? "Published" : "Draft"}</Badge>
                <span className="text-muted-foreground">{b.date}</span>
              </div>
              <h3 className="mt-2 font-bold">{b.title}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{b.excerpt}</p>
              <div className="mt-3 flex gap-1">
                <Button size="sm" variant="outline" onClick={() => setEditing(b)}><Pencil className="h-3 w-3" /></Button>
                <Button size="sm" variant="ghost" onClick={() => remove(b.id)}><Trash2 className="h-3 w-3" /></Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{editing?.id ? "Edit" : "New"} post</DialogTitle></DialogHeader>
          {editing && <Form value={editing} onSave={save} onCancel={() => setEditing(null)} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Form({ value, onSave, onCancel }: { value: BlogPost; onSave: (b: BlogPost & { coverFile?: File }) => void; onCancel: () => void }) {
  const [f, setF] = useState(value);
  const [tags, setTags] = useState(value.tags.join(", "));
  return (
    <div className="grid gap-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2"><Label>Title</Label><Input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") })} /></div>
        <div className="space-y-2"><Label>Slug</Label><Input value={f.slug} onChange={(e) => setF({ ...f, slug: e.target.value })} /></div>
        <div className="space-y-2"><Label>Category</Label><Input value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })} /></div>
        <div className="space-y-2 sm:col-span-2"><Label>Tags (comma-separated)</Label><Input value={tags} onChange={(e) => { setTags(e.target.value); setF({ ...f, tags: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) }); }} /></div>
        <div className="space-y-2 sm:col-span-2">
          <Label>Cover image</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setF({ ...f, coverFile: file, cover: URL.createObjectURL(file) } as any);
              }
            }}
          />
          {f.cover && <img src={f.cover} alt="" className="mt-2 h-32 w-full rounded-lg object-cover" />}
        </div>
        <div className="space-y-2 sm:col-span-2"><Label>Excerpt</Label><Textarea rows={2} value={f.excerpt} onChange={(e) => setF({ ...f, excerpt: e.target.value })} /></div>
        <div className="space-y-2 sm:col-span-2"><Label>Content (Markdown)</Label><Textarea rows={6} value={f.content} onChange={(e) => setF({ ...f, content: e.target.value })} /></div>
      </div>
      <div className="flex items-center gap-2"><Switch checked={f.published} onCheckedChange={(v) => setF({ ...f, published: v })} /><Label>Published</Label></div>
      <div className="flex justify-end gap-2"><Button variant="ghost" onClick={onCancel}>Cancel</Button><Button className="bg-gradient-primary text-primary-foreground" onClick={() => onSave(f)}>Save</Button></div>
    </div>
  );
}
