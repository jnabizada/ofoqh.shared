# Frontend Tenant Package Design

## Purpose

This document translates the platform tenant contract into a concrete frontend
package design for `ofoqh.frontend.platform`.

It is the implementation design for the shared browser tenancy package
workstream.

Use it before expanding shared tenant route, auth, session, and HTTP behavior
in this repo.

This document depends on:

- the platform tenant routing and session contract in `platform-bootstrap`
- the frontend platform repo ownership decision

## Design Goal

Create reusable frontend tenancy packages that all tenant-facing Ofoqh SPAs can
consume.

The first package should own:

- route parsing
- route validation
- auth return-state preservation
- callback validation
- confirmed tenant session context
- tenant mismatch detection
- tenant-aware request decoration seams

No product repo should implement those concerns as its canonical source.

## Current Extraction Shape

The first extracted package is:

- `@ofoqh/angular-tenant`

It is intentionally product-neutral.

It must not depend on:

- CareerPath page components
- CareerPath API clients
- CareerPath session stores
- product-specific route trees

## Package Boundary

### In scope

- canonical `/t/{tenantSlug}/{surface}/...` route parsing
- tenant route context models
- tenant-aware login return URL handling
- tenant callback state validation
- authenticated tenant mismatch detection
- generic tenant session state
- extension points for auth/session integration

### Out of scope

- product-specific callbacks and pages
- product-specific denied or mismatch screens
- product-specific auth clients
- product-specific API decoration logic that depends on local runtime types

## Core Package Building Blocks

## 1. Route Contract

### `TenantRouteContext`

The package should expose a shared route context model like:

```ts
type TenantRouteContext = {
  tenantSlug: string;
  surface: string;
  pathAfterSurface: string;
  fullPath: string;
};
```

This context is derived only from:

- `/t/{tenantSlug}/{surface}/...`

### `TenantRouteService`

Responsibilities:

- parse the current path
- validate canonical tenant route shape
- expose `tenantSlug`
- expose `surface`
- expose exact return URL
- reject malformed tenant-scoped routes

Rules:

- must not guess tenant from config defaults
- must not derive tenant from hostnames for tenant-facing SPAs
- must reject non-canonical routes like `/admin/...` for tenant journeys

## 2. Auth Flow Contract

### `TenantAuthFlowService`

Responsibilities:

- start login from the exact tenant-scoped route
- preserve exact deep-link return state
- validate callback state after IdP return
- restore exact original route after successful callback

Required behavior:

- if callback state is missing, fail
- if callback route tenant is absent, fail
- if callback tries to land outside canonical tenant routes, fail

### Authentication port

The package should not own any one product's session store.

Use an adapter contract, such as an injection token, for:

- start-login behavior
- future callback/session integration seams

This keeps the package reusable across products.

## 3. Session Contract

### `TenantSessionContext`

The package should expose a focused confirmed session model like:

```ts
type TenantSessionContext = {
  routeTenantSlug: string;
  authenticatedTenantSlug: string;
  authenticatedTenantId: string;
};
```

### `TenantSessionStore`

Responsibilities:

- store confirmed tenant context after callback and tenancy refresh
- expose route tenant
- expose authenticated tenant slug
- expose authenticated tenant ID
- expose mismatch state

This should remain a focused tenant layer, not a full replacement for any
product's broad session store.

## 4. Mismatch Contract

Responsibilities:

- compare route tenant slug against authenticated tenant slug
- stop normal app behavior on mismatch
- expose a shared mismatch state to guards and screens

Required behavior:

- no automatic redirect to another tenant
- no fallback to default tenant
- no best-effort route correction

Mismatch screens themselves should live in consuming product repos unless they
become intentionally generic platform UI.

## 5. HTTP Contract

Future package work should include the seam for:

- exposing the confirmed `tenantId`
- attaching `X-Tenant-Id`
- failing protected requests when tenant context is not confirmed

Recommended ordering:

- auth interceptor adds bearer token
- tenant interceptor adds `X-Tenant-Id`

## Consumer Model

Consuming products such as `careerpath` should:

- install `@ofoqh/angular-tenant`
- provide product-specific auth/session adapters
- compose product-specific guards, pages, and API clients around the package

That keeps platform code centralized while allowing product-specific behavior
at the edges.

