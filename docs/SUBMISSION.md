# Devpost Submission Draft

## Project name

Civora

## Tagline

Every site decision, safer, leaner, and lower-carbon.

## Inspiration

Construction teams already collect enormous amounts of information, but safety, workforce, tool, material, and sustainability data are fragmented. The people making urgent decisions still rely on separate dashboards, spreadsheets, radio calls, and hindsight. We built Civora to turn those disconnected signals into one accountable decision loop.

## What it does

Civora is an AI-powered construction command center. It predicts emerging safety risks, explains why they matter, recommends practical controls, routes an accountable response, and verifies the operational and environmental impact.

Its live digital twin combines zone conditions, people, tools, and environmental telemetry. Specialist workspaces support explainable safety intelligence, multilingual worker briefings, fatigue-aware crew planning, predictive tool maintenance, project carbon budgets, digital material passports, circular material matching, and audit-ready impact reporting.

## How we built it

We built a strict TypeScript React PWA with a shared construction domain model, persistent local workflows, deterministic real-time telemetry, route-level code splitting, responsive design, offline caching, and automated tests. The current prototype uses clearly labeled demo data so it remains reliable during judging. Its adapter-based architecture is ready for sensor, BIM, HR, procurement, and connected-tool integrations.

## Challenges

The hardest challenge was avoiding a collection of unrelated dashboards. We designed every workspace around the same operational loop: sense, understand, recommend, approve, act, and verify. We also had to make predictive AI credible, so Civora exposes confidence, contributing factors, data freshness, and human approval instead of presenting a black-box answer.

## Accomplishments

- One integrated workflow across safety, sustainability, people, tools, and reporting.
- Explainable heat-risk intervention with accountable dispatch.
- Interactive spatial digital twin with live telemetry.
- Carbon scenario modeling and circular material matching.
- Multilingual briefing and worker comprehension workflow.
- Predictive maintenance from tool vibration drift.
- Installable offline PWA with persistent state and automated tests.

## What we learned

The technical model is only part of safety innovation. Trust requires clear responsibility, privacy, source quality, and explanations that a supervisor can challenge. We also learned that sustainability becomes much more actionable when carbon and waste are translated into daily site decisions and financial value.

## What's next

Run a 6–8 week pilot focused on heat-risk prevention and tool health. Connect environmental sensors, a limited BIM model, and tool telemetry; validate false-positive rates; measure response time and downtime; interview workers about privacy and briefing comprehension; then expand into material and carbon workflows.

## Disclosure

The hackathon prototype uses deterministic simulated telemetry and illustrative impact values. It does not claim certified safety compliance, carbon assurance, or live production AI.
