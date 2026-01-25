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

@Component({
  selector: 'app-pollution-detail',
  imports: [RouterLink],
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

  // Sélecteurs NGXS
  isFavorite = this.store.selectSignal(FavoritesState.isFavorite);
  isAuthenticated = this.store.selectSignal(AuthState.isAuthenticated);

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
      this.pollutionService.deletePollution(pollution.id).subscribe({
        next: () => {
          this.router.navigate(['/pollutions/list']);
        },
        error: (err) => {
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

    // Si l'utilisateur n'est pas connecté, rediriger vers le login
    if (!this.isAuthenticated()) {
      alert('Vous devez être connecté pour ajouter des favoris. Vous allez être redirigé vers la page de connexion.');
      this.router.navigate(['/users/login']);
      return;
    }

    if (this.isFavorite()(pollution.id)) {
      this.store.dispatch(new RemoveFavorite(pollution.id));
    } else {
      this.store.dispatch(new AddFavorite(pollution));
    }
  }
}
