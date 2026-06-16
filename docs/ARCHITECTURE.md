# ProofPilot AI Architecture

See the root [ARCHITECTURE.md](../ARCHITECTURE.md) and the in-app `/architecture` page.

The implementation uses:

- Vercel / Next.js App Router for frontend and API routes.
- DynamoDB `ProofPilotEvents` for raw event ingestion.
- Aurora DSQL / PostgreSQL-compatible schema for workflow state.
- SHA-256 hash chain for evidence ledger integrity.
