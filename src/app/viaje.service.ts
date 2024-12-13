import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViajeService {
  private apiUrl = 'http://localhost:3000/viajes'; // Asegúrate de que esta URL sea correcta
  private viajeCreado: any = null; // Estado del viaje creado
  private viajeFinalizadoSubject = new Subject<void>(); // Sujeto para notificar cuando un viaje se finalice

  constructor(private http: HttpClient) {}

  // CREATE: Crear un nuevo viaje
  createViaje(viaje: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, viaje);
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

  // Métodos para manejar el estado del viaje creado
  setViajeCreado(viaje: any) {
    this.viajeCreado = viaje;
  }

  getViajeCreado() {
    return this.viajeCreado;
  }

  clearViajeCreado() {
    this.viajeCreado = null;
  }

  // Métodos para manejar la notificación de viaje finalizado
  notifyViajeFinalizado() {
    this.viajeFinalizadoSubject.next();
  }

  getViajeFinalizadoObservable(): Observable<void> {
    return this.viajeFinalizadoSubject.asObservable();
  }
}
