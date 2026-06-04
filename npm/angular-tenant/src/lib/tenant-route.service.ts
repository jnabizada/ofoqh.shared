import { Injectable } from '@angular/core';
import { TenantRouteContext, TenantSurface } from './tenant.models';

const SUPPORTED_TENANT_SURFACES: readonly TenantSurface[] = ['admin', 'partner', 'applicant', 'public'];
const SUPPORTED_TENANT_SURFACES_SET = new Set<string>(SUPPORTED_TENANT_SURFACES);

@Injectable({ providedIn: 'root' })
export class TenantRouteService {
  parsePath(pathname = window.location.pathname): TenantRouteContext | null {
    const normalizedPath = this.normalizePath(pathname);
    const match = normalizedPath.match(/^\/t\/([^/]+)\/([^/]+)(?:\/(.*))?$/i);
    if (!match) {
      return null;
    }

    const tenantSlug = match[1]?.trim() ?? '';
    const surface = (match[2]?.trim().toLowerCase() ?? '') as TenantSurface;
    const pathAfterSurface = (match[3] ?? '').trim();
    if (!tenantSlug || !SUPPORTED_TENANT_SURFACES_SET.has(surface)) {
      return null;
    }

    return {
      tenantSlug,
      surface,
      pathAfterSurface,
      fullPath: normalizedPath,
    };
  }

  currentRouteContext(pathname = window.location.pathname): TenantRouteContext | null {
    return this.parsePath(pathname);
  }

  currentTenantSlug(pathname = window.location.pathname): string | null {
    return this.currentRouteContext(pathname)?.tenantSlug ?? null;
  }

  currentSurface(pathname = window.location.pathname): TenantSurface | null {
    return this.currentRouteContext(pathname)?.surface ?? null;
  }

  isCanonicalTenantPath(pathname = window.location.pathname): boolean {
    return this.currentRouteContext(pathname) !== null;
  }

  buildSurfaceUrl(
    tenantSlug: string,
    surface: TenantSurface,
    ...segments: Array<string | null | undefined>
  ): string {
    const normalizedTenantSlug = tenantSlug.trim();
    if (!normalizedTenantSlug) {
      throw new Error('tenantSlug is required to build a tenant-scoped surface URL.');
    }

    const normalizedSegments = segments
      .filter((segment): segment is string => !!segment && segment.trim().length > 0)
      .map(segment => segment.replace(/^\/+|\/+$/g, ''));
    const base = `/t/${normalizedTenantSlug}/${surface}`;
    return normalizedSegments.length ? `${base}/${normalizedSegments.join('/')}` : base;
  }

  resolveSurfaceAuthDeniedUrl(pathname = window.location.pathname, fallback = '/auth/denied'): string {
    const route = this.parsePath(pathname);
    if (!route) {
      return fallback;
    }

    return this.buildSurfaceUrl(route.tenantSlug, route.surface, 'auth', 'denied');
  }

  private normalizePath(pathname: string): string {
    const trimmed = (pathname || '/').trim();
    if (!trimmed) {
      return '/';
    }

    const withoutQueryOrHash = trimmed.split(/[?#]/, 1)[0] || '/';
    const normalized = withoutQueryOrHash.replace(/\/{2,}/g, '/');
    if (normalized.length > 1 && normalized.endsWith('/')) {
      return normalized.slice(0, -1);
    }

    return normalized;
  }
}
