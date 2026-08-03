import { cn } from "@/lib/utils";
import { LangChip } from "@/components/lf/chips";
import type { LangCode } from "@/lib/demo/types";
import { AlertTriangle, Check, CircleDashed, Loader2, Lock } from "lucide-react";

type CellState = "queued" | "running" | "pass" | "fail" | "locked";

export type BoardSegment = {
  id: string;
  zh: string;
  context: string;
  limit?: string;
  /** step index at which the ZH source itself is settled */
  sourceIssue?: boolean;
  /** original ambiguous Chinese, shown before source QA is resolved */
  zhBefore?: string;
  /** locale that fails QA at step 4, if any */
  failsAt?: "ja" | "de";
  en: string;
  ja: string;
  de: string;
  fr: string;
};

export const BOARD_SEGMENTS: BoardSegment[] = [
  {
    id: "SEG-01",
    zh: "智能账本",
    context: "Product name · nav item",
    limit: "≤ 18 chars",
    en: "Smart Ledger",
    ja: "スマート台帳",
    de: "Smart Ledger",
    fr: "Smart Ledger",
  },
  {
    id: "SEG-02",
    zh: "开始设置",
    context: "Primary button · onboarding",
    limit: "≤ 20 chars",
    failsAt: "de",
    en: "Get started",
    ja: "設定を開始",
    de: "Jetzt starten",
    fr: "Commencer",
  },
  {
    id: "SEG-03",
    zh: "对账中心",
    context: "Section title · finance",
    limit: "≤ 24 chars",
    en: "Reconciliation Hub",
    ja: "照合センター",
    de: "Reconciliation Hub",
    fr: "Centre de rapprochement",
  },
  {
    id: "SEG-04",
    zh: "同步 {count} 条记录",
    context: "Status line · has variable",
    en: "Syncing {count} records",
    ja: "{count} 件のレコードを同期中",
    de: "{count} Datensätze werden synchronisiert",
    fr: "Synchronisation de {count} enregistrements",
  },
  {
    id: "SEG-05",
    zh: "同步完成后，系统将自动完成该账本记录。",
    context: "Status message · after sync",
    sourceIssue: true,
    zhBefore: "系统将在同步完成后自动关闭该账本记录。",
    failsAt: "ja",
    en: "Once syncing is complete, the system will automatically finalize the ledger record.",
    ja: "同期が完了すると、システムが台帳記録を自動的に確定します。",
    de: "Nach Abschluss der Synchronisierung finalisiert das System den Buchungssatz automatisch.",
    fr: "Une fois la synchronisation terminée, le système finalise automatiquement l’écriture.",
  },
  {
    id: "SEG-06",
    zh: "本月已节省 3 小时对账时间",
    context: "Campaign line · numbers",
    en: "3 hours of reconciliation saved this month",
    ja: "今月は照合作業を 3 時間削減",
    de: "3 Stunden Abstimmung in diesem Monat gespart",
    fr: "3 heures de rapprochement économisées ce mois-ci",
  },
  {
    id: "SEG-07",
    zh: "查看明细",
    context: "Secondary link · table row",
    limit: "≤ 16 chars",
    en: "View details",
    ja: "明細を表示",
    de: "Details ansehen",
    fr: "Voir le détail",
  },
  {
    id: "SEG-08",
    zh: "了解智能账本如何工作",
    context: "Marketing headline · landing",
    en: "See how Smart Ledger works",
    ja: "スマート台帳の仕組みを見る",
    de: "So funktioniert Smart Ledger",
    fr: "Découvrez le fonctionnement de Smart Ledger",
  },
];

const LOCALES: LangCode[] = ["en", "ja", "de", "fr"];

const cellStyle: Record<CellState, { cls: string; Icon: React.ComponentType<{ className?: string }>; label: string }> = {
  queued: { cls: "border-border bg-surface-2 text-muted-foreground", Icon: CircleDashed, label: "Queued" },
  running: { cls: "border-auto/25 bg-auto-soft text-auto", Icon: Loader2, label: "Generating" },
  pass: { cls: "border-pass/25 bg-pass-soft text-pass", Icon: Check, label: "Passed" },
  fail: { cls: "border-block/25 bg-block-soft text-block", Icon: AlertTriangle, label: "Needs a person" },
  locked: { cls: "border-primary/25 bg-primary-soft text-primary", Icon: Lock, label: "Locked master" },
};

function cellState(
  seg: BoardSegment,
  locale: LangCode,
  step: number,
  jaResolved: boolean,
  deResolved: boolean,
): CellState {
  if (locale === "en") {
    if (step < 2) return step === 1 && seg.sourceIssue ? "fail" : "queued";
    if (step === 2) return "running";
    return "locked";
  }
  if (step < 3) return "queued";
  if (step === 3) return "running";
  if (seg.failsAt === locale) {
    const resolved = locale === "ja" ? jaResolved : deResolved;
    return step >= 4 && !resolved ? "fail" : "pass";
  }
  return "pass";
}

export function SegmentBoard({
  step,
  jaResolved,
  deResolved,
  focusId,
  className,
}: {
  step: number;
  jaResolved: boolean;
  deResolved: boolean;
  focusId?: string | undefined;
  className?: string;
}) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full min-w-[720px] border-separate border-spacing-0 text-left">
        <thead>
          <tr>
            <th className="sticky left-0 z-10 bg-surface px-3 py-2 font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
              Segment
            </th>
            {LOCALES.map((l) => (
              <th key={l} className="px-3 py-2">
                <LangChip code={l} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {BOARD_SEGMENTS.map((seg) => {
            const focused = focusId === seg.id;
            const zh = step < 2 && seg.zhBefore ? seg.zhBefore : seg.zh;
            return (
              <tr key={seg.id} className={cn(focused && "bg-primary-soft/35")}>
                <td
                  className={cn(
                    "sticky left-0 z-10 max-w-[280px] border-t border-border px-3 py-2.5 align-top",
                    focused ? "bg-primary-soft/60" : "bg-surface",
                  )}
                >
                  <p className="font-mono text-[10px] text-muted-foreground">
                    {seg.id}
                    {seg.limit ? ` · ${seg.limit}` : ""}
                  </p>
                  <p className="mt-0.5 truncate text-sm font-medium" title={zh}>
                    {zh}
                  </p>
                  <p className="truncate text-[11px] text-muted-foreground">{seg.context}</p>
                </td>
                {LOCALES.map((l) => {
                  const state = cellState(seg, l, step, jaResolved, deResolved);
                  const cfg = cellStyle[state];
                  const text = seg[l as "en" | "ja" | "de" | "fr"];
                  const visible = state !== "queued" && state !== "running";
                  return (
                    <td key={l} className="border-t border-border px-3 py-2.5 align-top">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium",
                          cfg.cls,
                        )}
                      >
                        <cfg.Icon className={cn("size-3", state === "running" && "animate-spin")} aria-hidden />
                        {cfg.label}
                      </span>
                      <p
                        className={cn(
                          "mt-1 line-clamp-2 max-w-[220px] text-xs leading-relaxed",
                          visible ? "text-muted-foreground" : "text-transparent select-none",
                        )}
                      >
                        {visible ? text : "—"}
                      </p>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
