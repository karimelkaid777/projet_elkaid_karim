import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth`;

  /**
   * Rafraîchir l'access token avec le refresh token
   * @param refreshToken - Le refresh token stocké dans localStorage
   * @returns Observable avec le nouveau access token
   */
  refreshAccessToken(refreshToken: string): Observable<{ accessToken: string }> {
    return this.http.post<{ accessToken: string }>(
      `${this.apiUrl}/refresh`,
      { refreshToken }
    );
  }

  /**
   * Logout (optionnel - côté serveur)
   */
  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {});
  }
}
