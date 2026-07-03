import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FadeIn, SectionHeading } from "@/components/site/primitives";
import { profile, socialLinks, contactInfo } from "@/data/portfolio";
import { usePortfolio } from "@/contexts/portfolio-context";

export const Route = createFileRoute("/_site/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Aminu Gambo" },
      { name: "description", content: "Send a message or connect on social." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { setMessages } = usePortfolio();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setMessages((prev) => [
        { id: String(Date.now()), ...form, date: new Date().toISOString().slice(0, 10), read: false, archived: false },
        ...prev,
      ]);
      toast.success("Message sent — I'll get back to you soon.");
      setForm({ name: "", email: "", subject: "", message: "" });
      setLoading(false);
    }, 900);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <FadeIn><SectionHeading eyebrow="Say hi" title="Let's talk" description="Have a project, a question, or just want to say hi? Drop me a line." /></FadeIn>

      <div className="mt-16 grid gap-8 lg:grid-cols-5">
        <FadeIn className="lg:col-span-3">
          <form onSubmit={submit} className="space-y-4 rounded-2xl border bg-card p-6 shadow-soft sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" rows={6} required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            </div>
            <Button disabled={loading} type="submit" size="lg" className="w-full gap-2 bg-gradient-primary text-primary-foreground shadow-elegant">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {loading ? "Sending…" : "Send message"}
            </Button>
          </form>
        </FadeIn>

        <FadeIn delay={0.1} className="space-y-4 lg:col-span-2">
          <div className="rounded-2xl border bg-card p-6 shadow-soft">
            <h4 className="font-bold">Contact info</h4>
            <div className="mt-4 space-y-3">
              {contactInfo.map((c) => (
                <div key={c.label} className="flex items-center gap-3 text-sm">
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-primary text-primary-foreground"><c.icon className="h-4 w-4" /></div>
                  <div>
                    <div className="text-xs text-muted-foreground">{c.label}</div>
                    <div className="font-medium">{c.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-6 shadow-soft">
            <h4 className="font-bold">Social</h4>
            <div className="mt-4 grid grid-cols-5 gap-2">
              {socialLinks.map((s) => (
                <a key={s.name} href={s.url} target="_blank" rel="noreferrer" aria-label={s.name}
                  className="grid aspect-square place-items-center rounded-xl border transition-all hover:border-primary hover:text-primary hover:-translate-y-0.5">
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border bg-card shadow-soft">
            <div className="aspect-video w-full">
              <iframe
                title="Map"
                loading="lazy"
                className="h-full w-full"
                src={`https://www.google.com/maps?q=${encodeURIComponent(profile.location)}&output=embed`}
              />
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
