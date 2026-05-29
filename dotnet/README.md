# Ofoqh Workflow Diagnostics for .NET

`Ofoqh.Workflow.Diagnostics` and `Ofoqh.Workflow.Diagnostics.AspNetCore` provide
the shared backend contract for enterprise workflow diagnostics across Ofoqh services.

## What These Packages Solve

When one service calls another, failures often get flattened into vague `502` or
`500` responses. These packages preserve the downstream problem details so the
final caller can still see:

- the dependency that failed
- the operation that failed
- the downstream `ProblemDetails`
- trace and instance metadata
- the accumulated `failureChain`

## Packages

- `Ofoqh.Workflow.Diagnostics`
  Shared models, abstractions, headers, and ProblemDetails parsing helpers.
- `Ofoqh.Workflow.Diagnostics.AspNetCore`
  ASP.NET Core helpers for shaping workflow-aware `ProblemDetails` responses.

## Typical Usage

1. Parse downstream RFC 7807 responses instead of flattening them to text.
2. Throw or return workflow-aware exceptions/results that preserve the failure chain.
3. Emit `ProblemDetails` with `failureChain`, `downstreamService`, and
   `downstreamOperation` at the API boundary.

## Source and Guidance

- Source repository: `https://github.com/jnabizada/ofoqh.shared`
- Architecture and rollout guidance live in the repository `docs/` folder.

## Internal Distribution

- NuGet/BaGet: `https://bagetter.dev-test.careerpath.ofoqh.com/v3/index.json`

## License

Proprietary. See `LICENSE.md`.
