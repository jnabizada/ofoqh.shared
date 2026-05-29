# Workflow Coverage Matrix

Use this file to track enterprise adoption and make any untouched workflow
explicit.

## Status Legend

- `not-started`
- `in-progress`
- `covered`
- `blocked`

## Repositories

| Repo | Package Adoption | API Boundary Coverage | Worker/Event Coverage | UI/Operator Coverage | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `careerpath` | covered | in-progress | not-started | in-progress | in-progress | Published packages are consumed. Expand to all workflows. |
| `ofoqh.communication` | in-progress | in-progress | in-progress | not-started | in-progress | Shared package is referenced. Published client packages now preserve downstream `ProblemDetails`, delivery endpoints emit trace-aware problem responses, and webhook callbacks now return structured dependency failures. Remaining gaps are mostly operator-facing surfaces and broader worker/outbox coverage. |
| `ofoqh.identity.provider` | in-progress | in-progress | not-started | not-started | in-progress | OAuth admin path is covered. User-store notification workflows now preserve communication delivery and OAuth token acquisition failures through shared results and published client packages. Tenant invite creation, public self-registration, and invite delivery outcome lookups now surface degraded downstream state instead of silently collapsing it. Broaden further to remaining tenant/public workflows and operator surfaces. |

## Workflows

| Workflow | Entry Surface | Services Involved | Sync Hops | Async Hops | Final Diagnostics Surface | Status | Gaps |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Applicant access approval and invite | `careerpath` tenant admin | `careerpath-applicants`, `idp`, optional `communication` | Applicants -> IDP | optional notifications | API `ProblemDetails`, operator logs | in-progress | Approval/invite chain is covered through CareerPath and IDP invite creation. Follow-on communication notification failures still depend on the optional email path and should be validated end to end. |
| Applicant portal activation | public/applicant UI | `careerpath`, `idp` | Public UI -> CareerPath -> IDP | none | UI + API | in-progress | Shared frontend diagnostics not yet rendered in operator screens. |
| Application funnel summary | tenant admin UI | `careerpath-applications`, `catalog` | Applications -> Catalog | none | API `ProblemDetails` | in-progress | Catalog path should be audited end to end. |
| Tenant invite onboarding | IDP tenant admin API | `idp`, `communication` | Tenant invite API -> communication delivery client | email delivery + outcome polling | API `ProblemDetails`, operator logs | in-progress | Delivery client and token acquisition failures now preserve structured chains. Invite creation surfaces notification degradation in the created payload, and delivery outcome polling now distinguishes lookup failures from missing delivery data. Remaining gap is richer operator/UI rendering of those diagnostics. |
| Public password reset | IDP public API | `idp`, `communication` | Public API -> communication delivery client | email delivery | API `ProblemDetails` | in-progress | Reset email queue failures now preserve `failureChain`, including OAuth token acquisition failures. Delivery outcome read paths still need explicit regression coverage. |
| Public self-registration approval | IDP public API | `idp`, `communication` | Public API -> communication delivery client | admin notification email | API `ProblemDetails`, operator logs | in-progress | Notification dispatch failures now remain non-blocking but are surfaced in the created payload with structured chain details. Remaining gaps are broader operator/UI rendering and other non-blocking public flows. |
| Internal delivery service calls | backend service-to-service API | `communication`, downstream callers | Caller -> communication internal delivery API | provider send, provider webhook callbacks, realtime outbox | API `ProblemDetails`, client exceptions, worker logs | in-progress | Published .NET clients now preserve downstream problem details and chain entries. Provider send failures, webhook callbacks, and worker logging are chain-aware, but operator-facing outbox diagnostics still need a surfaced chain view. |

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
