import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Panel } from "@/components/lf/page";
import { Chip, LangChip } from "@/components/lf/chips";
import { AutomationNote } from "@/components/lf/automation";
import { useDemo } from "@/lib/demo/store";
import { cn } from "@/lib/utils";
import { RotateCcw } from "lucide-react";

export const Route = createFileRoute("/app/editor")({
  component: EditorPage,
});

const targets = ["ja", "de", "fr"] as const;

function EditorPage() {
  const { segments, exceptions, resolveException, rejectException, revertException } = useDemo();
  const [selected, setSelected] = useState<string>("SEG-02");
  const segment = segments.find((s) => s.id === selected)!;
  const exception = exceptions.find((e) => e.segmentId === selected);

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Multilingual editor" lead="Chinese source, the locked English master and the generated targets side by side. Flags are inline; the decision panel shows the rule behind each one." />

      <Panel title="Segments" description="REQ-2418 · 8 segments · UI strings and one campaign message">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="border-b border-border text-left font-mono text-[11px] tracking-wide text-muted-foreground uppercase">
                <th className="py-2 pr-3 font-medium">Key</th>
                <th className="py-2 pr-3 font-medium">Source (ZH)</th>
                <th className="py-2 pr-3 font-medium">English master</th>
                {targets.map((t) => (
                  <th key={t} className="py-2 pr-3 font-medium">
                    <LangChip code={t} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {segments.map((s) => (
                <tr
                  key={s.id}
                  tabIndex={0}
                  onClick={() => setSelected(s.id)}
                  onKeyDown={(e) => e.key === "Enter" && setSelected(s.id)}
                  className={cn(
                    "cursor-pointer border-b border-border/70 align-top transition-colors last:border-0 focus:outline-none",
                    selected === s.id ? "bg-primary-soft/40" : "hover:bg-surface-2",
                  )}
                >
                  <td className="py-3 pr-3">
                    <p className="font-mono text-[11px] text-muted-foreground">{s.id}</p>
                    <p className="font-medium">{s.key}</p>
                    <p className="text-xs text-muted-foreground">{s.context}</p>
                    {s.charLimit ? <p className="mt-1 font-mono text-[11px] text-muted-foreground">limit {s.charLimit}</p> : null}
                  </td>
                  <td className="max-w-[200px] py-3 pr-3">{s.source}</td>
                  <td className="max-w-[240px] py-3 pr-3 text-muted-foreground">{s.english}</td>
                  {targets.map((t) => {
                    const tr = s.targets[t];
                    return (
                      <td key={t} className="max-w-[220px] py-3 pr-3">
                        <p className={cn(tr.state === "flagged" && "text-block")}>{tr.value}</p>
                        {tr.state === "flagged" ? <Chip tone="block" className="mt-1">Flagged</Chip> : null}
                        {tr.state === "resolved" ? <Chip tone="pass" className="mt-1">Resolved</Chip> : null}
                        {tr.state === "pending" ? <Chip tone="muted" className="mt-1">Held</Chip> : null}
                        {tr.charCount && tr.charLimit ? (
                          <p className={cn("mt-1 font-mono text-[11px]", tr.charCount > tr.charLimit ? "text-block" : "text-muted-foreground")}>
                            {tr.charCount}/{tr.charLimit} chars
                          </p>
                        ) : null}
                        {tr.note ? <p className="mt-1 text-xs text-muted-foreground">{tr.note}</p> : null}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel className="mt-4" title={`Segment ${segment.id} — ${segment.key}`} description={segment.context}>
        {exception ? (
          <div className="space-y-3">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
              <p className="min-w-0 text-sm font-semibold">{exception.title}</p>
              <Chip tone={exception.state === "open" ? "block" : "pass"}>{exception.state === "open" ? "Needs a decision" : "Resolved"}</Chip>
            </div>
            <p className="text-sm text-muted-foreground">{exception.summary}</p>
            <AutomationNote automation={exception.automation} />
            <div className="rounded-lg border border-border bg-surface-2 p-3">
              <p className="font-mono text-[11px] tracking-wide text-muted-foreground uppercase">Suggested fix</p>
              <p className="mt-1 text-sm">{exception.suggestion}</p>
            </div>
            {exception.state === "open" ? (
              <div className="flex flex-wrap gap-2">
                <button onClick={() => resolveException(exception.id)} className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                  {exception.resolutionLabel}
                </button>
                <button onClick={() => rejectException(exception.id)} className="rounded-md border border-border bg-surface px-3 py-1.5 text-sm font-medium hover:bg-secondary">
                  {exception.rejectLabel}
                </button>
              </div>
            ) : (
              <button onClick={() => revertException(exception.id)} className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs font-medium hover:bg-secondary">
                <RotateCcw className="size-3.5" aria-hidden /> Revert this decision
              </button>
            )}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border bg-surface-2 p-6 text-center text-sm text-muted-foreground">
            This segment cleared every check. No human review is required.
          </div>
        )}
      </Panel>
    </div>
  );
}
