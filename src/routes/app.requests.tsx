import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Panel, Meter } from "@/components/lf/page";
import { Chip, LangChip } from "@/components/lf/chips";
import { requests } from "@/lib/demo/seed";
import { useDemo } from "@/lib/demo/store";
import { ArrowRight, X } from "lucide-react";

export const Route = createFileRoute("/app/requests")({
  component: RequestsPage,
});

const statusTone = { blocked: "block", "in-progress": "primary", released: "pass", queued: "muted" } as const;

function RequestsPage() {
  const [openId, setOpenId] = useState<string | null>(null);
  const { activity, blockingCount, progress } = useDemo();
  const open = requests.find((r) => r.id === openId);

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Requests" lead="Every localization request from product, operations, marketing and content teams. Select a row to inspect it." />

      <Panel title="All requests" description="Mock data for one organization.">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-border text-left font-mono text-[11px] tracking-wide text-muted-foreground uppercase">
                <th className="py-2 pr-3 font-medium">Request</th>
                <th className="py-2 pr-3 font-medium">Requester</th>
                <th className="py-2 pr-3 font-medium">Risk</th>
                <th className="py-2 pr-3 font-medium">Languages</th>
                <th className="py-2 pr-3 font-medium">Due</th>
                <th className="py-2 pr-3 font-medium">Progress</th>
                <th className="py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => {
                const live = r.id === "REQ-2418";
                const pct = live ? progress : r.progress;
                return (
                  <tr
                    key={r.id}
                    tabIndex={0}
                    onClick={() => setOpenId(r.id)}
                    onKeyDown={(e) => e.key === "Enter" && setOpenId(r.id)}
                    className="cursor-pointer border-b border-border/70 transition-colors last:border-0 hover:bg-surface-2 focus:bg-surface-2 focus:outline-none"
                  >
                    <td className="max-w-[280px] py-3 pr-3">
                      <p className="font-mono text-[11px] text-muted-foreground">{r.id}</p>
                      <p className="truncate font-medium">{r.title}</p>
                    </td>
                    <td className="py-3 pr-3 text-muted-foreground">
                      <p className="whitespace-nowrap">{r.requester}</p>
                      <p className="text-xs">{r.team}</p>
                    </td>
                    <td className="py-3 pr-3">
                      <Chip tone={r.risk === "high" ? "warn" : "muted"}>{r.risk === "high" ? "High risk" : "Standard"}</Chip>
                    </td>
                    <td className="py-3 pr-3">
                      <span className="flex gap-1">
                        {r.languages.map((l) => (
                          <LangChip key={l} code={l} />
                        ))}
                      </span>
                    </td>
                    <td className="py-3 pr-3 font-mono text-xs whitespace-nowrap text-muted-foreground">{r.due}</td>
                    <td className="w-32 py-3 pr-3">
                      <Meter value={pct} tone={live && blockingCount ? "warn" : "pass"} />
                      <span className="mt-1 block font-mono text-[11px] text-muted-foreground">{pct}%</span>
                    </td>
                    <td className="py-3">
                      <Chip tone={live && blockingCount ? "block" : statusTone[r.status]}>
                        {live && blockingCount ? "blocked" : r.status.replace("-", " ")}
                      </Chip>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      {open ? (
        <div className="fixed inset-0 z-50 flex justify-end">
          <button className="absolute inset-0 bg-foreground/30" aria-label="Close details" onClick={() => setOpenId(null)} />
          <aside className="rise-in relative flex h-full w-full max-w-lg flex-col overflow-y-auto border-l border-border bg-surface">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 border-b border-border p-4">
              <div className="min-w-0">
                <p className="font-mono text-[11px] text-muted-foreground">{open.id}</p>
                <h2 className="font-display text-base font-semibold">{open.title}</h2>
              </div>
              <button onClick={() => setOpenId(null)} className="rounded-md p-1 hover:bg-secondary" aria-label="Close">
                <X className="size-4" aria-hidden />
              </button>
            </div>
            <div className="space-y-4 p-4 text-sm">
              <p className="text-muted-foreground">{open.summary}</p>
              <dl className="grid grid-cols-2 gap-3">
                {[
                  ["Requester", `${open.requester} · ${open.team}`],
                  ["Risk", open.risk === "high" ? "High risk" : "Standard"],
                  ["Due", open.due],
                  ["Segments", String(open.segmentCount)],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-lg border border-border bg-surface-2 p-3">
                    <dt className="font-mono text-[11px] tracking-wide text-muted-foreground uppercase">{k}</dt>
                    <dd className="mt-0.5">{v}</dd>
                  </div>
                ))}
              </dl>
              {open.id === "REQ-2418" ? (
                <>
                  <div>
                    <p className="font-mono text-[11px] tracking-wide text-muted-foreground uppercase">Activity</p>
                    <ul className="mt-2 space-y-2">
                      {activity.slice(0, 5).map((a) => (
                        <li key={a.id} className="rounded-lg border border-border bg-surface-2 p-3">
                          <p className="text-sm">{a.message}</p>
                          {a.reason ? <p className="mt-1 text-xs text-muted-foreground">{a.reason}</p> : null}
                          <p className="mt-1 font-mono text-[11px] text-muted-foreground">{a.at}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link to="/app/workflow" className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                    Inspect workflow <ArrowRight className="size-4" aria-hidden />
                  </Link>
                </>
              ) : (
                <div className="rounded-lg border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
                  Only REQ-2418 is fully seeded in this prototype.
                </div>
              )}
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
