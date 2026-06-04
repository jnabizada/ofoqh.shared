import { InjectionToken } from '@angular/core';

export interface TenantAuthenticationPort {
  login(returnUrl: string): void;
}

export const TENANT_AUTHENTICATION_PORT = new InjectionToken<TenantAuthenticationPort>(
  'TENANT_AUTHENTICATION_PORT'
);

