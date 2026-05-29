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
| `ofoqh.communication` | in-progress | in-progress | not-started | not-started | in-progress | Shared package is referenced. API exception handler now preserves `failureChain`; delivery and worker paths still need explicit coverage. |
| `ofoqh.identity.provider` | in-progress | in-progress | not-started | not-started | in-progress | OAuth admin path is covered, and user-store notification workflows now preserve communication failure chains through shared results. Broaden further to tenant, public, and token-acquisition workflows. |

## Workflows

| Workflow | Entry Surface | Services Involved | Sync Hops | Async Hops | Final Diagnostics Surface | Status | Gaps |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Applicant access approval and invite | `careerpath` tenant admin | `careerpath-applicants`, `idp`, optional `communication` | Applicants -> IDP | optional notifications | API `ProblemDetails`, operator logs | in-progress | IDP and communication still need full package adoption. |
| Applicant portal activation | public/applicant UI | `careerpath`, `idp` | Public UI -> CareerPath -> IDP | none | UI + API | in-progress | Shared frontend diagnostics not yet rendered in operator screens. |
| Application funnel summary | tenant admin UI | `careerpath-applications`, `catalog` | Applications -> Catalog | none | API `ProblemDetails` | in-progress | Catalog path should be audited end to end. |
| Tenant invite onboarding | IDP tenant admin API | `idp`, `communication` | Tenant invite API -> communication delivery client | email delivery + outcome polling | API `ProblemDetails`, operator logs | in-progress | Invite creation still degrades to warning-only when email queueing fails after invite persistence. |
| Public password reset | IDP public API | `idp`, `communication` | Public API -> communication delivery client | email delivery | API `ProblemDetails` | in-progress | Reset email queue failures now preserve `failureChain`; token acquisition and delivery outcome reads still need explicit regression coverage. |
| Public self-registration approval | IDP public API | `idp`, `communication` | Public API -> communication delivery client | admin notification email | API `ProblemDetails`, operator logs | in-progress | Notification dispatch failures are structured internally, but public flow still logs-and-continues for some non-blocking notification paths. |

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
