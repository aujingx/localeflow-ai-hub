import { Link } from "@tanstack/react-router";
import { PrototypeBadge } from "@/components/lf/automation";
import { Languages } from "lucide-react";
import type { ReactNode } from "react";

const nav = [
  { to: "/", label: "Overview" },
  { to: "/product", label: "How it works" },
  { to: "/decisions", label: "Product decisions" },
  { to: "/roles", label: "Roles" },
] as const;

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3 lg:flex lg:justify-between">
          <Link to="/" className="flex min-w-0 items-center gap-2.5">
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Languages className="size-4" aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="block truncate font-display text-sm font-semibold">LocaleFlow AI</span>
              <span className="block truncate text-[11px] text-muted-foreground">Enterprise localization platform</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                activeProps={{ className: "bg-secondary text-foreground" }}
                className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            to="/app"
            className="inline-flex shrink-0 items-center justify-center rounded-md bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Open the demo
          </Link>
        </div>
        <div className="border-t border-border/70 lg:hidden">
          <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-5 py-2" aria-label="Main mobile">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                activeProps={{ className: "bg-secondary text-foreground" }}
                className="shrink-0 rounded-md px-3 py-1.5 text-sm text-muted-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t border-border bg-surface-2">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 py-10 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
          <div className="min-w-0">
            <p className="font-display text-sm font-semibold">LocaleFlow AI</p>
            <p className="mt-1.5 max-w-lg text-sm text-muted-foreground">
              An internal localization platform concept. This site and the demo are a product prototype built with mock
              data — no production integrations, customers, deployments, or measured results are represented.
            </p>
            <PrototypeBadge className="mt-3" />
          </div>
          <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground" aria-label="Footer">
            {nav.map((item) => (
              <Link key={item.to} to={item.to} className="hover:text-foreground">
                {item.label}
              </Link>
            ))}
            <Link to="/app" className="hover:text-foreground">
              Product demo
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

export function Section({
  eyebrow,
  title,
  lead,
  children,
  className = "",
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section className={`mx-auto max-w-6xl px-5 py-14 sm:py-20 ${className}`}>
      <div className="max-w-2xl">
        {eyebrow ? (
          <p className="font-mono text-[11px] font-semibold tracking-[0.18em] text-primary uppercase">{eyebrow}</p>
        ) : null}
        <h2 className="mt-2 text-2xl font-semibold text-balance sm:text-3xl">{title}</h2>
        {lead ? <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{lead}</p> : null}
      </div>
      {children ? <div className="mt-8">{children}</div> : null}
    </section>
  );
}
