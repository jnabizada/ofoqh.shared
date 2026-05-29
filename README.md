# ofoqh.shared

Shared contracts, packages, and guidance for cross-repo Ofoqh platform concerns.

## Purpose

This repository is the canonical home for the enterprise workflow diagnostics pattern
used across Ofoqh services and SPAs. It standardizes how downstream failures are
preserved, propagated, and exposed through RFC 7807 `ProblemDetails`.

The goal is simple: no workflow should lose its real failure state just because it
crossed one or more service boundaries.

## What Lives Here

- shared .NET packages for workflow diagnostics
- shared npm package for frontend diagnostics contracts and helpers
- JSON schema for workflow-aware `ProblemDetails`
- rollout, architecture, and adoption guidance
- publishing scripts for cluster BaGet and Verdaccio

## Packages

### NuGet

- `Ofoqh.Workflow.Diagnostics`
  Shared models, abstractions, headers, and ProblemDetails parsing helpers.
- `Ofoqh.Workflow.Diagnostics.AspNetCore`
  ASP.NET Core helpers for workflow-aware API responses.

### npm

- `@ofoqh/workflow-diagnostics`
  Shared TypeScript contract and helper layer for SPAs and frontend libraries.

## Repository Layout

- `docs/`
  Enterprise guidance, architecture, rollout checklists, and publishing notes.
- `schemas/`
  JSON schema for workflow-aware `ProblemDetails`.
- `dotnet/`
  Shared .NET packages and tests.
- `npm/`
  Shared frontend package(s).
- `scripts/`
  Publish helpers for internal registries.

## Internal Registries

- NuGet/BaGet: `https://bagetter.dev-test.careerpath.ofoqh.com/v3/index.json`
- npm/Verdaccio: `https://verdaccio.dev-test.careerpath.ofoqh.com/`

## Source

- Repository: `https://github.com/jnabizada/ofoqh.shared`

## Documentation

- [Contract](docs/contract.md)
- [Architecture](docs/architecture.md)
- [Adoption Guide](docs/adoption-guide.md)
- [Enterprise Rollout Checklist](docs/enterprise-rollout-checklist.md)
- [Workflow Coverage Matrix](docs/workflow-coverage-matrix.md)
- [Publishing](docs/publishing.md)

## License

This repository is proprietary and intended for internal Ofoqh use. See [LICENSE.md](LICENSE.md).
