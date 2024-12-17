import { Component, OnInit } from '@angular/core';
import { ViajeService } from '../../viaje.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-viajes-home',
  templateUrl: './viajes-home.component.html',
  styleUrls: ['./viajes-home.component.scss'],
})
export class ViajesHomeComponent implements OnInit {
  viajesUsuario: any[] = [];

  constructor(private viajeService: ViajeService, private toastController: ToastController) {}

  ngOnInit() {
    this.loadViajesUsuario();
  }

  loadViajesUsuario() {
    const pasajeroId = this.getPasajeroId();
    this.viajeService.getViajes().subscribe((viajes: any[]) => {
      this.viajesUsuario = viajes.filter(viaje => viaje.pasajeros && viaje.pasajeros.includes(pasajeroId));
    });
  }

  // Obtener el ID del pasajero
  getPasajeroId(): string {
    return localStorage.getItem('userId') || '';
  }

  // Mostrar un toast
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
}
