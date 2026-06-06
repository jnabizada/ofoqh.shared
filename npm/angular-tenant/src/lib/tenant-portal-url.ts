export function resolveTenantSlug(
  pathname: string,
  resolver: (pathname: string) => string | null | undefined,
): string | null {
  return resolver(pathname)?.trim() || null;
}

export function publicPortalUrl(
  tenantSlug: string | null | undefined,
  ...segments: Array<string | null | undefined>
): string {
  const normalizedSlug = tenantSlug?.trim() || '';
  const base = normalizedSlug ? `/t/${normalizedSlug}/public` : '/auth/denied';
  const normalizedSegments = segments
    .filter((segment): segment is string => !!segment && segment.trim().length > 0)
    .map(segment => segment.replace(/^\/+|\/+$/g, ''));

  if (!normalizedSegments.length) {
    return base;
  }

  return `${base}/${normalizedSegments.join('/')}`;
}

export type TenantPortalUrlInput = {
  slug: string;
  publicHost?: string | null;
  baseUrl?: string | null;
};

export function buildTenantPortalUrl(input: TenantPortalUrlInput): string {
  const tenantSlug = input.slug.trim();
  const portalPath = publicPortalUrl(tenantSlug);

  const publicHost = (input.publicHost ?? '').trim();
  if (publicHost) {
    const hasScheme = publicHost.startsWith('http://') || publicHost.startsWith('https://');
    const normalizedHost = hasScheme ? publicHost : `https://${publicHost}`;
    const url = new URL(normalizedHost);
    const basePath = url.pathname && url.pathname !== '/' ? url.pathname.replace(/\/+$/, '') : '';

    return `${url.origin}${basePath}${portalPath}`;
  }

  const configuredBase = (input.baseUrl ?? '').trim();
  const normalizedBase = configuredBase
    ? (configuredBase.startsWith('http://') || configuredBase.startsWith('https://')
        ? configuredBase
        : `https://${configuredBase}`)
    : window.location.origin;
  const url = new URL(normalizedBase);
  const basePath = url.pathname && url.pathname !== '/' ? url.pathname.replace(/\/+$/, '') : '';

  return `${url.origin}${basePath}${portalPath}`;
}
