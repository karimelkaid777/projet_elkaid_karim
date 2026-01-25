import { Pollution } from '../../pollutions/models/pollution.model';

// Action pour charger les favoris depuis l'API
export class LoadFavorites {
  static readonly type = '[Favorites] Load Favorites';
}

export class LoadFavoritesSuccess {
  static readonly type = '[Favorites] Load Favorites Success';
  constructor(public favorites: Pollution[]) {}
}

export class LoadFavoritesFailure {
  static readonly type = '[Favorites] Load Favorites Failure';
  constructor(public error: string) {}
}

// Action pour ajouter un favori
export class AddFavorite {
  static readonly type = '[Favorites] Add Favorite';
  constructor(public pollution: Pollution) {}
}

export class AddFavoriteSuccess {
  static readonly type = '[Favorites] Add Favorite Success';
  constructor(public pollution: Pollution) {}
}

export class AddFavoriteFailure {
  static readonly type = '[Favorites] Add Favorite Failure';
  constructor(public error: string) {}
}

// Action pour retirer un favori
export class RemoveFavorite {
  static readonly type = '[Favorites] Remove Favorite';
  constructor(public pollutionId: number) {}
}

export class RemoveFavoriteSuccess {
  static readonly type = '[Favorites] Remove Favorite Success';
  constructor(public pollutionId: number) {}
}

export class RemoveFavoriteFailure {
  static readonly type = '[Favorites] Remove Favorite Failure';
  constructor(public error: string) {}
}

// Action pour supprimer tous les favoris
export class ClearFavorites {
  static readonly type = '[Favorites] Clear Favorites';
}

export class ClearFavoritesSuccess {
  static readonly type = '[Favorites] Clear Favorites Success';
}

export class ClearFavoritesFailure {
  static readonly type = '[Favorites] Clear Favorites Failure';
  constructor(public error: string) {}
}
