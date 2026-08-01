import { cn } from "@/lib/utils";
import type { Automation } from "@/lib/demo/types";
import { RotateCcw, Sparkles } from "lucide-react";

export function AutomationNote({
  automation,
  className,
  compact = false,
}: {
  automation: Automation;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-auto/20 bg-auto-soft/60 p-3 text-xs leading-relaxed",
        className,
      )}
    >
      <div className="flex items-center gap-1.5 font-semibold text-auto">
        <Sparkles className="size-3.5 shrink-0" aria-hidden />
        Automated decision — {automation.trigger}
      </div>
      <dl className="mt-2 grid gap-1.5 text-muted-foreground sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-x-3">
        <dt className="font-medium text-foreground">Rule</dt>
        <dd className="min-w-0">{automation.rule}</dd>
        {!compact && (
          <>
            <dt className="font-medium text-foreground">Evidence</dt>
            <dd className="min-w-0">{automation.evidence}</dd>
          </>
        )}
        <dt className="font-medium text-foreground">Reversible</dt>
        <dd className="min-w-0 inline-flex items-center gap-1.5">
          <RotateCcw className="size-3 shrink-0" aria-hidden />
          {automation.reversible ? "Yes — this action can be undone" : "No"}
        </dd>
      </dl>
    </div>
  );
}

export function PrototypeBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-warn/35 bg-warn-soft px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-warn uppercase",
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-warn" aria-hidden />
      Prototype · mock data
    </span>
  );
}
