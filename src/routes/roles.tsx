import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, Section } from "@/components/site/site-layout";
import { Chip } from "@/components/lf/chips";
import { ArrowRight, Building2, Languages, ShieldCheck, UserRound } from "lucide-react";

export const Route = createFileRoute("/roles")({
  head: () => ({
    meta: [
      { title: "Roles and permissions — LocaleFlow AI" },
      {
        name: "description",
        content:
          "Who uses LocaleFlow AI inside the organization: requesters, Language Owners, platform admins, and the optional approver for high-risk content.",
      },
      { property: "og:title", content: "Roles and permissions — LocaleFlow AI" },
      {
        property: "og:description",
        content: "What each internal role sees, decides, and is accountable for.",
      },
    ],
  }),
  component: RolesPage,
});

const roles = [
  {
    icon: UserRound,
    name: "Requester",
    who: "Product, operations, marketing and content teams",
    sees: ["Their own requests and delivery dates", "Source QA clarifications addressed to them", "Per-language progress and release status"],
    decides: ["What to submit and when it is needed", "How to resolve an ambiguous source sentence"],
    not: ["Cannot edit target-language output", "Cannot change language assets"],
  },
  {
    icon: Languages,
    name: "Language Owner",
    who: "One accountable owner per language",
    sees: ["The exception queue for their language", "Rule, evidence and suggested fix per flag", "Their workload, schedule and SLA risk"],
    decides: ["Accept, edit or reject each flagged segment", "Confirm the final output for their language"],
    not: ["Does not review content that passed every check", "Cannot promote terminology globally"],
  },
  {
    icon: Building2,
    name: "Platform Admin",
    who: "Localization operations",
    sees: ["All requests, assets and operational load", "Terminology candidates with evidence and scope", "Prompt versions and rule configuration"],
    decides: ["Permissions and workflow rules", "Whether a candidate stays campaign-scoped, goes to trial, or becomes global", "Rollback of any knowledge change"],
    not: ["Does not sign off individual language output"],
  },
  {
    icon: ShieldCheck,
    name: "Approver (optional)",
    who: "Enabled per organization, for high-risk content only",
    sees: ["Only requests marked high risk", "The Language Owner's decision and the check record"],
    decides: ["Final confirmation before release"],
    not: ["Does not appear in the standard workflow", "Cannot edit content directly"],
  },
];

function RolesPage() {
  return (
    <SiteLayout>
      <Section
        eyebrow="Roles"
        title="Four internal roles, deliberately few"
        lead="LocaleFlow AI is used only by employees inside one customer organization. There are no vendor accounts and no external reviewer seats in this prototype."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {roles.map((r) => (
            <article key={r.name} className="rounded-xl border border-border bg-surface p-5">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary">
                  <r.icon className="size-4.5" aria-hidden />
                </span>
                <div className="min-w-0">
                  <h3 className="truncate font-display text-base font-semibold">{r.name}</h3>
                  <p className="truncate text-xs text-muted-foreground">{r.who}</p>
                </div>
              </div>

              <div className="mt-4 space-y-3 text-sm">
                <div>
                  <p className="font-mono text-[11px] tracking-wide text-muted-foreground uppercase">Sees</p>
                  <ul className="mt-1.5 space-y-1 text-muted-foreground">
                    {r.sees.map((s) => (
                      <li key={s}>· {s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-mono text-[11px] tracking-wide text-pass uppercase">Decides</p>
                  <ul className="mt-1.5 space-y-1 text-muted-foreground">
                    {r.decides.map((s) => (
                      <li key={s}>· {s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-mono text-[11px] tracking-wide text-muted-foreground uppercase">Boundaries</p>
                  <ul className="mt-1.5 space-y-1 text-muted-foreground">
                    {r.not.map((s) => (
                      <li key={s}>· {s}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <div className="border-y border-border bg-surface-2">
        <Section eyebrow="Approval" title="Where the optional approver fits" className="!py-14 sm:!py-16">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-surface p-5">
              <Chip tone="primary">Default workflow</Chip>
              <p className="mt-3 font-mono text-xs leading-relaxed text-muted-foreground">
                Language QA → failed check → Language Owner decision → release
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                One decision point. Content that passes every check is not routed to anyone.
              </p>
            </div>
            <div className="rounded-xl border border-warn/30 bg-warn-soft/50 p-5">
              <Chip tone="warn">High-risk workflow (opt-in)</Chip>
              <p className="mt-3 font-mono text-xs leading-relaxed text-muted-foreground">
                Language QA → Language Owner decision → approver confirmation → release
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                Enabled per organization in Settings. You can toggle it in the demo and watch the workflow change.
              </p>
            </div>
          </div>
          <Link
            to="/app/settings"
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try the approval rule in the demo
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Section>
      </div>
    </SiteLayout>
  );
}
