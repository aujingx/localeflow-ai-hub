import { createFileRoute, Link } from "@tanstack/react-router";
import { AutomationNote } from "@/components/lf/automation";
import { CheckChip, Chip, LangChip } from "@/components/lf/chips";
import { Meter, PageHeader } from "@/components/lf/page";
import { useDemo } from "@/lib/demo/store";
import type { Automation, TermCandidate } from "@/lib/demo/types";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  ArrowRight,
  BookOpenCheck,
  Check,
  ClipboardCheck,
  FileText,
  GitBranch,
  Languages,
  LockKeyhole,
  Rocket,
  RotateCcw,
  Sparkles,
  UserRound,
} from "lucide-react";
import type { ReactNode } from "react";

export const Route = createFileRoute("/app/guided")({
  head: () => ({
    meta: [
      { title: "Guided localization task — LocaleFlow AI" },
      {
        name: "description",
        content:
          "Complete a seeded localization task from Chinese source QA to multilingual release and scoped knowledge update.",
      },
    ],
  }),
  component: GuidedTaskPage,
});

const steps = [
  { id: "request", label: "Request", owner: "Requester", icon: FileText },
  { id: "source", label: "Source QA", owner: "Requester + system", icon: ClipboardCheck },
  { id: "master", label: "English master", owner: "Language Owner (EN)", icon: LockKeyhole },
  { id: "generation", label: "Generate locales", owner: "Localization Agent", icon: Languages },
  { id: "exceptions", label: "Resolve exceptions", owner: "Language Owners", icon: AlertTriangle },
  { id: "operations", label: "Rebalance work", owner: "Localization Agent", icon: GitBranch },
  { id: "release", label: "Release gate", owner: "System", icon: Rocket },
  { id: "knowledge", label: "Knowledge update", owner: "Platform Admin", icon: BookOpenCheck },
] as const;

const automationByStep: Automation[] = [
  {
    trigger: "Request submitted",
    rule: "OPS-PLAN-02 — split by locale and dependency before work begins",
    evidence: "8 source segments · 4 locales · Aug 5 release date · standard product-content risk",
    reversible: true,
  },
  {
    trigger: "Source clarity check",
    rule: "SRC-04 — block generation when two materially different readings remain plausible",
    evidence:
      "‘关闭’ can mean close the interface or finalise the ledger record. Context does not disambiguate it.",
    reversible: true,
  },
  {
    trigger: "English master generated",
    rule: "MASTER-LOCK-01 — target locales derive only from an approved master version",
    evidence:
      "Glossary applied · variables preserved · semantic coverage passed · no forbidden terms",
    reversible: true,
  },
  {
    trigger: "Master version EN-v3 locked",
    rule: "GEN-ROUTE-03 — run approved locale prompt and memory policy in parallel",
    evidence: "JA prompt 3.2 · DE prompt 3.9 · FR prompt 3.5 · approved term base v18",
    reversible: true,
  },
  {
    trigger: "Locale QA completed",
    rule: "QA-ROUTE-01 — route only failed checks to one accountable Language Owner",
    evidence:
      "JA formality failed · DE 34/20 character limit failed · FR passed every configured check",
    reversible: true,
  },
  {
    trigger: "Capacity forecast changed",
    rule: "OPS-CAP-03 — reassign an unstarted task when load exceeds 110% and a qualified backup is available",
    evidence:
      "Camille Roux 118% · Élodie Bernard 71% · TSK-19 not started · same locale and domain coverage",
    reversible: true,
  },
  {
    trigger: "All blocking checks closed",
    rule: "REL-GATE-01 — build a package only when master, locale, variable and approval checks pass",
    evidence:
      "0 blocking exceptions · EN-v3 unchanged · 4 locale packages complete · no optional approval required",
    reversible: true,
  },
  {
    trigger: "Repeated approved edits detected",
    rule: "KB-TERM-01 — require a scope decision before shared language assets change",
    evidence:
      "4 identical edits inside REQ-2418 · 0 occurrences outside the campaign in the last 90 days",
    reversible: true,
  },
];

