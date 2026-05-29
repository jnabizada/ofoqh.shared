# @ofoqh/workflow-diagnostics

Shared frontend and operator-facing workflow diagnostics helpers for Ofoqh SPAs.

## What This Package Provides

- TypeScript contracts for workflow-aware `ProblemDetails`
- typed `failureChain` models
- helpers for summarizing and rendering downstream workflow failures

## Why It Exists

Ofoqh workflows frequently span multiple services. This package helps UIs and shared
frontend libraries preserve and display structured failure information instead of
showing generic transport errors with no actionable context.

## Typical Usage

Import the shared contracts and helpers from the package and use them when:

- reading RFC 7807 responses from backend APIs
- rendering operator diagnostics
- surfacing dependency-failure summaries in admin tools

## Source and Guidance

- Source repository: `https://github.com/jnabizada/ofoqh.shared`
- Shared contract and rollout guidance live in the repository `docs/` folder.

## Internal Distribution

- Verdaccio: `https://verdaccio.dev-test.careerpath.ofoqh.com/`

## License

Proprietary and internal-use only. See `LICENSE.md`.
