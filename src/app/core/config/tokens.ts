import { InjectionToken } from '@angular/core';

/**
 * API call prefix.
 *
 * Intentionally relative: in development, the Angular proxy and, in production, Nginx route /api to the
 * backend, so the same build works across all environments. Tests can override it using a provider.
 */
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => '/api',
});