const activityByStep = [
  ["Request received", "Task plan ready", "Owners tentatively assigned"],
  ["Ambiguity detected", "Generation held", "Clarification routed to Wen Jiang"],
  ["Clarification applied", "English candidate generated", "Master checks passed"],
  ["English master locked", "Three locale runs completed", "Locale QA started"],
  ["French auto-passed", "Japanese routed to Kenji", "German routed to Lukas"],
  ["Capacity risk predicted", "Qualified backup found", "Unstarted task remains reversible"],
  ["Blocking exceptions closed", "Release checks passed", "Demo package ready"],
  ["Edit pattern detected", "Scope recommendation calculated", "Global glossary unchanged"],
] as const;

function GuidedTaskPage() {
  const {
    guidedStep,
    guidedJaResolved,
    guidedDeResolved,
    guidedReassigned,
    guidedReleased,
    guidedKnowledgeDecision,
    setGuidedStep,
    resolveGuidedLanguage,
    reassignGuidedTask,
    releaseGuidedPackage,
    decideGuidedKnowledge,
    resetGuided,
  } = useDemo();

  const complete = guidedStep === steps.length;
  const progress = complete ? 100 : Math.round(((guidedStep + 0.5) / steps.length) * 100);
  const currentAutomation =
    automationByStep[Math.min(guidedStep, automationByStep.length - 1)] ?? automationByStep[0]!;
  const activity = (complete ? activityByStep[7] : activityByStep[guidedStep]) ?? activityByStep[0];
  const focusId = guidedStep <= 1 ? "SEG-05" : guidedStep === 4 ? "SEG-05" : undefined;

  return (
    <div className="mx-auto max-w-[1280px]">
      <PageHeader
        title="Complete one localization task"
        lead="Follow REQ-2418 from Chinese source copy to a releasable multilingual package. The data is seeded; every decision changes the walkthrough state."
        actions={
          <button
            onClick={resetGuided}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium hover:bg-secondary"
          >
            <RotateCcw className="size-4" aria-hidden />
            Restart
          </button>
        }
      />

      <section className="mb-4 rounded-xl border border-border bg-surface p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Chip tone="primary">REQ-2418</Chip>
              <Chip tone={complete ? "pass" : "auto"}>
                {complete ? "Released" : `Step ${guidedStep + 1} of ${steps.length}`}
              </Chip>
            </div>
            <h2 className="mt-2 font-display text-base font-semibold">Smart Ledger launch</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              8 Chinese UI and campaign segments · English master · Japanese, German and French
            </p>
          </div>
          <p className="font-mono text-sm font-semibold tabular-nums">{progress}%</p>
        </div>

        {/* Horizontal task path */}
        <ol className="mt-4 grid grid-cols-2 gap-1.5 sm:grid-cols-4 xl:grid-cols-8">
          {steps.map((step, index) => {
            const done = guidedStep > index;
            const active = guidedStep === index;
            const available = index <= guidedStep;
            return (
              <li key={step.id} className="min-w-0">
                <button
                  disabled={!available}
                  onClick={() => setGuidedStep(index)}
                  className={cn(
                    "w-full overflow-hidden rounded-lg border px-2.5 py-2 text-left transition-colors",
                    active
                      ? "border-primary bg-primary-soft"
                      : done
                        ? "border-pass/30 bg-pass-soft/40 hover:border-pass/60"
                        : "border-border bg-surface-2",
                    !available && "cursor-not-allowed opacity-45",
                  )}
                >
                  <span className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        "grid size-4 shrink-0 place-items-center rounded-full text-[9px] font-semibold",
                        done
                          ? "bg-pass text-pass-foreground"
                          : active
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground",
                      )}
                    >
                      {done ? <Check className="size-2.5" aria-hidden /> : index + 1}
                    </span>
                    <span
                      className={cn(
                        "truncate text-xs font-medium",
                        active && "text-primary",
                      )}
                    >
                      {step.label}
                    </span>
                  </span>
                  <span className="mt-0.5 block truncate pl-5.5 text-[10px] text-muted-foreground">
                    {step.owner}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <div className="mt-3">
          <Meter value={progress} tone={complete ? "pass" : "primary"} />
        </div>
      </section>

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
        <main className="min-w-0 rounded-xl border border-border bg-surface p-4 sm:p-6">
          {complete ? (
            <CompletionStep onRestart={resetGuided} decision={guidedKnowledgeDecision} />
          ) : (
            <GuidedStep
              step={guidedStep}
              jaResolved={guidedJaResolved}
              deResolved={guidedDeResolved}
              reassigned={guidedReassigned}
              released={guidedReleased}
              onNext={() => setGuidedStep(guidedStep + 1)}
              onResolveLanguage={resolveGuidedLanguage}
              onReassign={reassignGuidedTask}
              onRelease={releaseGuidedPackage}
              onKnowledgeDecision={(decision) => {
                decideGuidedKnowledge(decision);
                setGuidedStep(steps.length);
              }}
            />
          )}
        </main>

        <aside className="space-y-4 lg:sticky lg:top-4">
          <section className="rounded-xl border border-border bg-surface p-4">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-auto" aria-hidden />
              <h2 className="font-display text-sm font-semibold">Agent activity</h2>
            </div>
            <ol className="mt-3 space-y-3">
              {activity.map((item, index) => (
                <li key={item} className="grid grid-cols-[auto_minmax(0,1fr)] gap-2 text-xs">
                  <span className="mt-1 size-1.5 rounded-full bg-auto" aria-hidden />
                  <span className="text-muted-foreground">
                    <span className="font-mono text-[10px] text-auto">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="ml-2">{item}</span>
                  </span>
                </li>
              ))}
            </ol>
          </section>

          <AutomationNote automation={currentAutomation} />

          <section className="rounded-xl border border-border bg-surface p-4">
            <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
              Demo boundary
            </p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              This walkthrough uses deterministic local data. “Release” creates a simulated package;
              it does not send content to a production CMS.
            </p>
          </section>
        </aside>
      </div>

      <section className="mt-4 rounded-xl border border-border bg-surface">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 border-b border-border px-4 py-3">
          <div className="min-w-0">
            <h2 className="font-display text-sm font-semibold">Live segment board</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              All 8 segments of REQ-2418. Status updates as you move through the task — this is the
              working view a Language Owner sees.
            </p>
          </div>
          <Chip tone={complete ? "pass" : "auto"}>{complete ? "Released" : "Live"}</Chip>
        </div>
        <SegmentBoard
          step={complete ? steps.length : guidedStep}
          jaResolved={guidedJaResolved}
          deResolved={guidedDeResolved}
          focusId={focusId}
        />
      </section>
    </div>
  );
}


function GuidedStep({
  step,
  jaResolved,
  deResolved,
  reassigned,
  released,
  onNext,
  onResolveLanguage,
  onReassign,
  onRelease,
  onKnowledgeDecision,
}: {
  step: number;
  jaResolved: boolean;
  deResolved: boolean;
  reassigned: boolean;
  released: boolean;
  onNext: () => void;
  onResolveLanguage: (language: "ja" | "de") => void;
  onReassign: () => void;
  onRelease: () => void;
  onKnowledgeDecision: (decision: TermCandidate["state"]) => void;
}) {
  switch (step) {
    case 0:
      return <RequestStep onNext={onNext} />;
    case 1:
      return <SourceQaStep onNext={onNext} />;
    case 2:
      return <EnglishMasterStep onNext={onNext} />;
    case 3:
      return <GenerationStep onNext={onNext} />;
    case 4:
      return (
        <ExceptionsStep
          jaResolved={jaResolved}
          deResolved={deResolved}
          onResolve={onResolveLanguage}
          onNext={onNext}
        />
      );
    case 5:
      return <OperationsStep reassigned={reassigned} onReassign={onReassign} onNext={onNext} />;
    case 6:
      return <ReleaseStep released={released} onRelease={onRelease} onNext={onNext} />;
    default:
      return <KnowledgeStep onDecision={onKnowledgeDecision} />;
  }
}

function StepHeader({ number, title, lead }: { number: string; title: string; lead: string }) {
  return (
    <header className="border-b border-border pb-4">
      <p className="font-mono text-[10px] font-semibold tracking-[0.16em] text-primary uppercase">
        Step {number}
      </p>
      <h2 className="mt-1 text-xl font-semibold">{title}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{lead}</p>
    </header>
  );
}

function PrimaryAction({
  children,
  onClick,
  disabled = false,
}: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-45"
    >
      {children}
      <ArrowRight className="size-4" aria-hidden />
    </button>
  );
}

function RequestStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="rise-in">
      <StepHeader
        number="01"
        title="Submit the Chinese source"
        lead="The requester supplies the copy and the constraints the localization workflow needs before generation begins."
      />
      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_240px]">
        <section className="rounded-lg border border-border bg-surface-2 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold">Source segment · SEG-05</p>
            <LangChip code="zh" />
          </div>
          <p className="mt-4 text-lg leading-relaxed">系统将在同步完成后自动关闭该账本记录。</p>
          <p className="mt-3 text-xs text-muted-foreground">
            Shown after a sync run · status message · no character limit
          </p>
        </section>
        <dl className="space-y-3 rounded-lg border border-border p-4 text-sm">
          <div>
            <dt className="text-xs text-muted-foreground">Requested by</dt>
            <dd className="mt-0.5 font-medium">Wen Jiang · Product</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Locales</dt>
            <dd className="mt-1 flex flex-wrap gap-1.5">
              <LangChip code="en" /> <LangChip code="ja" /> <LangChip code="de" />{" "}
              <LangChip code="fr" />
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Release target</dt>
            <dd className="mt-0.5 font-medium">Aug 5 · Standard risk</dd>
          </div>
        </dl>
      </div>
      <div className="mt-5 flex justify-end">
        <PrimaryAction onClick={onNext}>Start localization</PrimaryAction>
      </div>
    </div>
  );
}

function SourceQaStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="rise-in">
      <StepHeader
        number="02"
        title="Resolve source ambiguity before translation"
        lead="Source QA stops only the affected segment. The other seven segments can continue through deterministic checks."
      />
      <section className="mt-5 rounded-lg border border-block/25 bg-block-soft/35 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <CheckChip state="fail" label="Ambiguity found" />
          <Chip tone="muted">SRC-04</Chip>
        </div>
        <p className="mt-3 text-sm font-medium">“关闭该账本记录” has two plausible readings:</p>
        <ol className="mt-3 grid gap-3 sm:grid-cols-2">
          <li className="rounded-lg border border-border bg-surface p-3 text-sm">
            <span className="font-semibold">A · Close the interface</span>
            <p className="mt-1 text-muted-foreground">
              Dismiss or hide the ledger record from the current view.
            </p>
          </li>
          <li className="rounded-lg border border-primary/25 bg-primary-soft/45 p-3 text-sm">
            <span className="font-semibold text-primary">B · Finalise the record</span>
            <p className="mt-1 text-muted-foreground">
              Mark the ledger record complete after syncing.
            </p>
          </li>
        </ol>
      </section>
      <section className="mt-4 rounded-lg border border-pass/25 bg-pass-soft/40 p-4">
        <p className="font-mono text-[10px] font-semibold tracking-wide text-pass uppercase">
          Requester clarification
        </p>
        <p className="mt-2 text-sm">Use meaning B. Revised source:</p>
        <p className="mt-2 text-base font-medium">同步完成后，系统将自动完成该账本记录。</p>
      </section>
      <div className="mt-5 flex justify-end">
        <PrimaryAction onClick={onNext}>Confirm meaning and continue</PrimaryAction>
      </div>
    </div>
  );
}

function EnglishMasterStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="rise-in">
      <StepHeader
        number="03"
        title="Approve one English master"
        lead="The master creates a versioned interpretation shared by every target locale. High-risk work would retain Chinese as an additional reference."
      />
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <TranslationCard
          label="Approved source"
          code="zh"
          text="同步完成后，系统将自动完成该账本记录。"
        />
        <TranslationCard
          label="English candidate · EN-v3"
          code="en"
          text="Once syncing is complete, the system will automatically finalize the ledger record."
          emphasized
        />
      </div>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {["Semantic coverage", "Glossary alignment", "Variable integrity", "Forbidden terms"].map(
          (check) => (
            <li
              key={check}
              className="flex items-center justify-between rounded-lg border border-border bg-surface-2 px-3 py-2"
            >
              <span className="text-sm">{check}</span>
              <CheckChip state="pass" />
            </li>
          ),
        )}
      </ul>
      <div className="mt-5 flex justify-end">
        <PrimaryAction onClick={onNext}>Approve and lock EN-v3</PrimaryAction>
      </div>
    </div>
  );
}

function GenerationStep({ onNext }: { onNext: () => void }) {
  const outputs = [
    {
      code: "ja" as const,
      text: "同期が完了すると、システムが台帳記録を自動的に確定する。",
      status: "Generated",
    },
    {
      code: "de" as const,
      text: "Nach Abschluss der Synchronisierung finalisiert das System den Buchungssatz automatisch.",
      status: "Generated",
    },
    {
      code: "fr" as const,
      text: "Une fois la synchronisation terminée, le système finalise automatiquement l’écriture.",
      status: "Generated",
    },
  ];
  return (
    <div className="rise-in">
      <StepHeader
        number="04"
        title="Generate target locales in parallel"
        lead="Each locale uses its own terminology, translation memory, prompt version and language rules. The output is not considered releasable until locale QA runs."
      />
      <div className="mt-5 grid gap-3">
        {outputs.map((output) => (
          <section key={output.code} className="rounded-lg border border-border bg-surface-2 p-4">
            <div className="flex items-center justify-between gap-3">
              <LangChip code={output.code} />
              <Chip tone="auto" icon={Sparkles}>
                {output.status}
              </Chip>
            </div>
            <p className="mt-3 text-sm leading-relaxed">{output.text}</p>
          </section>
        ))}
      </div>
      <div className="mt-5 flex justify-end">
        <PrimaryAction onClick={onNext}>Run locale QA</PrimaryAction>
      </div>
    </div>
  );
}

