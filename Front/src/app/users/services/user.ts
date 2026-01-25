import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, CreateUserDto } from '../models/user.model';
import { LoginResponse } from '../../shared/models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/utilisateur`;

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  createUser(userDto: CreateUserDto): Observable<User> {
    return this.http.post<User>(this.apiUrl, userDto);
  }

  /**
   * Login utilisateur via /api/auth/login
   * Retourne accessToken + refreshToken + user
   */
  login(login: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${environment.apiUrl}/auth/login`,
      { login, password }
    );
  }
}
