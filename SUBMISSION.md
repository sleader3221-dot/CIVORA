# Devpost Submission

## Title

ProofPilot AI - Evidence-Grade Fraud & Incident Operations OS

## Tagline

A Vercel-deployed B2B SaaS platform that turns suspicious events into risk-scored cases, linked evidence timelines, tamper-evident ledgers, and audit-ready reports using Aurora DSQL and DynamoDB.

## Problem

Fraud and incident teams receive large volumes of suspicious events but struggle to prove what happened, why it matters, and which evidence supports the response.

## What It Does

ProofPilot AI ingests suspicious events, scores risk deterministically, creates investigation cases, links entities, records tamper-evident ledger rows, verifies evidence chains, and generates audit-ready reports.

## How It Was Built

Next.js App Router, Vercel-ready API routes, TypeScript, Zod, Recharts, React Flow, Drizzle schema definitions, AWS SDK v3 DynamoDB adapter, Aurora DSQL/PostgreSQL adapter layer, SHA-256 evidence ledger, and Vitest tests.

## AWS Databases Used

DynamoDB is used as the high-volume raw event store. Aurora DSQL/PostgreSQL is used as the relational system of record for investigation workflow and SaaS data.

## Testing Instructions

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

## Demo Video Script

0:00-0:15 Problem.

0:15-0:35 Solution.

0:35-1:25 Working app demo.

1:25-2:05 AWS database architecture.

2:05-2:35 Business impact.

2:35-2:55 Closing.

## Required Screenshots

- Landing page.
- Judge Demo Mode.
- Dashboard.
- Case detail.
- Entity graph.
- Ledger verification.
- Generated report.
- Architecture page.
- System health page.
- DynamoDB table with GSIs.
- Aurora DSQL schema.
- Vercel deployment settings.

## Vercel Team ID Placeholder

team_xxxxxxxxx

## Bonus Content Checklist

- Public content phrase included.
- Hashtag: `#H0Hackathon`.
- AWS proof checklist included.
- Security posture documented.
- Tests and build commands documented.

I created this content for the purposes of entering the H0: Hack the Zero Stack with Vercel v0 and AWS Databases hackathon.

#H0Hackathon
