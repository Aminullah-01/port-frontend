import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import { Download, Upload, FileText, History, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { useProfile, useUpdateProfile } from "@/hooks/use-profile";

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
  const { data: profile, isLoading } = useProfile();
  const updateMutation = useUpdateProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (isLoading || !profile) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fd = new FormData();
    fd.append("resume", file);
    fd.append("_method", "PUT");

    try {
      await updateMutation.mutateAsync(fd);
      toast.success("Resume updated successfully");
    } catch (err: any) {
      const msg = err.errors?.resume?.[0] || err.message || "Failed to update resume";
      toast.error(msg);
    }
  };

  const resumeUrl = profile.resume_url;
  const fileName = resumeUrl
    ? resumeUrl.substring(resumeUrl.lastIndexOf("/") + 1)
    : "No resume uploaded";
  const isPdf = resumeUrl?.toLowerCase().endsWith(".pdf");

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx"
        className="hidden"
      />
      <AdminPageHeader
        title="Resume"
        description="Upload, preview, and manage your CV."
        actions={
          <>
            <Button
              variant="outline"
              className="gap-2"
              disabled={!resumeUrl}
              onClick={() => {
                if (resumeUrl) window.open(resumeUrl, "_blank");
              }}
            >
              <Download className="h-4 w-4" />Download
            </Button>
            <Button
              className="gap-2 bg-gradient-primary text-primary-foreground"
              disabled={updateMutation.isPending}
              onClick={() => fileInputRef.current?.click()}
            >
              {updateMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {updateMutation.isPending ? "Replacing..." : "Replace"}
            </Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border bg-card p-6 shadow-soft lg:col-span-2">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-primary" />
            <h3 className="font-bold">Current resume</h3>
          </div>
          <div className="mt-4 aspect-[3/4] rounded-xl bg-muted grid place-items-center">
            {resumeUrl ? (
              isPdf ? (
                <iframe
                  src={resumeUrl}
                  className="w-full h-full rounded-xl border-none"
                  title="Resume Preview"
                />
              ) : (
                <div className="text-center p-6">
                  <FileText className="mx-auto h-16 w-16 text-primary opacity-80 animate-pulse" />
                  <p className="mt-4 font-semibold text-sm max-w-xs truncate">{fileName}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Word Document (not previewable in browser)</p>
                  <Button
                    variant="outline"
                    className="mt-4 gap-2"
                    onClick={() => window.open(resumeUrl, "_blank")}
                  >
                    <Download className="h-4 w-4" />Download to View
                  </Button>
                </div>
              )
            ) : (
              <div className="text-center text-muted-foreground">
                <FileText className="mx-auto h-12 w-12 opacity-50" />
                <p className="mt-2 text-sm">No resume uploaded yet</p>
                <p className="text-xs text-muted-foreground">
                  Click 'Replace' to upload a PDF or Word document.
                </p>
              </div>
            )}
          </div>
          {resumeUrl && (
            <div className="mt-2 text-center text-xs text-muted-foreground">
              Loaded: {fileName}
            </div>
          )}
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-soft">
          <div className="flex items-center gap-3">
            <History className="h-5 w-5 text-primary" />
            <h3 className="font-bold">Version history</h3>
          </div>
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
