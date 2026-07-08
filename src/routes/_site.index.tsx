import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowRight, Download, Mail, Github, Linkedin, Facebook, Twitter, MessageCircle, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedBackground, Counter, FadeIn, SectionHeading, TypingText } from "@/components/site/primitives";
import { useProfile } from "@/hooks/use-profile";
import { useProjects } from "@/hooks/use-projects";
import { useServices } from "@/hooks/use-services";

export const Route = createFileRoute("/_site/")({
  component: HomePage,
});

function HomePage() {
  const { data: profile } = useProfile();
  const { data: projects = [] } = useProjects();
  const { data: services = [] } = useServices();
  if (!profile) return null;
  const socialLinks = [
    { name: "GitHub", url: profile.socials.github, icon: Github },
    { name: "LinkedIn", url: profile.socials.linkedin, icon: Linkedin },
    { name: "Facebook", url: profile.socials.facebook, icon: Facebook },
    { name: "Twitter", url: profile.socials.twitter, icon: Twitter },
    { name: "WhatsApp", url: profile.socials.whatsapp, icon: MessageCircle },
    { name: "Email", url: profile.socials.email, icon: Mail },
  ].filter(s => s.url);
  const featured = projects.filter((p) => p.featured).slice(0, 3);
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <AnimatedBackground />
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-32">
          <div className="flex flex-col justify-center">
            <FadeIn>
              <div className="inline-flex items-center gap-2 rounded-full border bg-card/50 px-3 py-1 text-xs font-medium backdrop-blur">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                Available for new projects
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Hi, I'm <span className="text-gradient">{profile.name.split(" ")[0]}</span>
              </h1>
            </FadeIn>
            <FadeIn delay={0.15}>
              <div className="mt-4 text-2xl font-semibold text-muted-foreground sm:text-3xl">
                <TypingText words={profile.titles} className="text-foreground" />
              </div>
            </FadeIn>
            <FadeIn delay={0.25}>
              <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">{profile.bio}</p>
            </FadeIn>
            <FadeIn delay={0.35}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/projects">
                  <Button size="lg" className="gap-2 bg-gradient-primary text-primary-foreground shadow-elegant hover:opacity-90">
                    View Projects <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <a href={profile.resume_url || "/resume.pdf"} download>
                  <Button size="lg" variant="outline" className="gap-2"><Download className="h-4 w-4" />Resume</Button>
                </a>
                <Link to="/contact">
                  <Button size="lg" variant="ghost" className="gap-2"><Mail className="h-4 w-4" />Contact</Button>
                </Link>
              </div>
            </FadeIn>
            <FadeIn delay={0.5}>
              <div className="mt-8 flex gap-3">
                {socialLinks.slice(0, 4).map((s) => (
                  <a key={s.name} href={s.url} target="_blank" rel="noreferrer" aria-label={s.name}
                    className="grid h-10 w-10 place-items-center rounded-xl border transition-all hover:border-primary hover:text-primary hover:-translate-y-0.5">
                    <s.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.2} className="relative flex items-center justify-center">
            <div className="relative">
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
                <div className="absolute -inset-4 rounded-full bg-gradient-primary opacity-40 blur-3xl" />
                <div className="relative aspect-square w-64 overflow-hidden rounded-full border-4 border-primary/30 shadow-glow sm:w-80 lg:w-96">
                  <img src={profile.avatar} alt={profile.name} className="h-full w-full object-cover bg-card" />
                </div>
              </motion.div>
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-4 -right-4 grid h-16 w-16 place-items-center rounded-2xl bg-card shadow-elegant"
              >
                <Sparkles className="h-6 w-6 text-primary" />
              </motion.div>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-4 -left-4 flex items-center gap-2 rounded-2xl bg-card px-4 py-3 shadow-elegant"
              >
                <Star className="h-4 w-4 fill-primary text-primary" />
                <div>
                  <div className="text-sm font-bold">4+ years</div>
                  <div className="text-xs text-muted-foreground">of craft</div>
                </div>
              </motion.div>
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.6}>
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 px-4 pb-20 sm:grid-cols-4 sm:px-6 lg:px-8">
            {profile.stats.map((s) => (
              <div key={s.label} className="glass rounded-2xl p-6 text-center">
                <div className="text-3xl font-black text-gradient sm:text-4xl"><Counter to={s.value} suffix="+" /></div>
                <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* Featured projects */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <FadeIn><SectionHeading eyebrow="Selected work" title="Featured projects" description="A glimpse of what I've been building lately." /></FadeIn>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((p, i) => (
            <FadeIn key={p.id} delay={i * 0.1}>
              <Link to="/projects" className="group block overflow-hidden rounded-2xl border bg-card shadow-soft transition-all hover:-translate-y-1 hover:shadow-elegant">
                <div className="relative aspect-video overflow-hidden">
                  <img src={p.image} alt={p.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                </div>
                <div className="p-6">
                  <div className="text-xs font-medium text-primary">{p.category}</div>
                  <h3 className="mt-1 text-lg font-bold">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link to="/projects"><Button variant="outline" className="gap-2">See all projects <ArrowRight className="h-4 w-4" /></Button></Link>
        </div>
      </section>

      {/* Services preview */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <FadeIn><SectionHeading eyebrow="What I do" title="Services" description="From pixel-perfect interfaces to production code." /></FadeIn>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.slice(0, 6).map((s, i) => (
            <FadeIn key={s.id} delay={i * 0.05}>
              <div className="group h-full rounded-2xl border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-elegant">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-elegant">
                  <s.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-bold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="relative overflow-hidden rounded-3xl border bg-gradient-primary p-10 text-center text-primary-foreground shadow-elegant sm:p-16">
            <div className="absolute inset-0 bg-gradient-glow opacity-40" />
            <div className="relative">
              <h3 className="text-3xl font-black sm:text-4xl">Have a project in mind?</h3>
              <p className="mx-auto mt-3 max-w-xl opacity-90">Let's build something people love to use.</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link to="/contact"><Button size="lg" variant="secondary" className="gap-2"><Mail className="h-4 w-4" />Get in touch</Button></Link>
                <a href={profile.socials.github} target="_blank" rel="noreferrer"><Button size="lg" variant="outline" className="gap-2 border-white/40 bg-white/10 text-primary-foreground hover:bg-white/20"><Github className="h-4 w-4" />GitHub</Button></a>
                <a href={profile.socials.linkedin} target="_blank" rel="noreferrer"><Button size="lg" variant="outline" className="gap-2 border-white/40 bg-white/10 text-primary-foreground hover:bg-white/20"><Linkedin className="h-4 w-4" />LinkedIn</Button></a>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>
    </>
  );
}
