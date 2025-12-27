/**
 * API Client for MatrixHub Backend
 * Handles all HTTP requests to the backend API
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface User {
  id: string;
  name: string;
  email?: string;
  role: string;
  avatar_url?: string;
  version?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  agent_id: string;
  email: string;
  password: string;
}

export interface Entity {
  uid: string;
  type: 'agent' | 'tool' | 'mcp_server';
  name: string;
  version: string;
  summary?: string;
  description?: string;
  capabilities?: string[];
  frameworks?: string[];
  providers?: string[];
  protocols?: string[];
  manifests?: Record<string, any>;
  quality_score?: number;
  license?: string;
  homepage?: string;
  source_url?: string;
  created_at?: string;
}

class APIClient {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = API_BASE_URL;
    // Load token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth_token', token);
      } else {
        localStorage.removeItem('auth_token');
      }
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...(options.headers as Record<string, string>),
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
      throw new Error(error.detail || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async login(credentials: LoginCredentials): Promise<{ access_token: string; user: User }> {
    try {
      const formData = new URLSearchParams();
      formData.append('username', credentials.username);
      formData.append('password', credentials.password);

      const response = await fetch(`${this.baseURL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Login failed' }));
        throw new Error(error.detail || 'Login failed');
      }

      return response.json();
    } catch (error) {
      // If backend is not available, provide helpful error message
      if (error instanceof TypeError) {
        throw new Error('Backend API is not available. Please use Guest mode or configure the backend URL.');
      }
      throw error;
    }
  }

  async register(data: RegisterData): Promise<{ access_token: string; user: User }> {
    try {
      return await this.request('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (error) {
      // If backend is not available, provide helpful error message
      if (error instanceof TypeError) {
        throw new Error('Backend API is not available. Please use Guest mode or configure the backend URL.');
      }
      throw error;
    }
  }

  async guestLogin(): Promise<{ access_token: string; user: User }> {
    try {
      return await this.request('/api/auth/guest', {
        method: 'POST',
      });
    } catch (error) {
      // Fallback for guest mode when backend is unavailable
      console.warn('Backend not available, using demo mode:', error);

      // Return mock guest user for demo purposes
      const mockGuestUser: User = {
        id: 'guest-' + Date.now(),
        name: 'Guest Agent',
        email: 'guest@agentlink.demo',
        role: 'Observer Node',
        avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Guest',
        version: 'Read-Only v1.0',
      };

      return {
        access_token: 'demo_token_' + Date.now(),
        user: mockGuestUser,
      };
    }
  }

  async getProfile(userId: string): Promise<User> {
    return this.request(`/api/auth/profile/${userId}`);
  }

  // Entity endpoints
  async getEntities(params?: {
    q?: string;
    type?: 'agent' | 'tool' | 'mcp_server';
    protocol?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ entities: Entity[]; total: number }> {
    const searchParams = new URLSearchParams();
    if (params?.q) searchParams.append('q', params.q);
    if (params?.type) searchParams.append('type', params.type);
    if (params?.protocol) searchParams.append('protocol', params.protocol);
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.offset) searchParams.append('offset', params.offset.toString());

    const query = searchParams.toString();
    return this.request(`/api/entities${query ? `?${query}` : ''}`);
  }

  async getEntity(uid: string): Promise<Entity> {
    return this.request(`/api/entities/${uid}`);
  }

  // Health check
  async health(): Promise<{ status: string }> {
    return this.request('/health');
  }
}

export const api = new APIClient();
