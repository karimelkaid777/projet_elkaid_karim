import { User } from '../../users/models/user.model';

/**
 * Modèle d'authentification
 * IMPORTANT: accessToken reste en mémoire (Store)
 * refreshToken est stocké dans localStorage
 */
export interface AuthStateModel {
  token: string | null;  // Access token (en mémoire uniquement)
  refreshToken: string | null;  // Refresh token (sera aussi dans localStorage)
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

/**
 * Credentials pour le login
 */
export interface LoginCredentials {
  login: string;
  password: string;
}

/**
 * Réponse du backend lors du login
 */
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
