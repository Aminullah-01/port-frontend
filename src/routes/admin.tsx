import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { useAuth } from "@/contexts/auth-context";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  console.log('[ADMIN] RENDER', { loading, isAuthenticated });

  useEffect(() => {
    console.log('[ADMIN] useEffect', { loading, isAuthenticated });
    if (!loading && !isAuthenticated) {
      console.log('[ADMIN] REDIRECT TO /login — not authenticated');
      navigate({ to: "/login" });
    }
  }, [loading, isAuthenticated, navigate]);

  if (loading) {
    console.log('[ADMIN] loading — showing spinner');
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  console.log('[ADMIN] rendering AdminShell');
  return (
    <AdminShell>
      <Outlet />
    </AdminShell>
  );
}
