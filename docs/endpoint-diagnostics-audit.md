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
| `ofoqh.identity.provider` | Tenant invites | `/api/tenant/invites` | `communication` | invite email + delivery lookup | API + tenant UI | in-progress | lookup and notification degradation surfaced; `2026-05-30`: invite delivery polling now uses `Ofoqh.Communication.Client.Delivery 0.0.3` instead of a raw internal HTTP client |
| `ofoqh.identity.provider` | Public password reset | `/api/public/forgot-password`, `/api/public/reset-password` | `communication` for forgot-password email queueing | password reset email | API `ProblemDetails` | in-progress | `2026-05-30`: forgot-password failures now preserve downstream dependency metadata at the HTTP boundary, not only the failure chain |
| `ofoqh.identity.provider` | Host and tenant user management | `/api/host/tenants/{tenantId}/users/*`, `/api/tenant/users/*`, `/api/tenant/roles/*` | primarily ASP.NET Identity / EF, optional communication in adjacent flows | password reset, role/claim/profile mutations | API responses | in-progress | `2026-05-30`: generic internal errors replaced with actionable Identity result details; claim and role mutation results no longer ignored |
| `ofoqh.communication` | Delivery internal | `/api/internal/messages*`, `/api/internal/delivery-outcomes` | provider plugins | webhook + outbox | API + worker logs + shared delivery client package | in-progress | delivery API path covered; raw delivery reads and delivery outcome reads now backfill error category and concise summary for operator-friendly inspection, and `Ofoqh.Communication.Client.Delivery 0.0.3` exposes typed read methods for both surfaces, but broader operator surfaces are still limited |
| `ofoqh.communication` | Realtime outbox failures | `/api/realtime/outbox/failures` | none at read time; reflects worker-captured dependency failures | retries + dead-letter transitions | operator API payload + CareerPath tenant communications UI | in-progress | `2026-05-30`: structured diagnostics now returned for new workflow-aware rows, including concise operator summaries; CareerPath tenant communications workspace now renders the summary, dependency context, and failure chain |
| `ofoqh.communication` | Realtime/chat endpoint fallbacks | `/api/realtime/backchannels/*`, `/api/realtime/chats/*`, `/api/realtime/bootstrap/*`, `/api/internal/events`, selected bulletin mutation/read endpoints | primarily local application handlers; downstream failures already flow through global exception handling | none | API `ProblemDetails` | in-progress | `2026-05-30`: unexpected application-status fallbacks now return trace-aware `ProblemDetails` with operation context instead of bare 500 responses |

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

### `2026-05-30` `ofoqh.identity.provider` public password reset diagnostics

Completed in this slice:

- the shared `InternalError` result contract now preserves `downstreamService` and `downstreamOperation` alongside `failureChain`
- `ResultExtensions` now emits those dependency metadata fields in HTTP `ProblemDetails` for workflow-aware internal errors
- forgot-password notification queue failures now carry communication dependency metadata all the way to the public API response
- focused tests cover both the service result and the HTTP `ProblemDetails` projection

Still open after this slice:

- password-reset diagnostics are API-visible, but there is no separate operator-facing surface for these public flows
- other public/tenant flows should continue to prefer this shared result path over ad hoc internal-error shaping when downstream metadata exists

### `2026-05-30` `ofoqh.communication` delivery outcome read summaries

Completed in this slice:

- durable delivery outcome reads now expose a top-level backfilled `ErrorCategory` and concise `ErrorSummary`
- the same summary builder now serves both raw delivery reads and delivery outcome event reads, keeping operator wording consistent
- focused repository and internal delivery endpoint tests cover the new summary/category projection

Still open after this slice:

- no first-party operator UI consumes delivery outcome event summaries yet
- service-to-service consumers still need adoption follow-through if they want to display the new outcome summary fields
- broader operator closeout in `communication` remains an audit task beyond this read-model improvement

### `2026-05-30` `ofoqh.communication` shared delivery client read coverage

Completed in this slice:

- `Ofoqh.Communication.Client.Delivery` now supports typed reads for persisted delivery records and durable delivery outcome events
- the shared client exposes concise summary-bearing DTOs instead of forcing downstream services onto ad hoc HTTP calls
- dedicated client tests now verify raw delivery search, idempotency-key lookup, and delivery outcome query construction plus JSON parsing

Still open after this slice:

- downstream repos still need to adopt the new read methods where they currently inspect delivery state indirectly
- operator-facing UIs remain a separate concern from backend client parity

### `2026-05-30` `ofoqh.identity.provider` shared delivery client adoption

Completed in this slice:

- invite delivery outcome lookup now uses the published `Ofoqh.Communication.Client.Delivery 0.0.3` read surface instead of a custom raw `HttpClient` call
- the extra named internal delivery client path was removed from identity infrastructure wiring
- focused invite and public identity tests remained green after the client adoption

Still open after this slice:

- this is the first downstream adoption only; other repos still need to switch to the shared read client where they inspect communication delivery state
- operator/UI surfaces remain separate from the backend client parity work

### `2026-05-30` `ofoqh.communication` realtime and internal endpoint fallback hardening

Completed in this slice:

- remaining chat, backchannel, realtime-session, internal business-event, and bulletin fallback branches now emit trace-aware `ProblemDetails`
- unexpected application statuses now include `traceId`, operation name, and reported operation status instead of returning a bare `500`
- the hardening is intentionally additive: structured dependency exceptions still flow through the global exception handler, while unexpected result-shaping mismatches now preserve enough context for operators

Still open after this slice:

- these paths still rely on representative build coverage rather than dedicated endpoint-level tests for every fallback branch
- operator UIs remain a separate concern where the API is not directly consumed by a human-facing screen
- worker/provider-originated logs still matter for deep root-cause analysis beyond the API edge

### `2026-05-30` `ofoqh.communication` outbox operator summary and tenant UI surfacing

Completed in this slice:

- outbox failure diagnostics now include a compact server-generated summary for status-code and timeout cases
- the CareerPath tenant communications monitor now prefers the structured diagnostics payload instead of reparsing raw `lastError` JSON
- tenant operators can now see the dependency label, concise summary, and detailed failure chain together in one workspace

Still open after this slice:

- this operator view still lives in `careerpath`, not in a first-party `communication` console
- other communication-originated operator surfaces may still need similar direct summary/dependency rendering

### `2026-05-30` `ofoqh.communication` delivery read-model operator summaries

Completed in this slice:

- persisted delivery read responses now backfill `LastErrorCategory` from stored status + provider error text when older rows do not already have one
- delivery read responses now include a concise `LastErrorSummary` so operator UIs do not have to interpret raw provider text on their own
- focused delivery read-handler tests cover the backfilled category and summary behavior

Still open after this slice:

- no first-party operator UI consumes these delivery summaries yet
- downstream clients still need targeted surfacing if they want to present delivery-read diagnostics alongside outbox diagnostics

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
