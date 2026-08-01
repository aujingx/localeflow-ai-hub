import { createContext, useCallback, useContext, useMemo, useReducer, type ReactNode } from "react";
import {
  exceptions as seedExceptions,
  initialActivity,
  languageRules as seedRules,
  segments as seedSegments,
  stages as seedStages,
  tasks as seedTasks,
  termCandidates as seedCandidates,
  terms as seedTerms,
} from "./seed";
import type {
  ActivityEvent,
  ExceptionItem,
  LanguageRule,
  Segment,
  Stage,
  TaskItem,
  TermCandidate,
  TermEntry,
} from "./types";

export interface DemoState {
  stages: Stage[];
  segments: Segment[];
  exceptions: ExceptionItem[];
  candidates: TermCandidate[];
  terms: TermEntry[];
  tasks: TaskItem[];
  rules: LanguageRule[];
  activity: ActivityEvent[];
  secondApprover: boolean;
  autoPassLowRisk: boolean;
  trialPrompt: boolean;
  guidedStep: number;
  guidedJaResolved: boolean;
  guidedDeResolved: boolean;
  guidedReassigned: boolean;
  guidedReleased: boolean;
  guidedKnowledgeDecision: TermCandidate["state"];
}

type Action =
  | { type: "resolve-exception"; id: string }
  | { type: "reject-exception"; id: string }
  | { type: "revert-exception"; id: string }
  | { type: "candidate"; id: string; decision: TermCandidate["state"] }
  | { type: "toggle"; key: "secondApprover" | "autoPassLowRisk" | "trialPrompt" }
  | { type: "toggle-rule"; id: string }
  | { type: "guided-step"; step: number }
  | { type: "guided-resolve"; language: "ja" | "de" }
  | { type: "guided-reassign" }
  | { type: "guided-release" }
  | { type: "guided-knowledge"; decision: TermCandidate["state"] }
  | { type: "guided-reset" }
  | { type: "reset" };

function initial(): DemoState {
  return {
    stages: structuredClone(seedStages),
    segments: structuredClone(seedSegments),
    exceptions: structuredClone(seedExceptions),
    candidates: structuredClone(seedCandidates),
    terms: structuredClone(seedTerms),
    tasks: structuredClone(seedTasks),
    rules: structuredClone(seedRules),
    activity: structuredClone(initialActivity),
    secondApprover: false,
    autoPassLowRisk: true,
    trialPrompt: false,
    guidedStep: 0,
    guidedJaResolved: false,
    guidedDeResolved: false,
    guidedReassigned: false,
    guidedReleased: false,
    guidedKnowledgeDecision: "pending",
  };
}

let eventSeq = 100;
function event(
  actor: string,
  actorType: ActivityEvent["actorType"],
  message: string,
  reason?: string,
  reversible = true,
): ActivityEvent {
  eventSeq += 1;
  return { id: `A-${eventSeq}`, at: "Just now", actor, actorType, message, reason, reversible };
}

function applySegmentFix(state: DemoState, exc: ExceptionItem): Segment[] {
  if (!exc.segmentId) return state.segments;
  return state.segments.map((seg) => {
    if (seg.id !== exc.segmentId) return seg;
    if (exc.kind === "source-clarity") {
      return {
        ...seg,
        english: "The system finalises the ledger record automatically once the sync completes.",
        targets: {
          ja: {
            value: "同期が完了すると、システムが自動的に台帳記録を確定します。",
            state: "resolved" as const,
          },
          de: {
            value:
              "Nach Abschluss der Synchronisierung schließt das System den Buchungssatz automatisch ab.",
            state: "resolved" as const,
          },
          fr: {
            value:
              "Une fois la synchronisation terminée, le système clôture automatiquement l’écriture.",
            state: "resolved" as const,
          },
        },
      };
    }
    const lang = exc.language as "ja" | "de" | "fr";
    const target = seg.targets[lang];
    return {
      ...seg,
      targets: {
        ...seg.targets,
        [lang]: {
          ...target,
          value: exc.suggestion,
          state: "resolved" as const,
          charCount: exc.kind === "character-limit" ? exc.suggestion.length : target.charCount,
          note: undefined,
        },
      },
    };
  });
}