function ExceptionsStep({
  jaResolved,
  deResolved,
  onResolve,
  onNext,
}: {
  jaResolved: boolean;
  deResolved: boolean;
  onResolve: (language: "ja" | "de") => void;
  onNext: () => void;
}) {
  return (
    <div className="rise-in">
      <StepHeader
        number="05"
        title="Send only failed checks to people"
        lead="French clears every configured check automatically. Japanese and German stop for different, traceable reasons."
      />
      <div className="mt-5 space-y-3">
        <ExceptionCard
          code="ja"
          title="Formality rule"
          before="同期が完了すると、システムが台帳記録を自動的に確定する。"
          after="同期が完了すると、システムが台帳記録を自動的に確定します。"
          evidence="Plain form detected where JA-FORMALITY-01 requires です・ます for product UI."
          resolved={jaResolved}
          action="Apply formal version"
          onResolve={() => onResolve("ja")}
        />
        <ExceptionCard
          code="de"
          title="Button character limit"
          before="Jetzt mit der Einrichtung beginnen"
          after="Jetzt starten"
          evidence="34 / 20 characters. The limit comes from the component metadata supplied with the request."
          resolved={deResolved}
          action="Apply shorter label"
          onResolve={() => onResolve("de")}
        />
        <section className="rounded-lg border border-pass/25 bg-pass-soft/35 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <LangChip code="fr" />
              <p className="text-sm font-semibold">All configured checks passed</p>
            </div>
            <CheckChip state="pass" label="Auto-passed" />
          </div>
        </section>
      </div>
      <div className="mt-5 flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          {jaResolved && deResolved
            ? "Both human exceptions are closed."
            : "Resolve both blocking exceptions to continue."}
        </p>
        <PrimaryAction onClick={onNext} disabled={!jaResolved || !deResolved}>
          Continue to operations
        </PrimaryAction>
      </div>
    </div>
  );
}

