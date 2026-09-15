import { createFileRoute, Link } from "@tanstack/react-router";
import {
  FolderKanban,
  Sparkles,
  Award,
  Inbox,
  PenSquare,
  Eye,
  Download,
  Plus,
  TrendingUp,
  Activity,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { useProjects } from "@/hooks/use-projects";
import { useSkills } from "@/hooks/use-skills";
import { useCertificates } from "@/hooks/use-certificates";
import { useMessages } from "@/hooks/use-messages";
import { useBlogPosts } from "@/hooks/use-blog";
import { useDashboard } from "@/hooks/use-dashboard";
import { Counter } from "@/components/site/primitives";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Dashboard — Admin" }] }),
  component: DashboardPage,
});

const defaultDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function DashboardPage() {
  const { data: dashboard } = useDashboard();
  const { data: projects = [] } = useProjects();
  const { data: skills = [] } = useSkills();
  const { data: certificates = [] } = useCertificates();
  const { data: messages = [] } = useMessages();
  const { data: blog = [] } = useBlogPosts();

  const featuredCount = dashboard?.featured_projects ?? projects.filter((p) => p.featured).length;
  const unread =
    dashboard?.unread_messages ??
    messages.filter((m: { is_read?: boolean; archived?: boolean }) => !m.is_read && !m.archived)
      .length;

  const stats = [
    {
      label: "Total Projects",
      value: dashboard?.total_projects ?? projects.length,
      icon: FolderKanban,
    },
    { label: "Featured", value: featuredCount, icon: TrendingUp },
    {
      label: "Skills",
      value: dashboard?.total_skills ?? skills.length,
      icon: Sparkles,
    },
    {
      label: "Certificates",
      value: dashboard?.total_certificates ?? certificates.length,
      icon: Award,
    },
    {
      label: "Messages",
      value: dashboard?.total_messages ?? messages.length,
      icon: Inbox,
    },
    {
      label: "Blog Posts",
      value: dashboard?.total_blogs ?? blog.length,
      icon: PenSquare,
    },
    {
      label: "Visitors (7d)",
      value: dashboard?.visitors_7d ?? 0,
      icon: Eye,
    },
    {
      label: "CV Downloads",
      value: dashboard?.cv_downloads ?? 0,
      icon: Download,
    },
  ];

  // Dynamic real visitor chart
  const visitorChartData =
    dashboard?.visitor_chart && dashboard.visitor_chart.length > 0
      ? dashboard.visitor_chart
      : defaultDays.map((d) => ({ d, v: 0 }));

  // Dynamic category distribution
  const categoryData =
    dashboard?.category_distribution && dashboard.category_distribution.length > 0
      ? dashboard.category_distribution
      : projects.reduce<{ name: string; value: number }[]>((acc, p) => {
          if (!p.category) return acc;
          const found = acc.find((c) => c.name === p.category);
          if (found) found.value++;
          else acc.push({ name: p.category, value: 1 });
          return acc;
        }, []);

  // Real recent activities
  const recentActivities = dashboard?.recent_activities ?? [];

  return (
    <div>
      <AdminPageHeader
        title="Dashboard"
        description="Live overview of portfolio metrics, content, and real visitor activities."
        actions={
          <Link to="/admin/projects">
            <Button className="gap-2 bg-gradient-primary text-primary-foreground">
              <Plus className="h-4 w-4" />
              New project
            </Button>
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border bg-card p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">{s.label}</div>
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-primary text-primary-foreground">
                <s.icon className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 text-3xl font-black">
              <Counter to={s.value} />
            </div>
            {unread > 0 && s.label === "Messages" && (
              <div className="mt-1 text-xs text-primary font-medium">{unread} unread</div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border bg-card p-6 shadow-soft lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold">Visitors this week</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Daily real visitor traffic over the last 7 days
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live traffic
            </span>
          </div>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={visitorChartData}>
                <defs>
                  <linearGradient id="visitorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.5} />
                <XAxis dataKey="d" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis allowDecimals={false} stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                  formatter={(value: number) => [`${value} visitors`, "Visits"]}
                />
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke="var(--color-chart-1)"
                  fill="url(#visitorGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <h3 className="font-bold">Projects by category</h3>
            <span className="text-xs text-muted-foreground">Portfolio distribution</span>
          </div>
          <div className="mt-4 h-64">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.5} />
                  <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={11} />
                  <YAxis
                    allowDecimals={false}
                    stroke="var(--color-muted-foreground)"
                    fontSize={12}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                    formatter={(value: number) => [`${value} projects`, "Total"]}
                  />
                  <Bar dataKey="value" fill="var(--color-chart-2)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                No projects found yet
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border bg-card p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <h3 className="font-bold">Recent activity</h3>
            </div>
            <span className="text-xs text-muted-foreground">Real-time log</span>
          </div>

          <ul className="mt-4 space-y-3 text-sm">
            {recentActivities.length > 0 ? (
              recentActivities.map((a, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 rounded-xl border bg-background/60 p-3 shadow-xs"
                >
                  <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
                  <span className="flex-1 font-medium">{a.title}</span>
                  <span className="text-xs text-muted-foreground shrink-0">{a.time}</span>
                </li>
              ))
            ) : (
              <li className="p-4 text-center text-xs text-muted-foreground">
                No recent activities recorded yet.
              </li>
            )}
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
              <Link
                key={q.to}
                to={q.to}
                className="rounded-xl border p-4 text-sm font-medium hover:border-primary hover:bg-muted/50 transition-colors"
              >
                {q.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
