import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Meter } from "@/components/lf/page";

export const Route = createFileRoute("/app/analytics")({
  component: AnalyticsPage,
});

const metrics = [
  { label: "Segments auto-passed", value: 68, note: "of 8 segments in this launch, prototype data" },
  { label: "Checks failing on first pass", value: 21, note: "mostly length and formality rules" },
  { label: "Exceptions closed by owners", value: 50, note: "remaining items are open in the demo" },
];

function AnalyticsPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Analytics" lead="Prototype figures only — derived from seeded demo data, not measured production results." />
      <Panel title="Quality and flow" description="Every number below is illustrative.">
        <ul className="space-y-4">
          {metrics.map((m) => (
            <li key={m.label}>
              <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3">
                <p className="min-w-0 truncate text-sm font-medium">{m.label}</p>
                <p className="font-mono text-sm">{m.value}%</p>
              </div>
              <div className="mt-1.5">
                <Meter value={m.value} tone="pass" />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{m.note}</p>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