function ExceptionCard({
  code,
  title,
  before,
  after,
  evidence,
  resolved,
  action,
  onResolve,
}: {
  code: "ja" | "de";
  title: string;
  before: string;
  after: string;
  evidence: string;
  resolved: boolean;
  action: string;
  onResolve: () => void;
}) {
  return (
    <section
      className={cn(
        "rounded-lg border p-4",
        resolved ? "border-pass/25 bg-pass-soft/30" : "border-block/25 bg-block-soft/30",
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <LangChip code={code} />
          <p className="text-sm font-semibold">{title}</p>
        </div>
        <CheckChip
          state={resolved ? "pass" : "fail"}
          label={resolved ? "Resolved" : "Human decision"}
        />
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="rounded-md border border-border bg-surface p-3">
          <p className="font-mono text-[10px] text-muted-foreground uppercase">Generated</p>
          <p className="mt-1.5 text-sm">{before}</p>
        </div>
        <div className="rounded-md border border-border bg-surface p-3">
          <p className="font-mono text-[10px] text-muted-foreground uppercase">Suggested fix</p>
          <p className="mt-1.5 text-sm font-medium">{after}</p>
        </div>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">{evidence}</p>
      {!resolved ? (
        <button
          onClick={onResolve}
          className="mt-3 rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium hover:bg-secondary"
        >
          {action}
        </button>
      ) : (
        <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-pass">
          <Check className="size-3.5" aria-hidden /> Edit QA reran and passed
        </p>
      )}
    </section>
  );
}

function OperationsStep({
  reassigned,
  onReassign,
  onNext,
}: {
  reassigned: boolean;
  onReassign: () => void;
  onNext: () => void;
}) {
  return (
    <div className="rise-in">
      <StepHeader
        number="06"
        title="Rebalance work before it becomes a delay"
        lead="The coordination layer detects a capacity risk and selects a qualified internal backup. It never changes an in-progress task silently."
      />
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <PersonCard
          name="Camille Roux"
          load={118}
          status={reassigned ? "Reassigned" : "Over capacity"}
          tone="block"
        />
        <PersonCard
          name="Élodie Bernard"
          load={71}
          status={reassigned ? "Assigned TSK-19" : "Qualified backup"}
          tone="pass"
        />
      </div>
      <section className="mt-4 rounded-lg border border-border bg-surface-2 p-4">
        <div className="flex items-start gap-3">
          <UserRound className="mt-0.5 size-4 shrink-0 text-auto" aria-hidden />
          <div>
            <p className="text-sm font-semibold">FR final read · TSK-19</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Not started · same locale and product-domain coverage · no change to budget or quality
              threshold
            </p>
          </div>
        </div>
      </section>
      <div className="mt-5 flex flex-wrap justify-end gap-2">
        {!reassigned ? (
          <button
            onClick={onReassign}
            className="rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium hover:bg-secondary"
          >
            Confirm automatic reassignment
          </button>
        ) : (
          <PrimaryAction onClick={onNext}>Continue to release gate</PrimaryAction>
        )}
      </div>
    </div>
  );
}

function PersonCard({
  name,
  load,
  status,
  tone,
}: {
  name: string;
  load: number;
  status: string;
  tone: "block" | "pass";
}) {
  return (
    <section className="rounded-lg border border-border bg-surface-2 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold">{name}</p>
        <Chip tone={tone}>{status}</Chip>
      </div>
      <p className="mt-3 font-mono text-xl font-semibold">{load}%</p>
      <p className="text-xs text-muted-foreground">forecast capacity</p>
      <div className="mt-3">
        <Meter value={load} tone={load > 100 ? "block" : "pass"} />
      </div>
    </section>
  );
}

function ReleaseStep({
  released,
  onRelease,
  onNext,
}: {
  released: boolean;
  onRelease: () => void;
  onNext: () => void;
}) {
  const checks = [
    "Chinese source version approved",
    "English master EN-v3 unchanged",
    "Japanese, German and French packages complete",
    "Variables and character limits passed",
    "No blocking exceptions remain",
    "Optional second approval not required for standard risk",
  ];
  return (
    <div className="rise-in">
      <StepHeader
        number="07"
        title="Pass the release gate"
        lead="Release readiness is recalculated from current state; it is not inherited from an earlier approval."
      />
      <ul className="mt-5 space-y-2">
        {checks.map((check) => (
          <li
            key={check}
            className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface-2 px-3 py-2.5"
          >
            <span className="text-sm">{check}</span>
            <CheckChip state="pass" />
          </li>
        ))}
      </ul>
      {released ? (
        <section className="mt-4 rounded-lg border border-pass/25 bg-pass-soft/40 p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-pass">
            <Check className="size-4" aria-hidden /> Demo release package created
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Version LF-REQ-2418-01 · local simulation · no external system contacted
          </p>
        </section>
      ) : null}
      <div className="mt-5 flex justify-end">
        {released ? (
          <PrimaryAction onClick={onNext}>Continue to knowledge update</PrimaryAction>
        ) : (
          <button
            onClick={onRelease}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Rocket className="size-4" aria-hidden /> Release demo package
          </button>
        )}
      </div>
    </div>
  );
}

function KnowledgeStep({ onDecision }: { onDecision: (decision: TermCandidate["state"]) => void }) {
  return (
    <div className="rise-in">
      <StepHeader
        number="08"
        title="Decide what the system should learn"
        lead="Repeated edits are evidence, not permission. The scope decision prevents a campaign choice from silently replacing a valid shared term."
      />
      <section className="mt-5 rounded-lg border border-warn/30 bg-warn-soft/35 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="font-mono text-[10px] text-muted-foreground">
              TC-01 · DE · 4 approved edits
            </p>
            <p className="mt-1 text-sm font-semibold">对账中心 → “Reconciliation Hub”</p>
          </div>
          <Chip tone="warn">Campaign scope recommended</Chip>
        </div>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs text-muted-foreground">Evidence for reuse</dt>
            <dd className="mt-1">Four identical edits in this launch</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Evidence against global promotion</dt>
            <dd className="mt-1">
              No use outside the campaign; finance still uses the approved German term
            </dd>
          </div>
        </dl>
      </section>
      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        <DecisionButton
          title="Keep as campaign exception"
          body="Recommended. Apply only to REQ-2418 and leave the global glossary unchanged."
          primary
          onClick={() => onDecision("campaign-scoped")}
        />
        <DecisionButton
          title="Start limited trial"
          body="Test on future low-risk campaign content before promotion."
          onClick={() => onDecision("trial")}
        />
        <DecisionButton
          title="Promote globally"
          body="Replace the shared German term for all future projects."
          onClick={() => onDecision("approved-global")}
        />
        <DecisionButton
          title="Reject candidate"
          body="Treat the repeated edits as noise and create no new knowledge."
          onClick={() => onDecision("rejected")}
        />
      </div>
    </div>
  );
}

function DecisionButton({
  title,
  body,
  primary = false,
  onClick,
}: {
  title: string;
  body: string;
  primary?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-lg border p-4 text-left transition-colors",
        primary
          ? "border-primary/30 bg-primary-soft/45 hover:bg-primary-soft"
          : "border-border bg-surface hover:bg-secondary",
      )}
    >
      <span className="text-sm font-semibold">{title}</span>
      <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{body}</span>
    </button>
  );
}

