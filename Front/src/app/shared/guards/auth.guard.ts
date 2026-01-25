import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { Store } from '@ngxs/store';
import { AuthState } from '../states/auth.state';

/**
 * Guard fonctionnel pour protéger les routes
 * Vérifie si l'utilisateur est authentifié via le store NGXS
 */
export const authGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);

  const isAuthenticated = store.selectSnapshot(AuthState.isAuthenticated);

  if (!isAuthenticated) {
    // Redirige vers la page de login si non authentifié
    router.navigate(['/users/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }

  return true;
};
