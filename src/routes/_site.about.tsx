import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, GraduationCap, Briefcase, Heart, Target, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn, SectionHeading } from "@/components/site/primitives";
import { profile, education, experience } from "@/data/portfolio";

export const Route = createFileRoute("/_site/about")({
  head: () => ({
    meta: [
      { title: "About — Aminu Gambo" },
      { name: "description", content: "Learn about Aminu Gambo Abubakar — background, experience, and mission." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <FadeIn><SectionHeading eyebrow="About me" title="Design-led. Engineering-minded." description={profile.bio} /></FadeIn>

      <div className="mt-16 grid gap-8 md:grid-cols-2">
        <FadeIn>
          <div className="rounded-2xl border bg-card p-6 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary text-primary-foreground"><GraduationCap className="h-5 w-5" /></div>
              <h3 className="text-lg font-bold">Education</h3>
            </div>
            <ul className="mt-6 space-y-4">
              {education.map((e) => (
                <li key={e.title} className="border-l-2 border-primary/40 pl-4">
                  <div className="text-xs font-medium text-primary">{e.year}</div>
                  <div className="font-semibold">{e.title}</div>
                  <div className="text-sm text-muted-foreground">{e.org}</div>
                </li>
              ))}
            </ul>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="rounded-2xl border bg-card p-6 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary text-primary-foreground"><Briefcase className="h-5 w-5" /></div>
              <h3 className="text-lg font-bold">Experience</h3>
            </div>
            <ul className="mt-6 space-y-4">
              {experience.map((e) => (
                <li key={e.title} className="border-l-2 border-primary/40 pl-4">
                  <div className="text-xs font-medium text-primary">{e.year}</div>
                  <div className="font-semibold">{e.title} · {e.org}</div>
                  <div className="text-sm text-muted-foreground">{e.detail}</div>
                </li>
              ))}
            </ul>
          </div>
        </FadeIn>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {[
          { icon: Target, title: "Mission", text: "Ship craft-forward products that people can't put down." },
          { icon: Heart, title: "Values", text: "Curiosity, honesty, and a bias for making things simple." },
          { icon: Compass, title: "Interests", text: "AI, motion design, systems, and open-source tooling." },
        ].map((c, i) => (
          <FadeIn key={c.title} delay={i * 0.05}>
            <div className="h-full rounded-2xl border bg-card p-6 shadow-soft">
              <c.icon className="h-6 w-6 text-primary" />
              <h4 className="mt-3 font-bold">{c.title}</h4>
              <p className="mt-2 text-sm text-muted-foreground">{c.text}</p>
            </div>
          </FadeIn>
        ))}
      </div>

      <div className="mt-12 flex flex-wrap justify-center gap-3">
        <a href="/resume.pdf"><Button className="gap-2 bg-gradient-primary text-primary-foreground shadow-elegant"><Download className="h-4 w-4" />Download CV</Button></a>
        <Link to="/contact"><Button variant="outline">Get in touch</Button></Link>
      </div>
    </div>
  );
}
