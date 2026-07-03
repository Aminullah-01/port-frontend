import { createFileRoute } from "@tanstack/react-router";
import { Download, Upload, FileText, History } from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/resume")({
  head: () => ({ meta: [{ title: "Resume — Admin" }] }),
  component: ResumeAdmin,
});

const versions = [
  { v: "v3.2", date: "2025-06-20", note: "Added AI section" },
  { v: "v3.1", date: "2025-04-11", note: "Updated experience" },
  { v: "v3.0", date: "2025-01-08", note: "New template" },
];

function ResumeAdmin() {
  return (
    <div>
      <AdminPageHeader title="Resume" description="Upload, preview, and manage your CV."
        actions={
          <>
            <Button variant="outline" className="gap-2"><Download className="h-4 w-4" />Download</Button>
            <Button className="gap-2 bg-gradient-primary text-primary-foreground" onClick={() => toast.success("Resume replaced")}>
              <Upload className="h-4 w-4" />Replace
            </Button>
          </>
        } />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border bg-card p-6 shadow-soft lg:col-span-2">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-primary" />
            <h3 className="font-bold">Current resume</h3>
          </div>
          <div className="mt-4 aspect-[3/4] rounded-xl bg-muted grid place-items-center">
            <div className="text-center text-muted-foreground">
              <FileText className="mx-auto h-12 w-12 opacity-50" />
              <p className="mt-2 text-sm">Resume preview placeholder</p>
              <p className="text-xs">Aminu_Gambo_Resume_v3.2.pdf</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-soft">
          <div className="flex items-center gap-3"><History className="h-5 w-5 text-primary" /><h3 className="font-bold">Version history</h3></div>
          <ul className="mt-4 space-y-2">
            {versions.map((v) => (
              <li key={v.v} className="rounded-lg border p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold">{v.v}</span>
                  <span className="text-xs text-muted-foreground">{v.date}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{v.note}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
