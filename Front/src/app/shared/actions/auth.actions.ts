import { LoginCredentials } from '../models/auth.model';

/**
 * Namespace pour les actions d'authentification
 */
export namespace Auth {
  /**
   * Action de login (asynchrone)
   */
  export class Login {
    static readonly type = '[Auth] Login';
    constructor(public credentials: LoginCredentials) {}
  }

  /**
   * Action de succès du login
   */
  export class LoginSuccess {
    static readonly type = '[Auth] Login Success';
    constructor(public payload: { token?: string; refreshToken?: string; user: any }) {}
  }

  /**
   * Action d'échec du login
   */
  export class LoginFailure {
    static readonly type = '[Auth] Login Failure';
    constructor(public error: string) {}
  }

  /**
   * Action de logout
   */
  export class Logout {
    static readonly type = '[Auth] Logout';
  }

  /**
   * Action pour nettoyer les erreurs
   */
  export class ClearError {
    static readonly type = '[Auth] Clear Error';
  }
}
