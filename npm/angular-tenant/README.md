# @ofoqh/angular-tenant

Shared Angular tenancy primitives for Ofoqh browser clients.

## Scope

- Parse canonical tenant routes
- Guard canonical tenant routes
- Preserve tenant-scoped return URLs during auth
- Detect route-vs-authenticated-tenant mismatch

## Out of Scope

- Product routes
- Product API clients
- Product-specific session stores
- Product-specific denied or mismatch pages

Consumers provide their own authentication adapter through the
`TENANT_AUTHENTICATION_PORT` injection token.
