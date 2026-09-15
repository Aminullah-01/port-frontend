import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { analyticsApi } from "@/api/endpoints";

export const Route = createFileRoute("/_site")({
  component: SiteLayout,
});

function SiteLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Don't track admin pages
    if (pathname.startsWith("/admin")) return;

    // Track once per session per path to avoid spamming on refreshes
    const key = `tracked_${pathname}`;
    if (!sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, "1");
      analyticsApi.trackVisit(pathname).catch(() => {});
    }
  }, [pathname]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
