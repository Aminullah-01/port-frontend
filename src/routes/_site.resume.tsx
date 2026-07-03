import { createFileRoute } from "@tanstack/react-router";
import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn, SectionHeading } from "@/components/site/primitives";
import { profile, education, experience, skills } from "@/data/portfolio";

export const Route = createFileRoute("/_site/resume")({
  head: () => ({
    meta: [
      { title: "Resume — Aminu Gambo" },
      { name: "description", content: "Downloadable resume and career overview." },
    ],
  }),
  component: ResumePage,
});

function ResumePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <FadeIn><SectionHeading eyebrow="CV" title="Resume" description="A quick overview — download the full PDF below." /></FadeIn>

      <div className="mt-8 flex justify-center">
        <a href="/resume.pdf" download>
          <Button size="lg" className="gap-2 bg-gradient-primary text-primary-foreground shadow-elegant">
            <Download className="h-4 w-4" />Download PDF
          </Button>
        </a>
      </div>

      <FadeIn>
        <article className="mt-12 overflow-hidden rounded-2xl border bg-card shadow-soft">
          <header className="border-b bg-gradient-primary p-8 text-primary-foreground">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6" />
              <div>
                <h2 className="text-2xl font-black">{profile.name}</h2>
                <p className="opacity-90">{profile.titles.join(" · ")}</p>
              </div>
            </div>
            <p className="mt-2 text-sm opacity-90">{profile.email} · {profile.location}</p>
          </header>

          <div className="grid gap-8 p-8 md:grid-cols-2">
            <section>
              <h3 className="text-sm font-bold uppercase tracking-widest text-primary">Experience</h3>
              <ul className="mt-4 space-y-4">
                {experience.map((e) => (
                  <li key={e.title}>
                    <div className="font-semibold">{e.title}</div>
                    <div className="text-sm text-muted-foreground">{e.org} · {e.year}</div>
                    <p className="mt-1 text-sm">{e.detail}</p>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="text-sm font-bold uppercase tracking-widest text-primary">Education</h3>
              <ul className="mt-4 space-y-4">
                {education.map((e) => (
                  <li key={e.title}>
                    <div className="font-semibold">{e.title}</div>
                    <div className="text-sm text-muted-foreground">{e.org} · {e.year}</div>
                  </li>
                ))}
              </ul>

              <h3 className="mt-8 text-sm font-bold uppercase tracking-widest text-primary">Top Skills</h3>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {skills.slice(0, 10).map((s) => (
                  <span key={s.id} className="rounded-md bg-muted px-2 py-1 text-xs">{s.name}</span>
                ))}
              </div>
            </section>
          </div>
        </article>
      </FadeIn>
    </div>
  );
}
