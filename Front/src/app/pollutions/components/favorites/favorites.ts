import { Component, inject, computed, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngxs/store';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Pollution } from '../../models/pollution.model';
import { FavoritesState } from '../../../shared/states/favorites.state';
import { AuthState } from '../../../shared/states/auth.state';
import { RemoveFavorite, ClearFavorites } from '../../../shared/actions/favorites.actions';
import { LoadingButtonDirective } from '../../../shared/directives/loading-button';

@Component({
  selector: 'app-favorites',
  imports: [RouterLink, LoadingButtonDirective],
  templateUrl: './favorites.html',
  styleUrl: './favorites.scss'
})
export class FavoritesComponent {
  private store = inject(Store);
  private router = inject(Router);

  favorites = computed(() => this.store.selectSignal(FavoritesState.getFavorites)());
  favoritesCount = computed(() => this.store.selectSignal(FavoritesState.getFavoritesCount)());
  isAuthenticated = this.store.selectSignal(AuthState.isAuthenticated);

  removeLoadingId = signal<number | null>(null);
  clearAllLoading = signal(false);

  onViewDetail(pollution: Pollution) {
    this.router.navigate(['/pollutions/detail', pollution.id]);
  }

  onRemoveFavorite(pollutionId: number) {
    this.removeLoadingId.set(pollutionId);
    this.store.dispatch(new RemoveFavorite(pollutionId)).subscribe({
      complete: () => this.removeLoadingId.set(null),
      error: () => this.removeLoadingId.set(null)
    });
  }

  onClearAll() {
    if (confirm('Êtes-vous sûr de vouloir supprimer tous les favoris ?')) {
      this.clearAllLoading.set(true);
      this.store.dispatch(new ClearFavorites()).subscribe({
        complete: () => this.clearAllLoading.set(false),
        error: () => this.clearAllLoading.set(false)
      });
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

  formatDate(date: Date | string): string {
    const dateObject = typeof date === 'string' ? new Date(date) : date;
    return format(dateObject, 'd MMM yyyy', { locale: fr });
  }
}
