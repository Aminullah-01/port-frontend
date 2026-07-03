import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Github, ExternalLink, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FadeIn, SectionHeading } from "@/components/site/primitives";
import { usePortfolio } from "@/contexts/portfolio-context";
import type { Project } from "@/data/portfolio";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_site/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Aminu Gambo" },
      { name: "description", content: "Selected projects across frontend, design, and AI." },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const { projects } = usePortfolio();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("All");
  const [sort, setSort] = useState<"latest" | "az">("latest");
  const [selected, setSelected] = useState<Project | null>(null);

  const categories = ["All", ...Array.from(new Set(projects.map((p) => p.category)))];

  const filtered = useMemo(() => {
    let list = projects.filter((p) =>
      (cat === "All" || p.category === cat) &&
      (p.title.toLowerCase().includes(q.toLowerCase()) || p.description.toLowerCase().includes(q.toLowerCase()))
    );
    if (sort === "az") list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    else list = [...list].sort((a, b) => a.order - b.order);
    return list;
  }, [projects, q, cat, sort]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <FadeIn><SectionHeading eyebrow="Portfolio" title="Projects" description="A collection of work across product, design, and code." /></FadeIn>

      <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 md:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search projects…" className="pl-9" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button key={c} onClick={() => setCat(c)}
              className={cn("rounded-full border px-3 py-1.5 text-sm transition-all",
                cat === c ? "border-transparent bg-gradient-primary text-primary-foreground" : "hover:bg-muted")}>
              {c}
            </button>
          ))}
        </div>
        <select value={sort} onChange={(e) => setSort(e.target.value as "latest" | "az")}
          className="rounded-lg border bg-card px-3 py-2 text-sm">
          <option value="latest">Latest</option>
          <option value="az">A–Z</option>
        </select>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((p, i) => (
            <motion.div key={p.id} layout
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: i * 0.03 }}>
              <button onClick={() => setSelected(p)}
                className="group block w-full overflow-hidden rounded-2xl border bg-card text-left shadow-soft transition-all hover:-translate-y-1 hover:shadow-elegant">
                <div className="relative aspect-video overflow-hidden">
                  <img src={p.image} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  {p.featured && (
                    <Badge className="absolute left-3 top-3 gap-1 bg-gradient-primary text-primary-foreground border-0">
                      <Star className="h-3 w-3" />Featured
                    </Badge>
                  )}
                </div>
                <div className="p-5">
                  <div className="text-xs font-medium text-primary">{p.category}</div>
                  <h3 className="mt-1 text-lg font-bold">{p.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.description}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {p.tech.slice(0, 3).map((t) => (
                      <span key={t} className="rounded-md bg-muted px-2 py-0.5 text-xs">{t}</span>
                    ))}
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="mt-20 text-center text-muted-foreground">
          <Search className="mx-auto h-8 w-8 opacity-40" />
          <p className="mt-4">No projects match your search.</p>
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-3xl overflow-hidden p-0">
          {selected && (
            <>
              <div className="relative aspect-video">
                <img src={selected.image} alt={selected.title} className="h-full w-full object-cover" />
                <button onClick={() => setSelected(null)} className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-background/80 backdrop-blur">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="p-6">
                <div className="text-xs font-medium text-primary">{selected.category}</div>
                <h3 className="mt-1 text-2xl font-black">{selected.title}</h3>
                <p className="mt-3 text-muted-foreground">{selected.longDescription}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {selected.tech.map((t) => <Badge key={t} variant="secondary">{t}</Badge>)}
                </div>
                <div className="mt-6 flex gap-2">
                  <a href={selected.github} target="_blank" rel="noreferrer"><Button variant="outline" className="gap-2"><Github className="h-4 w-4" />Code</Button></a>
                  <a href={selected.live} target="_blank" rel="noreferrer"><Button className="gap-2 bg-gradient-primary text-primary-foreground"><ExternalLink className="h-4 w-4" />Live Demo</Button></a>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
