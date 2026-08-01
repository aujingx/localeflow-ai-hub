import { createFileRoute, Link } from "@tanstack/react-router";
import { useDemo } from "@/lib/demo/store";
import { PageHeader, Panel, Meter } from "@/components/lf/page";
import { Chip, StageChip, LangChip } from "@/components/lf/chips";
import { requests, ACTIVE_REQUEST_ID } from "@/lib/demo/seed";
import { ArrowRight, Sparkles, UserRound } from "lucide-react";

export const Route = createFileRoute("/app/")({
  component: OverviewPage,
});

function OverviewPage() {
  const { stages, openExceptions, blockingCount, progress, activity } = useDemo();
  const active = requests.find((r) => r.id === ACTIVE_REQUEST_ID)!;

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Overview"
        lead="Delivery health for the active launch. Every automated action below shows the rule and evidence behind it."
        actions={
          <Link
            to="/app/workflow"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Open workflow <ArrowRight className="size-4" aria-hidden />
          </Link>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-surface p-4 lg:col-span-2">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
            <div className="min-w-0">
              <p className="font-mono text-[11px] text-muted-foreground">{active.id}</p>
              <h2 className="mt-0.5 font-display text-base font-semibold">{active.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{active.summary}</p>
            </div>
            <Chip tone={blockingCount ? "block" : "pass"}>{blockingCount ? "Blocked" : "On track"}</Chip>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Stage progress</span>
              <span className="font-mono">{progress}%</span>
            </div>
            <Meter value={progress} tone={blockingCount ? "warn" : "pass"} />
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {active.languages.map((l) => (
              <LangChip key={l} code={l} />
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {[
            ["Open exceptions", String(openExceptions.length), "Awaiting a human decision"],
            ["Blocking", String(blockingCount), "Stops release until resolved"],
            ["Stages complete", `${stages.filter((s) => s.status === "done").length}/${stages.length}`, "Across the active launch"],
          ].map(([k, v, d]) => (
            <div key={k} className="rounded-xl border border-border bg-surface p-4">
              <p className="font-mono text-[11px] tracking-wide text-muted-foreground uppercase">{k}</p>
              <p className="mt-1 font-display text-2xl font-semibold tabular-nums">{v}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel title="Stage funnel" description="Checks run at each transition, not only before release.">
          <ol className="space-y-2">
            {stages.map((s) => (
              <li key={s.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-border bg-surface-2 px-3 py-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{s.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{s.owner}</p>
                </div>
                <StageChip status={s.status} />
              </li>
            ))}
          </ol>
        </Panel>

        <Panel title="Exceptions awaiting a person" description="Only failed checks are routed.">
          {openExceptions.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              No open exceptions. Everything cleared its checks.
            </div>
          ) : (
            <ul className="space-y-2">
              {openExceptions.map((e) => (
                <li key={e.id} className="rounded-lg border border-border bg-surface-2 p-3">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{e.title}</p>
                      <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-muted-foreground">
                        <UserRound className="size-3 shrink-0" aria-hidden />
                        {e.assignee}
                      </p>
                    </div>
                    <Chip tone={e.severity === "blocked" ? "block" : "warn"}>{e.severity === "blocked" ? "Blocked" : "Warning"}</Chip>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <Link to="/app/workflow" className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
            Review exceptions <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Panel>
      </div>

      <Panel className="mt-4" title="Recent automated actions" description="Trigger, rule and reversibility for each system decision.">
        <ul className="space-y-2">
          {activity.slice(0, 6).map((a) => (
            <li key={a.id} className="rise-in rounded-lg border border-border bg-surface-2 p-3">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <p className="min-w-0 text-sm">
                  <span className="inline-flex items-center gap-1.5 font-medium">
                    {a.actorType === "system" ? <Sparkles className="size-3.5 text-auto" aria-hidden /> : null}
                    {a.actor}
                  </span>{" "}
                  — {a.message}
                </p>
                <span className="shrink-0 font-mono text-[11px] text-muted-foreground">{a.at}</span>
              </div>
              {a.reason ? <p className="mt-1 text-xs text-muted-foreground">{a.reason}</p> : null}
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
