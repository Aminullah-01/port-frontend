import { Link, useRouterState } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon, Download, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { navLinks } from "@/data/portfolio";
import { useTheme } from "@/contexts/theme-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "glass shadow-soft" : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary text-primary-foreground font-black shadow-elegant">A</div>
          <span className="hidden font-bold sm:inline">Aminullah.dev</span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:text-foreground",
                pathname === l.to ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {l.name}
              {pathname === l.to && (
                <motion.div layoutId="nav-underline" className="mx-3 -mt-1 h-0.5 rounded-full bg-gradient-primary" />
              )}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Link to="/admin" className="hidden md:inline-flex">
            <Button variant="ghost" size="sm" className="gap-2"><LayoutDashboard className="h-4 w-4" />Admin</Button>
          </Link>
          <a href="/resume.pdf" className="hidden sm:inline-flex">
            <Button size="sm" className="gap-2 bg-gradient-primary text-primary-foreground shadow-elegant hover:opacity-90">
              <Download className="h-4 w-4" />Resume
            </Button>
          </a>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen((v) => !v)} aria-label="Menu">
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
                <Link key={l.to} to={l.to} className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium",
                  pathname === l.to ? "bg-gradient-primary text-primary-foreground" : "hover:bg-muted"
                )}>{l.name}</Link>
              ))}
              <Link to="/admin" className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted">Admin Dashboard</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
