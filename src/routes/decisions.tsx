import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, Section } from "@/components/site/site-layout";
import { Chip } from "@/components/lf/chips";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/decisions")({
  head: () => ({
    meta: [
      { title: "Product decisions — LocaleFlow AI" },
      {
        name: "description",
        content:
          "The reasoning behind LocaleFlow AI: distributed quality checks, a single Language Owner per language, optional second approval, and campaign-scoped terminology candidates.",
      },
      { property: "og:title", content: "Product decisions — LocaleFlow AI" },
      {
        property: "og:description",
        content: "Six decisions that shape the workflow, with the trade-offs each one accepts.",
      },
    ],
  }),
  component: DecisionsPage,
});

const decisions = [
  {
    id: "D-01",
    title: "Quality checks run throughout, not as a final proofread",
    decision:
      "Validation is attached to each transition — source, master, generation, language, release — instead of a single review stage before publication.",
    why: "Most defects originate upstream. An ambiguous source sentence caught at Source QA costs one clarification; the same sentence caught after generation costs four languages of rework.",
    tradeoff:
      "More check surfaces to configure and maintain, and more places where a run can stop. Mitigated by scoping a failure to the affected segment and language only.",
  },
  {
    id: "D-02",
    title: "One English master, locked before any target language",
    decision:
      "Every target language derives from a single approved English master rather than from the Chinese source.",
    why: "It gives one reviewable point of interpretation, keeps target languages consistent with each other, and makes divergence traceable to a master version.",
    tradeoff:
      "Adds a serialisation point and some loss of nuance for languages closer to Chinese. Accepted because consistency and auditability matter more for internal product copy.",
  },
  {
    id: "D-03",
    title: "No separate AI proofreading role",
    decision:
      "AI generates translations; the platform validates them. There is no second AI persona that reviews the first one's output.",
    why: "A second generative pass does not provide an independent quality signal. Rule- and evidence-based checks produce a finding the Language Owner can act on.",
    tradeoff:
      "Checks only catch what has been expressed as a rule, a list, or a limit. Judgement-level quality still depends on the Language Owner.",
  },
  {
    id: "D-04",
    title: "A failed check goes to exactly one Language Owner",
    decision:
      "Each language has one accountable owner for exceptions. No review pools, no round-robin.",
    why: "Shared queues diffuse accountability and produce inconsistent language over time. A named owner also makes capacity measurable, which is what makes automated scheduling honest.",
    tradeoff:
      "Single-owner concentration is a delivery risk, which is why Operations monitors capacity and can reassign unstarted tasks to an equally scoped owner.",
  },
  {
    id: "D-05",
    title: "The second approver is optional and configuration-driven",
    decision:
      "A second approval step exists only when an organization enables it, and only applies to content marked high risk.",
    why: "Regulated content needs it; routine UI strings do not. Making it universal would train reviewers to approve without reading.",
    tradeoff:
      "Two possible workflow shapes to design, test and explain. Handled by making the active shape visible in Settings and in the workflow view.",
  },
  {
    id: "D-06",
    title: "Repeated edits create campaign-scoped candidates, not glossary changes",
    decision:
      "When the same human edit repeats, the system raises a terminology candidate scoped to the campaign. Promotion to the global glossary is an explicit admin decision.",
    why: "A launch often uses deliberately different wording. Silently rewriting shared language assets from local behaviour would propagate a campaign choice across every future project.",
    tradeoff:
      "Some genuinely global corrections wait for an admin. Reduced by showing the evidence, the affected segments, a trial mode and a rollback path on the candidate itself.",
  },
];

const openQuestions = [
  "How should a rejected clarification be escalated when the requester does not respond before the due date?",
  "Should translation memory writes follow the same scope-first rule as terminology, or auto-commit on release?",
  "What is the right unit for capacity — hours, segments, or weighted complexity?",
];

function DecisionsPage() {
  return (
    <SiteLayout>
      <Section
        eyebrow="Product decisions"
        title="What we chose, why, and what it costs"
        lead="Each decision below shapes the workflow you can click through in the demo. The trade-off column is the part that usually gets left out."
      >
        <div className="space-y-4">
          {decisions.map((d) => (
            <article key={d.id} className="rounded-xl border border-border bg-surface p-5 sm:p-6">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
                <h3 className="min-w-0 font-display text-base font-semibold sm:text-lg">
                  {d.title}
                </h3>
                <span className="shrink-0 font-mono text-[11px] text-muted-foreground">{d.id}</span>
              </div>
              <dl className="mt-4 grid gap-4 sm:grid-cols-3">
                <div>
                  <dt className="font-mono text-[11px] tracking-wide text-primary uppercase">
                    Decision
                  </dt>
                  <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {d.decision}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[11px] tracking-wide text-pass uppercase">Why</dt>
                  <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{d.why}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[11px] tracking-wide text-warn uppercase">
                    Trade-off
                  </dt>
                  <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {d.tradeoff}
                  </dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </Section>

      <div className="border-y border-border bg-surface-2">
        <Section
          eyebrow="Still open"
          title="Questions this prototype does not answer yet"
          className="!py-14 sm:!py-16"
        >
          <ul className="space-y-2">
            {openQuestions.map((q) => (
              <li
                key={q}
                className="flex items-start gap-3 rounded-lg border border-border bg-surface p-4 text-sm"
              >
                <Chip tone="muted">Open</Chip>
                <span className="min-w-0 text-muted-foreground">{q}</span>
              </li>
            ))}
          </ul>
          <Link
            to="/app"
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Explore the product demo
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Section>
      </div>
    </SiteLayout>
  );
}