function recomputeStages(state: DemoState): Stage[] {
  const open = state.exceptions.filter((e) => e.state === "open");
  const openBlocking = open.filter((e) => e.severity === "blocked");
  const sourceOpen = open.some((e) => e.kind === "source-clarity");
  const langOpen = open.some((e) => e.kind === "locale-rules" || e.kind === "character-limit");

  return state.stages.map((stage) => {
    if (stage.id === "source-qa") {
      return {
        ...stage,
        status: sourceOpen ? "blocked" : "done",
        completedAt: sourceOpen ? undefined : "Just now",
        checks: stage.checks.map((c) =>
          c.category === "source-clarity"
            ? {
                ...c,
                state: sourceOpen ? "fail" : "pass",
                detail: sourceOpen ? c.detail : "Clarified by the requester; generation resumed.",
              }
            : c,
        ),
      };
    }
    if (stage.id === "language-qa") {
      return {
        ...stage,
        status: langOpen ? "blocked" : "done",
        checks: stage.checks.map((c) => {
          const isJa = c.id === "c10";
          const isDe = c.id === "c11";
          if (isJa || isDe) {
            const stillOpen = open.some(
              (e) => (isJa && e.kind === "locale-rules") || (isDe && e.kind === "character-limit"),
            );
            return {
              ...c,
              state: stillOpen ? "fail" : "pass",
              detail: stillOpen ? c.detail : "Resolved by the Language Owner.",
            };
          }
          return c;
        }),
      };
    }
    if (stage.id === "exceptions") {
      return {
        ...stage,
        status: open.length ? "active" : "done",
        checks: stage.checks.map((c) => {
          const map: Record<string, ExceptionItem["kind"]> = {
            c15: "locale-rules",
            c16: "character-limit",
            c17: "source-clarity",
          };
          const kind = map[c.id];
          if (!kind) return c;
          const stillOpen = open.some((e) => e.kind === kind);
          return {
            ...c,
            state: stillOpen ? "pending" : "pass",
            detail: stillOpen ? c.detail : "Closed.",
          };
        }),
      };
    }
    if (stage.id === "release") {
      const ready = openBlocking.length === 0;
      return {
        ...stage,
        status: ready ? "active" : "waiting",
        checks: stage.checks.map((c) => ({
          ...c,
          state: ready ? "pass" : "pending",
          detail: ready
            ? "Ready to publish."
            : `${openBlocking.length} blocking exception(s) open.`,
        })),
      };
    }
    if (stage.id === "knowledge") {
      const pending = state.candidates.filter((c) => c.state === "pending").length;
      return {
        ...stage,
        status: pending ? "queued" : "done",
        checks: stage.checks.map((c) => ({
          ...c,
          state: pending ? "pending" : "pass",
          detail: pending
            ? `${pending} candidate(s) awaiting a scope decision.`
            : "All candidates decided.",
        })),
      };
    }
    return stage;
  });
}

