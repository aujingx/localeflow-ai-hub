import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, Section } from "@/components/site/site-layout";
import { WORKFLOW_STEPS } from "@/components/site/workflow-strip";
import { Chip } from "@/components/lf/chips";
import { ArrowRight, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/product")({
  head: () => ({
    meta: [
      { title: "How LocaleFlow AI works — workflow, checks and exceptions" },
      {
        name: "description",
        content:
          "Stage-by-stage view of the LocaleFlow AI workflow: source QA, English master, multilingual generation, language QA, human exceptions, release and knowledge updates.",
      },
      { property: "og:title", content: "How LocaleFlow AI works" },
      {
        property: "og:description",
        content: "What each stage checks, who is involved, and when an exception reaches a person.",
      },
    ],
  }),
  component: ProductPage,
});

const checkCatalogue = [
  ["Terminology", "Approved glossary terms, campaign exceptions and forbidden variants."],
  ["Numbers & currency", "Figures, units, decimal separators and currency symbols per locale."],
  ["Variables", "Placeholder presence, order and syntax carried through every language."],
  ["Missing content", "Empty strings, dropped clauses and untranslated segments."],
  ["Character limits", "Component-level limits declared with the request."],
  ["Formatting", "Punctuation, spacing, casing and markup integrity."],
  ["Locale rules", "Register, address form and typographic conventions per language."],
  ["Release readiness", "Open exceptions, master integrity and package completeness."],
];

function ProductPage() {
  return (
    <SiteLayout>
      <Section
        eyebrow="How it works"
        title="One pipeline, checked at every transition"
        lead="Each stage has an owner, a set of checks, and a clear rule for when a person is needed. A failed check stops only the segment and language it affects — the rest of the release keeps moving."
      >
        <ol className="relative space-y-3 border-l border-border pl-6">
          {WORKFLOW_STEPS.map((step, i) => (
            <li key={step.id} className="relative rounded-xl border border-border bg-surface p-5">
              <span
                className="absolute top-6 -left-[1.6rem] grid size-6 place-items-center rounded-full border border-border bg-background font-mono text-[10px] font-semibold"
                aria-hidden
              >
                {i + 1}
              </span>
              <h3 className="font-display text-base font-semibold">{step.name}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.detail}</p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {step.checks.map((c) => (
                  <li key={c}>
                    <Chip tone="muted">{c}</Chip>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </Section>

      <div className="border-y border-border bg-surface-2">
        <Section
          eyebrow="Check catalogue"
          title="What the platform validates"
          lead="AI produces the translation. The platform is responsible for proving it is releasable — the same categories run wherever they are relevant, not once at the end."
          className="!py-14 sm:!py-16"
        >
          <dl className="grid gap-3 sm:grid-cols-2">
            {checkCatalogue.map(([term, def]) => (
              <div key={term} className="rounded-lg border border-border bg-surface p-4">
                <dt className="text-sm font-semibold">{term}</dt>
                <dd className="mt-1 text-sm text-muted-foreground">{def}</dd>
              </div>
            ))}
          </dl>
        </Section>
      </div>

      <Section
        eyebrow="Routing"
        title="When a person gets involved"
        lead="The routing rule is deliberately narrow, so review attention lands where the system could not decide."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              t: "Everything passes",
              b: "Low-risk content that clears every check moves forward automatically. The run is logged with the checks it passed.",
              tone: "pass" as const,
            },
            {
              t: "A check fails",
              b: "The affected segment and language are routed to exactly one Language Owner, with the rule, the evidence and a suggested fix.",
              tone: "block" as const,
            },
            {
              t: "High-risk content",
              b: "If the organization enabled the optional second approver, an extra confirmation step appears — only for content marked high risk.",
              tone: "warn" as const,
            },
          ].map((c) => (
            <article key={c.t} className="rounded-xl border border-border bg-surface p-5">
              <Chip tone={c.tone}>{c.t}</Chip>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.b}</p>
            </article>
          ))}
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-xl border border-auto/25 bg-auto-soft/60 p-5">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-auto" aria-hidden />
          <p className="text-sm leading-relaxed text-muted-foreground">
            There is no separate AI proofreading role. Validation is a property of the workflow, and the only human
            review step is the exception queue — which keeps accountability with the Language Owner who signs off the
            language.
          </p>
        </div>

        <Link
          to="/app"
          className="mt-8 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          See it running in the demo
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </Section>
    </SiteLayout>
  );
}
