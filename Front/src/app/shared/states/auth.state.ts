import { Injectable, inject } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Auth } from '../actions/auth.actions';
import { AuthStateModel } from '../models/auth.model';
import { UserService } from '../../users/services/user';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { LoadFavorites } from '../actions/favorites.actions';

/**
 * État initial de l'authentification
 * IMPORTANT: Le refreshToken est chargé depuis localStorage au démarrage
 */
const defaultState: AuthStateModel = {
  token: null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

/**
 * State NGXS pour l'authentification
 * Gère le login, logout et la persistance
 */
@State<AuthStateModel>({
  name: 'auth',
  defaults: defaultState,
})
@Injectable()
export class AuthState {
  private userService = inject(UserService);

  /**
   * Selector pour récupérer l'état d'authentification
   */
  @Selector()
  static isAuthenticated(state: AuthStateModel): boolean {
    return state.isAuthenticated;
  }

  /**
   * Selector pour récupérer l'utilisateur courant
   */
  @Selector()
  static currentUser(state: AuthStateModel) {
    return state.user;
  }

  /**
   * Selector pour récupérer le token (access token)
   */
  @Selector()
  static token(state: AuthStateModel): string | null {
    return state.token;
  }

  /**
   * Selector pour récupérer le refresh token
   */
  @Selector()
  static refreshToken(state: AuthStateModel): string | null {
    return state.refreshToken;
  }

  /**
   * Selector pour récupérer l'état de chargement
   */
  @Selector()
  static loading(state: AuthStateModel): boolean {
    return state.loading;
  }

  /**
   * Selector pour récupérer les erreurs
   */
  @Selector()
  static error(state: AuthStateModel): string | null {
    return state.error;
  }

  /**
   * Action de login (asynchrone)
   */
  @Action(Auth.Login)
  login(ctx: StateContext<AuthStateModel>, action: Auth.Login) {
    // Set loading state
    ctx.patchState({
      loading: true,
      error: null,
    });

    return this.userService.login(action.credentials.login, action.credentials.password).pipe(
      tap((response) => {
        // Extraire les tokens et l'utilisateur de la réponse
        const { accessToken, refreshToken, user } = response;

        // Succès du login
        ctx.dispatch(
          new Auth.LoginSuccess({
            token: accessToken,
            refreshToken: refreshToken,
            user: user,
          })
        );
      }),
      catchError((error) => {
        // Échec du login
        const errorMessage = error?.error?.message || 'Erreur de connexion';
        ctx.dispatch(new Auth.LoginFailure(errorMessage));
        return throwError(() => error);
      })
    );
  }

  /**
   * Action de succès du login
   * IMPORTANT: Stocke le refreshToken dans localStorage
   * mais garde l'accessToken UNIQUEMENT en mémoire (Store)
   */
  @Action(Auth.LoginSuccess)
  loginSuccess(ctx: StateContext<AuthStateModel>, action: Auth.LoginSuccess) {
    const { token, refreshToken, user } = action.payload;

    // Stocker le refresh token dans localStorage (autorisé par le prof)
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }

    // Mettre à jour le state (access token reste en mémoire uniquement)
    ctx.patchState({
      token: token || null,
      refreshToken: refreshToken || null,
      user: user,
      isAuthenticated: true,
      loading: false,
      error: null,
    });

    // Charger les favoris de l'utilisateur après le login
    ctx.dispatch(new LoadFavorites());
  }

  /**
   * Action d'échec du login
   */
  @Action(Auth.LoginFailure)
  loginFailure(ctx: StateContext<AuthStateModel>, action: Auth.LoginFailure) {
    ctx.patchState({
      loading: false,
      error: action.error,
      isAuthenticated: false,
    });
  }

  /**
   * Action de logout
   * Supprime le refreshToken du localStorage
   */
  @Action(Auth.Logout)
  logout(ctx: StateContext<AuthStateModel>) {
    // Supprimer le refresh token du localStorage
    localStorage.removeItem('refreshToken');

    // Réinitialiser l'état (sans le refreshToken du localStorage)
    ctx.setState({
      token: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    });
  }

  /**
   * Action pour nettoyer les erreurs
   */
  @Action(Auth.ClearError)
  clearError(ctx: StateContext<AuthStateModel>) {
    ctx.patchState({
      error: null,
    });
  }
}
