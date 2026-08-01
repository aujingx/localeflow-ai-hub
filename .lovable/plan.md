## LocaleFlow AI — product site + clickable prototype

Two connected experiences in one app, visually consistent, all data local and mocked. A persistent "Prototype — mock data" label appears in both.

### Visual system

- **Typography:** Sora (headings, tight tracking) + Manrope (body, tables, UI).
- **Palette — colorful but disciplined:** cool near-black ink `#0E1116` and layered light neutrals as the base, with a *functional* multi-hue system rather than one flat accent:
  - Primary/action: indigo `#4F46E5`
  - Success / passed checks: teal `#0E9384`
  - Warning / SLA risk: amber `#D97706`
  - Blocked / failed check: rose `#E11D48`
  - Info / automation: sky `#0284C7`
  - Language identity hues (EN/JA/DE/FR each get a consistent chip color)
  Color always carries meaning — no decorative gradients, no neon purple, no glass.
- Dark mode included; all values as oklch tokens in `src/styles.css`.
- Subtle motion: workflow node progression, status chip transitions, progress bars, row-level state changes. Reduced-motion respected.

### App shell (UX choice)

Hybrid: **collapsible left sidebar** grouping the nine areas into Work / Assets / Insights, plus a **top context bar** (project selector, language filter, environment badge, command palette `⌘K`). Sidebar collapses to icon rail on tablet and becomes a bottom sheet / drawer on mobile. This keeps nine dense areas navigable without losing table width.

### Marketing site (routes)

- `/` — hero ("From approved Chinese copy to every market—without chasing tasks."), CTAs *Explore the product demo* / *View product decisions*; problem framing; animated workflow strip; where AI acts and where humans do; scope-of-prototype note.
- `/product` — workflow deep dive: Chinese source → Source QA → English master → Multilingual generation → Language QA → Human exceptions → Release → Knowledge updates, with the check categories at each stage (terminology, numbers, variables, missing content, character limits, formatting, locale rules, release readiness).
- `/decisions` — product decision log: why checks are distributed not final-stage, why one Language Owner (no AI-proofreader role), why the second approver is optional/config-driven, why terminology candidates default to campaign-scoped, auto-pass criteria for low-risk content.
- `/roles` — Requester, Language Owner, Platform Admin, optional Approver: what each sees and decides.
- Each route gets its own `head()` metadata.

### Demo (routes under `/app`)

1. **Overview** — launch health, stage funnel, exceptions awaiting me, SLA risk, recent automated actions with reasons.
2. **Requests** — table + request detail drawer: source files, stage timeline, per-language status, activity log.
3. **Workflow** — visual pipeline for the seeded launch, per-stage check results, clickable nodes revealing which checks ran, passed, or failed.
4. **Multilingual Editor** — segment table: Chinese source, English master, JA/DE/FR columns, inline check badges, flagged-segment panel with rule, evidence, suggested fix, Accept / Edit / Reject, and reversibility note.
5. **Language Assets** — terminology, translation memory, language rules, prompt versions (with version diff and scope).
6. **Operations** — schedule, employee capacity bars, assignments, SLA risk list, blockers, reassignment log.
7. **Knowledge Updates** — terminology candidates with evidence (edit frequency, segments), applicable scope, trial mode, Approve / Scope to campaign / Reject, rollback.
8. **Analytics** — meaningful charts only: stage throughput, exception reasons, first-pass rate by language, capacity vs. load.
9. **Settings** — permissions, workflow rules, and the optional second-approver toggle for high-risk content (toggling it visibly changes the workflow diagram and a pending request's path).

### Seeded scenario

One feature launch: Chinese UI strings + a marketing message → approved English master → JA/DE/FR. Five live exceptions, each clickable and resolvable:

- Source QA flags an ambiguous Chinese sentence → clarification request back to the requester.
- Japanese fails a formality rule.
- German exceeds a UI character limit.
- A Language Owner is over capacity → an unstarted task auto-reassigns (with reason + undo).
- Repeated human edits generate a terminology candidate, held as a campaign-scoped exception rather than a global term change.

Every automated action renders a compact "why" line: trigger, rule or evidence, and whether it is reversible.

### Clickable main path

Open request → inspect workflow → open flagged segment → resolve it → approve or scope a terminology candidate → see progress, stage status, exception count, and analytics update. State lives in a client-side mock store (React context + reducer), so changes persist across the demo session and reset from a visible control.

### Technical notes

- TanStack Start file routes; `/` is the marketing home, demo under `/app/*` with a layout route holding the shell.
- Mock data and reducer in `src/lib/demo/` — seed, types, selectors, actions.
- shadcn primitives (table, drawer, tabs, dialog, tooltip, progress, badge) restyled to the token system; no hardcoded color utilities.
- Motion via CSS transitions and small Framer-free animations; accessible focus states, keyboard-navigable tables and drawers, `aria-live` on state changes.
- Empty, loading (skeleton), success, warning, and blocked states designed per surface.
- No backend, no auth, no external integrations.
