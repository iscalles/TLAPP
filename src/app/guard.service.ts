import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GuardService {
  private authTokenKey = "authToken";
  private userRoleKey = "userRole"; 
  private userIdKey = "userId"; // Nueva clave para almacenar userId
  private loggedIn: boolean = false;
  private apiUrl = 'http://localhost:3000/users'; 

  constructor(private http: HttpClient) {}

  storeToken(token: string): void {
    localStorage.setItem(this.authTokenKey, token);
  }

  storeUserId(id: number): void {
    localStorage.setItem(this.userIdKey, id.toString()); // Almacena userId
  }
  
  getUserId(): number | null {
    const userId = localStorage.getItem(this.userIdKey);
    return userId ? Number(userId) : null; // Convierte a número, si existe
  }
  
  storeUserRole(role: string): void {
    localStorage.setItem(this.userRoleKey, role); 
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.authTokenKey);
  }

  getUserRole(): string | null {
    return localStorage.getItem(this.userRoleKey); // Devuelve el rol del usuario
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  login(email: string, password: string): Observable<any> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(users => {
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
          this.storeToken(user.token);
          this.storeUserRole(user.rol);
          this.storeUserId(user.id); // Almacena el userId al iniciar sesión
          this.loggedIn = true; // Cambia el estado de autenticación
          console.log(user);
          return user; // Devuelve el usuario autenticado
        } else {
          return null; // Usuario no encontrado
        }
      }),
      catchError(error => {
        console.error('Error en la autenticación:', error);
        return of(null); // Manejo básico de errores
      })
    );
  }

  removeToken(): void {
    localStorage.removeItem(this.authTokenKey);
    localStorage.removeItem(this.userRoleKey);
    localStorage.removeItem(this.userIdKey); // Elimina también el userId
  }

  getUserById(userId: number): Observable<any> {
    // Implementación para obtener el usuario por ID
    return this.http.get<any>(`${this.apiUrl}/${userId}`).pipe(
      catchError(error => {
        console.error('Error en getUserById:', error);
        return throwError(error); // Propaga el error para que pueda ser manejado por el llamador
      })
    );
  }
}
