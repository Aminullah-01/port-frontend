import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { FadeIn, SectionHeading } from "@/components/site/primitives";
import { skillCategories } from "@/data/portfolio";
import { usePortfolio } from "@/contexts/portfolio-context";

export const Route = createFileRoute("/_site/skills")({
  head: () => ({
    meta: [
      { title: "Skills — Aminu Gambo" },
      { name: "description", content: "Frontend, design, and AI skills with proficiency levels." },
    ],
  }),
  component: SkillsPage,
});

function SkillsPage() {
  const { skills } = usePortfolio();
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <FadeIn><SectionHeading eyebrow="What I know" title="Skills & Toolkit" description="A curated set of tools and technologies I use daily." /></FadeIn>

      <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {skillCategories.map((cat, i) => {
          const items = skills.filter((s) => s.category === cat.name);
          return (
            <FadeIn key={cat.name} delay={i * 0.05}>
              <div className="h-full rounded-2xl border bg-card p-6 shadow-soft">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary text-primary-foreground">
                    <cat.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold">{cat.name}</h3>
                </div>
                <div className="mt-6 space-y-4">
                  {items.map((s) => (
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
                  {items.length === 0 && <p className="text-sm text-muted-foreground">No skills yet.</p>}
                </div>
              </div>
            </FadeIn>
          );
        })}
      </div>
    </div>
  );
}
