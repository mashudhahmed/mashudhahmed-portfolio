/**
 * Centralized Admin API Client
 * - Injects Bearer token automatically
 * - Handles 401 Unauthorized globally (redirects to login)
 * - Returns structured data or throws descriptive error messages
 */

export async function adminFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  // Handle 401 Unauthorized globally
  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('adminToken');
      if (window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login?expired=true';
      }
    }
    throw new Error('Your session has expired. Please log in again.');
  }

  // Parse response
  const contentType = res.headers.get('content-type');
  let data: any = null;
  if (contentType && contentType.includes('application/json')) {
    data = await res.json().catch(() => null);
  } else {
    data = await res.text().catch(() => null);
  }

  if (!res.ok) {
    const errorMsg =
      (data && typeof data === 'object' && (data.message || data.error)) ||
      `Request failed with status ${res.status}`;
    const formattedMsg = Array.isArray(errorMsg) ? errorMsg.join(', ') : errorMsg;
    throw new Error(formattedMsg);
  }

  return data as T;
}

/**
 * Triggers Next.js on-demand cache revalidation for the specified tags or homepage
 */
export async function revalidatePortfolio(tags: string[] = []): Promise<void> {
  try {
    await fetch('/api/revalidate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tags }),
    });
  } catch (err) {
    console.warn('Revalidation warning:', err);
  }
}
