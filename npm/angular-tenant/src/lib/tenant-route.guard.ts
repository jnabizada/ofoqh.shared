import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TenantRouteService } from './tenant-route.service';

export const tenantRouteGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const tenantRoutes = inject(TenantRouteService);

  const routeContext = tenantRoutes.parsePath(state.url);
  const routeTenantSlug = route.paramMap.get('tenantSlug')?.trim();

  if (!routeContext || !routeTenantSlug || routeTenantSlug !== routeContext.tenantSlug) {
    return router.parseUrl(tenantRoutes.resolveSurfaceAuthDeniedUrl(state.url));
  }

  return true;
};
