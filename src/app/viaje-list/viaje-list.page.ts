import { Component, OnInit } from '@angular/core';
import { ViajeService } from '../viaje.service';

@Component({
  selector: 'app-viaje-list',
  templateUrl: './viaje-list.page.html',
  styleUrls: ['./viaje-list.page.scss'],
})
export class ViajeListPage implements OnInit {
  estados:any[]=[
    {id:1,estado:"pendiente"},
    {id:2,estado:"completado"},
  ]
  viajes: any[] = [];
  newViaje: { 
    conductorId: string; 
    pasajeroId: string; 
    direccionInicio: string; 
    direccionFinal: string; 
    horaInicio: string; 
    horaTermino: string; 
    distancia: number; 
    precio: number; 
    estado: string; 
  } = {
    conductorId: '',
    pasajeroId: '',
    direccionInicio: '',
    direccionFinal: '',
    horaInicio: '',
    horaTermino: '',
    distancia: 0,
    precio: 0,
    estado: 'pendiente' // Valor predeterminado
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

  // Crear un nuevo viaje
  createViaje() {
    this.viajeService.createViaje(this.newViaje).subscribe(() => {
      this.loadViajes(); // Actualizar la lista después de crear
      // Limpiar el formulario después de crear el viaje
      this.resetNewViaje();
    });
  }

  // Resetear el formulario de nuevo viaje
  resetNewViaje() {
    this.newViaje = { 
      conductorId: '', 
      pasajeroId: '', 
      direccionInicio: '', 
      direccionFinal: '', 
      horaInicio: '', 
      horaTermino: '', 
      distancia: 0, 
      precio: 0, 
      estado: 'pendiente' 
    };
  }

  // Actualizar un viaje existente
  updateViaje(id: number, updatedViaje: any) {
    this.viajeService.updateViaje(id, updatedViaje).subscribe(() => {
      this.loadViajes(); // Actualizar la lista después de editar
    });
  }

  // Eliminar un viaje
  deleteViaje(id: number) {
    this.viajeService.deleteViaje(id).subscribe(() => {
      this.loadViajes(); // Actualizar la lista después de eliminar
    });
  }
}
