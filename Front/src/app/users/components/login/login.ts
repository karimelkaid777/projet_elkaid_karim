import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Auth } from '../../../shared/actions/auth.actions';
import { AuthState } from '../../../shared/states/auth.state';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  private store = inject(Store);
  private router = inject(Router);

  // Utilisation des selectors NGXS
  loading = this.store.selectSignal(AuthState.loading);
  error = this.store.selectSignal(AuthState.error);

  // Formulaire
  login = '';
  password = '';

  onSubmit() {
    if (!this.login || !this.password) {
      return;
    }

    // Dispatch de l'action Login
    this.store.dispatch(new Auth.Login({
      login: this.login,
      password: this.password
    })).subscribe({
      next: () => {
        // Vérifier si l'authentification a réussi
        const isAuthenticated = this.store.selectSnapshot(AuthState.isAuthenticated);
        if (isAuthenticated) {
          const user = this.store.selectSnapshot(AuthState.currentUser);
          alert(`Bienvenue ${user?.nom} ${user?.prenom || ''}!`);
          this.router.navigate(['/pollutions']);
        }
      },
      error: (err) => {
        console.error('Erreur lors du login:', err);
      }
    });
  }

  ngOnDestroy() {
    // Nettoyer les erreurs lors de la destruction du composant
    this.store.dispatch(new Auth.ClearError());
  }
}
