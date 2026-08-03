# LocaleFlow AI

An interactive product case for an enterprise localization workflow: approved Chinese source copy becomes an English master and multilingual release, while the system handles QA, routing, workload balancing, and knowledge updates.

[Live demo](https://localeflow-ai-hub.lovable.app) · [中文产品案例](docs/CASE_STUDY_CN.md)

## Product thesis

Translation generation is only one step in localization. Delivery slows down when source copy is ambiguous, checks happen late, exceptions lack an owner, and a project manager has to coordinate every handoff.

LocaleFlow AI treats localization as an operational system:

- validate the source before translation;
- use one approved English master as the traceable reference;
- run deterministic and locale-specific checks at every transition;
- route only failed checks to an accountable Language Owner;
- automate task breakdown, assignment, reminders, capacity balancing, and status reporting;
- turn repeated approved edits into scoped knowledge candidates instead of silently changing shared assets.

## Workflow

`Chinese source → Source QA → English master → Multilingual generation → Language QA → Human exceptions → Release → Knowledge updates`

Low-risk content moves forward when all configured checks pass. A failed check blocks only the affected segment and locale. High-risk content can require an additional approval step when the organization enables that policy.

## Product decisions

| Decision                              | Rationale                                                                                                  | Trade-off                                                                              |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| QA is distributed across the workflow | Upstream defects are cheaper to resolve before they multiply across locales                                | More rules and check surfaces to maintain                                              |
| One approved English master           | Creates a shared, versioned interpretation for all target languages                                        | May lose nuance; high-risk work retains Chinese as reference                           |
| No separate AI proofreader            | A second generative pass is not an independent quality signal; rules and evidence make failures actionable | Judgement-level issues still require a Language Owner                                  |
| One Language Owner per locale         | Keeps exception ownership explicit                                                                         | Requires capacity-aware reassignment and backup coverage                               |
| Knowledge updates are scope-first     | A repeated edit may be global knowledge, a domain rule, or a campaign exception                            | Promotion is slower than automatic glossary writes, but safer                          |
| Coordination is automated             | Removes manual chasing and status reconstruction                                                           | Budget, quality-threshold, and deadline conflicts still require an authorized employee |

## Roles

- **Requester** — submits source content and resolves source ambiguity.
- **Language Owner** — handles flagged language exceptions and confirms language output.
- **Platform Admin** — manages permissions, workflow rules, and shared language assets.
- **Optional approver permission** — appears only for content covered by a configured high-risk policy.

There are no external vendor roles in this product model. All work stays inside the customer organization.

## What the deployed demo shows

The deployed prototype opens on a seeded workspace for `REQ-2418 · Smart Ledger launch`. The workspace connects the request, workflow, multilingual content, operations, language assets, knowledge decisions, settings, and analytics:

- inspect the request, workflow stages, and checks attached to each transition;
- compare the approved Chinese source, locked English master, and Japanese, German, and French output;
- review seeded source-ambiguity, Japanese-formality, and German character-limit exceptions;
- inspect workload, a capacity-based reassignment, and the reason and undo path behind the automated move;
- review language assets and decide whether repeated edits belong in shared terminology or remain a campaign exception;
- change the optional approval policy and inspect illustrative operational and quality analytics.

All interactions use deterministic local mock data. The workspace resets when the page reloads and does not create a production release.

## Evidence boundary

| Status                       | Included                                                                                                                                                 |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Implemented in the prototype | Seeded request and workflow views, multilingual content, local state changes, exception handling, workload and reassignment views, language assets, knowledge decisions, settings, and seeded analytics |
| Product design defined       | Risk routing, scope-aware learning, reversible automation, workload model, and governance rules                                                          |
| Future work                  | Production connectors, persistent backend, SSO/RBAC, multi-tenant isolation, model evaluation, and release integrations                                  |
| Measured outcomes            | None claimed; all figures in the demo are illustrative and derived from seeded data                                                                      |

## Success metrics for validation

These are proposed measures, not reported results:

- median request-to-release cycle time;
- human-touch rate by content risk and locale;
- first-pass QA failure rate and defect escape rate;
- exception resolution time and reassignment frequency;
- approved knowledge-candidate reuse and rollback rate;
- workload forecast error and SLA-risk precision.

## Repository structure

```text
src/routes/            Product website and application routes
src/lib/demo/          Seed data, state model, and demo actions
src/components/lf/     Product-specific interface components
src/components/site/   Public case-study components
docs/                  Product case documentation
```

## Run locally

Requirements: Node.js 20+ and npm or Bun.

```sh
git clone https://github.com/aujingx/localeflow-ai-hub.git
cd localeflow-ai-hub
npm install
npm run dev
```

Validation:

```sh
npm run build
npm run lint
```
