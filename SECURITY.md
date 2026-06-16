# Security

ProofPilot AI is a hackathon-safe demo with production-minded security posture.

## No Secrets

Do not commit `.env`, `.env.local`, AWS credentials, database passwords, screenshots with visible secrets, or API keys.

## Server-Side AWS Calls

AWS SDK and database adapters are used from server-side modules and API routes only.

## Input Validation

`POST /api/ingest` and `POST /api/risk/score` validate payloads with Zod before scoring or storing events.

## Rate Limit Placeholder

`lib/security/rate-limit.ts` provides an in-memory rate-limit helper for the ingest route. Production should replace this with Vercel KV, Redis, API Gateway, or WAF-backed controls.

## Synthetic Data Only

Northstar Pay demo data is synthetic. Do not paste real customer events into the public demo.

## Report Sanitization

Generated report HTML escapes untrusted strings before rendering.

## Production Auth Upgrade Notes

Before production launch:

- Add organization login and RBAC.
- Store API keys hashed only.
- Add audit retention policies.
- Enable AWS IAM least privilege.
- Add request signing or key-based ingest authentication.
- Add tenant isolation tests.
- Add alerting for adapter failures.
