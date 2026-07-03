import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { FadeIn, SectionHeading } from "@/components/site/primitives";
import { usePortfolio } from "@/contexts/portfolio-context";

export const Route = createFileRoute("/_site/services")({
  head: () => ({
    meta: [
      { title: "Services — Aminu Gambo" },
      { name: "description", content: "Frontend development, UI/UX design, and graphic design services." },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const { services } = usePortfolio();
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <FadeIn><SectionHeading eyebrow="Services" title="How I can help" description="Pick a service or blend them — every engagement is tailored." /></FadeIn>

      <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => (
          <FadeIn key={s.id} delay={i * 0.05}>
            <div className="group relative h-full overflow-hidden rounded-2xl border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-elegant">
              <div className="absolute inset-x-0 -top-32 h-32 bg-gradient-primary opacity-0 blur-3xl transition-opacity group-hover:opacity-40" />
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-elegant">
                <s.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-bold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
              <ul className="mt-4 space-y-2 text-sm">
                {s.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />{f}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
