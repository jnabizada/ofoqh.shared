import { HttpContext, HttpContextToken, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { combineLatest, defer, switchMap, throwError, timeout } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { requireConfirmedTenantHeaders, TenantContextUnavailableError } from './tenant-request-context';
import { TenantSessionStore } from './tenant-session.store';

export const REQUIRE_TENANT_CONTEXT = new HttpContextToken<boolean>(() => false);

export function requireTenantContext(context = new HttpContext()): HttpContext {
  return context.set(REQUIRE_TENANT_CONTEXT, true);
}

const TENANT_CONTEXT_WAIT_TIMEOUT_MS = 5000;

export const tenantHttpInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.context.get(REQUIRE_TENANT_CONTEXT)) {
    return next(req);
  }

  const tenantSession = inject(TenantSessionStore);
  const tenantRequestState$ = combineLatest([
    toObservable(tenantSession.isReadyForProtectedRequests),
    toObservable(tenantSession.hasMismatch),
  ]).pipe(
    map(([isReady, hasMismatch]) => ({ isReady, hasMismatch }))
  );

  return defer(() => {
    if (tenantSession.isReadyForProtectedRequests()) {
      return next(req.clone({
        setHeaders: requireConfirmedTenantHeaders(tenantSession),
      }));
    }

    if (tenantSession.hasMismatch()) {
      return throwTenantContextUnavailable(req.url);
    }

    return tenantRequestState$.pipe(
      filter(state => state.isReady || state.hasMismatch),
      take(1),
      timeout({
        first: TENANT_CONTEXT_WAIT_TIMEOUT_MS,
        with: () => throwTenantContextUnavailable(req.url),
      }),
      switchMap(state => state.hasMismatch
        ? throwTenantContextUnavailable(req.url)
        : next(req.clone({
          setHeaders: requireConfirmedTenantHeaders(tenantSession),
        })))
    );
  });
};

function throwTenantContextUnavailable(url: string | null) {
  return throwError(() => new HttpErrorResponse({
    status: 412,
    statusText: 'Tenant context unavailable',
    url: url ?? undefined,
    error: {
      title: 'Tenant context unavailable',
      detail: new TenantContextUnavailableError().message,
    },
  }));
}
