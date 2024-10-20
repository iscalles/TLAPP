import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { IonSearchbar } from '@ionic/angular';

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
  @ViewChild('searchInput', { static: false }) searchInput!: IonSearchbar; // Cambia ElementRef por IonSearchbar
  map!: any;

  constructor() {}

  async ngAfterViewInit() {
    console.log("ngAfterViewInit ejecutado");
    console.log("Referencia a searchInput:", this.searchInput);
    
    await this.loadGoogleMaps();
    await this.loadMap();
  
    // Usa un pequeño retraso para asegurar que el DOM esté completamente cargado
    setTimeout(() => {
      this.setupSearchBox();
    }, 300); 
    console.log("Componente inicializado completamente:", this.searchInput, this.mapElement);// Prueba con un retraso de 300 ms
  }

  private async loadGoogleMaps(): Promise<void> {
    if (!window.google) {
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCQVlePODfWpk6ZfBCx51vXA3UAIyK69Fw&libraries=places';
        script.onload = () => {
          console.log("Google Maps API cargado");
          resolve(); 
        }; 
        document.body.appendChild(script);
      });
    } else {
      return Promise.resolve();
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
  
    new google.maps.Marker({
      position: latLng,
      map: this.map,
      title: "Estás aquí",
    });
  
    console.log("Mapa cargado"); // Agrega un log aquí
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

        this.map.addListener('bounds_changed', () => {
            searchBox.setBounds(this.map.getBounds()!);
        });

        searchBox.addListener('places_changed', () => {
            const places = searchBox.getPlaces();
            if (places.length === 0) return;

            const bounds = new google.maps.LatLngBounds();
            places.forEach((place: any) => {
                if (!place.geometry) {
                    console.log("No details available for input: '" + place.name + "'");
                    return;
                }
                if (place.geometry.viewport) {
                    bounds.union(place.geometry.viewport);
                } else {
                    bounds.extend(place.geometry.location);
                }
            });
            this.map.fitBounds(bounds);
        });
    }).catch((error: any) => {
        console.error("Error al obtener el elemento de entrada:", error);
    });
  }
}
