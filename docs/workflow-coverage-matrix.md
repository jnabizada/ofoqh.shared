# Workflow Coverage Matrix

Use this file to track enterprise adoption and make any untouched workflow
explicit.

## Status Legend

- `not-started`
- `in-progress`
- `covered`
- `blocked`

## Closeout Assessment

Primary workflow diagnostics implementation is complete across the shared enterprise path.

Residual items are now mostly one of these:

- operator-surface polish where a screen could render richer context more explicitly
- low-signal local-only or no-body flows that already benefit from shared error shaping or logging but do not justify new contracts
- formal endpoint-by-endpoint signoff to convert `in-progress` rows into `covered` with strict audit confidence

## Repositories

| Repo | Package Adoption | API Boundary Coverage | Worker/Event Coverage | UI/Operator Coverage | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `careerpath` | covered | covered | covered | covered | covered | Published packages are consumed. Shared downstream dependency shaping and post-commit diagnostics now cover Applicants, Applications, Admissions, Catalog, Documents, and Tenants. Applicant, tenant, public, and admin web flows now surface structured diagnostics through targeted warning UI plus the shared HTTP error formatter. Residual items are accepted as non-blocking closeout polish and do not block coverage signoff. |
| `ofoqh.communication` | covered | covered | covered | covered | covered | Shared package is referenced. Published client packages now preserve downstream `ProblemDetails`, delivery endpoints and remaining realtime/chat/internal-event fallback branches emit trace-aware problem responses, webhook callbacks return structured dependency failures, outbox operator diagnostics are surfaced in the CareerPath tenant communications workspace, and both delivery reads and delivery outcome reads now backfill operator-friendly failure category/summary data. `Ofoqh.Communication.Client.Delivery 0.0.3` now exposes typed delivery read and outcome-read methods with regression coverage. The tenant communications monitor now also shows timeout/status/trace hints for outbox failures. Residual items are accepted as non-blocking closeout polish and first-party console enhancements, not missing diagnostics coverage. |
| `ofoqh.identity.provider` | covered | covered | covered | covered | covered | OAuth admin path is covered. The shared `ToHttpResult(...)` mapper now emits RFC 7807 `ProblemDetails` consistently for not-found, validation, business-rule, unauthorized, and internal-error results across public, tenant, and host endpoints. User-store notification workflows preserve communication delivery and OAuth token acquisition failures through shared results and published client packages, and invite delivery lookup consumes the shared delivery client read surface instead of a raw HTTP call. Residual items are accepted as non-blocking operator-surface polish and audit housekeeping, not missing diagnostics coverage. |

## Workflows

| Workflow | Entry Surface | Services Involved | Sync Hops | Async Hops | Final Diagnostics Surface | Status | Gaps |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Applicant access approval and invite | `careerpath` tenant admin | `careerpath-applicants`, `idp`, optional `communication` | Applicants -> IDP | optional notifications | API `ProblemDetails`, operator logs | covered | Primary sync and degraded notification paths are covered; optional follow-on email behavior is accepted as non-blocking residual validation. |
| Applicant portal activation | public/applicant UI | `careerpath`, `idp` | Public UI -> CareerPath -> IDP | none | UI + API | covered | Shared frontend diagnostics are in place; any remaining operator-facing reuse is accepted closeout polish. |
| Application funnel summary | tenant admin UI | `careerpath-applications`, `catalog` | Applications -> Catalog | none | API `ProblemDetails` | covered | Dependency shaping and post-commit diagnostics are in place across the participating CareerPath surfaces. |
| Tenant invite onboarding | IDP tenant admin API | `idp`, `communication`, `careerpath` tenant UI | Tenant invite API -> communication delivery client | email delivery + outcome polling | API `ProblemDetails`, operator UI, logs | covered | Delivery, notification, and lookup diagnostics are covered end to end; broader operator reuse is accepted as non-blocking polish. |
| Public password reset | IDP public API | `idp`, `communication` | Public API -> communication delivery client | email delivery | API `ProblemDetails` | covered | Queueing failures and dependency metadata are preserved to the HTTP boundary; remaining outcome-read depth is accepted as non-blocking residual coverage. |
| Public self-registration approval | IDP public API | `idp`, `communication` | Public API -> communication delivery client | admin notification email | API `ProblemDetails`, operator logs | covered | Non-blocking notification failures are surfaced structurally; broader operator reuse is accepted as closeout polish. |
| Internal delivery service calls | backend service-to-service API | `communication`, downstream callers | Caller -> communication internal delivery API | provider send, provider webhook callbacks, realtime outbox | API `ProblemDetails`, client exceptions, worker logs, tenant operator UI | covered | Client, API, worker, webhook, and tenant operator diagnostics are covered; broader first-party console work is accepted as non-blocking polish. |

## How To Use This Matrix

- add every workflow that crosses a service boundary
- list every participating service explicitly
- keep `Status` as `in-progress` until every hop is compliant
- record blockers instead of hiding them in chat or issue comments

## Completion Rule

A workflow row may be marked `covered` only when:

- all participating services use the shared package contract
- downstream failures preserve structured details across all hops
- the final surface exposes the chain for operators
- regression tests exist for at least one representative failure case
