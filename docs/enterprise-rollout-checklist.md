# Enterprise Rollout Checklist

## Objective

Apply the workflow diagnostics pattern across the enterprise so that no
user-facing or background workflow loses downstream failure context.

This checklist is the operational companion to:

- [contract.md](/home/jnabizada/Projects/Ofoqh/ofoqh.shared/docs/contract.md:1)
- [architecture.md](/home/jnabizada/Projects/Ofoqh/ofoqh.shared/docs/architecture.md:1)
- [adoption-guide.md](/home/jnabizada/Projects/Ofoqh/ofoqh.shared/docs/adoption-guide.md:1)

## Scope

Every participating repo must be assessed:

- `careerpath`
- `ofoqh.communication`
- `ofoqh.identity.provider`
- any supporting repo that contributes workflow steps, background jobs, or
  user-visible orchestration

## Definition Of Coverage

A workflow is covered only when all of these are true:

1. every service hop emits RFC 7807 `ProblemDetails`
2. every caller preserves downstream `ProblemDetails` as structured data
3. every API boundary emits `failureChain`
4. correlation and causation ids are propagated through all hops
5. operator-facing UI or logs can show the chain without losing hop details

If one hop in the chain still collapses failures into plain text, the workflow
is not fully covered.

## Rollout Phases

### Phase 1. Platform Readiness

- publish `Ofoqh.Workflow.Diagnostics` to BaGet
- publish `Ofoqh.Workflow.Diagnostics.AspNetCore` to BaGet
- publish `@ofoqh/workflow-diagnostics` to Verdaccio
- document contract, publishing, and migration rules in this repo

### Phase 2. Repo Adoption

For each repo:

- add package references from cluster registries
- remove local duplicate contract copies
- migrate service-to-service clients to downstream problem parsing
- migrate API exception handling to emit `failureChain`
- add tests for at least one multi-hop failure path

### Phase 3. Workflow Coverage

For each business workflow:

- inventory all participating services
- identify every sync and async hop
- verify each hop preserves diagnostics
- simulate a failure in each critical downstream dependency
- confirm the final API or operator surface exposes the full chain

### Phase 4. Governance

- require new workflow features to use the shared diagnostics package
- block introduction of local custom failure-envelope variants
- add code review checks for downstream error flattening
- review coverage quarterly

## Per-Repo Checklist

Repeat this for every participating repo:

- package feed configured for cluster BaGet or Verdaccio
- shared diagnostics package consumed from registry
- no local fork of the shared workflow diagnostics contract remains
- outbound HTTP clients parse RFC 7807 downstream payloads
- background workers and event consumers preserve failure chain metadata
- API exception handlers emit `failureChain`
- operator tooling can display chain details
- tests cover downstream validation failure
- tests cover downstream authorization failure
- tests cover downstream timeout or network failure

## Per-Workflow Checklist

Repeat this for every important workflow:

- workflow owner identified
- entrypoint and user-facing surface identified
- all services in the path listed
- all synchronous HTTP hops listed
- all asynchronous queue/event hops listed
- each hop assessed for diagnostics compliance
- final response or operator surface verified
- residual gaps recorded in the coverage matrix

## High-Priority Workflow Categories

At minimum, inventory and verify:

- onboarding and invite flows
- authentication and access approval flows
- profile completion flows
- application submission flows
- admissions decision flows
- document upload and verification flows
- communication send, retry, and failure handling flows
- background reconciliation, reminders, and scheduled jobs

## Non-Negotiable Rules

- no service may replace downstream `ProblemDetails` with plain text only
- no repo may define its own incompatible `failureChain` schema
- no consumer may reference a developer-local registry
- no repo should use direct cross-repo project references as the steady state

## Tracking

Use the shared matrix in:

- [workflow-coverage-matrix.md](/home/jnabizada/Projects/Ofoqh/ofoqh.shared/docs/workflow-coverage-matrix.md:1)

Every uncovered workflow or partial hop must be visible there until closed.
