import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViajeService {
  apiUrl = 'https://52980e9d-49e6-4de5-959e-64957ef06805-00-2e5umcjokfs6r.picard.replit.dev/viajes'; // URL de la API para los viajes

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    })
  };

  private viajeCreado: any = null; // Estado del viaje creado
  private viajeFinalizadoSubject = new Subject<void>(); // Sujeto para notificar cuando un viaje se finalice

  constructor(private http: HttpClient) {}

  // Método para obtener todos los viajes
  getViajes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Método para crear un nuevo viaje
  createViaje(viaje: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, viaje, this.httpOptions);
  }

  // Método para actualizar un viaje
  updateViaje(id: number, viaje: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, viaje, this.httpOptions);
  }

  // Método para eliminar un viaje
  deleteViaje(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.httpOptions);
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

  // Método para obtener un viaje por ID
  getViajeById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Métodos para manejar la notificación de viaje finalizado
  notifyViajeFinalizado() {
    this.viajeFinalizadoSubject.next();
  }

  getViajeFinalizadoObservable(): Observable<void> {
    return this.viajeFinalizadoSubject.asObservable();
  }
}
