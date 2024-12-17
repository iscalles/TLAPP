import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { ViajeService } from '../../viaje.service';
import { UserService } from '../../user.service';
import { ToastController } from '@ionic/angular';
import { interval, Subscription } from 'rxjs';

declare var google: any;

@Component({
  selector: 'app-inicio-conductor',
  templateUrl: './inicio-conductor.component.html',
  styleUrls: ['./inicio-conductor.component.scss'],
})
export class InicioConductorComponent implements AfterViewInit, OnDestroy {
  @ViewChild('map', { static: false }) mapElement!: ElementRef;
  map!: any;
  directionsService!: any;
  directionsRenderer!: any;
  geocoder!: any;
  markerInicio!: any;
  markerFinal!: any;
  showCreateForm = false; // Para mostrar/ocultar el formulario
  nuevoViaje = {
    direccionInicio: '',
    direccionFinal: '',
    distancia: 0,
    precio: 0,
    cupos: 0, // Nuevo campo para los cupos
    estado: 'pendiente'
  };
  viajeCreado: any = null; // Para almacenar el viaje creado
  seleccionandoInicio = true; // Para determinar si estamos seleccionando la dirección de inicio o final
  private updateSubscription!: Subscription;

  constructor(
    private viajeService: ViajeService,
    private userService: UserService,
    private toastController: ToastController
  ) {}

  async ngAfterViewInit() {
    await this.loadMap();
    this.viajeCreado = this.viajeService.getViajeCreado();
    if (this.viajeCreado) {
      this.trazarRuta(this.viajeCreado.direccionInicio, this.viajeCreado.direccionFinal);
      this.startUpdatingViaje();
    }
  }

  ngOnDestroy() {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }

  async loadMap() {
    const coordinates = await Geolocation.getCurrentPosition();
    const latLng = new google.maps.LatLng(coordinates.coords.latitude, coordinates.coords.longitude);

    const mapOptions = {
      center: latLng,
      zoom: 15,
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);


    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer({
      suppressMarkers: true // Suprimir los marcadores predeterminados
    });
    this.directionsRenderer.setMap(this.map);
    this.geocoder = new google.maps.Geocoder();

    // Agregar manejador de eventos de clic en el mapa
    this.map.addListener('click', (event: any) => {
      this.handleMapClick(event.latLng);
    });
  }

