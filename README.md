# LocaleFlow AI Demo

我需要创建一个AI翻译平台的说明+demo 网站：
Build a polished, responsive B2B SaaS product demo and companion product-explanation website for LocaleFlow AI.

LocaleFlow AI is an internal enterprise localization platform. It manages the full workflow from approved Chinese source copy to an English master, multiple target languages, quality checks, human exception handling, release, and continuous updates to terminology and translation memory. It also automates the daily coordination work normally handled by a localization project manager: task breakdown, scheduling, assignment, reminders, workload tracking, delay prediction, and status reporting.

The product is used only by employees inside one customer organization. The core users are:

Requesters from product, operations, marketing, and content teams

Language Owners who handle flagged language issues and confirm final output

Platform Admins who manage permissions, language assets, and workflow rules

Optional approval permissions for regulated or high-risk content

Experience to create

Create two connected experiences:

A concise product website that explains the problem, product approach, workflow, key decisions, and prototype scope.

A clickable product demo that feels like a credible enterprise application rather than a static dashboard.

The website should help a recruiter, hiring manager, or B2B buyer understand the product in a few minutes. Use clear, restrained copy and avoid unsupported performance claims, customer logos, testimonials, or invented business results.

Suggested hero direction:

From approved Chinese copy to every market—without chasing tasks.

LocaleFlow AI generates multilingual content, checks quality at every step, routes exceptions to the right employee, and keeps delivery moving from request to release.

Primary CTA: Explore the product demo

Secondary CTA: View product decisions

Core workflow

Show this product flow clearly:

Chinese source → Source QA → English master → Multilingual generation → Language QA → Human exceptions → Release → Knowledge updates

Quality checks should appear throughout the workflow, not as one final proofreading stage. AI creates the translation; the product then validates terminology, numbers, variables, missing content, character limits, formatting, locale rules, and release readiness. Do not create a separate AI proofreading role.

Low-risk content can pass automatically. Failed checks go to one Language Owner. A second approver is optional and only appears when the customer has configured it for high-risk content.

Product demo

Include the following areas, while choosing the best layout and component structure yourself:

Overview

Requests

Workflow

Multilingual Editor

Language Assets: terminology, translation memory, language rules, and prompt versions

Operations: scheduling, employee capacity, assignment, SLA risks, blockers, and workload

Knowledge Updates: terminology candidates, supporting evidence, applicable scope, trial, approval, and rollback

Analytics

Organization settings and optional approval rules

Use realistic seeded demo data for one feature launch containing Chinese UI copy and a marketing message, with an approved English master and Japanese, German, and French outputs.

The demo should show a few meaningful exceptions:

Source QA finds an ambiguous Chinese sentence and asks the requester to clarify it.

Japanese fails a formality rule.

German exceeds a UI character limit.

The system detects that one Language Owner is overloaded and reassigns an unstarted task.

Repeated human edits create a terminology candidate, but the system keeps it as a campaign-specific exception instead of changing the global terminology database.

Make the main path clickable. Users should be able to open a request, inspect workflow status, review a flagged segment, approve or reject a terminology candidate, and see the project progress update. Use local mock data and clear state changes; a production backend is not required.

Design direction

Create a premium enterprise product with strong information hierarchy and excellent usability. The visual tone should be calm, precise, modern, and international.

Use a refined neutral palette with one distinctive accent color.

Use typography, spacing, tables, timelines, progress indicators, and status labels carefully.

Make dense operational information easy to scan.

Use subtle motion for workflow progress and state changes.

Design thoughtful empty, loading, success, warning, and blocked states.

Keep accessibility and responsive behavior in mind.

Avoid generic AI imagery, chatbot-first layouts, neon purple gradients, excessive glass effects, oversized marketing claims, and decorative charts without meaning.

AI should feel embedded in the workflow rather than presented as a chat window. Every automated decision should show a short reason, the rule or evidence used, and whether the action can be reversed.

Use English as the primary interface language. Chinese should appear naturally as the source content inside the demo, and the target-language examples should look authentic. Keep the public website and application visually consistent.

Clearly label this as a product prototype. Do not claim production integrations, real customers, measured efficiency gains, or completed enterprise deployment.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://localeflow-ai-hub.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6750a282-ba22-49a3-a773-e2ce22246643).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
