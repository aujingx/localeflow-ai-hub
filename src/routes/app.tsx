import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { DemoProvider, useDemo } from "@/lib/demo/store";
import { PrototypeBadge } from "@/components/lf/automation";
import { Chip } from "@/components/lf/chips";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  BarChart3,
  BookMarked,
  ChevronLeft,
  FileText,
  GitBranch,
  Languages,
  LayoutDashboard,
  Lightbulb,
  Menu,
  RotateCcw,
  Settings,
  Sparkles,
  SlidersHorizontal,
  Table2,
  X,
} from "lucide-react";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "Product demo — LocaleFlow AI" },
      {
        name: "description",
        content:
          "Clickable prototype of the LocaleFlow AI localization workspace: requests, workflow, multilingual editor, language assets, operations, knowledge updates and analytics.",
      },
      { property: "og:title", content: "LocaleFlow AI product demo" },
      {
        property: "og:description",
        content: "A clickable enterprise localization workspace running on mock data.",
      },
    ],
  }),
  component: AppLayout,
});

const groups = [
  {
    label: "Work",
    items: [
      { to: "/app", label: "Overview", icon: LayoutDashboard, exact: true },
      { to: "/app/guided", label: "Guided task", icon: Sparkles },
      { to: "/app/requests", label: "Requests", icon: FileText },
      { to: "/app/workflow", label: "Workflow", icon: GitBranch },
      { to: "/app/editor", label: "Multilingual editor", icon: Table2 },
    ],
  },
  {
    label: "Assets & operations",
    items: [
      { to: "/app/assets", label: "Language assets", icon: BookMarked },
      { to: "/app/operations", label: "Operations", icon: SlidersHorizontal },
      { to: "/app/knowledge", label: "Knowledge updates", icon: Lightbulb },
    ],
  },
  {
    label: "Insights",
    items: [
      { to: "/app/analytics", label: "Analytics", icon: BarChart3 },
      { to: "/app/settings", label: "Settings", icon: Settings },
    ],
  },
] as const;

function AppLayout() {
  return (
    <DemoProvider>
      <Shell />
    </DemoProvider>
  );
}

function Shell() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { openExceptions, blockingCount, reset, secondApprover, guidedStep } = useDemo();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const guidedActive = pathname.startsWith("/app/guided");

  const nav = (onNavigate?: () => void) => (
    <nav className="flex flex-1 flex-col gap-5 overflow-y-auto p-3" aria-label="Workspace">
      {groups.map((group) => (
        <div key={group.label}>
          {!collapsed && (
            <p className="px-2 pb-1.5 font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
              {group.label}
            </p>
          )}
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const active =
                "exact" in item && item.exact ? pathname === item.to : pathname.startsWith(item.to);
              const badge =
                item.to === "/app/workflow" && openExceptions.length ? openExceptions.length : null;
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={onNavigate}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      "flex items-center gap-2.5 rounded-md px-2 py-2 text-sm transition-colors",
                      active
                        ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                      collapsed && "justify-center",
                    )}
                  >
                    <item.icon className="size-4 shrink-0" aria-hidden />
                    {!collapsed && <span className="min-w-0 flex-1 truncate">{item.label}</span>}
                    {!collapsed && badge ? (
                      <span className="shrink-0 rounded-full bg-block-soft px-1.5 py-0.5 text-[10px] font-semibold text-block">
                        {badge}
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-200 md:flex",
          collapsed ? "w-16" : "w-60",
        )}
      >
        <div
          className={cn(
            "flex items-center gap-2.5 border-b border-sidebar-border p-3",
            collapsed && "justify-center",
          )}
        >
          <Link
            to="/"
            className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground"
            title="Back to the product site"
          >
            <Languages className="size-4" aria-hidden />
          </Link>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate font-display text-sm font-semibold">LocaleFlow AI</p>
              <p className="truncate text-[11px] text-muted-foreground">Acme Corp · Internal</p>
            </div>
          )}
        </div>
        {nav()}
        <div className="border-t border-sidebar-border p-3">
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="flex w-full items-center justify-center gap-2 rounded-md px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft
              className={cn("size-4 transition-transform", collapsed && "rotate-180")}
              aria-hidden
            />
            {!collapsed && "Collapse"}
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
          />
          <div className="rise-in absolute inset-y-0 left-0 flex w-72 flex-col border-r border-sidebar-border bg-sidebar">
            <div className="flex items-center justify-between border-b border-sidebar-border p-3">
              <p className="font-display text-sm font-semibold">LocaleFlow AI</p>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close navigation"
                className="rounded-md p-1 hover:bg-secondary"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>
            {nav(() => setMobileOpen(false))}
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
          <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-2.5">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-md p-1.5 hover:bg-secondary md:hidden"
              aria-label="Open navigation"
            >
              <Menu className="size-4.5" aria-hidden />
            </button>
            <div className="hidden md:block" />
            <div className="flex min-w-0 items-center gap-2 overflow-x-auto">
              <Chip tone="primary">REQ-2418 · Smart Ledger launch</Chip>
              <span className="hidden text-xs text-muted-foreground sm:inline">
                ZH → EN · JA · DE · FR
              </span>
              {guidedActive ? (
                <Chip tone={guidedStep === 8 ? "pass" : "auto"}>
                  {guidedStep === 8 ? "Guided task released" : `Guided task ${guidedStep + 1}/8`}
                </Chip>
              ) : blockingCount > 0 ? (
                <Chip tone="block">{blockingCount} blocking</Chip>
              ) : (
                <Chip tone="pass">No blocking exceptions</Chip>
              )}
              {!guidedActive && secondApprover ? <Chip tone="warn">2nd approver on</Chip> : null}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <PrototypeBadge className="hidden lg:inline-flex" />
              <button
                onClick={reset}
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-secondary"
              >
                <RotateCcw className="size-3.5" aria-hidden />
                Reset demo
              </button>
            </div>
          </div>
        </header>

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
