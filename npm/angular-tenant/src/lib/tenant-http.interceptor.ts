import { HttpContext, HttpContextToken, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { requireConfirmedTenantHeaders, TenantContextUnavailableError } from './tenant-request-context';
import { TenantSessionStore } from './tenant-session.store';

export const REQUIRE_TENANT_CONTEXT = new HttpContextToken<boolean>(() => false);

export function requireTenantContext(context = new HttpContext()): HttpContext {
  return context.set(REQUIRE_TENANT_CONTEXT, true);
}

export const tenantHttpInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.context.get(REQUIRE_TENANT_CONTEXT)) {
    return next(req);
  }

  const tenantSession = inject(TenantSessionStore);
  try {
    return next(req.clone({
      setHeaders: requireConfirmedTenantHeaders(tenantSession),
    }));
  } catch (error) {
    if (!(error instanceof TenantContextUnavailableError)) {
      return throwError(() => error);
    }

    return throwError(() => new HttpErrorResponse({
      status: 412,
      statusText: 'Tenant context unavailable',
      url: req.url,
      error: {
        title: 'Tenant context unavailable',
        detail: error.message,
      },
    }));
  }
};
