import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, FolderKanban, Sparkles, Wrench, Award, FileText,
  Inbox, PenSquare, User, Settings, LogOut, ChevronsLeft, Search, Bell, Sun, Moon,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/theme-context";
import { profile } from "@/data/portfolio";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const items = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard, exact: true },
  { title: "Projects", url: "/admin/projects", icon: FolderKanban },
  { title: "Skills", url: "/admin/skills", icon: Sparkles },
  { title: "Services", url: "/admin/services", icon: Wrench },
  { title: "Certificates", url: "/admin/certificates", icon: Award },
  { title: "Resume", url: "/admin/resume", icon: FileText },
  { title: "Messages", url: "/admin/messages", icon: Inbox },
  { title: "Blog", url: "/admin/blog", icon: PenSquare },
  { title: "Profile", url: "/admin/profile", icon: User },
  { title: "Settings", url: "/admin/settings", icon: Settings },
] as const;

export function AdminShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { theme, toggle } = useTheme();

  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside className={cn(
        "sticky top-0 hidden h-screen shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground transition-all lg:flex",
        collapsed ? "w-16" : "w-64"
      )}>
        <div className="flex h-16 items-center gap-2 border-b px-4">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-primary text-primary-foreground font-black">A</div>
          {!collapsed && <span className="truncate font-bold">Admin Panel</span>}
          <button onClick={() => setCollapsed((v) => !v)} className="ml-auto grid h-8 w-8 shrink-0 place-items-center rounded-lg hover:bg-sidebar-accent">
            <ChevronsLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
          </button>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {items.map((it) => {
            const active = it.exact ? pathname === it.url : pathname.startsWith(it.url);
            return (
              <Link key={it.url} to={it.url}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active ? "bg-gradient-primary text-primary-foreground shadow-elegant" : "hover:bg-sidebar-accent"
                )}>
                <it.icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="truncate">{it.title}</span>}
              </Link>
            );
          })}
        </nav>
        <div className="border-t p-3">
          <Link to="/" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-sidebar-accent">
            <LogOut className="h-4 w-4 shrink-0" />{!collapsed && <span>Exit admin</span>}
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/70 px-4 backdrop-blur sm:px-6">
          <div className="relative hidden max-w-md flex-1 md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search…" className="pl-9" />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggle} aria-label="Theme">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full border p-1 pr-3">
                  <img src={profile.avatar} className="h-7 w-7 rounded-full bg-muted" alt="" />
                  <span className="hidden text-sm font-medium sm:inline">{profile.name.split(" ")[0]}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{profile.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link to="/admin/profile">Profile</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/admin/settings">Settings</Link></DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link to="/">Exit admin</Link></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export function AdminPageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h1 className="truncate text-2xl font-black sm:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
