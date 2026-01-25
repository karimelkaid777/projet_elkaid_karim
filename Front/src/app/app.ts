import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { AuthState } from './shared/states/auth.state';
import { FavoritesState } from './shared/states/favorites.state';
import { Auth } from './shared/actions/auth.actions';
import { LoadFavorites } from './shared/actions/favorites.actions';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private store = inject(Store);
  private router = inject(Router);

  title = 'Gestion des Pollutions';

  // Selectors NGXS
  isAuthenticated = this.store.selectSignal(AuthState.isAuthenticated);
  currentUser = this.store.selectSignal(AuthState.currentUser);
  favoritesCount = this.store.selectSignal(FavoritesState.getFavoritesCount);

  ngOnInit() {
    // Si l'utilisateur est déjà connecté (depuis localStorage), charger ses favoris
    if (this.isAuthenticated()) {
      this.store.dispatch(new LoadFavorites());
    }
  }

  logout() {
    this.store.dispatch(new Auth.Logout());
    this.router.navigate(['/users/login']);
  }
}
