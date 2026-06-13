# Architecture

## Prototype architecture

```text
Browser / Installable PWA
        |
        +-- Command Center
        +-- Digital Twin
        +-- Safety Intelligence
        +-- Carbon & Circularity
        +-- Workforce
        +-- Tools & Assets
        +-- Reports
        |
Shared typed event and state model
        |
Deterministic telemetry adapter + local persistence
```

The hackathon prototype is intentionally local-first. It works without credentials, survives refreshes, supports offline caching, and cannot fail because a third-party API is unavailable during judging.

## Production target

```text
Edge devices / Cameras / Sensors / Tool tags
        |
MQTT or HTTPS ingestion gateway
        |
Schema validation + event bus
        |
Time-series store ----- Object storage
        |                       |
Operational graph ----- BIM / ERP / HR / Procurement connectors
        |
Feature service
        |
Risk models / Optimization / RAG copilot
        |
Policy and approval engine
        |
Web PWA + notifications + reporting
```

## Recommended production choices

- **Ingestion:** MQTT for site telemetry; HTTPS/webhooks for enterprise systems.
- **Event validation:** versioned JSON Schema or Protobuf.
- **Operational data:** PostgreSQL with PostGIS.
- **Time series:** TimescaleDB or managed equivalent.
- **Object evidence:** S3-compatible immutable storage.
- **Auth:** OIDC/SAML, MFA, least-privilege RBAC.
- **API:** typed REST/GraphQL plus WebSocket/SSE live updates.
- **Models:** calibrated gradient boosting/time-series models for risk; constrained optimization for scheduling; LLM only for explanation and retrieval.
- **Observability:** structured logs, traces, data-quality metrics, model drift, and alert-delivery SLIs.

## Trust controls

1. No autonomous safety-critical action.
2. Human approval for recommendations.
3. Confidence and contributing factors shown.
4. Source timestamps and freshness visible.
5. Sensor-quality gating before model inference.
6. Audit event for every alert, edit, and decision.
7. PII minimization and configurable retention.
8. Face recognition explicitly excluded.
9. Model cards and validation windows.
10. Graceful degraded/offline operation.

## Data contracts

Current TypeScript domain objects define sites, zones, alerts, tasks, tools, workers, materials, and metric points. Production adapters should emit these stable domain contracts so UI modules do not depend on vendor payloads.

## Testing strategy

- Unit tests for risk ranking, filtering, and safety score behavior.
- Integration tests for navigation and alert response.
- Production compilation as a required quality gate.
- Browser smoke tests for desktop and mobile.
- Future: contract tests for each connector, accessibility scans, visual regression, load testing, and incident-recovery exercises.
