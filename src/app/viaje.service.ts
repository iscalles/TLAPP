import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViajeService {
  private apiUrl = 'http://localhost:3000/viajes'; // Enlace al recurso de viajes en db.json

  constructor(private http: HttpClient) {}

  // CREATE: Crear un nuevo viaje
  createViaje(viaje: any): Observable<any> {
    return this.http.post(this.apiUrl, viaje);
  }

  // READ: Obtener todos los viajes
  getViajes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // READ: Obtener un viaje por ID
  getViajeById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // UPDATE: Actualizar un viaje por ID
  updateViaje(id: number, viaje: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, viaje);
  }

  // DELETE: Eliminar un viaje por ID
  deleteViaje(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
