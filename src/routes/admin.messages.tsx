import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Trash2, Archive, Reply, Inbox as InboxIcon } from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { usePortfolio } from "@/contexts/portfolio-context";
import type { Message } from "@/data/portfolio";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/messages")({
  head: () => ({ meta: [{ title: "Messages — Admin" }] }),
  component: MessagesAdmin,
});

function MessagesAdmin() {
  const { messages, setMessages } = usePortfolio();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "archived">("all");
  const [selected, setSelected] = useState<Message | null>(null);

  const filtered = messages.filter((m) => {
    if (filter === "unread" && (m.read || m.archived)) return false;
    if (filter === "archived" && !m.archived) return false;
    if (filter === "all" && m.archived) return false;
    return m.subject.toLowerCase().includes(q.toLowerCase()) || m.name.toLowerCase().includes(q.toLowerCase());
  });

  const patch = (id: string, p: Partial<Message>) => setMessages((prev) => prev.map((m) => m.id === id ? { ...m, ...p } : m));

  return (
    <div>
      <AdminPageHeader title="Messages" description="Inquiries from the contact form." />

      <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
        <div className="rounded-2xl border bg-card shadow-soft">
          <div className="border-b p-3">
            <div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
            </div>
            <div className="mt-2 flex gap-1">
              {(["all", "unread", "archived"] as const).map((f) => (
                <button key={f} onClick={() => setFilter(f)} className={cn("rounded-full border px-3 py-1 text-xs capitalize", filter === f && "border-transparent bg-gradient-primary text-primary-foreground")}>{f}</button>
              ))}
            </div>
          </div>
          <ul className="max-h-[600px] overflow-y-auto">
            {filtered.length === 0 && (
              <li className="p-8 text-center text-sm text-muted-foreground">
                <InboxIcon className="mx-auto h-8 w-8 opacity-40" /><p className="mt-2">No messages</p>
              </li>
            )}
            {filtered.map((m) => (
              <li key={m.id}>
                <button onClick={() => { setSelected(m); patch(m.id, { read: true }); }}
                  className={cn("block w-full border-b p-3 text-left hover:bg-muted/50",
                    selected?.id === m.id && "bg-muted/60", !m.read && "font-semibold")}>
                  <div className="flex items-center justify-between">
                    <span className="truncate">{m.name}</span>
                    <span className="text-xs text-muted-foreground">{m.date}</span>
                  </div>
                  <div className="mt-1 truncate text-sm">{m.subject}</div>
                  {!m.read && <Badge className="mt-1 bg-primary text-primary-foreground" variant="default">New</Badge>}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-soft">
          {selected ? (
            <>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 className="text-xl font-bold">{selected.subject}</h3>
                  <p className="text-sm text-muted-foreground">{selected.name} · {selected.email}</p>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" className="gap-1" onClick={() => { patch(selected.id, { archived: true }); toast.success("Archived"); setSelected(null); }}><Archive className="h-3 w-3" />Archive</Button>
                  <Button size="sm" variant="ghost" className="gap-1 text-destructive" onClick={() => { setMessages((p) => p.filter((x) => x.id !== selected.id)); toast.success("Deleted"); setSelected(null); }}><Trash2 className="h-3 w-3" />Delete</Button>
                </div>
              </div>
              <p className="mt-6 whitespace-pre-wrap text-sm leading-relaxed">{selected.message}</p>
              <div className="mt-6 rounded-xl border p-3">
                <textarea placeholder="Write a reply…" className="w-full resize-none border-0 bg-transparent text-sm outline-none" rows={3} />
                <div className="mt-2 flex justify-end">
                  <Button size="sm" className="gap-1 bg-gradient-primary text-primary-foreground" onClick={() => toast.success("Reply queued (mock)")}><Reply className="h-3 w-3" />Send reply</Button>
                </div>
              </div>
            </>
          ) : (
            <div className="grid h-full min-h-[300px] place-items-center text-muted-foreground">
              <div className="text-center"><InboxIcon className="mx-auto h-10 w-10 opacity-40" /><p className="mt-2 text-sm">Select a message</p></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
