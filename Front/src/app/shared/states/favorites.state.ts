import { Injectable, inject } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Pollution } from '../../pollutions/models/pollution.model';
import { FavoritesService } from '../services/favorites.service';
import { Auth } from '../actions/auth.actions';
import {
  LoadFavorites,
  LoadFavoritesSuccess,
  LoadFavoritesFailure,
  AddFavorite,
  AddFavoriteSuccess,
  AddFavoriteFailure,
  RemoveFavorite,
  RemoveFavoriteSuccess,
  RemoveFavoriteFailure,
  ClearFavorites,
  ClearFavoritesSuccess,
  ClearFavoritesFailure
} from '../actions/favorites.actions';

export interface FavoritesStateModel {
  favorites: Pollution[];
  loading: boolean;
  error: string | null;
}

@State<FavoritesStateModel>({
  name: 'favorites',
  defaults: {
    favorites: [],
    loading: false,
    error: null
  }
})
@Injectable()
export class FavoritesState {
  private favoritesService = inject(FavoritesService);

  @Selector()
  static getFavorites(state: FavoritesStateModel): Pollution[] {
    return state.favorites;
  }

  @Selector()
  static getFavoritesCount(state: FavoritesStateModel): number {
    return state.favorites.length;
  }

  @Selector()
  static isFavorite(state: FavoritesStateModel) {
    return (pollutionId: number) => {
      return state.favorites.some(p => p.id === pollutionId);
    };
  }

  @Selector()
  static isLoading(state: FavoritesStateModel): boolean {
    return state.loading;
  }

  @Selector()
  static getError(state: FavoritesStateModel): string | null {
    return state.error;
  }

  // Charger les favoris depuis l'API
  @Action(LoadFavorites)
  loadFavorites(ctx: StateContext<FavoritesStateModel>) {
    ctx.patchState({ loading: true, error: null });

    return this.favoritesService.getFavorites().pipe(
      tap((favorites) => {
        ctx.dispatch(new LoadFavoritesSuccess(favorites));
      }),
      catchError((error) => {
        const errorMessage = error?.error?.message || 'Erreur lors du chargement des favoris';
        ctx.dispatch(new LoadFavoritesFailure(errorMessage));
        return throwError(() => error);
      })
    );
  }

  @Action(LoadFavoritesSuccess)
  loadFavoritesSuccess(ctx: StateContext<FavoritesStateModel>, action: LoadFavoritesSuccess) {
    ctx.patchState({
      favorites: action.favorites,
      loading: false,
      error: null
    });
  }

  @Action(LoadFavoritesFailure)
  loadFavoritesFailure(ctx: StateContext<FavoritesStateModel>, action: LoadFavoritesFailure) {
    ctx.patchState({
      loading: false,
      error: action.error
    });
  }

  // Ajouter un favori
  @Action(AddFavorite)
  addFavorite(ctx: StateContext<FavoritesStateModel>, action: AddFavorite) {
    const state = ctx.getState();
    const exists = state.favorites.some(p => p.id === action.pollution.id);

    if (exists) {
      return; // Déjà en favoris
    }

    ctx.patchState({ loading: true, error: null });

    return this.favoritesService.addFavorite(action.pollution).pipe(
      tap((pollution) => {
        ctx.dispatch(new AddFavoriteSuccess(pollution));
      }),
      catchError((error) => {
        const errorMessage = error?.error?.message || 'Erreur lors de l\'ajout du favori';
        ctx.dispatch(new AddFavoriteFailure(errorMessage));
        return throwError(() => error);
      })
    );
  }

  @Action(AddFavoriteSuccess)
  addFavoriteSuccess(ctx: StateContext<FavoritesStateModel>, action: AddFavoriteSuccess) {
    const state = ctx.getState();
    ctx.patchState({
      favorites: [...state.favorites, action.pollution],
      loading: false,
      error: null
    });
  }

  @Action(AddFavoriteFailure)
  addFavoriteFailure(ctx: StateContext<FavoritesStateModel>, action: AddFavoriteFailure) {
    ctx.patchState({
      loading: false,
      error: action.error
    });
  }

  // Retirer un favori
  @Action(RemoveFavorite)
  removeFavorite(ctx: StateContext<FavoritesStateModel>, action: RemoveFavorite) {
    ctx.patchState({ loading: true, error: null });

    return this.favoritesService.removeFavorite(action.pollutionId).pipe(
      tap(() => {
        ctx.dispatch(new RemoveFavoriteSuccess(action.pollutionId));
      }),
      catchError((error) => {
        const errorMessage = error?.error?.message || 'Erreur lors de la suppression du favori';
        ctx.dispatch(new RemoveFavoriteFailure(errorMessage));
        return throwError(() => error);
      })
    );
  }

  @Action(RemoveFavoriteSuccess)
  removeFavoriteSuccess(ctx: StateContext<FavoritesStateModel>, action: RemoveFavoriteSuccess) {
    const state = ctx.getState();
    const filtered = state.favorites.filter(p => p.id !== action.pollutionId);

    ctx.patchState({
      favorites: filtered,
      loading: false,
      error: null
    });
  }

  @Action(RemoveFavoriteFailure)
  removeFavoriteFailure(ctx: StateContext<FavoritesStateModel>, action: RemoveFavoriteFailure) {
    ctx.patchState({
      loading: false,
      error: action.error
    });
  }

  // Supprimer tous les favoris
  @Action(ClearFavorites)
  clearFavorites(ctx: StateContext<FavoritesStateModel>) {
    ctx.patchState({ loading: true, error: null });

    return this.favoritesService.clearFavorites().pipe(
      tap(() => {
        ctx.dispatch(new ClearFavoritesSuccess());
      }),
      catchError((error) => {
        const errorMessage = error?.error?.message || 'Erreur lors de la suppression des favoris';
        ctx.dispatch(new ClearFavoritesFailure(errorMessage));
        return throwError(() => error);
      })
    );
  }

  @Action(ClearFavoritesSuccess)
  clearFavoritesSuccess(ctx: StateContext<FavoritesStateModel>) {
    ctx.patchState({
      favorites: [],
      loading: false,
      error: null
    });
  }

  @Action(ClearFavoritesFailure)
  clearFavoritesFailure(ctx: StateContext<FavoritesStateModel>, action: ClearFavoritesFailure) {
    ctx.patchState({
      loading: false,
      error: action.error
    });
  }

  // Réinitialiser les favoris lors du logout
  @Action(Auth.Logout)
  onLogout(ctx: StateContext<FavoritesStateModel>) {
    ctx.patchState({
      favorites: [],
      loading: false,
      error: null
    });
  }
}