function CompletionStep({
  onRestart,
  decision,
}: {
  onRestart: () => void;
  decision: TermCandidate["state"];
}) {
  const decisionText: Record<TermCandidate["state"], string> = {
    pending: "No scope decision",
    "campaign-scoped": "Campaign exception",
    trial: "Limited trial",
    "approved-global": "Global promotion",
    rejected: "Candidate rejected",
  };
  return (
    <div className="rise-in">
      <div className="rounded-xl border border-pass/25 bg-pass-soft/35 p-5 text-center sm:p-8">
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-pass text-pass-foreground">
          <Check className="size-6" aria-hidden />
        </span>
        <p className="mt-4 font-mono text-[10px] font-semibold tracking-[0.16em] text-pass uppercase">
          Task complete
        </p>
        <h2 className="mt-1 text-2xl font-semibold">One request, from source to release</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
          The simulated package is released and the terminology candidate has an explicit scope
          decision. No production system was contacted.
        </p>
      </div>
      <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[
          ["Source", "8 Chinese segments"],
          ["Delivery", "EN master + 3 target locales"],
          ["Exceptions", "3 content and language issues resolved"],
          ["Operations", "1 capacity-based reassignment"],
          ["Knowledge", decisionText[decision]],
          ["Release", "LF-REQ-2418-01 · simulated"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg border border-border bg-surface-2 p-4">
            <dt className="font-mono text-[10px] tracking-wide text-muted-foreground uppercase">
              {label}
            </dt>
            <dd className="mt-1 text-sm font-semibold">{value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-5 flex flex-wrap justify-end gap-2">
        <button
          onClick={onRestart}
          className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium hover:bg-secondary"
        >
          <RotateCcw className="size-4" aria-hidden /> Run again
        </button>
        <Link
          to="/app/workflow"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Explore the full workspace <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
    </div>
  );
}

function TranslationCard({
  label,
  code,
  text,
  emphasized = false,
}: {
  label: string;
  code: "zh" | "en";
  text: string;
  emphasized?: boolean;
}) {
  return (
    <section
      className={cn(
        "rounded-lg border p-4",
        emphasized ? "border-primary/25 bg-primary-soft/35" : "border-border bg-surface-2",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <LangChip code={code} />
      </div>
      <p className="mt-4 text-base leading-relaxed">{text}</p>
    </section>
  );
}
