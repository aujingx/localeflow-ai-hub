import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel } from "@/components/lf/page";
import { Chip, LangChip } from "@/components/lf/chips";
import { promptVersions, tmEntries } from "@/lib/demo/seed";
import { useDemo } from "@/lib/demo/store";

export const Route = createFileRoute("/app/assets")({
  component: AssetsPage,
});

function AssetsPage() {
  const { terms, rules, toggleRule, trialPrompt } = useDemo();

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Language assets" lead="Terminology, translation memory, language rules and prompt versions. Shared assets only change through an explicit decision." />

      <Panel title="Terminology" description="Approved glossary plus any campaign-scoped exceptions.">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-border text-left font-mono text-[11px] tracking-wide text-muted-foreground uppercase">
                <th className="py-2 pr-3 font-medium">Source</th>
                <th className="py-2 pr-3 font-medium">EN</th>
                <th className="py-2 pr-3 font-medium">JA</th>
                <th className="py-2 pr-3 font-medium">DE</th>
                <th className="py-2 pr-3 font-medium">FR</th>
                <th className="py-2 pr-3 font-medium">Scope</th>
                <th className="py-2 font-medium">Updated</th>
              </tr>
            </thead>
            <tbody>
              {terms.map((t) => (
                <tr key={t.id} className="border-b border-border/70 last:border-0">
                  <td className="py-2.5 pr-3 font-medium">{t.source}</td>
                  <td className="py-2.5 pr-3 text-muted-foreground">{t.en}</td>
                  <td className="py-2.5 pr-3 text-muted-foreground">{t.ja}</td>
                  <td className="py-2.5 pr-3 text-muted-foreground">{t.de}</td>
                  <td className="py-2.5 pr-3 text-muted-foreground">{t.fr}</td>
                  <td className="py-2.5 pr-3">
                    <Chip tone={t.scope === "campaign" ? "warn" : "pass"}>{t.scope === "campaign" ? "Campaign only" : "Global"}</Chip>
                  </td>
                  <td className="py-2.5 font-mono text-[11px] whitespace-nowrap text-muted-foreground">{t.updatedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel title="Translation memory" description="Reused during generation before anything new is produced.">
          <ul className="space-y-2">
            {tmEntries.map((e) => (
              <li key={e.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-border bg-surface-2 p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm">{e.source}</p>
                  <p className="truncate text-xs text-muted-foreground">{e.target}</p>
                </div>
                <span className="flex shrink-0 items-center gap-2">
                  <LangChip code={e.language} />
                  <Chip tone={e.match >= 95 ? "pass" : "muted"}>{e.match}%</Chip>
                </span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Language rules" description="Rules decide whether a check blocks release or only warns.">
          <ul className="space-y-2">
            {rules.map((r) => (
              <li key={r.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-border bg-surface-2 p-3">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 truncate text-sm font-medium">
                    <LangChip code={r.language} /> {r.name}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">{r.description}</p>
                </div>
                <span className="flex shrink-0 items-center gap-2">
                  <Chip tone={r.severity === "blocked" ? "block" : "warn"}>{r.severity}</Chip>
                  <button
                    onClick={() => toggleRule(r.id)}
                    aria-pressed={r.enabled}
                    className={`rounded-md border px-2 py-1 text-xs font-medium transition-colors ${r.enabled ? "border-primary/30 bg-primary-soft text-primary" : "border-border bg-surface text-muted-foreground"}`}
                  >
                    {r.enabled ? "On" : "Off"}
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel className="mt-4" title="Prompt versions" description="Generation prompts are versioned; trials run alongside the active version.">
        <ul className="space-y-2">
          {promptVersions.map((p) => (
            <li key={p.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 rounded-lg border border-border bg-surface-2 p-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {p.name} <span className="font-mono text-xs text-muted-foreground">{p.version}</span>
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">{p.change}</p>
                <p className="mt-1 font-mono text-[11px] text-muted-foreground">changed {p.changedAt}</p>
              </div>
              <Chip tone={p.status === "active" ? "pass" : p.status === "trial" ? "warn" : "muted"}>
                {p.status === "trial" && !trialPrompt ? "trial (off)" : p.status}
              </Chip>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
