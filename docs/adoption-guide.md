# Adoption Guide

## First Wave

1. adopt shared contract models and parsers
2. preserve downstream `ProblemDetails` in service-to-service callers
3. emit `failureChain` from API boundaries
4. add UI helpers for operator-facing diagnostics

## Participating Repositories

- `careerpath`
- `communication`
- `idp`

## Migration Rule

Do not invent local variants of the `failureChain` shape. Extend the shared contract only through this repository.

## Enterprise Rollout

Use these documents to drive enterprise-wide adoption:

- [enterprise-rollout-checklist.md](/home/jnabizada/Projects/Ofoqh/ofoqh.shared/docs/enterprise-rollout-checklist.md:1)
- [workflow-coverage-matrix.md](/home/jnabizada/Projects/Ofoqh/ofoqh.shared/docs/workflow-coverage-matrix.md:1)
- [endpoint-diagnostics-audit.md](/home/jnabizada/Projects/Ofoqh/ofoqh.shared/docs/endpoint-diagnostics-audit.md:1)
