import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { AuthState } from '../states/auth.state';
import { Pollution } from '../../pollutions/models/pollution.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private http = inject(HttpClient);
  private store = inject(Store);
  private apiUrl = `${environment.apiUrl}/favoris`;

  /**
   * Récupère les headers avec le token d'authentification
   */
  private getAuthHeaders(): HttpHeaders {
    const token = this.store.selectSnapshot(AuthState.token);
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  /**
   * Récupérer les favoris de l'utilisateur connecté
   */
  getFavorites(): Observable<Pollution[]> {
    return this.http.get<Pollution[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Ajouter une pollution aux favoris
   */
  addFavorite(pollution: Pollution): Observable<Pollution> {
    return this.http.post<Pollution>(this.apiUrl,
      { pollutionId: pollution.id },
      { headers: this.getAuthHeaders() }
    );
  }

  /**
   * Retirer une pollution des favoris
   */
  removeFavorite(pollutionId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${pollutionId}`, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Supprimer tous les favoris
   */
  clearFavorites(): Observable<void> {
    return this.http.delete<void>(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }
}
