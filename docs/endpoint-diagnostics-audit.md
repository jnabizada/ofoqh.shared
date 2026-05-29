# Endpoint Diagnostics Audit

## Objective

Track diagnostics coverage endpoint by endpoint across the enterprise, not only
workflow by workflow.

Use this document together with:

- [enterprise-rollout-checklist.md](/home/jnabizada/Projects/Ofoqh/ofoqh.shared/docs/enterprise-rollout-checklist.md:1)
- [workflow-coverage-matrix.md](/home/jnabizada/Projects/Ofoqh/ofoqh.shared/docs/workflow-coverage-matrix.md:1)

## Coverage Rule

An endpoint is considered covered only when all of these are true:

1. it preserves downstream RFC 7807 `ProblemDetails` from every dependency it calls
2. it emits `failureChain` when it returns a dependency-driven failure
3. any async side effects it triggers preserve diagnostics in logs, events, or returned payloads
4. the operator-facing surface for that endpoint can display the meaningful diagnostics when applicable
5. at least one representative failure test exists for the endpoint category

If an endpoint succeeds while a non-blocking downstream step fails, that
degraded state must still be visible in the success payload or operator surface.

## Inventory Snapshot

Current inventory from source scanning on `2026-05-30`:

| Repo | Approx. mapped endpoints | Primary API surfaces |
| --- | ---: | --- |
| `careerpath` | `139` | applicants, applications, admissions, catalog, documents, tenants, internal APIs |
| `ofoqh.identity.provider` | `43` | public, tenant, host, utility, OAuth admin |
| `ofoqh.communication` | `51` | chat, bulletins, preferences, backchannels, internal events, delivery APIs, provider webhooks |

These counts are approximate route mappings from current source and should be
refreshed as APIs evolve.

## Audit Status Legend

- `not-started`
- `in-progress`
- `covered`
- `blocked`

## Repo Audit Plan

### `careerpath`

Current focus:

- applicants approval and invite endpoints
- applications dependency-failure endpoints
- tenant invite operator UI
- admissions review collaboration endpoints
- documents applicant access and lifecycle endpoints
- shared workflow communication publishers used by multiple APIs

Still requires full endpoint audit across:

- `Applicants.Api`
- `Applications.Api`
- `Admissions.Api`
- `Catalog.Api`
- `Documents.Api`
- `Tenants.Api`
- internal API groups in each service

Checklist:

- classify each endpoint as `read`, `write`, `internal`, `stream`, or `background-triggering`
- record outbound dependencies per endpoint
- mark whether dependency failures already preserve `failureChain`
- mark whether success-with-degradation is surfaced when applicable
- mark whether tenant/applicant/operator UI renders diagnostics
- distinguish shared infrastructure coverage from endpoint-surface coverage

### `ofoqh.identity.provider`

Current focus:

- tenant invite creation and lookup
- public self-registration
- password reset
- OAuth admin dependency flows
- host and tenant user-management mutations

Still requires full endpoint audit across:

- `PublicEndpoints`
- `TenantEndpoints`
- `HostEndpoints`
- `UtilityEndpoints`
- `OAuthEndpoints`

Checklist:

- identify endpoints with non-blocking communication side effects
- ensure those endpoints expose degraded downstream state explicitly
- identify endpoints that still use generic `InternalError` without structured dependency context
- audit invite, user, role, host-tenant, and OAuth administration surfaces separately

### `ofoqh.communication`

Current focus:

- internal delivery APIs
- provider send failures
- webhook callback failures
- outbox and worker logs
- outbox failure operator surface

Still requires full endpoint audit across:

- chat endpoints
- bulletin endpoints
- preference endpoints
- backchannel endpoints
- internal business-event endpoints
- realtime bootstrap/session endpoints
- delivery/internal/realtime endpoints
- webhook endpoints

Checklist:

- confirm every non-2xx path emits structured `ProblemDetails`
- confirm each API client preserves chain details
- confirm worker/outbox/retry/dead-letter paths preserve chain metadata
- add operator-facing diagnostics for outbox failure inspection

## Endpoint Category Checklist

Repeat for each endpoint category in every repo:

### Read Endpoints

- dependency failures parsed as structured downstream problems
- returned API failure includes `failureChain`
- “no data” is distinct from “lookup failed”
- operator UI can distinguish degraded lookup state

### Write Endpoints

- blocking dependency failures return structured `ProblemDetails`
- non-blocking side effects surface degraded state in success payloads or operator views
- audit logs preserve correlation and failure chain

### Internal Service Endpoints

- downstream callers can parse RFC 7807 responses
- dependency names and operations are preserved
- timeout vs non-timeout failures remain distinguishable

### Webhook/Callback Endpoints

- provider or downstream failures return structured diagnostics when safe
- invalid payload and invalid auth remain distinct from dependency failure
- background side effects preserve chain metadata

### Worker/Background-Triggered Surfaces

- chain metadata survives retries and dead-letter transitions
- operator-facing views can inspect failure state without log spelunking

## Endpoint Audit Matrix

Use this template when auditing each endpoint group:

