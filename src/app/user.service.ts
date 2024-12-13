import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/users'; // URL de la API para los usuarios

  constructor(private http: HttpClient) {}

  // Método para registrar un nuevo usuario
  registerUser(user: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, user);
  }

  // Método para crear un nuevo usuario
  crearUsuario(user: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, user);
  }
}
