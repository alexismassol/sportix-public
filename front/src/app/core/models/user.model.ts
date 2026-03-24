export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'spectator' | 'club';
  clubName?: string;
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    user: User;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}
