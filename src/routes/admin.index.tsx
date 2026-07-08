import { createFileRoute, Link } from "@tanstack/react-router";
import { FolderKanban, Sparkles, Award, Inbox, PenSquare, Eye, Download, Plus, TrendingUp, Loader2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, BarChart, Bar, CartesianGrid } from "recharts";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { useProjects } from "@/hooks/use-projects";
import { useSkills } from "@/hooks/use-skills";
import { useCertificates } from "@/hooks/use-certificates";
import { useMessages } from "@/hooks/use-messages";
import { useBlogPosts } from "@/hooks/use-blog";
import { Counter } from "@/components/site/primitives";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Dashboard — Admin" }] }),
  component: DashboardPage,
});

const visitorData = [
  { d: "Mon", v: 420 }, { d: "Tue", v: 680 }, { d: "Wed", v: 540 },
  { d: "Thu", v: 890 }, { d: "Fri", v: 1120 }, { d: "Sat", v: 760 }, { d: "Sun", v: 640 },
];
const categoryData = [
  { name: "Web", value: 12 }, { name: "Mobile", value: 5 }, { name: "AI", value: 7 },
  { name: "Design", value: 9 }, { name: "Branding", value: 4 },
];

function DashboardPage() {
  const { data: projects = [] } = useProjects();
  const { data: skills = [] } = useSkills();
  const { data: certificates = [] } = useCertificates();
  const { data: messages = [] } = useMessages();
  const { data: blog = [] } = useBlogPosts();
  const featuredCount = projects.filter((p) => p.featured).length;
  const unread = messages.filter((m: any) => !m.read && !m.archived).length;

  const stats = [
    { label: "Total Projects", value: projects.length, icon: FolderKanban },
    { label: "Featured", value: featuredCount, icon: TrendingUp },
    { label: "Skills", value: skills.length, icon: Sparkles },
    { label: "Certificates", value: certificates.length, icon: Award },
    { label: "Messages", value: messages.length, icon: Inbox },
    { label: "Blog Posts", value: blog.length, icon: PenSquare },
    { label: "Visitors (7d)", value: 4210, icon: Eye },
    { label: "CV Downloads", value: 128, icon: Download },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Dashboard"
        description="Overview of your portfolio, content, and activity."
        actions={<Link to="/admin/projects"><Button className="gap-2 bg-gradient-primary text-primary-foreground"><Plus className="h-4 w-4" />New project</Button></Link>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border bg-card p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">{s.label}</div>
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-primary text-primary-foreground"><s.icon className="h-4 w-4" /></div>
            </div>
            <div className="mt-3 text-3xl font-black"><Counter to={s.value} /></div>
            {unread > 0 && s.label === "Messages" && <div className="mt-1 text-xs text-primary">{unread} unread</div>}
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border bg-card p-6 shadow-soft lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold">Visitors this week</h3>
            <span className="text-xs text-muted-foreground">Mock data</span>
          </div>
          <div className="mt-4 h-64">
            <ResponsiveContainer>
              <AreaChart data={visitorData}>
                <defs>
                  <linearGradient id="v" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="d" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
                <Area type="monotone" dataKey="v" stroke="var(--color-chart-1)" fill="url(#v)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-soft">
          <h3 className="font-bold">Projects by category</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
                <Bar dataKey="value" fill="var(--color-chart-2)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border bg-card p-6 shadow-soft">
          <h3 className="font-bold">Recent activity</h3>
          <ul className="mt-4 space-y-3 text-sm">
            {[
              "New message from Sarah Chen",
              "Project 'Nebula Analytics' updated",
              "Certificate 'Advanced React' added",
              "Blog draft saved",
              "Skill 'PyTorch' updated",
            ].map((a, i) => (
              <li key={i} className="flex items-center gap-3 rounded-lg border bg-background p-3">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span className="flex-1">{a}</span>
                <span className="text-xs text-muted-foreground">{i + 1}h ago</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-soft">
          <h3 className="font-bold">Quick actions</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              { label: "Add Project", to: "/admin/projects" },
              { label: "Add Skill", to: "/admin/skills" },
              { label: "New Blog Post", to: "/admin/blog" },
              { label: "Upload Certificate", to: "/admin/certificates" },
            ].map((q) => (
              <Link key={q.to} to={q.to} className="rounded-xl border p-4 text-sm font-medium hover:border-primary hover:bg-muted/50">
                {q.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
