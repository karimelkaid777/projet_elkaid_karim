import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { AuthState } from '../states/auth.state';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';
import { Auth } from '../actions/auth.actions';

/**
 * HTTP Interceptor pour :
 * 1. Injecter automatiquement le JWT Bearer dans toutes les requêtes
 * 2. Gérer les erreurs 401 et rafraîchir le token automatiquement
 *
 * Conforme au cours slide 7-8 - JWT & Sécurisation API
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);
  const authService = inject(AuthService);
  const router = inject(Router);

  // Récupérer le token depuis le store NGXS (single source of truth)
  const token = store.selectSnapshot(AuthState.token);

  // Cloner la requête pour ajouter le header Authorization si un token existe
  const authReq = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      })
    : req;

  // Passer la requête modifiée au handler suivant
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Si erreur 401 (Unauthorized) et qu'on a un refresh token
      if (error.status === 401) {
        const refreshToken = store.selectSnapshot(AuthState.refreshToken);

        // Si on a un refresh token, essayer de rafraîchir l'access token
        if (refreshToken) {
          return authService.refreshAccessToken(refreshToken).pipe(
            switchMap((response) => {
              // Mettre à jour le token dans le store
              store.dispatch(
                new Auth.LoginSuccess({
                  token: response.accessToken,
                  refreshToken: refreshToken,
                  user: store.selectSnapshot(AuthState.currentUser)
                })
              );

              // Retenter la requête originale avec le nouveau token
              const retryReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${response.accessToken}`
                }
              });
              return next(retryReq);
            }),
            catchError((refreshError) => {
              // Si le refresh échoue, déconnecter l'utilisateur
              store.dispatch(new Auth.Logout());
              router.navigate(['/users/login']);
              return throwError(() => refreshError);
            })
          );
        } else {
          // Pas de refresh token, déconnecter
          store.dispatch(new Auth.Logout());
          router.navigate(['/users/login']);
        }
      }

      // Pour toutes les autres erreurs, les propager
      return throwError(() => error);
    })
  );
};
