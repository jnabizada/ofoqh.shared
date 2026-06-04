# Angular Tenant Package Skeleton

## Purpose

This document defines the first concrete code skeleton for the
`@ofoqh/angular-tenant` package.

It is the design-to-code bridge for the first extraction slice in
`ofoqh.frontend.platform`.

Use it before expanding the package so the public API grows deliberately
instead of organically.

This document depends on:

- [Frontend Tenant Package Design](./frontend-tenant-package-design.md)

## Target Location

The package lives under:

```text
packages/angular-tenant/
```

With source rooted at:

```text
packages/angular-tenant/src/
```

## Proposed File Layout

Start with this minimal shape:

```text
src/
  public-api.ts
  lib/
    tenant.models.ts
    tenant-auth.port.ts
    tenant-route.service.ts
    tenant-auth-flow.service.ts
    tenant-session.store.ts
```

This is intentionally small. It is enough to support the first consumer
migration without locking the package into too many public concepts too early.

## File Responsibilities

## 1. `tenant.models.ts`

Owns the shared tenant types.

Recommended first-pass exports:

```ts
export type TenantSurface =
  | 'admin'
  | 'partner'
  | 'applicant'
  | 'public';

export type TenantRouteContext = {
  tenantSlug: string;
  surface: TenantSurface;
  pathAfterSurface: string;
  fullPath: string;
};

export type AuthenticatedTenant = {
  tenantId: string | null;
  tenantSlug: string | null;
};

export type TenantSessionContext = {
  routeTenantSlug: string;
  authenticatedTenantSlug: string;
  authenticatedTenantId: string;
};
```

Why here:

- keeps type definitions shared
- prevents the same concepts from being redefined in each product repo

## 2. `tenant-auth.port.ts`

Owns the product integration seam.

Recommended responsibilities:

- define the contract for starting tenant-scoped login
- expose an Angular injection token for consumer-provided auth adapters

Why here:

- keeps the package product-neutral
- avoids coupling shared tenancy logic to a CareerPath-specific session store

## 3. `tenant-route.service.ts`

Owns canonical tenant route parsing and validation.

Recommended responsibilities:

- parse `/t/{tenantSlug}/{surface}/...`
- expose current `TenantRouteContext | null`
- expose helpers like:
  - `currentRouteContext()`
  - `currentTenantSlug()`
  - `currentSurface()`
  - `buildSurfaceUrl(tenantSlug, surface, ...segments)`

Important rules:

- must not guess tenant from config defaults
- must not fall back to non-canonical routes
- may reject routes, but must not repair them silently

## 4. `tenant-auth-flow.service.ts`

Owns tenant-aware login and callback flow.

Recommended responsibilities:

- start login from current tenant-scoped route
- preserve exact return URL in auth state
- validate callback return state
- expose helper to resolve post-callback target

Expected collaboration:

- consumer-provided auth adapter via `tenant-auth.port.ts`
- consumer callback handling layer

Important rule:

- callback without tenant-scoped state must fail, not guess

## 5. `tenant-session.store.ts`

Owns the confirmed tenant session layer.

Recommended responsibilities:

- hold confirmed `TenantSessionContext | null`
- expose:
  - confirmed tenant slug
  - confirmed tenant ID
  - mismatch state
  - readiness state for protected API calls

Suggested relationship:

- consuming products keep their own broad auth/session state
- this package focuses only on tenant confirmation state
- consumer code coordinates between product session state and tenant state

## Export Strategy

The shared package should export from:

- `packages/angular-tenant/src/public-api.ts`

Recommended first-pass exports:

```ts
export * from './lib/tenant-auth-flow.service';
export * from './lib/tenant-auth.port';
export * from './lib/tenant-route.service';
export * from './lib/tenant-session.store';
export * from './lib/tenant.models';
```

## Near-Term Expansion

The next additions should come only after the first consumer migration proves
the boundary:

- tenant route guard
- tenant HTTP interceptor
- broader auth/session adapter contracts
- optional generic mismatch UI if it proves reusable across products

