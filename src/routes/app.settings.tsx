import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel } from "@/components/lf/page";
import { useDemo } from "@/lib/demo/store";

export const Route = createFileRoute("/app/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { secondApprover, toggleSecondApprover } = useDemo();

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="Organization settings" lead="Permissions, workflow rules and optional approval for regulated or high-risk content." />
      <Panel title="Approval rules">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-lg border border-border bg-surface-2 p-4">
          <div className="min-w-0">
            <p className="text-sm font-medium">Second approver for high-risk content</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Off by default. When enabled, released segments in high-risk requests need a second confirmation.
            </p>
          </div>
          <button
            onClick={toggleSecondApprover}
            aria-pressed={secondApprover}
            className={`shrink-0 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${secondApprover ? "border-primary/30 bg-primary-soft text-primary" : "border-border bg-surface text-muted-foreground"}`}
          >
            {secondApprover ? "Enabled" : "Disabled"}
          </button>
        </div>
      </Panel>
    </div>
  );
}
