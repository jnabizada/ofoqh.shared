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
| `careerpath` | covered | in-progress | not-started | in-progress | in-progress | Published packages are consumed. Tenant admin invite screens now surface notification and delivery-lookup diagnostics to operators. Expand the same pattern across the remaining workflows. |
| `ofoqh.communication` | in-progress | in-progress | in-progress | in-progress | in-progress | Shared package is referenced. Published client packages now preserve downstream `ProblemDetails`, delivery endpoints and remaining realtime/chat/internal-event fallback branches emit trace-aware problem responses, webhook callbacks return structured dependency failures, outbox operator diagnostics are surfaced in the CareerPath tenant communications workspace, and both delivery reads and delivery outcome reads now backfill operator-friendly failure category/summary data. Remaining gaps are mostly broader operator coverage and final audit closeout. |
| `ofoqh.identity.provider` | in-progress | in-progress | not-started | not-started | in-progress | OAuth admin path is covered. User-store notification workflows now preserve communication delivery and OAuth token acquisition failures through shared results and published client packages. Tenant invite creation, public self-registration, forgot-password queue failures, invite delivery outcome lookups, and forgot-password `ProblemDetails` now surface degraded downstream state and explicit dependency metadata instead of silently collapsing it. Broaden further to remaining tenant/public workflows and operator surfaces. |

## Workflows

| Workflow | Entry Surface | Services Involved | Sync Hops | Async Hops | Final Diagnostics Surface | Status | Gaps |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Applicant access approval and invite | `careerpath` tenant admin | `careerpath-applicants`, `idp`, optional `communication` | Applicants -> IDP | optional notifications | API `ProblemDetails`, operator logs | in-progress | Approval/invite chain is covered through CareerPath and IDP invite creation. Follow-on communication notification failures still depend on the optional email path and should be validated end to end. |
| Applicant portal activation | public/applicant UI | `careerpath`, `idp` | Public UI -> CareerPath -> IDP | none | UI + API | in-progress | Shared frontend diagnostics not yet rendered in operator screens. |
| Application funnel summary | tenant admin UI | `careerpath-applications`, `catalog` | Applications -> Catalog | none | API `ProblemDetails` | in-progress | Catalog path should be audited end to end. |
| Tenant invite onboarding | IDP tenant admin API | `idp`, `communication`, `careerpath` tenant UI | Tenant invite API -> communication delivery client | email delivery + outcome polling | API `ProblemDetails`, operator UI, logs | in-progress | Delivery client and token acquisition failures now preserve structured chains. Invite creation surfaces notification degradation in the created payload, delivery outcome polling distinguishes lookup failures from missing delivery data, and the CareerPath tenant invite workspace now renders those diagnostics. Remaining gaps are broader reuse of this operator pattern in other workflows. |
| Public password reset | IDP public API | `idp`, `communication` | Public API -> communication delivery client | email delivery | API `ProblemDetails` | in-progress | Reset email queue failures now preserve `failureChain`, `downstreamService`, and `downstreamOperation`, including OAuth token acquisition failures, all the way to the HTTP problem response. Delivery outcome read paths still need explicit regression coverage. |
| Public self-registration approval | IDP public API | `idp`, `communication` | Public API -> communication delivery client | admin notification email | API `ProblemDetails`, operator logs | in-progress | Notification dispatch failures now remain non-blocking but are surfaced in the created payload with structured chain details. Remaining gaps are broader operator/UI rendering and other non-blocking public flows. |
| Internal delivery service calls | backend service-to-service API | `communication`, downstream callers | Caller -> communication internal delivery API | provider send, provider webhook callbacks, realtime outbox | API `ProblemDetails`, client exceptions, worker logs, tenant operator UI | in-progress | Published .NET clients now preserve downstream problem details and chain entries. Provider send failures, webhook callbacks, worker logging, outbox operator summaries, delivery read-model error summaries, and delivery outcome event summaries are chain-aware. Remaining gaps are broader operator reuse and final endpoint audit closeout. |

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
