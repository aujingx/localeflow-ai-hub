import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel } from "@/components/lf/page";
import { Chip } from "@/components/lf/chips";

export const Route = createFileRoute("/app/knowledge")({
  component: KnowledgePage,
});

function KnowledgePage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Knowledge updates" lead="Repeated human edits become candidates, never silent changes. Each candidate carries evidence, a proposed scope, a trial and a rollback path." />

      <Panel title="Terminology candidate" description="Detected from 3 repeated edits in REQ-2418.">
        <div className="rounded-lg border border-border bg-surface-2 p-4">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold">智能账本 → “Smart Ledger” (campaign wording)</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Language Owners replaced the generated “Intelligent Account Book” three times in this launch. Evidence: SEG-01, SEG-04, SEG-07.
              </p>
            </div>
            <Chip tone="warn">Campaign scope</Chip>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Kept as a campaign-specific exception rather than a global glossary change: the finance product line still uses the existing approved term. Reversible from the audit trail.
          </p>
        </div>
      </Panel>
    </div>
  );
}