  // Manejar clics en el mapa
  handleMapClick(latLng: any) {
    this.geocoder.geocode({ location: latLng }, (results: any, status: any) => {
      if (status === google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          const address = results[0].formatted_address;
          if (this.seleccionandoInicio) {
            this.nuevoViaje.direccionInicio = address;
            if (this.markerInicio) {
              this.markerInicio.setMap(null); // Eliminar marcador anterior si existe
            }
            this.markerInicio = new google.maps.Marker({
              position: latLng,
              map: this.map,
              title: "Inicio",
            });
          } else {
            this.nuevoViaje.direccionFinal = address;
            if (this.markerFinal) {
              this.markerFinal.setMap(null); // Eliminar marcador anterior si existe
            }
            this.markerFinal = new google.maps.Marker({
              position: latLng,
              map: this.map,
              title: "Final",
            });
            this.trazarRuta(this.nuevoViaje.direccionInicio, this.nuevoViaje.direccionFinal);
          }
        }
      } else {
        console.error('Geocode was not successful for the following reason: ' + status);
      }
    });
  }

  // Confirmar la dirección de inicio
  confirmarDireccionInicio() {
    this.seleccionandoInicio = false; // Cambiar a seleccionar dirección final
  }

  // Trazar la ruta en el mapa y calcular la distancia
  trazarRuta(direccionInicio: string, direccionFinal: string) {
    const request = {
      origin: direccionInicio,
      destination: direccionFinal,
      travelMode: google.maps.TravelMode.DRIVING
    };

    this.directionsService.route(request, (result: any, status: any) => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.directionsRenderer.setDirections(result);
        const route = result.routes[0];
        const distance = route.legs[0].distance.value / 1000; // Convertir metros a kilómetros
        this.nuevoViaje.distancia = distance;
        this.nuevoViaje.direccionFinal = direccionFinal; // Asegurarse de que la dirección final se actualice
      } else {
        console.error('Error al trazar la ruta:', status);
      }
    });
  }

  // Crear un nuevo viaje
  async crearViaje() {
    if (this.nuevoViaje.direccionInicio && this.nuevoViaje.direccionFinal && this.nuevoViaje.distancia > 0 && this.nuevoViaje.precio > 0 && this.nuevoViaje.cupos >= 1 && this.nuevoViaje.cupos <= 4) {
      const nuevoViajeConId = { ...this.nuevoViaje, id: this.generateId(), conductorId: this.getConductorId() };

      this.viajeService.createViaje(nuevoViajeConId).subscribe(
        async (viaje) => {
          this.presentToast('Viaje creado exitosamente');
          this.viajeService.setViajeCreado(viaje); // Almacenar el viaje creado en el servicio compartido
          this.viajeCreado = viaje; // Almacenar el viaje creado localmente
          this.updateEstadoConductor('ocupado'); // Cambiar el estado del conductor a "ocupado"
          this.toggleCreateForm(); // Oculta el formulario después de crear
          this.nuevoViaje = { direccionInicio: '', direccionFinal: '', distancia: 0, precio: 0, cupos: 0, estado: 'pendiente' }; // Reinicia los valores del formulario
          if (this.markerInicio) {
            this.markerInicio.setMap(null); // Eliminar marcador de inicio
          }
          if (this.markerFinal) {
            this.markerFinal.setMap(null); // Eliminar marcador de final
          }
        },
        async (error) => {
          this.presentToast('Error al crear el viaje');
          console.error('Error al crear el viaje:', error);
        }
      );
    } else {
      this.presentToast('Por favor, complete todos los campos correctamente');
    }
  }

  // Iniciar la actualización periódica del viaje
  startUpdatingViaje() {
    this.updateSubscription = interval(5000).subscribe(() => {
      if (this.viajeCreado) {
        this.viajeService.getViajeById(this.viajeCreado.id).subscribe((viaje: any) => {
          this.viajeCreado = viaje;
        });
      }
    });
  }

  // Cancelar el viaje
  cancelarViaje() {
    if (this.viajeCreado) {
      this.viajeService.deleteViaje(this.viajeCreado.id).subscribe(() => {
        this.presentToast('El viaje ha sido cancelado.');
        this.viajeService.clearViajeCreado(); // Limpiar el estado del viaje creado en el servicio compartido
        this.viajeCreado = null;
        this.updateEstadoConductor('desocupado'); // Cambiar el estado del conductor a "desocupado"
        this.directionsRenderer.setDirections({ routes: [] }); // Limpiar la ruta del mapa
        if (this.updateSubscription) {
          this.updateSubscription.unsubscribe(); // Detener la actualización periódica
        }
      });
    }
  }

  // Finalizar el viaje
  finalizarViaje() {
    if (this.viajeCreado) {
      this.viajeCreado.estado = 'completado';
      this.viajeService.updateViaje(this.viajeCreado.id, this.viajeCreado).subscribe(() => {
        this.presentToast('El viaje ha sido finalizado.');
        this.viajeService.clearViajeCreado(); // Limpiar el estado del viaje creado en el servicio compartido
        this.viajeCreado = null;
        this.updateEstadoConductor('desocupado'); // Cambiar el estado del conductor a "desocupado"
        this.updateEstadoPasajeros(this.viajeCreado.pasajeros, 'desocupado'); // Cambiar el estado de los pasajeros a "desocupado"
        this.directionsRenderer.setDirections({ routes: [] }); // Limpiar la ruta del mapa
        if (this.updateSubscription) {
          this.updateSubscription.unsubscribe(); // Detener la actualización periódica
        }
      });
    }
  }

  // Actualizar el estado del conductor
  updateEstadoConductor(estado: string) {
    const conductorId = this.getConductorId();
    this.userService.getUserById(conductorId).subscribe(user => {
      user.estado = estado;
      this.userService.updateUser(conductorId, user).subscribe(() => {
        console.log(`Estado del conductor actualizado a ${estado}`);
      });
    });
  }

  // Actualizar el estado de los pasajeros
  updateEstadoPasajeros(pasajeros: string[], estado: string) {
    pasajeros.forEach(pasajeroId => {
      this.userService.getUserById(pasajeroId).subscribe(user => {
        user.estado = estado;
        this.userService.updateUser(pasajeroId, user).subscribe(() => {
          this.presentToast(`El viaje ha sido finalizado para el pasajero ${user.name}.`);
          console.log(`Estado del pasajero ${user.name} actualizado a ${estado}`);
        });
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

  // Métodos adicionales para generar ID y obtener el ID del conductor
  generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  getConductorId(): string {
    return localStorage.getItem('userId') || '';
  }

  // Métodos adicionales para cargar viajes y alternar el formulario
  loadViajes() {
    // Implementa la lógica para cargar los viajes
  }

  toggleCreateForm() {
    this.showCreateForm = !this.showCreateForm;
  }
}