function reducer(state: DemoState, action: Action): DemoState {
  switch (action.type) {
    case "reset":
      return initial();

    case "resolve-exception":
    case "reject-exception": {
      const exc = state.exceptions.find((e) => e.id === action.id);
      if (!exc || exc.state !== "open") return state;
      const accepted = action.type === "resolve-exception";
      let next: DemoState = {
        ...state,
        exceptions: state.exceptions.map((e) =>
          e.id === exc.id
            ? {
                ...e,
                state: "resolved",
                resolutionNote: accepted ? exc.resolutionLabel : exc.rejectLabel,
              }
            : e,
        ),
      };
      if (accepted) next = { ...next, segments: applySegmentFix(next, exc) };
      if (exc.kind === "capacity") {
        next = {
          ...next,
          tasks: next.tasks.map((t) =>
            t.id === "TSK-19"
              ? accepted
                ? { ...t, assignee: "Élodie Bernard", state: "in-progress" }
                : { ...t, assignee: "Camille Roux", state: "not-started" }
              : t,
          ),
        };
      }
      next = {
        ...next,
        activity: [
          event(
            "You",
            "human",
            `${exc.title} — ${accepted ? exc.resolutionLabel : exc.rejectLabel}`,
            `${exc.automation.rule}. Decision recorded and reversible from the exception record.`,
          ),
          ...next.activity,
        ],
      };
      return { ...next, stages: recomputeStages(next) };
    }

    case "revert-exception": {
      const base = initial();
      const seeded = base.exceptions.find((e) => e.id === action.id);
      if (!seeded) return state;
      let next: DemoState = {
        ...state,
        exceptions: state.exceptions.map((e) => (e.id === action.id ? seeded : e)),
        segments: state.segments.map((seg) => {
          const original = base.segments.find((s) => s.id === seg.id);
          return seeded.segmentId === seg.id && original ? original : seg;
        }),
        activity: [
          event(
            "You",
            "human",
            `Reverted: ${seeded.title}`,
            "Automated and human decisions in this prototype are reversible.",
          ),
          ...state.activity,
        ],
      };
      next = { ...next, stages: recomputeStages(next) };
      return next;
    }

    case "candidate": {
      const cand = state.candidates.find((c) => c.id === action.id);
      if (!cand) return state;
      const labels: Record<string, string> = {
        "campaign-scoped": "kept as a campaign-specific exception",
        "approved-global": "promoted to the global glossary",
        rejected: "rejected",
        trial: "put into trial on the next generation run",
        pending: "returned to pending",
      };
      let terms = state.terms;
      if (action.decision === "approved-global") {
        terms = state.terms.map((t) =>
          t.source === cand.source
            ? { ...t, [cand.language]: cand.proposedTarget, updatedAt: "Just now" }
            : t,
        );
      } else if (action.decision === "campaign-scoped") {
        terms = [
          ...state.terms.filter((t) => t.id !== `TC-${cand.id}`),
          {
            id: `TC-${cand.id}`,
            source: cand.source,
            en: state.terms.find((t) => t.source === cand.source)?.en ?? "—",
            ja:
              cand.language === "ja"
                ? cand.proposedTarget
                : (state.terms.find((t) => t.source === cand.source)?.ja ?? "—"),
            de:
              cand.language === "de"
                ? cand.proposedTarget
                : (state.terms.find((t) => t.source === cand.source)?.de ?? "—"),
            fr:
              cand.language === "fr"
                ? cand.proposedTarget
                : (state.terms.find((t) => t.source === cand.source)?.fr ?? "—"),
            scope: "campaign" as const,
            status: "campaign-exception" as const,
            updatedAt: "Just now",
          },
        ];
      }
      const next: DemoState = {
        ...state,
        terms,
        candidates: state.candidates.map((c) =>
          c.id === action.id ? { ...c, state: action.decision } : c,
        ),
        exceptions:
          cand.id === "TC-01"
            ? state.exceptions.map((e) =>
                e.kind === "terminology" && action.decision !== "pending"
                  ? { ...e, state: "resolved", resolutionNote: labels[action.decision] }
                  : e,
              )
            : state.exceptions,
        activity: [
          event(
            "You",
            "human",
            `Terminology candidate “${cand.source}” ${labels[action.decision]}`,
            `${cand.automation.rule}. ${action.decision === "campaign-scoped" ? "Global glossary untouched." : ""} Reversible.`,
          ),
          ...state.activity,
        ],
      };
      return { ...next, stages: recomputeStages(next) };
    }

    case "toggle": {
      const value = !state[action.key];
      const labels = {
        secondApprover: "Optional second approver for high-risk content",
        autoPassLowRisk: "Auto-pass for low-risk content that clears every check",
        trialPrompt: "DE generation prompt v4.0 trial",
      } as const;
      return {
        ...state,
        [action.key]: value,
        activity: [
          event(
            "You",
            "human",
            `${labels[action.key]} ${value ? "enabled" : "disabled"}`,
            "Workflow rule change. Applies to new stage transitions.",
          ),
          ...state.activity,
        ],
      };
    }

    case "toggle-rule":
      return {
        ...state,
        rules: state.rules.map((r) => (r.id === action.id ? { ...r, enabled: !r.enabled } : r)),
      };

    case "guided-step":
      return { ...state, guidedStep: Math.max(0, Math.min(8, action.step)) };

    case "guided-resolve":
      return {
        ...state,
        guidedJaResolved: action.language === "ja" ? true : state.guidedJaResolved,
        guidedDeResolved: action.language === "de" ? true : state.guidedDeResolved,
      };

    case "guided-reassign":
      return { ...state, guidedReassigned: true };

    case "guided-release":
      return { ...state, guidedReleased: true };

    case "guided-knowledge":
      return { ...state, guidedKnowledgeDecision: action.decision };

    case "guided-reset": {
      const seeded = initial();
      return {
        ...state,
        guidedStep: seeded.guidedStep,
        guidedJaResolved: seeded.guidedJaResolved,
        guidedDeResolved: seeded.guidedDeResolved,
        guidedReassigned: seeded.guidedReassigned,
        guidedReleased: seeded.guidedReleased,
        guidedKnowledgeDecision: seeded.guidedKnowledgeDecision,
      };
    }

    default:
      return state;
  }
}

