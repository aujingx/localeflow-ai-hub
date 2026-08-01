import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, Section } from "@/components/site/site-layout";
import { WorkflowStrip } from "@/components/site/workflow-strip";
import { PrototypeBadge } from "@/components/lf/automation";
import { Chip } from "@/components/lf/chips";
import { ArrowRight, AlertTriangle, Check, GitBranch, ScrollText, Users } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LocaleFlow AI — Enterprise localization from Chinese source to every market" },
      {
        name: "description",
        content:
          "A product prototype for an internal localization platform: Chinese source to English master to JA, DE and FR, with checks at every stage, routed human exceptions, and automated project coordination.",
      },
      { property: "og:title", content: "LocaleFlow AI — Enterprise localization workflow prototype" },
      {
        property: "og:description",
        content:
          "From approved Chinese copy to every market—without chasing tasks. Explore the clickable product demo and the product decisions behind it.",
      },
    ],
  }),
  component: Home,
});

const problems = [
  {
    icon: ScrollText,
    title: "Quality checks arrive too late",
    body: "Terminology, numbers, variables and length problems surface during a final proofread, when fixing them is most expensive.",
  },
  {
    icon: Users,
    title: "Coordination eats the day",
    body: "A project manager chases owners, rebalances load, and rebuilds status reports by hand for every launch.",
  },
  {
    icon: GitBranch,
    title: "Knowledge never settles",
    body: "The same manual edit is repeated across campaigns because nothing turns it into a reviewed, scoped glossary change.",
  },
];

const approach = [
  {
    title: "Checks live inside the workflow",
    body: "Validation runs at source, at the master, after generation, and again at release. AI produces the translation; the platform verifies terminology, numbers, variables, missing content, character limits, formatting, locale rules and release readiness.",
  },
  {
    title: "Only exceptions reach people",
    body: "Low-risk content that clears every check can pass automatically. A failed check goes to exactly one Language Owner with the rule, the evidence and a suggested fix. A second approver appears only where the organization configured it for high-risk content.",
  },
  {
    title: "Coordination is a product feature",
    body: "Task breakdown, scheduling, assignment, reminders, workload tracking, delay prediction and status reporting run continuously — with a visible reason for every automated move.",
  },
  {
    title: "Every automated action is legible",
    body: "Each decision shows what triggered it, which rule or evidence it used, and whether it can be reversed. Nothing changes a shared language asset without a scope decision.",
  },
];

export default function Home() {
  return (
    <SiteLayout>
      <section className="relative overflow-hidden border-b border-border">
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-[0.35]" aria-hidden />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-primary/40" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-5 py-16 sm:py-24">
          <PrototypeBadge />
          <h1 className="mt-5 max-w-3xl text-3xl leading-[1.1] font-semibold text-balance sm:text-5xl">
            From approved Chinese copy to every market—without chasing tasks.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            LocaleFlow AI generates multilingual content, checks quality at every step, routes exceptions to the right
            employee, and keeps delivery moving from request to release.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/app"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Explore the product demo
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link
              to="/decisions"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
            >
              View product decisions
            </Link>
          </div>

          <dl className="mt-12 grid max-w-3xl gap-4 sm:grid-cols-3">
            {[
              ["Source of truth", "One approved, locked English master"],
              ["Target languages in the demo", "Japanese · German · French"],
              ["Human touchpoints", "Failed checks only"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl border border-border bg-surface p-4">
                <dt className="font-mono text-[11px] tracking-wide text-muted-foreground uppercase">{k}</dt>
                <dd className="mt-1.5 text-sm font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <Section
        eyebrow="The problem"
        title="Localization slows down between the work, not during it"
        lead="Translation itself is rarely the bottleneck. The delay sits in unclear source copy, late quality checks, and the manual coordination that keeps a release moving."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {problems.map((p) => (
            <article key={p.title} className="rounded-xl border border-border bg-surface p-5">
              <p.icon className="size-5 text-primary" aria-hidden />
              <h3 className="mt-3 text-base font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
            </article>
          ))}
        </div>
      </Section>

      <div className="border-y border-border bg-surface-2">
        <Section
          eyebrow="The workflow"
          title="Chinese source to release, with checks at every step"
          lead="Quality is not a stage at the end. Each transition has its own checks, and a failure stops only what it affects."
          className="!py-14 sm:!py-16"
        >
          <WorkflowStrip />
          <Link
            to="/product"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            See what each stage checks
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Section>
      </div>

      <Section eyebrow="The approach" title="Four commitments the product is built on">
        <div className="grid gap-4 md:grid-cols-2">
          {approach.map((a) => (
            <article key={a.title} className="rounded-xl border border-border bg-surface p-5">
              <div className="flex items-start gap-2.5">
                <Check className="mt-0.5 size-4 shrink-0 text-pass" aria-hidden />
                <h3 className="text-base font-semibold">{a.title}</h3>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a.body}</p>
            </article>
          ))}
        </div>
      </Section>

      <div className="border-y border-border bg-surface-2">
        <Section
          eyebrow="In the demo"
          title="One feature launch, five real exceptions"
          lead="The demo is seeded with a single launch: Chinese UI strings plus a campaign message, an approved English master, and Japanese, German and French output."
          className="!py-14 sm:!py-16"
        >
          <ul className="grid gap-3 md:grid-cols-2">
            {[
              ["Source QA finds an ambiguous Chinese sentence", "The requester is asked to clarify it before generation continues.", "block"],
              ["Japanese fails a formality rule", "Plain form used where the style guide requires です・ます.", "block"],
              ["German exceeds a UI character limit", "34 characters against a 20-character button.", "block"],
              ["A Language Owner is over capacity", "An unstarted task is reassigned, with the rule and an undo.", "warn"],
              ["Repeated edits create a terminology candidate", "Held as a campaign-specific exception — the global glossary is untouched.", "warn"],
            ].map(([title, body, tone]) => (
              <li key={title as string} className="rounded-xl border border-border bg-surface p-4">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle
                    className={`mt-0.5 size-4 shrink-0 ${tone === "block" ? "text-block" : "text-warn"}`}
                    aria-hidden
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{body}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <Section
        eyebrow="Scope"
        title="What this prototype is, and what it is not"
        lead="Everything you can click runs on local mock data."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-pass/25 bg-pass-soft/50 p-5">
            <Chip tone="pass" icon={Check}>
              Included
            </Chip>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>End-to-end workflow with per-stage checks and state changes</li>
              <li>A clickable exception path with reversible decisions</li>
              <li>Language assets, operations, knowledge updates and analytics surfaces</li>
              <li>Configurable optional second-approver rule</li>
            </ul>
          </div>
          <div className="rounded-xl border border-border bg-surface p-5">
            <Chip tone="muted">Not claimed</Chip>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>No production integrations or connected content systems</li>
              <li>No real customers, deployments or usage</li>
              <li>No measured efficiency gains or quality benchmarks</li>
              <li>No persistent backend — the demo resets when you reload</li>
            </ul>
          </div>
        </div>
        <Link
          to="/app"
          className="mt-8 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Explore the product demo
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </Section>
    </SiteLayout>
  );
}
