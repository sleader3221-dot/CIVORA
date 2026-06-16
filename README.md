# ProofPilot AI

Evidence-grade fraud and incident operations OS for the H0: Hack the Zero Stack with Vercel v0 and AWS Databases hackathon.

Track: Track 2 - Monetizable B2B App

ProofPilot AI turns suspicious fintech, SaaS, marketplace, and digital-business events into risk-scored investigation cases, linked evidence timelines, tamper-evident audit ledgers, and compliance-ready reports using Vercel, DynamoDB, and Aurora DSQL.

## Problem

Fraud and incident teams receive thousands of suspicious events, but the hard work is proving what happened, why it matters, which entities are related, and which evidence supports the final action.

## Solution

ProofPilot AI provides a judge-friendly, end-to-end workflow:

1. Launch Live Demo.
2. Generate Suspicious Events.
3. Score risk with deterministic, explainable rules.
4. Auto-create critical investigation cases.
5. Open a case with timeline, entity graph, evidence records, and notes.
6. Verify the evidence hash chain.
7. Generate and print an audit-ready report.
8. Review the architecture and system health pages.

## Features

- Premium B2B landing page.
- Judge Demo Mode with no login friction.
- One-click 1,000 suspicious event generator.
- Event ingestion API with Zod validation.
- Deterministic risk engine with human-readable reason codes.
- Auto case creation for high-risk activity.
- Dashboard analytics with Recharts.
- Event stream filters and database-mode badges.
- Case detail page with timeline, linked evidence, notes, entity graph, ledger, and report actions.
- React Flow entity graph.
- Tamper-evident SHA-256 evidence ledger.
- Ledger verification endpoint and UI.
- HTML report generator with sanitized output.
- Architecture page with Mermaid diagram and AWS database proof path.
- System health page with environment readiness checklist.
- Pricing page for B2B monetization.
- Devpost-ready submission page.
- Demo video script and AWS setup docs.
- Vitest coverage for risk, ledger, event generator, report generator, and API contracts.

## Tech Stack

- Next.js App Router
- TypeScript strict checks
- Tailwind CSS dependency plus custom enterprise CSS
- shadcn/ui-style cards, badges, and buttons
- Zod
- Recharts
- React Flow via `@xyflow/react`
- Drizzle schema definitions for Aurora DSQL/PostgreSQL compatibility
- AWS SDK v3 DynamoDB adapter
- Vitest
- ESLint flat config

## AWS Databases Used

### Aurora DSQL

Aurora DSQL is the relational system of record for organizations, users, memberships, API keys, entities, cases, case events, risk scores, evidence ledger rows, case notes, reports, and billing plans.

Why Aurora DSQL: investigation workflows need strongly consistent case state, notes, evidence chain rows, report generation records, and SaaS billing data that can be queried relationally.

### DynamoDB

DynamoDB stores high-volume raw suspicious events in a single-table design:

- `PK = ORG#organizationId`
- `SK = EVENT#timestamp#eventId`
- `GSI1PK = ENTITY#entityId`
- `GSI1SK = EVENT#timestamp`
- `GSI2PK = RISK#severity`
- `GSI2SK = timestamp#eventId`

Why DynamoDB: raw event ingestion is bursty and access-pattern driven. DynamoDB gives a strong path for latest organization events, entity timelines, and high/critical risk feeds.

## Architecture Summary

Vercel hosts the Next.js frontend and API routes. API routes validate payloads, call the deterministic risk engine, write raw events through the event repository, create/update cases through workflow repositories, append evidence ledger rows, verify hash chains, and generate reports.

If live AWS env vars are absent, ProofPilot runs the safe demo adapter and clearly labels the UI as Demo Adapter. It does not fake live AWS mode.

## Local Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

Copy `.env.example` to `.env.local` for local live-mode testing:

```bash
DATABASE_URL=
AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
DYNAMODB_EVENTS_TABLE=ProofPilotEvents
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DEMO_MODE=true
```

Do not commit `.env` or `.env.local`.

## Demo Mode

Demo mode works without AWS credentials. It uses deterministic synthetic Northstar Pay data and in-memory repositories to support judge testing.

## Live AWS Mode

Live AWS mode becomes available only when both DynamoDB and Aurora DSQL/PostgreSQL environment variables are configured. System Health shows whether each adapter is ready without displaying secret values.

## Vercel Deployment

1. Push the repository to GitHub.
2. Import the repo into Vercel.
3. Set the environment variables from `.env.example`.
4. Deploy.
5. Visit `/system-health` and confirm the adapter mode.

## Judge Testing Instructions

1. Open the Vercel link.
2. Click Launch Live Demo.
3. Open Judge Demo Mode.
4. Click Generate Suspicious Events.
5. Open the latest critical case.
6. Review risk explanation, timeline, and entity graph.
7. Click Verify Evidence Chain.
8. Click Generate Report.
9. Visit `/architecture`.
10. Visit `/system-health`.

## Commands

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Screenshots Checklist

- Landing page.
- Judge Demo Mode.
- Dashboard.
- Ingest API page.
- Events page.
- Cases page.
- Case detail page.
- Entity graph.
- Ledger verification.
- Report preview.
- Architecture page.
- System health page.
- Vercel environment settings.
- DynamoDB table and GSIs.
- Aurora DSQL schema/migration proof.

## Demo Video Script

See [DEMO_VIDEO_SCRIPT.md](./DEMO_VIDEO_SCRIPT.md).

## Bonus Content Checklist

- Public content phrase included on `/submission`.
- Hashtag included: `#H0Hackathon`.
- AWS screenshot checklist included.
- Vercel deployment readiness documented.
- Security posture documented in [SECURITY.md](./SECURITY.md).