| Repo | Endpoint group | Route or surface | Dependency calls | Async side effects | Final diagnostics surface | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `careerpath` | Applicants | `/api/applicants/access-requests/{id}/approve` | `idp`, optional `communication` | invite + email | API + operator logs | covered | seed implementation complete |
| `careerpath` | Admissions collaboration writes | `/api/review-cases/{id}/request-info`, `/api/review-cases/{id}/notes`, `/api/review-cases/{id}/decisions`, `/api/offers/*` | `applications`, `applicants`, shared `communication` publishers | chat + bulletins + reminders | API `ProblemDetails`; operator UI still limited | in-progress | `2026-05-30`: shared dependency wrapping added for Applicants/Applications lookups and workflow communication publishers |
| `careerpath` | Documents applicant access and lifecycle | `/api/documents*`, `/internal/documents*` | `applicants`, `applications`, `communication` | bulletins + chat + realtime events | API `ProblemDetails`; tenant/applicant UI still mostly implicit | in-progress | `2026-05-30`: access ownership, usage lookup, and realtime publish paths now preserve dependency failures |
| `ofoqh.identity.provider` | Tenant invites | `/api/tenant/invites` | `communication` | invite email + delivery lookup | API + tenant UI | in-progress | lookup and notification degradation surfaced |
| `ofoqh.identity.provider` | Host and tenant user management | `/api/host/tenants/{tenantId}/users/*`, `/api/tenant/users/*`, `/api/tenant/roles/*` | primarily ASP.NET Identity / EF, optional communication in adjacent flows | password reset, role/claim/profile mutations | API responses | in-progress | `2026-05-30`: generic internal errors replaced with actionable Identity result details; claim and role mutation results no longer ignored |
| `ofoqh.communication` | Delivery internal | `/api/internal/messages*` | provider plugins | webhook + outbox | API + worker logs | in-progress | delivery API path covered; broader operator surfaces still limited |
| `ofoqh.communication` | Realtime outbox failures | `/api/realtime/outbox/failures` | none at read time; reflects worker-captured dependency failures | retries + dead-letter transitions | operator API payload | in-progress | `2026-05-30`: structured diagnostics now returned for new workflow-aware rows; no dedicated UI yet |

## Slice Notes

### `2026-05-30` `careerpath` admissions + documents

Completed in this slice:

- introduced shared `DownstreamDependencyException` and `DownstreamDependencyErrors` in `BuildingBlocks`
- global API exception handler now maps downstream dependency failures to `502` or `504` and includes dependency metadata
- admissions downstream lookups to `applications` and `applicants` now preserve RFC 7807 responses instead of flattening them
- documents applicant ownership, applicant recipient, application usage, and workflow realtime publish paths now preserve downstream diagnostics
- shared workflow bulletin/chat/conversation-summary publishers now preserve downstream diagnostics for all consuming APIs

Still open after this slice:

- no dedicated operator-facing diagnostics UI yet for admissions/documents failures
- hosted-service reminder/backfill surfaces still need endpoint-adjacent audit notes and explicit operator views
- broader catalog and tenant endpoint groups remain untouched

### `2026-05-30` `ofoqh.communication` outbox operator surface

Completed in this slice:

- aligned communication projects to `Ofoqh.Workflow.Diagnostics` `0.1.1`
- outbox worker now stores a structured diagnostics envelope for workflow and downstream dependency failures
- `/api/realtime/outbox/failures` now returns parsed diagnostics alongside the human-readable last error
- regression tests cover both structured workflow-aware rows and legacy plain-text rows

Still open after this slice:

- there is still no dedicated UI/dashboard for outbox and dead-letter inspection
- non-outbox operator surfaces for chat, bulletins, and delivery still rely more on logs than explicit diagnostics views
- delivery-module operator reads remain a separate audit slice

### `2026-05-30` `ofoqh.identity.provider` host and tenant user management

Completed in this slice:

- tenant user and role mutation paths now preserve actionable Identity error details instead of returning generic internal errors
- tenant claim and role replacement flows now check add/remove operation results instead of assuming success
- soft-delete role and claim cleanup now fails explicitly when Identity rejects a mutation, instead of silently continuing
- focused tenant user and role tests passed after the diagnostics update

Still open after this slice:

- these user-management endpoints still do not emit workflow-style failure chains because they are mostly local Identity mutations rather than downstream service hops
- broader host/tenant surfaces outside user management still need endpoint-by-endpoint audit review
- operator-facing UI rendering of these richer validation/internal messages remains a separate client-side concern

## Next Endpoint Audit Order

Recommended next slices:

1. `careerpath` catalog and tenant internal endpoints
2. remaining `careerpath` admissions/documents operator screens
3. `communication` non-outbox operator surfaces
4. broader `idp` host and tenant non-user-management endpoints
5. remaining public/operator screens that still do not render diagnostics

## Completion Rule

This audit is complete only when:

- every mapped endpoint group is listed
- each group has a coverage status
- every endpoint with downstream dependencies has been reviewed
- every endpoint with async side effects has a degradation strategy
- remaining gaps are visible and tracked until closed
