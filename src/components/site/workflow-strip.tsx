import { cn } from "@/lib/utils";

export const WORKFLOW_STEPS = [
  {
    id: "source",
    name: "Chinese source",
    detail: "Approved copy arrives with component metadata and character limits.",
    checks: ["Completeness", "Placeholder integrity", "Ambiguity scan"],
  },
  {
    id: "source-qa",
    name: "Source QA",
    detail: "Problems in the source are caught before anything is generated.",
    checks: ["Source clarity", "Term consistency", "Variable syntax"],
  },
  {
    id: "master",
    name: "English master",
    detail: "One approved, locked master that every target language derives from.",
    checks: ["Glossary alignment", "Numbers & currency", "Master lock"],
  },
  {
    id: "generation",
    name: "Multilingual generation",
    detail: "JA, DE and FR generated with the active prompt version and translation memory.",
    checks: ["Memory reuse", "Placeholder carry-over", "Coverage"],
  },
  {
    id: "language-qa",
    name: "Language QA",
    detail: "Per-language validation of everything a reviewer would otherwise check by hand.",
    checks: ["Terminology", "Character limits", "Locale rules", "Formatting"],
  },
  {
    id: "exceptions",
    name: "Human exceptions",
    detail: "Only failed checks reach a person — one Language Owner decides.",
    checks: ["Suggested fix", "Rule shown", "Decision logged"],
  },
  {
    id: "release",
    name: "Release",
    detail: "Readiness re-verified at publish time, not assumed from an earlier stage.",
    checks: ["Exceptions closed", "Master unchanged", "Locale packages built"],
  },
  {
    id: "knowledge",
    name: "Knowledge updates",
    detail: "Repeated edits become scoped candidates for terminology and memory.",
    checks: ["Evidence", "Scope", "Trial", "Rollback"],
  },
] as const;

export function WorkflowStrip({ className }: { className?: string }) {
  return (
    <ol className={cn("grid gap-2 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {WORKFLOW_STEPS.map((step, i) => (
        <li
          key={step.id}
          className="group relative overflow-hidden rounded-xl border border-border bg-surface p-4 transition-colors hover:border-primary/40"
        >
          <span className="absolute inset-x-0 top-0 h-0.5 overflow-hidden bg-border">
            <span
              className="flow-pulse block h-full w-1/3 bg-primary"
              style={{ animationDelay: `${i * 0.18}s` }}
              aria-hidden
            />
          </span>
          <p className="font-mono text-[11px] text-muted-foreground">{String(i + 1).padStart(2, "0")}</p>
          <p className="mt-1 font-display text-sm font-semibold">{step.name}</p>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{step.detail}</p>
          <ul className="mt-3 flex flex-wrap gap-1">
            {step.checks.map((c) => (
              <li
                key={c}
                className="rounded border border-border bg-surface-2 px-1.5 py-0.5 text-[10px] text-muted-foreground"
              >
                {c}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}
