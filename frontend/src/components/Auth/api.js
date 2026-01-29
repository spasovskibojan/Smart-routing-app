import API_BASE_URL from '../../config';

// Token storage utilities
export function getAccessToken() {
  return localStorage.getItem('access_token');
}

export function getRefreshToken() {
  return localStorage.getItem('refresh_token');
}

export function setTokens(access, refresh) {
  localStorage.setItem('access_token', access);
  if (refresh) {
    localStorage.setItem('refresh_token', refresh);
  }
}

export function clearTokens() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
}

// Helper function to get auth headers
export function authHeaders() {
  const token = getAccessToken();
  if (token) {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }
  return { 'Content-Type': 'application/json' };
}

// Refresh access token if expired
export async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${API_BASE_URL}/users/refresh`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (res.ok) {
      const data = await res.json();
      setTokens(data.access, null);
      return true;
    }
  } catch (error) {
    console.error('Token refresh failed:', error);
  }

  clearTokens();
  return false;
}

// API functions
export async function register(username, password, password2) {
  const res = await fetch(`${API_BASE_URL}/users/register`, {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, password2 }),
  });
  return res;
}

export async function login(username, password) {
  const res = await fetch(`${API_BASE_URL}/users/login`, {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (res.ok) {
    const data = await res.json();
    setTokens(data.access, data.refresh);
    return { ok: true, data };
  }

  return res;
}

export async function me() {
  const res = await fetch(`${API_BASE_URL}/users/me`, {
    headers: authHeaders(),
  });

  // If unauthorized, try to refresh token
  if (res.status === 401) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return await fetch(`${API_BASE_URL}/users/me`, {
        headers: authHeaders(),
      });
    }
  }

  return res;
}

export async function logout() {
  // JWT is stateless - just clear local tokens
  clearTokens();

  // Optional: notify backend
  try {
    await fetch(`${API_BASE_URL}/users/logout`, {
      method: "POST",
      headers: authHeaders(),
    });
  } catch (error) {
    // Ignore - tokens already cleared locally
  }

  return { ok: true };
}
