import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  apiUrl = 'https://52980e9d-49e6-4de5-959e-64957ef06805-00-2e5umcjokfs6r.picard.replit.dev/users'; // URL de la API para los usuarios

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    })
  };

  constructor(private http: HttpClient) {}

  // Método para obtener todos los usuarios
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Método para obtener un usuario por ID
  getUserById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Método para actualizar un usuario
  updateUser(id: string, user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, user, this.httpOptions);
  }

  // Método para crear un nuevo usuario
  crearUsuario(user: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, user, this.httpOptions);
  }
}
