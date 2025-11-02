// src/services/api.ts

export const API_BASE_URL = import.meta.env.VITE_API_URL || '';

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

export interface ChatMessage {
  role: string;
  content: string;
}

export interface ChatResponse {
  content: string;
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  memory_enabled: boolean;
}

export const chatAPI = {
  async sendMessage(messages: ChatMessage[]): Promise<ChatResponse> {
    const token = localStorage.getItem('aura_token');

    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        messages,
        model: 'gpt-4o-mini',
        max_tokens: 500
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Failed to send message');
    }

    return data;
  },
};
