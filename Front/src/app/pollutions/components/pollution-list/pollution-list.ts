import {Component, inject, signal, OnInit, OnDestroy} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {Store} from '@ngxs/store';
import {Subject, Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged, switchMap, tap} from 'rxjs/operators';
import {format} from 'date-fns';
import {fr} from 'date-fns/locale';
import {Pollution} from '../../models/pollution.model';
import {PollutionFilterDto} from '../../models/pollution.dto';
import {POLLUTION_TYPES} from '../../models/pollution.constants';
import {PollutionService} from '../../services/pollution';
import {FormsModule} from '@angular/forms';
import {FavoritesState} from '../../../shared/states/favorites.state';
import {AuthState} from '../../../shared/states/auth.state';
import {AddFavorite, RemoveFavorite, RemoveFavoriteLocal} from '../../../shared/actions/favorites.actions';
import {LoadingButtonDirective} from '../../../shared/directives/loading-button';

@Component({
  selector: 'app-pollution-list',
  imports: [
    FormsModule,
    RouterLink,
    LoadingButtonDirective
  ],
  templateUrl: './pollution-list.html',
  styleUrl: './pollution-list.scss'
})
export class PollutionList implements OnInit, OnDestroy {
  private pollutionService = inject(PollutionService);
  private router = inject(Router);
  private store = inject(Store);

  pollutions = signal<Pollution[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  filterType = signal<string>('');
  filterTitle = signal<string>('');

  readonly pollutionTypes = POLLUTION_TYPES;

  // Sélecteurs NGXS
  isFavorite = this.store.selectSignal(FavoritesState.isFavorite);
  isAuthenticated = this.store.selectSignal(AuthState.isAuthenticated);

  // ID de la pollution en cours de modification de favori
  favoriteLoadingId = signal<number | null>(null);
  deleteLoadingId = signal<number | null>(null);

  private searchFiltersChanged$ = new Subject<PollutionFilterDto>();
  private dynamicSearchSubscription!: Subscription;
  private readonly SEARCH_DEBOUNCE_TIME_MS = 300;

  constructor() {
    this.loadPollutions();
  }

  ngOnInit() {
    this.setupDynamicSearch();
  }

  ngOnDestroy() {
    if (this.dynamicSearchSubscription) {
      this.dynamicSearchSubscription.unsubscribe();
    }
  }

  private setupDynamicSearch() {
    this.dynamicSearchSubscription = this.searchFiltersChanged$.pipe(
      debounceTime(this.SEARCH_DEBOUNCE_TIME_MS),
      distinctUntilChanged((previous, current) =>
        previous.title === current.title && previous.type === current.type
      ),
      tap(() => this.loading.set(true)),
      switchMap(filters => this.pollutionService.filterPollutions(filters))
    ).subscribe({
      next: (foundPollutions) => this.handleSearchSuccess(foundPollutions),
      error: (searchError) => this.handleSearchError(searchError)
    });
  }

  private emitCurrentFilters() {
    const currentFilters: PollutionFilterDto = {
      title: this.filterTitle() || undefined,
      type: this.filterType() || undefined
    };
    this.searchFiltersChanged$.next(currentFilters);
  }

  private handleSearchSuccess(foundPollutions: Pollution[]) {
    this.pollutions.set(foundPollutions);
    this.loading.set(false);
  }

  private handleSearchError(searchError: unknown) {
    this.error.set('Erreur lors de la recherche');
    this.loading.set(false);
    console.error(searchError);
  }

  handleSearchTextChange(newSearchText: string) {
    this.filterTitle.set(newSearchText);
    this.emitCurrentFilters();
  }

  loadPollutions() {
    this.loading.set(true);
    this.pollutionService.getAllPollutions().subscribe({
      next: (data) => {
        this.pollutions.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Erreur lors du chargement des pollutions');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  handlePollutionTypeChange(newPollutionType: string) {
    this.filterType.set(newPollutionType);
    this.emitCurrentFilters();
  }

  onViewDetail(pollution: Pollution) {
    this.router.navigate(['/pollutions/detail', pollution.id]);
  }

  onEdit(pollution: Pollution, event: Event) {
    event.stopPropagation();
    this.router.navigate(['/pollutions/edit', pollution.id]);
  }

  onDelete(id: number, event: Event) {
    event.stopPropagation();
    event.preventDefault();

    if (confirm('Êtes-vous sûr de vouloir supprimer cette pollution ?')) {
      this.deleteLoadingId.set(id);
      this.pollutionService.deletePollution(id).subscribe({
        next: () => {
          this.deleteLoadingId.set(null);
          // Retirer aussi des favoris localement
          this.store.dispatch(new RemoveFavoriteLocal(id));
          this.loadPollutions();
        },
        error: (err) => {
          this.deleteLoadingId.set(null);
          alert('Erreur lors de la suppression');
          console.error(err);
        }
      });
    }
  }

  onCreateNew() {
    this.router.navigate(['/pollutions/new']);
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

  getTypeLabel(type: string): string {
    return type;
  }

  formatDate(date: Date | string): string {
    const dateObject = typeof date === 'string' ? new Date(date) : date;
    return format(dateObject, 'd MMM yyyy', {locale: fr});
  }

  toggleFavorite(pollution: Pollution) {
    if (!this.isAuthenticated()) {
      alert('Vous devez être connecté pour ajouter des favoris. Vous allez être redirigé vers la page de connexion.');
      this.router.navigate(['/users/login']);
      return;
    }

    this.favoriteLoadingId.set(pollution.id);

    const action = this.isFavorite()(pollution.id)
      ? new RemoveFavorite(pollution.id)
      : new AddFavorite(pollution);

    this.store.dispatch(action).subscribe({
      complete: () => this.favoriteLoadingId.set(null),
      error: () => this.favoriteLoadingId.set(null)
    });
  }
}
