import type { ReactNode } from "react";

export function PageHeader({
  title,
  lead,
  actions,
}: {
  title: string;
  lead: string;
  actions?: ReactNode;
}) {
  return (
    <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 pb-6 sm:flex sm:justify-between">
      <div className="min-w-0 max-w-2xl">
        <h1 className="truncate font-display text-xl font-semibold sm:text-2xl">{title}</h1>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{lead}</p>
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </header>
  );
}

export function Panel({
  title,
  description,
  children,
  className = "",
  actions,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
}) {
  return (
    <section className={`rounded-xl border border-border bg-surface ${className}`}>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 border-b border-border px-4 py-3">
        <div className="min-w-0">
          <h2 className="truncate font-display text-sm font-semibold">{title}</h2>
          {description ? <p className="mt-0.5 text-xs text-muted-foreground">{description}</p> : null}
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-surface-2 p-8 text-center">
      <p className="text-sm font-medium">{title}</p>
      <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground">{body}</p>
    </div>
  );
}

export function Meter({ value, tone = "primary" }: { value: number; tone?: "primary" | "pass" | "warn" | "block" }) {
  const bg = { primary: "bg-primary", pass: "bg-pass", warn: "bg-warn", block: "bg-block" }[tone];
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted" role="presentation">
      <div className={`h-full rounded-full transition-[width] duration-500 ${bg}`} style={{ width: `${Math.min(100, value)}%` }} />
    </div>
  );
}
