import { cn } from "@/lib/utils";
import { LANGUAGE_META } from "@/lib/demo/seed";
import type { CheckState, LangCode, StageStatus } from "@/lib/demo/types";
import { AlertTriangle, Check, CircleDashed, Clock, Loader2, MinusCircle, X } from "lucide-react";

const toneMap = {
  pass: "bg-pass-soft text-pass border-pass/25",
  warn: "bg-warn-soft text-warn border-warn/30",
  block: "bg-block-soft text-block border-block/25",
  auto: "bg-auto-soft text-auto border-auto/25",
  primary: "bg-primary-soft text-primary border-primary/25",
  muted: "bg-muted text-muted-foreground border-border",
} as const;

export type Tone = keyof typeof toneMap;

export function Chip({
  tone = "muted",
  children,
  className,
  icon: Icon,
}: {
  tone?: Tone;
  children: React.ReactNode;
  className?: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap transition-colors",
        toneMap[tone],
        className,
      )}
    >
      {Icon ? <Icon className="size-3.5 shrink-0" /> : null}
      {children}
    </span>
  );
}

const checkTone: Record<CheckState, { tone: Tone; icon: React.ComponentType<{ className?: string }>; label: string }> = {
  pass: { tone: "pass", icon: Check, label: "Passed" },
  fail: { tone: "block", icon: X, label: "Failed" },
  warn: { tone: "warn", icon: AlertTriangle, label: "Warning" },
  pending: { tone: "auto", icon: Clock, label: "Pending" },
  skipped: { tone: "muted", icon: MinusCircle, label: "Skipped" },
};

export function CheckChip({ state, label }: { state: CheckState; label?: string }) {
  const cfg = checkTone[state];
  return (
    <Chip tone={cfg.tone} icon={cfg.icon}>
      {label ?? cfg.label}
    </Chip>
  );
}

const stageTone: Record<StageStatus, { tone: Tone; icon: React.ComponentType<{ className?: string }>; label: string }> = {
  done: { tone: "pass", icon: Check, label: "Complete" },
  active: { tone: "primary", icon: Loader2, label: "In progress" },
  blocked: { tone: "block", icon: AlertTriangle, label: "Blocked" },
  waiting: { tone: "warn", icon: Clock, label: "Waiting" },
  queued: { tone: "muted", icon: CircleDashed, label: "Queued" },
};

export function StageChip({ status }: { status: StageStatus }) {
  const cfg = stageTone[status];
  return (
    <Chip tone={cfg.tone} icon={cfg.icon}>
      {cfg.label}
    </Chip>
  );
}

export function stageAccent(status: StageStatus) {
  return {
    done: "bg-pass",
    active: "bg-primary",
    blocked: "bg-block",
    waiting: "bg-warn",
    queued: "bg-border",
  }[status];
}

export function LangChip({ code, className }: { code: LangCode; className?: string }) {
  const meta = LANGUAGE_META[code];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2 py-0.5 font-mono text-[11px] font-semibold tracking-wide",
        className,
      )}
      title={meta.label}
    >
      <span className={cn("size-1.5 rounded-full", meta.bg)} aria-hidden />
      {meta.short}
    </span>
  );
}
