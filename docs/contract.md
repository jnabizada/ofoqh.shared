# Workflow Diagnostics Contract

## Goal

Provide one cross-repo contract for propagating workflow failures across chained service calls.

## Core Principles

- every API emits RFC 7807 `ProblemDetails`
- downstream failures are preserved as structured data
- each hop appends to a shared `failureChain`
- correlation and causation identifiers are propagated end to end

## Standard Headers

- `X-Correlation-Id`
- `X-Request-Id`
- `X-Causation-Id`
- optional: `X-Workflow-Failure-Chain`

## Standard ProblemDetails Extensions

- `failureChain`
- `operatorMessage`
- `userMessage`
- `technicalDetails`
- `downstreamService`
- `downstreamOperation`
