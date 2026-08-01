import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Panel } from "@/components/lf/page";
import { CheckChip, Chip, StageChip, stageAccent } from "@/components/lf/chips";
import { AutomationNote } from "@/components/lf/automation";
import { useDemo } from "@/lib/demo/store";
import { cn } from "@/lib/utils";
import { RotateCcw } from "lucide-react";

export const Route = createFileRoute("/app/workflow")({
  component: WorkflowPage,
});

function WorkflowPage() {
  const { stages, exceptions, resolveException, rejectException, revertException, secondApprover } = useDemo();
  const [openStage, setOpenStage] = useState<string>("language-qa");

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Workflow"
        lead="REQ-2418 · Smart Ledger launch. Select a stage to see which checks ran, and resolve exceptions inline."
      />

      <Panel title="Pipeline" description={secondApprover ? "Second approver enabled for high-risk content." : "Standard workflow — no second approver configured."}>
        <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {stages.map((s) => (
            <li key={s.id}>
              <button
                onClick={() => setOpenStage(s.id)}
                className={cn(
                  "w-full overflow-hidden rounded-xl border p-3 text-left transition-colors",
                  openStage === s.id ? "border-primary bg-primary-soft/50" : "border-border bg-surface-2 hover:border-primary/40",
                )}
              >
                <span className={cn("mb-2 block h-1 w-full rounded-full", stageAccent(s.status))} aria-hidden />
                <p className="truncate text-sm font-medium">{s.name}</p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">{s.owner}</p>
                <span className="mt-2 block">
                  <StageChip status={s.status} />
                </span>
              </button>
            </li>
          ))}
        </ol>
      </Panel>

      {stages
        .filter((s) => s.id === openStage)
        .map((s) => (
          <Panel key={s.id} className="mt-4" title={`${s.name} — checks`} description={s.description}>
            <ul className="space-y-2">
              {s.checks.map((c) => (
                <li key={c.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 rounded-lg border border-border bg-surface-2 p-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{c.label}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{c.detail}</p>
                    <p className="mt-1 font-mono text-[11px] text-muted-foreground">{c.category} · {c.scope}</p>
                  </div>
                  <CheckChip state={c.state} />
                </li>
              ))}
            </ul>
          </Panel>
        ))}

      <Panel className="mt-4" title="Exceptions" description="A failed check goes to exactly one owner, with the rule, the evidence and a suggested fix.">
        <ul className="space-y-3">
          {exceptions.map((e) => (
            <li key={e.id} className={cn("rounded-xl border p-4", e.state === "open" ? "border-border bg-surface-2" : "border-pass/25 bg-pass-soft/40")}>
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{e.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{e.summary}</p>
                  <p className="mt-1.5 font-mono text-[11px] text-muted-foreground">
                    {e.id} · {e.assignee} · raised {e.raisedAt}
                  </p>
                </div>
                <Chip tone={e.state === "open" ? (e.severity === "blocked" ? "block" : "warn") : "pass"}>
                  {e.state === "open" ? (e.severity === "blocked" ? "Blocked" : "Warning") : "Resolved"}
                </Chip>
              </div>

              <AutomationNote automation={e.automation} className="mt-3" />

              <div className="mt-3 rounded-lg border border-border bg-surface p-3">
                <p className="font-mono text-[11px] tracking-wide text-muted-foreground uppercase">Suggested resolution</p>
                <p className="mt-1 text-sm">{e.suggestion}</p>
              </div>

              {e.state === "open" ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    onClick={() => resolveException(e.id)}
                    className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    {e.resolutionLabel}
                  </button>
                  <button
                    onClick={() => rejectException(e.id)}
                    className="rounded-md border border-border bg-surface px-3 py-1.5 text-sm font-medium hover:bg-secondary"
                  >
                    {e.rejectLabel}
                  </button>
                </div>
              ) : (
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <p className="text-xs text-muted-foreground">Decision: {e.resolutionNote}</p>
                  <button
                    onClick={() => revertException(e.id)}
                    className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs font-medium hover:bg-secondary"
                  >
                    <RotateCcw className="size-3.5" aria-hidden /> Revert
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
