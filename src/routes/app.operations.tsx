import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Meter } from "@/components/lf/page";
import { Chip } from "@/components/lf/chips";

export const Route = createFileRoute("/app/operations")({
  component: OperationsPage,
});

const people = [
  { name: "Aya Morimoto", role: "Language Owner · JA", load: 92, sla: "At risk", tone: "warn" as const },
  { name: "Lukas Brandt", role: "Language Owner · DE", load: 61, sla: "On track", tone: "pass" as const },
  { name: "Camille Rossi", role: "Language Owner · FR", load: 44, sla: "On track", tone: "pass" as const },
  { name: "Wei Chen", role: "Source reviewer · ZH", load: 70, sla: "On track", tone: "pass" as const },
];

const schedule = [
  { task: "JA formality fix — SEG-02", owner: "Aya Morimoto", due: "Today 17:00", state: "Blocked", tone: "block" as const },
  { task: "DE length rewrite — SEG-05", owner: "Lukas Brandt", due: "Today 18:00", state: "In progress", tone: "primary" as const },
  { task: "FR review pass", owner: "Camille Rossi", due: "Tomorrow 12:00", state: "Queued", tone: "muted" as const },
  { task: "JA marketing tone check", owner: "Reassigned to Camille Rossi", due: "Tomorrow 15:00", state: "Reassigned", tone: "auto" as const },
];

function OperationsPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Operations" lead="Scheduling, capacity, assignment and delivery risk. The platform handles the coordination a localization project manager would otherwise chase by hand." />

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Employee capacity" description="Load is calculated from open segments, historical throughput and working hours.">
          <ul className="space-y-3">
            {people.map((p) => (
              <li key={p.name} className="rounded-lg border border-border bg-surface-2 p-3">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{p.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{p.role}</p>
                  </div>
                  <Chip tone={p.tone}>{p.sla}</Chip>
                </div>
                <div className="mt-2">
                  <Meter value={p.load} tone={p.load > 85 ? "warn" : "pass"} />
                  <p className="mt-1 font-mono text-[11px] text-muted-foreground">{p.load}% of weekly capacity</p>
                </div>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Schedule & assignment" description="One unstarted task was reassigned automatically; the move is reversible.">
          <ul className="space-y-2">
            {schedule.map((t) => (
              <li key={t.task} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-border bg-surface-2 p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{t.task}</p>
                  <p className="truncate text-xs text-muted-foreground">{t.owner} · due {t.due}</p>
                </div>
                <Chip tone={t.tone}>{t.state}</Chip>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
