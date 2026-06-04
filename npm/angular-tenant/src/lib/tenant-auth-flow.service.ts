import { Injectable, inject } from '@angular/core';
import { TENANT_AUTHENTICATION_PORT } from './tenant-auth.port';
import { TenantRouteService } from './tenant-route.service';

@Injectable({ providedIn: 'root' })
export class TenantAuthFlowService {
  private readonly auth = inject(TENANT_AUTHENTICATION_PORT, { optional: true });
  private readonly tenantRoutes = inject(TenantRouteService);

  startLoginForCurrentRoute(pathname = window.location.pathname) {
    const route = this.tenantRoutes.currentRouteContext(pathname);
    if (!route) {
      throw new Error('Tenant-scoped login requires a canonical /t/{tenantSlug}/{surface}/... route.');
    }

    this.requireAuthPort().login(route.fullPath);
  }

  startLoginForReturnUrl(returnUrl: string) {
    const route = this.tenantRoutes.parsePath(returnUrl);
    if (!route) {
      throw new Error('Tenant-scoped login returnUrl must use the canonical /t/{tenantSlug}/{surface}/... route shape.');
    }

    this.requireAuthPort().login(route.fullPath);
  }

  resolveReturnUrl(state: string | null | undefined, pathname = window.location.pathname): string {
    const normalizedState = (state ?? '').trim();
    if (normalizedState) {
      const route = this.tenantRoutes.parsePath(normalizedState);
      if (!route) {
        throw new Error('Tenant-scoped callback state is missing a canonical tenant route.');
      }

      return route.fullPath;
    }

    const currentRoute = this.tenantRoutes.currentRouteContext(pathname);
    if (!currentRoute) {
      throw new Error('Tenant-scoped callback requires a canonical tenant route.');
    }

    return currentRoute.fullPath;
  }

  private requireAuthPort() {
    if (!this.auth) {
      throw new Error('TENANT_AUTHENTICATION_PORT is not configured for the current application.');
    }

    return this.auth;
  }
}

