import { Link, useRouterState } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon, Download, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { navLinks } from "@/data/portfolio";
import { useTheme } from "@/contexts/theme-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { analyticsApi } from "@/api/endpoints";
import { useProfile } from "@/hooks/use-profile";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { theme, toggle } = useTheme();
  const { data: profile } = useProfile();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
        scrolled ? "glass shadow-soft py-3" : "bg-transparent py-5",
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary text-primary-foreground font-black text-base shadow-elegant group-hover:scale-105 transition-transform">
            A
          </div>
          <span className="font-bold tracking-tight text-foreground">
            Aminu<span className="text-primary">.</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 rounded-full border bg-card/60 backdrop-blur-md px-3 py-1.5 shadow-soft md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
                pathname === l.to
                  ? "bg-gradient-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {l.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          {/* <Link to="/admin" className="hidden md:inline-flex">
            <Button variant="ghost" size="sm" className="gap-2"><LayoutDashboard className="h-4 w-4" />Admin</Button>
          </Link> */}
          <a
            href={profile?.resume_url || "/resume.pdf"}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="hidden sm:inline-flex"
            onClick={() => analyticsApi.trackCvDownload("/navbar-resume").catch(() => {})}
          >
            <Button
              size="sm"
              className="gap-2 bg-gradient-primary text-primary-foreground shadow-elegant hover:opacity-90"
            >
              <Download className="h-4 w-4" />
              Resume
            </Button>
          </a>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass overflow-hidden lg:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {navLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-medium",
                    pathname === l.to
                      ? "bg-gradient-primary text-primary-foreground"
                      : "hover:bg-muted",
                  )}
                >
                  {l.name}
                </Link>
              ))}
              <Link to="/admin" className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted">
                Admin Dashboard
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
