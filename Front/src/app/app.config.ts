import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideHttpClient, withFetch, withInterceptors} from '@angular/common/http';
import {environment} from '../environments/environment';
import {mockBackendInterceptor} from './pollutions/interceptors/mock-backend-interceptor';
import { provideStore } from '@ngxs/store';
import { AuthState } from './shared/states/auth.state';
import { FavoritesState } from './shared/states/favorites.state';
import { authInterceptor } from './shared/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      // Interceptor JWT pour injecter automatiquement le token dans toutes les requêtes
      withInterceptors([authInterceptor])
      // Je n'ai plus besoin de mocker le backend en production puisque j'ai un vrai backend maintenant
      //...(!environment.production ? [withInterceptors([mockBackendInterceptor])] : [])
    ),
    // Configuration NGXS
    // IMPORTANT: Le token JWT ne doit PAS être stocké dans localStorage (sécurité)
    // Il reste uniquement en mémoire dans le store NGXS
    provideStore(
      [AuthState, FavoritesState], // États à enregistrer
      {
        developmentMode: !environment.production,
      }
      // withNgxsStoragePlugin RETIRÉ pour ne pas stocker le token dans localStorage
    )
  ]
};