interface DemoContextValue extends DemoState {
  resolveException: (id: string) => void;
  rejectException: (id: string) => void;
  revertException: (id: string) => void;
  decideCandidate: (id: string, decision: TermCandidate["state"]) => void;
  toggleSetting: (key: "secondApprover" | "autoPassLowRisk" | "trialPrompt") => void;
  toggleRule: (id: string) => void;
  setGuidedStep: (step: number) => void;
  resolveGuidedLanguage: (language: "ja" | "de") => void;
  reassignGuidedTask: () => void;
  releaseGuidedPackage: () => void;
  decideGuidedKnowledge: (decision: TermCandidate["state"]) => void;
  resetGuided: () => void;
  reset: () => void;
  openExceptions: ExceptionItem[];
  blockingCount: number;
  progress: number;
}

const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initial);

  const resolveException = useCallback(
    (id: string) => dispatch({ type: "resolve-exception", id }),
    [],
  );
  const rejectException = useCallback(
    (id: string) => dispatch({ type: "reject-exception", id }),
    [],
  );
  const revertException = useCallback(
    (id: string) => dispatch({ type: "revert-exception", id }),
    [],
  );
  const decideCandidate = useCallback(
    (id: string, decision: TermCandidate["state"]) => dispatch({ type: "candidate", id, decision }),
    [],
  );
  const toggleSetting = useCallback(
    (key: "secondApprover" | "autoPassLowRisk" | "trialPrompt") =>
      dispatch({ type: "toggle", key }),
    [],
  );
  const toggleRule = useCallback((id: string) => dispatch({ type: "toggle-rule", id }), []);
  const setGuidedStep = useCallback((step: number) => dispatch({ type: "guided-step", step }), []);
  const resolveGuidedLanguage = useCallback(
    (language: "ja" | "de") => dispatch({ type: "guided-resolve", language }),
    [],
  );
  const reassignGuidedTask = useCallback(() => dispatch({ type: "guided-reassign" }), []);
  const releaseGuidedPackage = useCallback(() => dispatch({ type: "guided-release" }), []);
  const decideGuidedKnowledge = useCallback(
    (decision: TermCandidate["state"]) => dispatch({ type: "guided-knowledge", decision }),
    [],
  );
  const resetGuided = useCallback(() => dispatch({ type: "guided-reset" }), []);
  const reset = useCallback(() => dispatch({ type: "reset" }), []);

  const value = useMemo<DemoContextValue>(() => {
    const openExceptions = state.exceptions.filter((e) => e.state === "open");
    const blockingCount = openExceptions.filter((e) => e.severity === "blocked").length;
    const doneStages = state.stages.filter((s) => s.status === "done").length;
    const progress = Math.round((doneStages / state.stages.length) * 100);
    return {
      ...state,
      resolveException,
      rejectException,
      revertException,
      decideCandidate,
      toggleSetting,
      toggleRule,
      setGuidedStep,
      resolveGuidedLanguage,
      reassignGuidedTask,
      releaseGuidedPackage,
      decideGuidedKnowledge,
      resetGuided,
      reset,
      openExceptions,
      blockingCount,
      progress,
    };
  }, [
    state,
    resolveException,
    rejectException,
    revertException,
    decideCandidate,
    toggleSetting,
    toggleRule,
    setGuidedStep,
    resolveGuidedLanguage,
    reassignGuidedTask,
    releaseGuidedPackage,
    decideGuidedKnowledge,
    resetGuided,
    reset,
  ]);

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo must be used inside DemoProvider");
  return ctx;
}
