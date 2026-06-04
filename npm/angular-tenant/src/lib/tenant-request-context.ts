import { TenantSessionStore } from './tenant-session.store';

export class TenantContextUnavailableError extends Error {
  constructor(
    message = 'The current request requires a confirmed tenant ID and a mismatch-free tenant session.',
  ) {
    super(message);
    this.name = 'TenantContextUnavailableError';
  }
}

export function resolveConfirmedTenantHeaders(
  tenantSession: TenantSessionStore,
): Record<string, string> | null {
  const tenantId = tenantSession.confirmedTenantId();
  if (!tenantId || tenantSession.hasMismatch()) {
    return null;
  }

  return {
    'X-Tenant-Id': tenantId,
  };
}

export function requireConfirmedTenantHeaders(
  tenantSession: TenantSessionStore,
): Record<string, string> {
  const headers = resolveConfirmedTenantHeaders(tenantSession);
  if (!headers) {
    throw new TenantContextUnavailableError();
  }

  return headers;
}

export function resolveRouteTenantBootstrapHeaders(
  tenantSlug: string | null | undefined,
): Record<string, string> {
  const normalizedTenantSlug = tenantSlug?.trim() || '';
  if (!normalizedTenantSlug) {
    return {};
  }

  return {
    'X-Tenant': normalizedTenantSlug,
  };
}
