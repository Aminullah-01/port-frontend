import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ExternalLink, X, Award } from "lucide-react";
import { FadeIn, SectionHeading } from "@/components/site/primitives";
import { useCertificates } from "@/hooks/use-certificates";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Certificate } from "@/data/portfolio";

export const Route = createFileRoute("/_site/certificates")({
  head: () => ({
    meta: [
      { title: "Certificates — Aminu Gambo" },
      { name: "description", content: "Certifications and continuing education." },
    ],
  }),
  component: CertificatesPage,
});

function CertificatesPage() {
  const { data: certificates = [] } = useCertificates();
  const [selected, setSelected] = useState<Certificate | null>(null);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <FadeIn><SectionHeading eyebrow="Learning" title="Certificates" description="Formal recognitions from platforms and programs." /></FadeIn>

      <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {certificates.map((c, i) => (
          <FadeIn key={c.id} delay={i * 0.05}>
            <button onClick={() => setSelected(c)}
              className="group block w-full overflow-hidden rounded-2xl border bg-card text-left shadow-soft transition-all hover:-translate-y-1 hover:shadow-elegant">
              <div className="relative aspect-video overflow-hidden">
                <img src={c.image} alt={c.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent" />
                <Award className="absolute right-3 top-3 h-5 w-5 text-primary-foreground" />
              </div>
              <div className="p-5">
                <div className="text-xs font-medium text-primary">{c.date}</div>
                <h3 className="mt-1 font-bold">{c.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{c.organization}</p>
              </div>
            </button>
          </FadeIn>
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-2xl overflow-hidden p-0">
          {selected && (
            <>
              <div className="relative aspect-video">
                <img src={selected.image} alt={selected.title} className="h-full w-full object-cover" />
                <button onClick={() => setSelected(null)} className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-background/80 backdrop-blur">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="p-6">
                <div className="text-xs font-medium text-primary">{selected.date}</div>
                <h3 className="mt-1 text-2xl font-black">{selected.title}</h3>
                <p className="mt-1 text-muted-foreground">{selected.organization}</p>
                <a href={selected.credentialUrl} target="_blank" rel="noreferrer" className="mt-4 inline-block">
                  <Button className="gap-2 bg-gradient-primary text-primary-foreground"><ExternalLink className="h-4 w-4" />View credential</Button>
                </a>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
