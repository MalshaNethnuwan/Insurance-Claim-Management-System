// Frontend API Service client for Insurance Claim Management System

const API_BASE = '/api';
const ACTUATOR_BASE = '/actuator';

const getToken = () => localStorage.getItem('token') || sessionStorage.getItem('token');

const getHeaders = (isJson = true) => {
  const headers = {};
  if (isJson) {
    headers['Content-Type'] = 'application/json';
  }
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  if (!response.ok) {
    let errorMsg = `HTTP Error ${response.status}: ${response.statusText}`;
    try {
      const errorData = await response.json();
      errorMsg = errorData.message || errorData.error || errorMsg;
    } catch (_) {
      // Non-JSON error payload
    }
    throw new Error(errorMsg);
  }
  return response.json();
};

export const api = {
  // Auth Endpoints
  async login(username, password) {
    const res = await fetch(`${API_BASE}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return handleResponse(res);
  },

  async register(userData) {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return handleResponse(res);
  },

  // Claims Endpoints
  async getClaims() {
    const res = await fetch(`${API_BASE}/claims`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async trackClaim(claimNumber) {
    const res = await fetch(`${API_BASE}/claims/track/${encodeURIComponent(claimNumber)}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async createClaim(claimData) {
    const res = await fetch(`${API_BASE}/claims`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(claimData),
    });
    return handleResponse(res);
  },

  async updateClaimStatus(id, updateData) {
    const res = await fetch(`${API_BASE}/claims/${id}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(updateData),
    });
    return handleResponse(res);
  },

  async getMetrics() {
    const res = await fetch(`${API_BASE}/claims/metrics`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Policies Endpoints
  async getPolicies() {
    const res = await fetch(`${API_BASE}/policies`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Observability & Health
  async getHealth() {
    const res = await fetch(`${ACTUATOR_BASE}/health`, {
      headers: { Accept: 'application/json' },
    });
    return handleResponse(res);
  },
};
