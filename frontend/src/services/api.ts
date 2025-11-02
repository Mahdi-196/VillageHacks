// src/services/api.ts

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export interface PublicUser {
  id: number;
  email: string;
  display_name: string | null;
  created_at: string;
}

export interface AuthResponse {
  user: PublicUser;
  access_token: string;
  token_type: string;
  expires_in_minutes: number;
}

interface ChatResponse {
  id: string;
  message: string;
  timestamp: string;
}

export const authAPI = {
  async register(email: string, password: string, display_name: string): Promise<AuthResponse> {
    try {
      console.log('Registering user:', { email, display_name });
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, display_name }),
      });

      console.log('Register response status:', response.status);

      if (!response.ok) {
        let errorMessage = 'Registration failed';
        try {
          const data = await response.json();
          errorMessage = data.detail || errorMessage;
        } catch (e) {
          console.error('Failed to parse error response:', e);
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Registration successful:', data);
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      console.log('Logging in user:', { email });
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Login response status:', response.status);

      if (!response.ok) {
        let errorMessage = 'Login failed';
        try {
          const data = await response.json();
          errorMessage = data.detail || errorMessage;
        } catch (e) {
          console.error('Failed to parse error response:', e);
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Login successful:', data);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
};

export const chatAPI = {
  async sendMessage(message: string): Promise<ChatResponse> {
    const token = localStorage.getItem('aura_token');

    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to send message');
    }

    return data;
  },
};
