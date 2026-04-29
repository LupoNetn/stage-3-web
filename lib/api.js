/**
 * Secure API Client with Auto-Refresh Logic
 */
export async function apiRequest(endpoint, options = {}) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://stage-3-backend-azure.vercel.app';
  const url = `${baseUrl}${endpoint}`;

  // Default options
  const defaultOptions = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-API-Version': '1',
      ...options.headers,
    },
    credentials: 'include', // Crucial for HTTP-only cookies
  };

  try {
    let response = await fetch(url, defaultOptions);

    // If 401 Unauthorized, attempt to refresh tokens
    if (response.status === 401) {
      console.log('Access token expired, attempting refresh...');
      
      const refreshResponse = await fetch(`${baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: { 'X-API-Version': '1' },
        credentials: 'include',
      });

      if (refreshResponse.ok) {
        console.log('Refresh successful, retrying original request...');
        // Retry the original request
        response = await fetch(url, defaultOptions);
      } else {
        // Refresh failed (refresh token likely expired too)
        console.error('Refresh token expired, redirecting to login');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        throw new Error('Session expired');
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Request Failure:', error);
    throw error;
  }
}
