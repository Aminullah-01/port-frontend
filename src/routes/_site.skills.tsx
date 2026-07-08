import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { FadeIn, SectionHeading } from "@/components/site/primitives";
import { useSkills } from "@/hooks/use-skills";
import { 
  Code2, Server, Layers, Globe, Database, Cloud, Brain, Palette, Wrench, Sparkles 
} from "lucide-react";

export const Route = createFileRoute("/_site/skills")({
  head: () => ({
    meta: [
      { title: "Skills — Aminu Gambo" },
      { name: "description", content: "Frontend, design, and AI skills with proficiency levels." },
    ],
  }),
  component: SkillsPage,
});

const categoryIconMap: Record<string, any> = {
  frontend: Code2,
  backend: Server,
  programming: Layers,
  language: Globe,
  languages: Globe,
  database: Database,
  databases: Database,
  devops: Cloud,
  ai: Brain,
  design: Palette,
  uiux: Palette,
  tools: Wrench,
  developertools: Wrench,
};

function getCategoryIcon(categoryName: string) {
  const key = categoryName.toLowerCase().replace(/[^a-z0-9]/g, '');
  return categoryIconMap[key] || Code2;
}

function formatCategoryName(name: string) {
  if (!name) return "";
  if (name.toLowerCase() === "ai") return "AI";
  if (name.toLowerCase() === "devops") return "DevOps";
  return name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function SkillsPage() {
  const { data: skills = [] } = useSkills();
  
  // Group skills by category case-insensitively dynamically
  const categoryGroups: Record<string, { originalName: string; items: typeof skills }> = {};

  skills.forEach(s => {
    const cat = (s.category || "").trim();
    if (!cat) return;
    
    const key = cat.toLowerCase();
    if (!categoryGroups[key]) {
      categoryGroups[key] = {
        originalName: cat,
        items: [],
      };
    }
    categoryGroups[key].items.push(s);
  });

  const categoryKeys = Object.keys(categoryGroups);
  
  const defaultCategoryOrder = ["frontend", "backend", "programming", "language", "database", "devops", "ai", "tools"];
  
  const sortedKeys = categoryKeys.sort((a, b) => {
    const idxA = defaultCategoryOrder.indexOf(a);
    const idxB = defaultCategoryOrder.indexOf(b);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return a.localeCompare(b);
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <FadeIn><SectionHeading eyebrow="What I know" title="Skills & Toolkit" description="A curated set of tools and technologies I use daily." /></FadeIn>

      <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sortedKeys.map((key, i) => {
          const group = categoryGroups[key];
          const Icon = getCategoryIcon(key);
          return (
            <FadeIn key={key} delay={i * 0.05}>
              <div className="h-full rounded-2xl border bg-card p-6 shadow-soft">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary text-primary-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold">{formatCategoryName(group.originalName)}</h3>
                </div>
                <div className="mt-6 space-y-4">
                  {group.items.map((s) => (
                    <div key={s.id}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{s.name}</span>
                        <span className="text-muted-foreground">{s.percentage}%</span>
                      </div>
                      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${s.percentage}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, ease: "easeOut" }}
                          className="h-full rounded-full bg-gradient-primary"
                        />
                      </div>
                    </div>
                  ))}
                  {group.items.length === 0 && <p className="text-sm text-muted-foreground">No skills yet.</p>}
                </div>
              </div>
            </FadeIn>
          );
        })}
      </div>
    </div>
  );
}
