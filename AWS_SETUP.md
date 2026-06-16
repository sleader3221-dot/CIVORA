# AWS Setup

## DynamoDB

Create table `ProofPilotEvents`.

Primary key:

- Partition key: `PK` string
- Sort key: `SK` string

GSI1:

- Partition key: `GSI1PK`
- Sort key: `GSI1SK`

GSI2:

- Partition key: `GSI2PK`
- Sort key: `GSI2SK`

Set:

```bash
AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
DYNAMODB_EVENTS_TABLE=ProofPilotEvents
```

## Aurora DSQL / PostgreSQL

Apply `lib/db/migrations/0001_initial.sql` to the database.

Set:

```bash
DATABASE_URL=
```

## Vercel

Set all variables from `.env.example` in Vercel Project Settings. Then deploy and confirm `/system-health`.

## Proof Checklist

- DynamoDB table screenshot with GSIs.
- Aurora DSQL schema or migration screenshot.
- Vercel env var page with values hidden.
- `/system-health` screenshot showing Live AWS mode.
- Case detail screenshot after ledger verification.
