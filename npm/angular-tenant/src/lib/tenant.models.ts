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

export type TenantMismatchReason =
  | 'missing_route_tenant'
  | 'missing_authenticated_tenant'
  | 'slug_mismatch'
  | 'missing_tenant_id';

export type TenantSessionState = {
  context: TenantSessionContext | null;
  mismatchReason: TenantMismatchReason | null;
};

