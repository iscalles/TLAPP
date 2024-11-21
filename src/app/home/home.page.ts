import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { IonSearchbar } from '@ionic/angular';
import { GuardService } from '../guard.service';

// Extendemos la interfaz Window para incluir la propiedad google
interface Window {
  google: any;
}
declare var google: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {
  @ViewChild('map', { static: false }) mapElement!: ElementRef;
  @ViewChild('searchInput', { static: false }) searchInput!: IonSearchbar;
  map!: any;
  user: any;

  constructor(private guardService: GuardService) {}

  async ngAfterViewInit() {
    console.log("ngAfterViewInit ejecutado");
    console.log("Referencia a searchInput:", this.searchInput);
    
    await this.loadMap();
  
    // Usa un pequeño retraso para asegurar que el DOM esté completamente cargado
    setTimeout(() => {
      this.setupSearchBox();
    }, 300); 
    console.log("Componente inicializado completamente:", this.searchInput, this.mapElement);
  }

  async loadMap() {
    const coordinates = await Geolocation.getCurrentPosition();
    const latLng = new google.maps.LatLng(coordinates.coords.latitude, coordinates.coords.longitude);
  
    const mapOptions = {
      center: latLng,
      zoom: 15,
    };
  
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  
    new google.maps.Marker({
      position: latLng,
      map: this.map,
      title: "Estás aquí",
    });
  
    console.log("Mapa cargado");
  }

  setupSearchBox() {
    // Verificar que searchInput esté definido
    console.log("Elemento de búsqueda:", this.searchInput);
    if (!this.searchInput) {
        console.error("searchInput no está definido");
        return;
    }

    // Usar el método getInputElement() del componente IonSearchbar
    this.searchInput.getInputElement().then((input: HTMLInputElement) => {
        const searchBox = new google.maps.places.SearchBox(input);

        if (!this.map) {
            console.error("Mapa no está definido");
            return;
        }

        this.map.addListener('bounds_changed', () => {
            searchBox.setBounds(this.map.getBounds()!);
        });

        searchBox.addListener('places_changed', () => {
            const places = searchBox.getPlaces();
            if (!places || places.length === 0) {
                console.error("No se encontraron lugares");
                return;
            }

            const bounds = new google.maps.LatLngBounds();
            // Additional code to handle places and bounds
        });
    }).catch(error => {
        console.error("Error al obtener el elemento de entrada:", error);
    });
  }

  async loadUser() {
    const userId = this.guardService.getUserId();
    if (userId) {
      console.log("Cargando usuario con ID:", userId);
      try {
        this.user = await this.guardService.getUserById(userId).toPromise();
        console.log("Usuario cargado:", this.user);
      } catch (error) {
        console.error("Error al cargar el usuario:", error);
        this.user = { nombre: 'Invitado' }; // Valor por defecto en caso de error
      }
    } else {
      console.log("No hay usuario autenticado, asignando usuario por defecto.");
      this.user = { nombre: 'Invitado' }; // Valor por defecto si no hay usuario autenticado
    }
  }
}
