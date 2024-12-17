import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { ViajeService } from '../../viaje.service';
import { UserService } from '../../user.service';
import { ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';

declare var google: any;

@Component({
  selector: 'app-inicio-home',
  templateUrl: './inicio-home.component.html',
  styleUrls: ['./inicio-home.component.scss'],
})
export class InicioHomeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('map', { static: false }) mapElement!: ElementRef;
  map!: any;
  directionsService!: any;
  directionsRenderer!: any;
  geocoder!: any;
  viajesPendientes: any[] = [];
  viajeTomado: any = null;
  private checkInterval: any;
  private viajeFinalizadoSubscription!: Subscription;

  constructor(private viajeService: ViajeService, private userService: UserService, private toastController: ToastController) {}

  async ngAfterViewInit() {
    await this.loadMap();
    this.checkInterval = setInterval(() => {
      this.checkViajeTomado();
      this.loadViajesPendientes();
    }, 1000); // Ejecutar cada 1 segundo

    this.viajeFinalizadoSubscription = this.viajeService.getViajeFinalizadoObservable().subscribe(() => {
      this.checkViajeTomado();
    });
  }

  ngOnDestroy() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
    if (this.viajeFinalizadoSubscription) {
      this.viajeFinalizadoSubscription.unsubscribe();
    }
  }

  async loadMap() {
    // Obtener la posición actual
    const coordinates = await Geolocation.getCurrentPosition();
    const latLng = new google.maps.LatLng(coordinates.coords.latitude, coordinates.coords.longitude);

    // Configuraciones del mapa
    const mapOptions = {
      center: latLng,
      zoom: 15,
    };

    // Crear el mapa y agregar un marcador
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer({
      suppressMarkers: true // Suprimir los marcadores predeterminados
    });
    this.directionsRenderer.setMap(this.map);
    this.geocoder = new google.maps.Geocoder();
  }

  loadViajesPendientes() {
    this.viajeService.getViajes().subscribe((viajes: any[]) => {
      this.viajesPendientes = viajes.filter(viaje => viaje.estado === 'pendiente');
    });
  }

  checkViajeTomado() {
    const pasajeroId = this.getPasajeroId();
    this.viajeService.getViajes().subscribe((viajes: any[]) => {
      const viajeTomado = viajes.find(viaje => viaje.pasajeros && viaje.pasajeros.includes(pasajeroId));
      if (viajeTomado) {
        if (viajeTomado.estado === 'completado' && this.viajeTomado && this.viajeTomado.id === viajeTomado.id) {
          this.presentToast('El viaje ha sido finalizado.');
          this.viajeTomado = null;
          this.updateEstadoPasajero('desocupado'); // Cambiar el estado del pasajero a "desocupado"
          this.directionsRenderer.setDirections({ routes: [] }); // Limpiar la ruta del mapa
        } else {
          this.viajeTomado = viajeTomado;
          this.trazarRuta(viajeTomado.direccionInicio, viajeTomado.direccionFinal);
        }
      }
    });
  }

  tomarViaje(viaje: any) {
    const pasajeroId = this.getPasajeroId();
    if (viaje.cupos <= 4) {
      viaje.cupos -= 1;
      if (!viaje.pasajeros) {
        viaje.pasajeros = [];
      }
      viaje.pasajeros.push(pasajeroId);
      this.viajeService.updateViaje(viaje.id, viaje).subscribe(() => {
        this.presentToast('Has tomado el viaje exitosamente.');
        this.viajeTomado = viaje;
        this.updateEstadoPasajero('ocupado'); // Cambiar el estado del pasajero a "ocupado"
        this.trazarRuta(viaje.direccionInicio, viaje.direccionFinal);
      });
    } else {
      this.presentToast('No hay cupos disponibles.');
    }
  }

  cancelarViaje() {
    const pasajeroId = this.getPasajeroId();
    if (this.viajeTomado) {
      this.viajeTomado.cupos += 1;
      this.viajeTomado.pasajeros = this.viajeTomado.pasajeros.filter((id: string) => id !== pasajeroId);
      this.viajeService.updateViaje(this.viajeTomado.id, this.viajeTomado).subscribe(() => {
        this.presentToast('Has cancelado el viaje.');
        this.viajeTomado = null;
        this.updateEstadoPasajero('desocupado'); // Cambiar el estado del pasajero a "desocupado"
        this.loadViajesPendientes(); // Volver al listado de viajes disponibles
        this.directionsRenderer.setDirections({ routes: [] }); // Limpiar la ruta del mapa
      });
    }
  }

  // Trazar la ruta en el mapa
  trazarRuta(direccionInicio: string, direccionFinal: string) {
    const request = {
      origin: direccionInicio,
      destination: direccionFinal,
      travelMode: google.maps.TravelMode.DRIVING
    };

    this.directionsService.route(request, (result: any, status: any) => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.directionsRenderer.setDirections(result);
      } else {
        console.error('Error al trazar la ruta:', status);
      }
    });
  }

  // Obtener el ID del pasajero
  getPasajeroId(): string {
    return localStorage.getItem('userId') || '';
  }

  // Actualizar el estado del pasajero
  updateEstadoPasajero(estado: string) {
    const pasajeroId = this.getPasajeroId();
    this.userService.getUserById(pasajeroId).subscribe(user => {
      user.estado = estado;
      this.userService.updateUser(pasajeroId, user).subscribe(() => {
        console.log(`Estado del pasajero actualizado a ${estado}`);
      });
    });
  }

  // Mostrar un toast
  async presentToast(message: string, duration: number = 2000) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      position: 'bottom'
    });
    toast.present();
  }
}
