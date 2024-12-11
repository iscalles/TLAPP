import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';

declare var google: any;

@Component({
  selector: 'app-inicio-home',
  templateUrl: './inicio-home.component.html',
  styleUrls: ['./inicio-home.component.scss'],
})
export class InicioHomeComponent  implements AfterViewInit {
  @ViewChild('map', { static: false }) mapElement!: ElementRef;
  map!: any;

  constructor() {}

  async ngAfterViewInit() {
    await this.loadMap();
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

    new google.maps.Marker({
      position: latLng,
      map: this.map,
      title: "Estás aquí",
    });
  }
}

