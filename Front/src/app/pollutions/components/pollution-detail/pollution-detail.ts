import {Component, inject, signal, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {Store} from '@ngxs/store';
import {Pollution} from '../../models/pollution.model';
import {PollutionService} from '../../services/pollution';
import {format} from 'date-fns';
import {fr} from 'date-fns/locale';
import {FavoritesState} from '../../../shared/states/favorites.state';
import {AuthState} from '../../../shared/states/auth.state';
import {AddFavorite, RemoveFavorite} from '../../../shared/actions/favorites.actions';
import {LoadingButtonDirective} from '../../../shared/directives/loading-button';

@Component({
  selector: 'app-pollution-detail',
  imports: [RouterLink, LoadingButtonDirective],
  templateUrl: './pollution-detail.html',
  styleUrl: './pollution-detail.scss'
})
export class PollutionDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private pollutionService = inject(PollutionService);
  private store = inject(Store);

  pollution = signal<Pollution | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  deleteLoading = signal(false);

  // Sélecteurs NGXS
  isFavorite = this.store.selectSignal(FavoritesState.isFavorite);
  isAuthenticated = this.store.selectSignal(AuthState.isAuthenticated);
  favoriteLoading = signal(false);

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadPollution(id);
  }

  loadPollution(id: number) {
    this.loading.set(true);
    this.pollutionService.getPollutionById(id).subscribe({
      next: (data) => {
        this.pollution.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Pollution non trouvée');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  onBack() {
    this.router.navigate(['/pollutions/list']);
  }

  onEdit() {
    const pollution = this.pollution();
    if (pollution) {
      this.router.navigate(['/pollutions/edit', pollution.id]);
    }
  }

  onDelete() {
    const pollution = this.pollution();
    if (pollution && confirm('Êtes-vous sûr de vouloir supprimer cette pollution ?')) {
      this.deleteLoading.set(true);
      this.pollutionService.deletePollution(pollution.id).subscribe({
        next: () => {
          this.deleteLoading.set(false);
          this.router.navigate(['/pollutions/list']);
        },
        error: (err) => {
          this.deleteLoading.set(false);
          alert('Erreur lors de la suppression');
          console.error(err);
        }
      });
    }
  }

  getTypeLabel(type: string): string {
    return type;
  }

  formatDate(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, 'EEEE d MMMM yyyy', { locale: fr });
  }

  toggleFavorite() {
    const pollution = this.pollution();
    if (!pollution) return;

    if (!this.isAuthenticated()) {
      alert('Vous devez être connecté pour ajouter des favoris. Vous allez être redirigé vers la page de connexion.');
      this.router.navigate(['/users/login']);
      return;
    }

    this.favoriteLoading.set(true);

    const action = this.isFavorite()(pollution.id)
      ? new RemoveFavorite(pollution.id)
      : new AddFavorite(pollution);

    this.store.dispatch(action).subscribe({
      complete: () => this.favoriteLoading.set(false),
      error: () => this.favoriteLoading.set(false)
    });
  }
}
