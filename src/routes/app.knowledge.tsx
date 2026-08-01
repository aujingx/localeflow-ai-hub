import { createFileRoute } from "@tanstack/react-router";
import { AutomationNote } from "@/components/lf/automation";
import { Chip } from "@/components/lf/chips";
import { PageHeader, Panel } from "@/components/lf/page";
import { useDemo } from "@/lib/demo/store";
import type { TermCandidate } from "@/lib/demo/types";

export const Route = createFileRoute("/app/knowledge")({
  component: KnowledgePage,
});

const stateLabel: Record<TermCandidate["state"], string> = {
  pending: "Decision needed",
  trial: "Limited trial",
  "campaign-scoped": "Campaign exception",
  "approved-global": "Global glossary",
  rejected: "Rejected",
};

function KnowledgePage() {
  const { candidates, decideCandidate } = useDemo();

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Knowledge updates"
        lead="Repeated edits create candidates, not silent changes. Evidence and scope determine whether a change becomes shared knowledge, a limited rule, or a one-off exception."
      />

      <Panel
        title="Terminology candidates"
        description={`${candidates.filter((candidate) => candidate.state === "pending").length} awaiting a scope decision.`}
      >
        <div className="space-y-4">
          {candidates.map((candidate) => (
            <article
              key={candidate.id}
              className="rounded-xl border border-border bg-surface-2 p-4 sm:p-5"
            >
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <div className="min-w-0">
                  <p className="font-mono text-[11px] text-muted-foreground">
                    {candidate.id} · {candidate.language.toUpperCase()} · {candidate.editCount}{" "}
                    edits
                  </p>
                  <h3 className="mt-1 text-sm font-semibold">
                    {candidate.source} → “{candidate.proposedTarget}”
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Current approved term: “{candidate.currentTarget}”
                  </p>
                </div>
                <Chip
                  tone={
                    candidate.state === "pending"
                      ? "warn"
                      : candidate.state === "rejected"
                        ? "muted"
                        : "pass"
                  }
                >
                  {stateLabel[candidate.state]}
                </Chip>
              </div>

              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="font-mono text-[11px] tracking-wide text-muted-foreground uppercase">
                    Scope recommendation
                  </dt>
                  <dd className="mt-1 text-muted-foreground">{candidate.scopeSuggestion}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[11px] tracking-wide text-muted-foreground uppercase">
                    Evidence segments
                  </dt>
                  <dd className="mt-1 text-muted-foreground">
                    {candidate.evidenceSegments.join(" · ")}
                  </dd>
                </div>
              </dl>

              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {candidate.rationale}
              </p>
              <AutomationNote automation={candidate.automation} className="mt-4" />

              <div className="mt-4 border-t border-border pt-4">
                {candidate.state === "pending" ? (
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => decideCandidate(candidate.id, "campaign-scoped")}
                      className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    >
                      Keep as campaign exception
                    </button>
                    <button
                      onClick={() => decideCandidate(candidate.id, "trial")}
                      className="rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium hover:bg-secondary"
                    >
                      Start limited trial
                    </button>
                    <button
                      onClick={() => decideCandidate(candidate.id, "approved-global")}
                      className="rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium hover:bg-secondary"
                    >
                      Promote globally
                    </button>
                    <button
                      onClick={() => decideCandidate(candidate.id, "rejected")}
                      className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary"
                    >
                      Reject candidate
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs text-muted-foreground">
                      Decision recorded in the audit trail. Reopening restores the candidate without
                      changing historical releases.
                    </p>
                    <button
                      onClick={() => decideCandidate(candidate.id, "pending")}
                      className="rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium hover:bg-secondary"
                    >
                      Reopen decision
                    </button>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </Panel>
    </div>
  );
}
