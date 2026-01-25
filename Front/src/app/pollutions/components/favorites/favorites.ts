import { Component, inject, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngxs/store';
import { Pollution } from '../../models/pollution.model';
import { FavoritesState } from '../../../shared/states/favorites.state';
import { AuthState } from '../../../shared/states/auth.state';
import { RemoveFavorite, ClearFavorites } from '../../../shared/actions/favorites.actions';

@Component({
  selector: 'app-favorites',
  imports: [RouterLink],
  templateUrl: './favorites.html',
  styleUrl: './favorites.scss'
})
export class FavoritesComponent {
  private store = inject(Store);
  private router = inject(Router);

  favorites = computed(() => this.store.selectSignal(FavoritesState.getFavorites)());
  favoritesCount = computed(() => this.store.selectSignal(FavoritesState.getFavoritesCount)());
  isAuthenticated = this.store.selectSignal(AuthState.isAuthenticated);

  onViewDetail(pollution: Pollution) {
    this.router.navigate(['/pollutions/detail', pollution.id]);
  }

  onRemoveFavorite(pollutionId: number, event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.store.dispatch(new RemoveFavorite(pollutionId));
  }

  onClearAll() {
    if (confirm('Êtes-vous sûr de vouloir supprimer tous les favoris ?')) {
      this.store.dispatch(new ClearFavorites());
    }
  }

  getTypeIcon(type: string): string {
    const icons: Record<string, string> = {
      'Plastique': '♻️',
      'Chimique': '⚗️',
      'Dépôt sauvage': '🗑️',
      'Eau': '💧',
      'Air': '🌫️',
      'Autre': '⚠️'
    };
    return icons[type] || '⚠️';
  }
}
