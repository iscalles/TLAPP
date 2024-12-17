import { Component, OnInit } from '@angular/core';
import { ViajeService } from '../../viaje.service';

@Component({
  selector: 'app-viajes-conductor',
  templateUrl: './viajes-conductor.component.html',
  styleUrls: ['./viajes-conductor.component.scss'],
})
export class ViajesConductorComponent implements OnInit {
  viajes: any[] = [];
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

}
