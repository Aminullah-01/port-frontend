import { Link } from "@tanstack/react-router";
import { Github, Linkedin, Facebook, Twitter, MessageCircle, Mail, ArrowUp, Loader2 } from "lucide-react";
import { navLinks } from "@/data/portfolio";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/use-profile";

export function Footer() {
  const { data: profile, isLoading } = useProfile();
  if (isLoading || !profile) return null;
  const socialLinks = [
    { name: "GitHub", url: profile.socials.github, icon: Github },
    { name: "LinkedIn", url: profile.socials.linkedin, icon: Linkedin },
    { name: "Facebook", url: profile.socials.facebook, icon: Facebook },
    { name: "Twitter", url: profile.socials.twitter, icon: Twitter },
    { name: "WhatsApp", url: profile.socials.whatsapp, icon: MessageCircle },
    { name: "Email", url: profile.socials.email, icon: Mail },
  ].filter(s => s.url);
  return (
    <footer className="border-t bg-card/30">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary text-primary-foreground font-black">A</div>
            <span className="font-bold">Aminu.dev</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">{profile.tagline}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Navigate</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {navLinks.slice(0, 4).map((l) => (
              <li key={l.to}><Link to={l.to} className="hover:text-foreground">{l.name}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">More</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {navLinks.slice(4).map((l) => (
              <li key={l.to}><Link to={l.to} className="hover:text-foreground">{l.name}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Connect</h4>
          <div className="mt-4 flex flex-wrap gap-2">
            {socialLinks.map((s) => (
              <a key={s.name} href={s.url} target="_blank" rel="noreferrer" aria-label={s.name}
                className="grid h-10 w-10 place-items-center rounded-xl border transition-colors hover:bg-muted">
                <s.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">{profile.email}</p>
        </div>
      </div>
      <div className="border-t">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
          <Button variant="ghost" size="sm" className="gap-2" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <ArrowUp className="h-4 w-4" />Top
          </Button>
        </div>
      </div>
    </footer>
  );
}
