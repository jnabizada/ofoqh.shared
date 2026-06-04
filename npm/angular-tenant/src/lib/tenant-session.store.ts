import { Injectable, computed, signal } from '@angular/core';
import { AuthenticatedTenant, TenantMismatchReason, TenantSessionState } from './tenant.models';

@Injectable({ providedIn: 'root' })
export class TenantSessionStore {
  private readonly state = signal<TenantSessionState>({
    context: null,
    mismatchReason: null,
  });

  readonly context = computed(() => this.state().context);
  readonly mismatchReason = computed(() => this.state().mismatchReason);
  readonly hasMismatch = computed(() => this.mismatchReason() !== null);
  readonly confirmedTenantId = computed(() => this.context()?.authenticatedTenantId ?? null);
  readonly confirmedTenantSlug = computed(() => this.context()?.authenticatedTenantSlug ?? null);
  readonly routeTenantSlug = computed(() => this.context()?.routeTenantSlug ?? null);
  readonly isReadyForProtectedRequests = computed(() => !!this.confirmedTenantId() && !this.hasMismatch());

  clear() {
    this.state.set({
      context: null,
      mismatchReason: null,
    });
  }

  confirmAuthenticatedTenant(routeTenantSlug: string | null | undefined, tenant: AuthenticatedTenant | null | undefined) {
    const normalizedRouteTenantSlug = routeTenantSlug?.trim() ?? '';
    const authenticatedTenantSlug = tenant?.tenantSlug?.trim() ?? '';
    const authenticatedTenantId = tenant?.tenantId?.trim() ?? '';
    const mismatchReason = this.resolveMismatchReason(
      normalizedRouteTenantSlug,
      authenticatedTenantSlug,
      authenticatedTenantId
    );

    if (mismatchReason) {
      this.state.set({
        context: null,
        mismatchReason,
      });
      return;
    }

    this.state.set({
      context: {
        routeTenantSlug: normalizedRouteTenantSlug,
        authenticatedTenantSlug,
        authenticatedTenantId,
      },
      mismatchReason: null,
    });
  }

  private resolveMismatchReason(
    routeTenantSlug: string,
    authenticatedTenantSlug: string,
    authenticatedTenantId: string
  ): TenantMismatchReason | null {
    if (!routeTenantSlug) {
      return 'missing_route_tenant';
    }

    if (!authenticatedTenantSlug) {
      return 'missing_authenticated_tenant';
    }

    if (!authenticatedTenantId) {
      return 'missing_tenant_id';
    }

    if (routeTenantSlug !== authenticatedTenantSlug) {
      return 'slug_mismatch';
    }

    return null;
  }
}
