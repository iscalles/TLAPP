import { Component, OnInit } from '@angular/core';
import { ViajeService } from '../../viaje.service';

@Component({
  selector: 'app-viajes-conductor',
  templateUrl: './viajes-conductor.component.html',
  styleUrls: ['./viajes-conductor.component.scss'],
})
export class ViajesConductorComponent implements OnInit {
  viajes: any[] = [];
  showCreateForm = false; // Para mostrar/ocultar el formulario
  nuevoViaje = {
    direccionInicio: '',
    direccionFinal: '',
    distancia: 0,
    precio: 0,
    estado: 'pendiente' // Estado predeterminado del viaje
  };

  constructor(private viajeService: ViajeService) {}

  ngOnInit() {
    this.loadViajes();
  }

  // Obtener todos los viajes
  loadViajes() {
    this.viajeService.getViajes().subscribe((data) => {
      this.viajes = data;
    });
  }

  // Eliminar un viaje
  deleteViaje(id: number) {
    this.viajeService.deleteViaje(id).subscribe(() => {
      this.loadViajes(); // Actualizar la lista después de eliminar
    });
  }

  // Mostrar/ocultar el formulario para crear un nuevo viaje
  toggleCreateForm() {
    this.showCreateForm = !this.showCreateForm;
  }

  // Crear un nuevo viaje
  crearViaje() {
    if (this.nuevoViaje.direccionInicio && this.nuevoViaje.direccionFinal && this.nuevoViaje.distancia > 0 && this.nuevoViaje.precio > 0) {
      const nuevoViajeConId = { ...this.nuevoViaje, id: this.generateId(), conductorId: this.getConductorId() };

      this.viajeService.createViaje(nuevoViajeConId).subscribe(() => {
        this.loadViajes(); // Actualiza la lista de viajes después de crear el nuevo
        this.toggleCreateForm(); // Oculta el formulario después de crear
        this.nuevoViaje = { direccionInicio: '', direccionFinal: '', distancia: 0, precio: 0, estado: 'pendiente' }; // Reinicia los valores del formulario
      });
    } else {
      console.log('Por favor, completa todos los campos.');
    }
  }

  // Generar un ID aleatorio para el nuevo viaje
  generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // Obtener el ID del conductor desde el localStorage
  getConductorId(): string {
    return localStorage.getItem('userId') || '';
  }
}
