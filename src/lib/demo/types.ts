export type LangCode = "zh" | "en" | "ja" | "de" | "fr";

export type StageId =
  | "source-qa"
  | "english-master"
  | "generation"
  | "language-qa"
  | "exceptions"
  | "release"
  | "knowledge";

export type StageStatus = "done" | "active" | "blocked" | "waiting" | "queued";

export type CheckCategory =
  | "terminology"
  | "numbers"
  | "variables"
  | "missing-content"
  | "character-limit"
  | "formatting"
  | "locale-rules"
  | "release-readiness"
  | "source-clarity";

export type CheckState = "pass" | "fail" | "warn" | "skipped" | "pending";

export interface StageCheck {
  id: string;
  category: CheckCategory;
  label: string;
  state: CheckState;
  detail: string;
  scope: string;
}

export interface Stage {
  id: StageId;
  name: string;
  description: string;
  status: StageStatus;
  owner: string;
  startedAt?: string | undefined;
  completedAt?: string | undefined;
  checks: StageCheck[];
}

export type SegmentKind = "ui-string" | "marketing";

export interface Translation {
  value: string;
  state: "clean" | "flagged" | "resolved" | "pending";
  charCount?: number | undefined;
  charLimit?: number | undefined;
  note?: string | undefined;
}

export interface Segment {
  id: string;
  key: string;
  kind: SegmentKind;
  context: string;
  charLimit?: number | undefined;
  source: string;
  english: string;
  targets: Record<Exclude<LangCode, "zh" | "en">, Translation>;
}

export type ExceptionKind =
  | "source-clarity"
  | "locale-rules"
  | "character-limit"
  | "capacity"
  | "terminology";

export type ExceptionState = "open" | "resolved" | "reverted";

export interface Automation {
  trigger: string;
  rule: string;
  evidence: string;
  reversible: boolean;
}

export interface ExceptionItem {
  id: string;
  kind: ExceptionKind;
  language: LangCode;
  segmentId?: string | undefined;
  title: string;
  summary: string;
  severity: "blocked" | "warn";
  assignee: string;
  raisedAt: string;
  automation: Automation;
  suggestion: string;
  resolutionLabel: string;
  rejectLabel: string;
  state: ExceptionState;
  resolutionNote?: string | undefined;
}

export interface RequestItem {
  id: string;
  title: string;
  requester: string;
  team: string;
  risk: "standard" | "high";
  due: string;
  languages: LangCode[];
  segmentCount: number;
  status: "in-progress" | "blocked" | "released" | "queued";
  progress: number;
  summary: string;
}

export interface TermEntry {
  id: string;
  source: string;
  en: string;
  ja: string;
  de: string;
  fr: string;
  scope: "global" | "campaign";
  status: "approved" | "candidate" | "campaign-exception" | "rejected";
  updatedAt: string;
}

export interface TmEntry {
  id: string;
  source: string;
  target: string;
  language: LangCode;
  match: number;
  lastUsed: string;
}

export interface LanguageRule {
  id: string;
  language: LangCode;
  name: string;
  description: string;
  severity: "blocked" | "warn";
  enabled: boolean;
}

export interface PromptVersion {
  id: string;
  name: string;
  version: string;
  language: LangCode | "all";
  status: "active" | "archived" | "trial";
  changedAt: string;
  change: string;
}

export interface Person {
  id: string;
  name: string;
  role: string;
  languages: LangCode[];
  capacity: number;
  load: number;
  timezone: string;
}

export interface TaskItem {
  id: string;
  name: string;
  language: LangCode;
  assignee: string;
  due: string;
  state: "not-started" | "in-progress" | "done" | "reassigned";
  slaRisk: "none" | "at-risk" | "breached";
  hours: number;
}

export interface TermCandidate {
  id: string;
  source: string;
  currentTarget: string;
  proposedTarget: string;
  language: LangCode;
  editCount: number;
  evidenceSegments: string[];
  scopeSuggestion: "campaign" | "global";
  rationale: string;
  state: "pending" | "campaign-scoped" | "approved-global" | "rejected" | "trial";
  automation: Automation;
}

export interface ActivityEvent {
  id: string;
  at: string;
  actor: string;
  actorType: "system" | "human";
  message: string;
  reason?: string | undefined;
  reversible?: boolean | undefined;
}
